const NO_BREAK_SPACE = ' ';

/**
 * Formats rand using South African conventions: R, a space between thousands and a
 * decimal comma, for example R12 500,00. Written by hand instead of relying on Intl so
 * the result is identical on every Android device and in the unit tests.
 */
export function formatCurrency(amount: number): string {
  if (!Number.isFinite(amount)) {
    return 'R0,00';
  }
  const totalCents = Math.round(Math.abs(amount) * 100);
  const rand = Math.floor(totalCents / 100);
  const cents = totalCents % 100;
  const grouped = String(rand).replace(/\B(?=(\d{3})+(?!\d))/g, NO_BREAK_SPACE);
  const sign = amount < 0 && totalCents > 0 ? '-' : '';
  return `${sign}R${grouped},${String(cents).padStart(2, '0')}`;
}

/** Average price, or a friendly "No data" when there are no records (never NaN). */
export function formatAveragePrice(average: number | null): string {
  return average === null ? 'No data' : formatCurrency(average);
}

export function formatCount(count: number, singular: string, plural: string): string {
  return `${count} ${count === 1 ? singular : plural}`;
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/** "10 Nov 2026, 08:25" in the device's local time. */
export function formatDateTime(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) {
    return 'Unknown';
  }
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${date.getDate()} ${MONTHS[date.getMonth()]} ${date.getFullYear()}, ${hours}:${minutes}`;
}
