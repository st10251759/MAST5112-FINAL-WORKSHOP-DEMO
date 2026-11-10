import type { Equipment } from '../src/types/equipment';

/** Small factory so each test states only the fields it cares about. */
export function makeEquipment(overrides: Partial<Equipment> & { id: string }): Equipment {
  return {
    name: 'Item',
    description: 'Description',
    category: 'Strength',
    quantityAvailable: 1,
    unitPrice: 100,
    imageUrl: '',
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
    isFavourite: false,
    ...overrides,
  };
}
