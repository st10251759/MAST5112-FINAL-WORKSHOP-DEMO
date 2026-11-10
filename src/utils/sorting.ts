import type { Equipment, SortOption } from '../types/equipment';

export const SORT_OPTIONS: ReadonlyArray<{ value: SortOption; label: string }> = [
  { value: 'updated-desc', label: 'Recently updated' },
  { value: 'name-asc', label: 'Name A–Z' },
  { value: 'name-desc', label: 'Name Z–A' },
  { value: 'quantity-asc', label: 'Quantity: low to high' },
  { value: 'quantity-desc', label: 'Quantity: high to low' },
  { value: 'price-asc', label: 'Unit price: low to high' },
  { value: 'price-desc', label: 'Unit price: high to low' },
];

function compareNames(a: Equipment, b: Equipment): number {
  return a.name.localeCompare(b.name, 'en', { sensitivity: 'base' });
}

/**
 * Returns a NEW sorted array (Array.prototype.sort changes its input, so we copy first).
 * Ties fall back to name and then id, which keeps the order stable and predictable.
 */
export function sortEquipment(items: readonly Equipment[], option: SortOption): Equipment[] {
  const sorted = [...items];
  sorted.sort((a, b) => {
    let result = 0;
    switch (option) {
      case 'name-asc':
        result = compareNames(a, b);
        break;
      case 'name-desc':
        result = compareNames(b, a);
        break;
      case 'quantity-asc':
        result = a.quantityAvailable - b.quantityAvailable;
        break;
      case 'quantity-desc':
        result = b.quantityAvailable - a.quantityAvailable;
        break;
      case 'price-asc':
        result = a.unitPrice - b.unitPrice;
        break;
      case 'price-desc':
        result = b.unitPrice - a.unitPrice;
        break;
      case 'updated-desc':
        result = Date.parse(b.updatedAt) - Date.parse(a.updatedAt);
        break;
    }
    if (result !== 0 && !Number.isNaN(result)) return result;
    const byName = compareNames(a, b);
    return byName !== 0 ? byName : a.id.localeCompare(b.id);
  });
  return sorted;
}
