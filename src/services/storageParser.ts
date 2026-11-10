import { CATEGORIES } from '../types/equipment';
import type { Category, Equipment } from '../types/equipment';
import { clampThreshold, DEFAULT_LOW_STOCK_THRESHOLD } from '../utils/stock';

// Pure functions that turn stored text back into trusted app data.
// Kept apart from AsyncStorage so they can be unit tested without a phone.

export const STORAGE_VERSION = 1;

export interface PersistedState {
  equipment: Equipment[];
  lowStockThreshold: number;
}

export type ParseResult =
  | { status: 'empty' }
  | { status: 'ok'; state: PersistedState; droppedCount: number }
  | { status: 'corrupt' };

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isCategory(value: unknown): value is Category {
  return CATEGORIES.some((category) => category === value);
}

/**
 * Checks one stored record field by field. Anything that does not match the Equipment
 * type exactly (wrong type, negative quantity, NaN price, unknown category) is rejected,
 * so a damaged record can never crash the list or the statistics later.
 */
export function normaliseStoredEquipment(value: unknown): Equipment | null {
  if (!isRecord(value)) return null;
  const { id, name, description, category, quantityAvailable, unitPrice } = value;
  const { imageUrl, createdAt, updatedAt, isFavourite } = value;

  if (typeof id !== 'string' || id.length === 0) return null;
  if (typeof name !== 'string' || name.trim().length === 0) return null;
  if (typeof description !== 'string') return null;
  if (!isCategory(category)) return null;
  if (
    typeof quantityAvailable !== 'number' ||
    !Number.isSafeInteger(quantityAvailable) ||
    quantityAvailable < 0
  ) {
    return null;
  }
  if (typeof unitPrice !== 'number' || !Number.isFinite(unitPrice) || unitPrice < 0) return null;
  if (typeof createdAt !== 'string' || typeof updatedAt !== 'string') return null;

  return {
    id,
    name,
    description,
    category,
    quantityAvailable,
    unitPrice,
    imageUrl: typeof imageUrl === 'string' ? imageUrl : '',
    createdAt,
    updatedAt,
    isFavourite: isFavourite === true,
  };
}

export function serialiseState(state: PersistedState): string {
  return JSON.stringify({
    version: STORAGE_VERSION,
    equipment: state.equipment,
    lowStockThreshold: state.lowStockThreshold,
  });
}

/**
 * null  -> nothing saved yet ("empty")
 * text that is not valid JSON, or not the expected shape -> "corrupt"
 * valid shape -> "ok", with any individually damaged or duplicate records dropped
 */
export function parseStoredState(raw: string | null): ParseResult {
  if (raw === null) return { status: 'empty' };

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return { status: 'corrupt' };
  }

  if (!isRecord(parsed) || !Array.isArray(parsed.equipment)) {
    return { status: 'corrupt' };
  }

  const seenIds = new Set<string>();
  const equipment: Equipment[] = [];
  let droppedCount = 0;
  for (const candidate of parsed.equipment as unknown[]) {
    const record = normaliseStoredEquipment(candidate);
    if (record === null || seenIds.has(record.id)) {
      droppedCount += 1;
      continue;
    }
    seenIds.add(record.id);
    equipment.push(record);
  }

  const threshold =
    typeof parsed.lowStockThreshold === 'number'
      ? clampThreshold(parsed.lowStockThreshold)
      : DEFAULT_LOW_STOCK_THRESHOLD;

  return { status: 'ok', state: { equipment, lowStockThreshold: threshold }, droppedCount };
}
