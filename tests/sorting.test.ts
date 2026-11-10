import { sortEquipment } from '../src/utils/sorting';
import { makeEquipment } from './helpers';

const items = [
  makeEquipment({ id: 'a', name: 'bravo', quantityAvailable: 5, unitPrice: 300, updatedAt: '2026-02-01T00:00:00.000Z' }),
  makeEquipment({ id: 'b', name: 'Alpha', quantityAvailable: 0, unitPrice: 100, updatedAt: '2026-03-01T00:00:00.000Z' }),
  makeEquipment({ id: 'c', name: 'Charlie', quantityAvailable: 9, unitPrice: 200, updatedAt: '2026-01-01T00:00:00.000Z' }),
];

const ids = (list: ReturnType<typeof sortEquipment>) => list.map((i) => i.id);

describe('sortEquipment', () => {
  test('name A-Z ignores letter case', () => expect(ids(sortEquipment(items, 'name-asc'))).toEqual(['b', 'a', 'c']));
  test('name Z-A', () => expect(ids(sortEquipment(items, 'name-desc'))).toEqual(['c', 'a', 'b']));
  test('quantity ascending', () => expect(ids(sortEquipment(items, 'quantity-asc'))).toEqual(['b', 'a', 'c']));
  test('quantity descending', () => expect(ids(sortEquipment(items, 'quantity-desc'))).toEqual(['c', 'a', 'b']));
  test('price ascending', () => expect(ids(sortEquipment(items, 'price-asc'))).toEqual(['b', 'c', 'a']));
  test('price descending', () => expect(ids(sortEquipment(items, 'price-desc'))).toEqual(['a', 'c', 'b']));
  test('recently updated first', () => expect(ids(sortEquipment(items, 'updated-desc'))).toEqual(['b', 'a', 'c']));

  test('does not change the input array', () => {
    const before = ids(items);
    sortEquipment(items, 'price-desc');
    expect(ids(items)).toEqual(before);
  });

  test('ties are broken by name, so order is stable', () => {
    const tied = [
      makeEquipment({ id: '1', name: 'Zed', unitPrice: 50 }),
      makeEquipment({ id: '2', name: 'Abe', unitPrice: 50 }),
    ];
    expect(ids(sortEquipment(tied, 'price-asc'))).toEqual(['2', '1']);
  });
});
