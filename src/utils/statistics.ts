import { CATEGORIES } from '../types/equipment';
import type { Category, Equipment } from '../types/equipment';
import { getStockStatus } from './stock';

export interface InventoryStatistics {
  // ---- Required-equivalent statistics (count RECORDS, not units) ----
  totalRecords: number;
  /** Unweighted mean of unit prices across records. null when there are no records. */
  averageUnitPrice: number | null;
  recordsByCategory: Record<Category, number>;

  // ---- Extra gym statistics (clearly different units) ----
  /** Sum of quantityAvailable: counts UNITS. */
  totalUnits: number;
  unitsByCategory: Record<Category, number>;
  /** Sum of unitPrice x quantityAvailable, in rand. */
  replacementValue: number;
  lowStockRecords: number;
  outOfStockRecords: number;
}

function emptyCategoryCounts(): Record<Category, number> {
  const counts = {} as Record<Category, number>;
  for (const category of CATEGORIES) {
    counts[category] = 0;
  }
  return counts;
}

/**
 * Computes every statistic from the source records in one pass.
 *
 * Average unit price = sum of the record unit prices / number of records.
 *   It is deliberately UNWEIGHTED: a record with 25 units counts once, exactly like the
 *   restaurant POE where each dish counts once. A quantity-weighted average would be a
 *   different (and wrong for the POE) number.
 *
 * Money is added as whole cents so floating point drift (0.1 + 0.2) cannot creep in.
 */
export function computeStatistics(
  items: readonly Equipment[],
  lowStockThreshold: number,
): InventoryStatistics {
  const recordsByCategory = emptyCategoryCounts();
  const unitsByCategory = emptyCategoryCounts();
  let sumOfPricesInCents = 0;
  let replacementValueInCents = 0;
  let totalUnits = 0;
  let lowStockRecords = 0;
  let outOfStockRecords = 0;

  for (const item of items) {
    const priceInCents = Math.round(item.unitPrice * 100);
    sumOfPricesInCents += priceInCents;
    replacementValueInCents += priceInCents * item.quantityAvailable;
    totalUnits += item.quantityAvailable;
    recordsByCategory[item.category] += 1;
    unitsByCategory[item.category] += item.quantityAvailable;

    const status = getStockStatus(item.quantityAvailable, lowStockThreshold);
    if (status === 'low') lowStockRecords += 1;
    if (status === 'out') outOfStockRecords += 1;
  }

  const totalRecords = items.length;
  // Guard against dividing by zero: with no records there is no average (null, never NaN).
  const averageUnitPrice =
    totalRecords === 0 ? null : Math.round(sumOfPricesInCents / totalRecords) / 100;

  return {
    totalRecords,
    averageUnitPrice,
    recordsByCategory,
    totalUnits,
    unitsByCategory,
    replacementValue: replacementValueInCents / 100,
    lowStockRecords,
    outOfStockRecords,
  };
}
