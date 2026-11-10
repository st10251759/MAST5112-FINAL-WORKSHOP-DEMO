import { DEMO_EQUIPMENT } from '../src/data/demoEquipment';
import { formatCurrency } from '../src/utils/formatting';
import { computeStatistics } from '../src/utils/statistics';

// These are the "exact expected values" quoted in the README and workshop script.
// They were calculated independently (Python Decimal arithmetic) from the seed data.
describe('demo data', () => {
  const stats = computeStatistics(DEMO_EQUIPMENT, 2);

  test('record, unit and category totals', () => {
    expect(stats.totalRecords).toBe(12);
    expect(stats.totalUnits).toBe(95);
    expect(stats.recordsByCategory).toEqual({ Cardio: 4, Strength: 5, Accessories: 3 });
    expect(stats.unitsByCategory).toEqual({ Cardio: 12, Strength: 26, Accessories: 57 });
  });

  test('average unit price is R124 234,49 / 12 = R10 352,87', () => {
    expect(stats.averageUnitPrice).toBe(10352.87);
    expect(formatCurrency(stats.averageUnitPrice ?? 0)).toBe('R10 352,87');
  });

  test('replacement value is R338 596,88', () => {
    expect(stats.replacementValue).toBe(338596.88);
  });

  test('stock warnings: 3 low-stock records and 1 out-of-stock record', () => {
    expect(stats.lowStockRecords).toBe(3);
    expect(stats.outOfStockRecords).toBe(1);
  });

  test('ids are unique and favourites exist', () => {
    expect(new Set(DEMO_EQUIPMENT.map((item) => item.id)).size).toBe(DEMO_EQUIPMENT.length);
    expect(DEMO_EQUIPMENT.filter((item) => item.isFavourite === true)).toHaveLength(3);
  });
});
