import type { CategoryFilter, Equipment } from '../types/equipment';

export interface InventoryFilters {
  query: string;
  category: CategoryFilter;
  favouritesOnly: boolean;
}

export const DEFAULT_FILTERS: InventoryFilters = {
  query: '',
  category: 'All',
  favouritesOnly: false,
};

/** Trim and lower-case so "  TREAD " matches "Treadmill". */
export function normaliseQuery(query: string): string {
  return query.trim().toLowerCase();
}

export function hasActiveFilters(filters: InventoryFilters): boolean {
  return (
    normaliseQuery(filters.query).length > 0 ||
    filters.category !== 'All' ||
    filters.favouritesOnly
  );
}

/**
 * Search (by name only) and category filter are combined with AND.
 * Returns a new array; the source records are never changed.
 */
export function filterEquipment(
  items: readonly Equipment[],
  filters: InventoryFilters,
): Equipment[] {
  const query = normaliseQuery(filters.query);
  return items.filter((item) => {
    if (filters.category !== 'All' && item.category !== filters.category) return false;
    if (filters.favouritesOnly && item.isFavourite !== true) return false;
    if (query.length > 0 && !item.name.toLowerCase().includes(query)) return false;
    return true;
  });
}
