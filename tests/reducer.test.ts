import { initialInventoryState, inventoryReducer } from '../src/context/inventoryReducer';
import type { InventoryState } from '../src/context/inventoryReducer';
import type { EquipmentInput } from '../src/types/equipment';
import { makeEquipment } from './helpers';

const input: EquipmentInput = {
  name: 'New name',
  description: 'New description',
  category: 'Cardio',
  quantityAvailable: 7,
  unitPrice: 99.5,
  imageUrl: '',
};

function stateWith(...ids: string[]): InventoryState {
  return { ...initialInventoryState, equipment: ids.map((id) => makeEquipment({ id, name: `Item ${id}` })) };
}

describe('inventoryReducer', () => {
  test('add puts the new record first and does not mutate the old state', () => {
    const before = stateWith('1');
    const next = inventoryReducer(before, { type: 'add', item: makeEquipment({ id: '2' }) });
    expect(next.equipment.map((i) => i.id)).toEqual(['2', '1']);
    expect(before.equipment).toHaveLength(1);
  });

  test('add ignores a duplicate id', () => {
    const before = stateWith('1');
    expect(inventoryReducer(before, { type: 'add', item: makeEquipment({ id: '1' }) })).toBe(before);
  });

  test('update changes only the selected record and stamps updatedAt', () => {
    const before = stateWith('1', '2');
    const next = inventoryReducer(before, { type: 'update', id: '2', input, now: '2026-11-10T08:25:00.000Z' });
    expect(next.equipment[1]).toMatchObject({ id: '2', name: 'New name', quantityAvailable: 7, updatedAt: '2026-11-10T08:25:00.000Z' });
    expect(next.equipment[0]).toBe(before.equipment[0]);
    expect(next.equipment[1]?.createdAt).toBe('2026-01-01T00:00:00.000Z');
  });

  test('delete removes exactly the selected record', () => {
    const next = inventoryReducer(stateWith('1', '2', '3'), { type: 'delete', id: '2' });
    expect(next.equipment.map((i) => i.id)).toEqual(['1', '3']);
  });

  test('delete of an unknown id changes nothing', () => {
    expect(inventoryReducer(stateWith('1'), { type: 'delete', id: 'zzz' }).equipment).toHaveLength(1);
  });

  test('toggleFavourite flips and flips back', () => {
    const once = inventoryReducer(stateWith('1'), { type: 'toggleFavourite', id: '1' });
    expect(once.equipment[0]?.isFavourite).toBe(true);
    const twice = inventoryReducer(once, { type: 'toggleFavourite', id: '1' });
    expect(twice.equipment[0]?.isFavourite).toBe(false);
  });

  test('replaceAll replaces and clear empties, keeping the threshold', () => {
    const replaced = inventoryReducer(stateWith('1'), { type: 'replaceAll', items: [makeEquipment({ id: 'x' }), makeEquipment({ id: 'y' })] });
    expect(replaced.equipment.map((i) => i.id)).toEqual(['x', 'y']);
    const cleared = inventoryReducer({ ...replaced, lowStockThreshold: 4 }, { type: 'clear' });
    expect(cleared.equipment).toEqual([]);
    expect(cleared.lowStockThreshold).toBe(4);
  });

  test('setThreshold is clamped to 1..10', () => {
    expect(inventoryReducer(initialInventoryState, { type: 'setThreshold', value: 0 }).lowStockThreshold).toBe(1);
    expect(inventoryReducer(initialInventoryState, { type: 'setThreshold', value: 99 }).lowStockThreshold).toBe(10);
    expect(inventoryReducer(initialInventoryState, { type: 'setThreshold', value: 5 }).lowStockThreshold).toBe(5);
  });
});
