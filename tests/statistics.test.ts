import { computeStatistics } from '../src/utils/statistics';
import { formatAveragePrice, formatCurrency } from '../src/utils/formatting';
import { getStockStatus } from '../src/utils/stock';
import { makeEquipment } from './helpers';

describe('computeStatistics', () => {
  test('zero records gives a safe no-data state (never NaN or Infinity)', () => {
    const stats = computeStatistics([], 2);
    expect(stats.totalRecords).toBe(0);
    expect(stats.averageUnitPrice).toBeNull();
    expect(stats.totalUnits).toBe(0);
    expect(stats.replacementValue).toBe(0);
    expect(stats.recordsByCategory).toEqual({ Cardio: 0, Strength: 0, Accessories: 0 });
    expect(formatAveragePrice(stats.averageUnitPrice)).toBe('No data');
  });

  test('average unit price is UNWEIGHTED by quantity', () => {
    // Weighted average would be (100*1 + 300*99) / 100 = 298. The required average is 200.
    const stats = computeStatistics(
      [
        makeEquipment({ id: '1', unitPrice: 100, quantityAvailable: 1 }),
        makeEquipment({ id: '2', unitPrice: 300, quantityAvailable: 99 }),
      ],
      2,
    );
    expect(stats.averageUnitPrice).toBe(200);
    expect(stats.totalRecords).toBe(2);
    expect(stats.totalUnits).toBe(100);
  });

  test('counts records per category', () => {
    const stats = computeStatistics(
      [
        makeEquipment({ id: '1', category: 'Cardio' }),
        makeEquipment({ id: '2', category: 'Cardio' }),
        makeEquipment({ id: '3', category: 'Accessories' }),
      ],
      2,
    );
    expect(stats.recordsByCategory).toEqual({ Cardio: 2, Strength: 0, Accessories: 1 });
  });

  test('avoids floating point drift (0.1 + 0.2)', () => {
    const stats = computeStatistics(
      [makeEquipment({ id: '1', unitPrice: 0.1 }), makeEquipment({ id: '2', unitPrice: 0.2 })],
      2,
    );
    expect(stats.averageUnitPrice).toBe(0.15);
  });

  test('replacement value is the sum of price x quantity', () => {
    const stats = computeStatistics(
      [
        makeEquipment({ id: '1', unitPrice: 199.99, quantityAvailable: 3 }),
        makeEquipment({ id: '2', unitPrice: 10, quantityAvailable: 0 }),
      ],
      2,
    );
    expect(stats.replacementValue).toBe(599.97);
  });

  test('low and out-of-stock use the threshold', () => {
    const items = [
      makeEquipment({ id: '1', quantityAvailable: 0 }),
      makeEquipment({ id: '2', quantityAvailable: 1 }),
      makeEquipment({ id: '3', quantityAvailable: 2 }),
      makeEquipment({ id: '4', quantityAvailable: 3 }),
    ];
    expect(computeStatistics(items, 2)).toMatchObject({ lowStockRecords: 2, outOfStockRecords: 1 });
    expect(computeStatistics(items, 3)).toMatchObject({ lowStockRecords: 3, outOfStockRecords: 1 });
  });
});

describe('getStockStatus', () => {
  test('boundaries', () => {
    expect(getStockStatus(0, 2)).toBe('out');
    expect(getStockStatus(1, 2)).toBe('low');
    expect(getStockStatus(2, 2)).toBe('low');
    expect(getStockStatus(3, 2)).toBe('ok');
  });
});

describe('formatCurrency', () => {
  const nbsp = ' ';
  test('uses rand, space thousands separators and a decimal comma', () => {
    expect(formatCurrency(0)).toBe('R0,00');
    expect(formatCurrency(349)).toBe('R349,00');
    expect(formatCurrency(289.5)).toBe('R289,50');
    expect(formatCurrency(12750)).toBe(`R12${nbsp}750,00`);
    expect(formatCurrency(338596.88)).toBe(`R338${nbsp}596,88`);
    expect(formatCurrency(1234567.1)).toBe(`R1${nbsp}234${nbsp}567,10`);
  });
  test('never prints NaN or Infinity', () => {
    expect(formatCurrency(Number.NaN)).toBe('R0,00');
    expect(formatCurrency(Number.POSITIVE_INFINITY)).toBe('R0,00');
  });
});
