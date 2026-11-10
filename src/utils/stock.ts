import type { StockStatus } from '../types/equipment';

/** Gym enhancement (not part of the restaurant POE): records at or below this are "low stock". */
export const DEFAULT_LOW_STOCK_THRESHOLD = 2;
export const MIN_LOW_STOCK_THRESHOLD = 1;
export const MAX_LOW_STOCK_THRESHOLD = 10;

/**
 * out  = quantity is 0
 * low  = quantity is 1 up to and including the threshold
 * ok   = anything above the threshold
 */
export function getStockStatus(quantity: number, threshold: number): StockStatus {
  if (quantity <= 0) return 'out';
  if (quantity <= threshold) return 'low';
  return 'ok';
}

export function clampThreshold(value: number): number {
  if (!Number.isFinite(value)) return DEFAULT_LOW_STOCK_THRESHOLD;
  return Math.min(MAX_LOW_STOCK_THRESHOLD, Math.max(MIN_LOW_STOCK_THRESHOLD, Math.round(value)));
}
