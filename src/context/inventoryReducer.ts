import type { Equipment, EquipmentInput } from '../types/equipment';
import { DEFAULT_LOW_STOCK_THRESHOLD, clampThreshold } from '../utils/stock';

// The reducer is the single source of truth for inventory data. It is a pure function,
// so every state change is immutable (new arrays and new objects, never edited in place)
// and can be unit tested without React. Lists, details and statistics are all DERIVED
// from `equipment`, so they cannot disagree with each other.

export interface InventoryState {
  equipment: Equipment[];
  lowStockThreshold: number;
}

export const initialInventoryState: InventoryState = {
  equipment: [],
  lowStockThreshold: DEFAULT_LOW_STOCK_THRESHOLD,
};

export type InventoryAction =
  | { type: 'hydrate'; state: InventoryState }
  | { type: 'add'; item: Equipment }
  | { type: 'update'; id: string; input: EquipmentInput; now: string }
  | { type: 'delete'; id: string }
  | { type: 'toggleFavourite'; id: string }
  | { type: 'replaceAll'; items: readonly Equipment[] }
  | { type: 'clear' }
  | { type: 'setThreshold'; value: number };

export function inventoryReducer(state: InventoryState, action: InventoryAction): InventoryState {
  switch (action.type) {
    case 'hydrate':
      return action.state;

    case 'add':
      // Ignore a duplicate id rather than create two records with the same key.
      if (state.equipment.some((item) => item.id === action.item.id)) return state;
      return { ...state, equipment: [action.item, ...state.equipment] };

    case 'update':
      return {
        ...state,
        equipment: state.equipment.map((item) =>
          item.id === action.id ? { ...item, ...action.input, updatedAt: action.now } : item,
        ),
      };

    case 'delete':
      return { ...state, equipment: state.equipment.filter((item) => item.id !== action.id) };

    case 'toggleFavourite':
      return {
        ...state,
        equipment: state.equipment.map((item) =>
          item.id === action.id ? { ...item, isFavourite: item.isFavourite !== true } : item,
        ),
      };

    case 'replaceAll':
      return { ...state, equipment: action.items.map((item) => ({ ...item })) };

    case 'clear':
      return { ...state, equipment: [] };

    case 'setThreshold':
      return { ...state, lowStockThreshold: clampThreshold(action.value) };
  }
}
