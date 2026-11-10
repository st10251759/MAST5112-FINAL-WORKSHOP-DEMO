let counter = 0;

/**
 * Generates a stable unique id for a new record.
 * Combines the current time, a per-session counter and random characters, so two records
 * created in the same millisecond still get different ids. No extra package is needed,
 * and nothing depends on the record's position in the list.
 */
export function generateId(): string {
  counter += 1;
  const time = Date.now().toString(36);
  const random = Math.random().toString(36).slice(2, 8);
  return `eq-${time}-${counter.toString(36)}-${random}`;
}
