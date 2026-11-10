import { DEFAULT_FILTERS, filterEquipment, hasActiveFilters } from '../src/utils/filtering';
import { makeEquipment } from './helpers';

const items = [
  makeEquipment({ id: '1', name: 'Treadmill Pro', category: 'Cardio', isFavourite: true }),
  makeEquipment({ id: '2', name: 'Spin Bike', category: 'Cardio' }),
  makeEquipment({ id: '3', name: 'Barbell', category: 'Strength' }),
  makeEquipment({ id: '4', name: 'Yoga Mat', category: 'Accessories', isFavourite: true }),
];

describe('filterEquipment', () => {
  test('default filters return everything', () => {
    expect(filterEquipment(items, DEFAULT_FILTERS)).toHaveLength(4);
  });
  test('search is case-insensitive', () => {
    const ids = filterEquipment(items, { ...DEFAULT_FILTERS, query: 'TREAD' }).map((i) => i.id);
    expect(ids).toEqual(['1']);
  });
  test('search ignores leading and trailing spaces', () => {
    expect(filterEquipment(items, { ...DEFAULT_FILTERS, query: '   bike  ' })).toHaveLength(1);
  });
  test('whitespace-only query behaves like no query', () => {
    expect(filterEquipment(items, { ...DEFAULT_FILTERS, query: '   ' })).toHaveLength(4);
  });
  test('search matches name only, not description', () => {
    const withDescription = [makeEquipment({ id: '9', name: 'Rope', description: 'treadmill-like' })];
    expect(filterEquipment(withDescription, { ...DEFAULT_FILTERS, query: 'treadmill' })).toHaveLength(0);
  });
  test('category filter works alone', () => {
    expect(filterEquipment(items, { ...DEFAULT_FILTERS, category: 'Cardio' })).toHaveLength(2);
  });
  test('search and category combine with AND', () => {
    const result = filterEquipment(items, { ...DEFAULT_FILTERS, query: 'bike', category: 'Cardio' });
    expect(result.map((i) => i.id)).toEqual(['2']);
    expect(filterEquipment(items, { ...DEFAULT_FILTERS, query: 'bike', category: 'Strength' })).toHaveLength(0);
  });
  test('favourites-only combines with the other filters', () => {
    const result = filterEquipment(items, { ...DEFAULT_FILTERS, favouritesOnly: true, category: 'Cardio' });
    expect(result.map((i) => i.id)).toEqual(['1']);
  });
  test('does not change the source array', () => {
    const copy = [...items];
    filterEquipment(items, { ...DEFAULT_FILTERS, query: 'x' });
    expect(items).toEqual(copy);
  });
});

describe('hasActiveFilters', () => {
  test('is false for defaults and whitespace-only queries', () => {
    expect(hasActiveFilters(DEFAULT_FILTERS)).toBe(false);
    expect(hasActiveFilters({ ...DEFAULT_FILTERS, query: '  ' })).toBe(false);
  });
  test('is true for query, category or favourites', () => {
    expect(hasActiveFilters({ ...DEFAULT_FILTERS, query: 'a' })).toBe(true);
    expect(hasActiveFilters({ ...DEFAULT_FILTERS, category: 'Cardio' })).toBe(true);
    expect(hasActiveFilters({ ...DEFAULT_FILTERS, favouritesOnly: true })).toBe(true);
  });
});
