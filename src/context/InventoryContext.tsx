import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from 'react';
import type { ReactNode } from 'react';
import { DEMO_EQUIPMENT } from '../data/demoEquipment';
import { loadInventory, saveInventorySerialised } from '../services/inventoryStorage';
import { serialiseState } from '../services/storageParser';
import type { Equipment, EquipmentInput } from '../types/equipment';
import type { Notice, NoticeType } from '../types/ui';
import { generateId } from '../utils/id';
import { computeStatistics } from '../utils/statistics';
import type { InventoryStatistics } from '../utils/statistics';
import { initialInventoryState, inventoryReducer } from './inventoryReducer';

interface InventoryContextValue {
  equipment: readonly Equipment[];
  lowStockThreshold: number;
  /** Derived from `equipment` on every change. Describes ALL inventory, never a filtered view. */
  statistics: InventoryStatistics;
  /** False until saved data has been read. Screens show a loader until then. */
  isHydrated: boolean;
  /** Set when reading or saving to the device failed. */
  storageError: string | null;
  notice: Notice | null;
  getEquipmentById: (id: string) => Equipment | undefined;
  addEquipment: (input: EquipmentInput) => Equipment;
  updateEquipment: (id: string, input: EquipmentInput) => void;
  deleteEquipment: (id: string) => void;
  toggleFavourite: (id: string) => void;
  loadDemoData: () => void;
  clearInventory: () => void;
  setLowStockThreshold: (value: number) => void;
  retrySave: () => void;
  showNotice: (type: NoticeType, message: string) => void;
  dismissNotice: () => void;
}

const InventoryContext = createContext<InventoryContextValue | null>(null);

export function InventoryProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(inventoryReducer, initialInventoryState);
  const [isHydrated, setIsHydrated] = useState(false);
  const [storageError, setStorageError] = useState<string | null>(null);
  const [notice, setNotice] = useState<Notice | null>(null);

  // The text last known to be on the device. Used to avoid pointless writes.
  const lastPersistedRef = useRef<string | null>(null);
  // Becomes false if the initial READ failed, so we never overwrite data we could not read.
  const canPersistRef = useRef(true);
  const stateRef = useRef(state);
  const noticeIdRef = useRef(0);

  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  const showNotice = useCallback((type: NoticeType, message: string) => {
    noticeIdRef.current += 1;
    setNotice({ id: noticeIdRef.current, type, message });
  }, []);

  const dismissNotice = useCallback(() => setNotice(null), []);

  // ---- Hydration: load saved data exactly once, before anything may be saved ----
  // `isHydrated` stays false until the read finishes. The save effect below refuses to
  // run before then, so the empty initial state can never overwrite saved records.
  useEffect(() => {
    let cancelled = false;

    async function hydrate() {
      const outcome = await loadInventory();
      if (cancelled) return;

      switch (outcome.kind) {
        case 'empty':
          lastPersistedRef.current = serialiseState(initialInventoryState);
          break;
        case 'loaded':
          lastPersistedRef.current = serialiseState(outcome.state);
          dispatch({ type: 'hydrate', state: outcome.state });
          if (outcome.droppedCount > 0) {
            showNotice(
              'info',
              `${outcome.droppedCount} damaged saved record(s) were skipped. The rest loaded normally.`,
            );
          }
          break;
        case 'corrupt':
          lastPersistedRef.current = serialiseState(initialInventoryState);
          showNotice(
            'error',
            'Saved data could not be read, so the inventory was reset. A backup copy of the old data was kept on the device.',
          );
          break;
        case 'read-error':
          canPersistRef.current = false;
          setStorageError(
            `Saved data could not be read (${outcome.message}). Changes will not be saved until the app is restarted.`,
          );
          break;
      }
      setIsHydrated(true);
    }

    void hydrate();
    return () => {
      cancelled = true;
    };
  }, [showNotice]);

  const persist = useCallback(async (serialised: string) => {
    try {
      await saveInventorySerialised(serialised);
      lastPersistedRef.current = serialised;
      setStorageError(null);
    } catch {
      setStorageError('Your latest changes could not be saved to this device.');
    }
  }, []);

  // ---- Save every change after hydration ----
  useEffect(() => {
    if (!isHydrated || !canPersistRef.current) return;
    const serialised = serialiseState(state);
    if (serialised === lastPersistedRef.current) return;
    void persist(serialised);
  }, [state, isHydrated, persist]);

  const retrySave = useCallback(() => {
    if (!canPersistRef.current) return;
    void persist(serialiseState(stateRef.current));
  }, [persist]);

  // ---- Actions ----
  const getEquipmentById = useCallback(
    (id: string) => state.equipment.find((item) => item.id === id),
    [state.equipment],
  );

  const addEquipment = useCallback(
    (input: EquipmentInput): Equipment => {
      const now = new Date().toISOString();
      const item: Equipment = {
        ...input,
        id: generateId(),
        createdAt: now,
        updatedAt: now,
        isFavourite: false,
      };
      dispatch({ type: 'add', item });
      showNotice('success', `"${item.name}" was added to the inventory.`);
      return item;
    },
    [showNotice],
  );

  const updateEquipment = useCallback(
    (id: string, input: EquipmentInput) => {
      dispatch({ type: 'update', id, input, now: new Date().toISOString() });
      showNotice('success', `"${input.name}" was updated.`);
    },
    [showNotice],
  );

  const deleteEquipment = useCallback(
    (id: string) => {
      const existing = stateRef.current.equipment.find((item) => item.id === id);
      dispatch({ type: 'delete', id });
      if (existing) {
        showNotice('info', `"${existing.name}" was deleted.`);
      }
    },
    [showNotice],
  );

  const toggleFavourite = useCallback((id: string) => {
    dispatch({ type: 'toggleFavourite', id });
  }, []);

  const loadDemoData = useCallback(() => {
    dispatch({ type: 'replaceAll', items: DEMO_EQUIPMENT });
    showNotice('success', `Demo data loaded: ${DEMO_EQUIPMENT.length} records.`);
  }, [showNotice]);

  const clearInventory = useCallback(() => {
    dispatch({ type: 'clear' });
    showNotice('info', 'Inventory cleared.');
  }, [showNotice]);

  const setLowStockThreshold = useCallback((value: number) => {
    dispatch({ type: 'setThreshold', value });
  }, []);

  // Statistics are derived from the records, never stored separately, so they cannot go stale.
  const statistics = useMemo(
    () => computeStatistics(state.equipment, state.lowStockThreshold),
    [state.equipment, state.lowStockThreshold],
  );

  const value = useMemo<InventoryContextValue>(
    () => ({
      equipment: state.equipment,
      lowStockThreshold: state.lowStockThreshold,
      statistics,
      isHydrated,
      storageError,
      notice,
      getEquipmentById,
      addEquipment,
      updateEquipment,
      deleteEquipment,
      toggleFavourite,
      loadDemoData,
      clearInventory,
      setLowStockThreshold,
      retrySave,
      showNotice,
      dismissNotice,
    }),
    [
      state.equipment,
      state.lowStockThreshold,
      statistics,
      isHydrated,
      storageError,
      notice,
      getEquipmentById,
      addEquipment,
      updateEquipment,
      deleteEquipment,
      toggleFavourite,
      loadDemoData,
      clearInventory,
      setLowStockThreshold,
      retrySave,
      showNotice,
      dismissNotice,
    ],
  );

  return <InventoryContext.Provider value={value}>{children}</InventoryContext.Provider>;
}

export function useInventory(): InventoryContextValue {
  const context = useContext(InventoryContext);
  if (context === null) {
    throw new Error('useInventory must be used inside an InventoryProvider.');
  }
  return context;
}
