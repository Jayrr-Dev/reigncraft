/**
 * Row-preserving inventory capacity expand (one new empty column per row).
 *
 * @module components/inventory/domains/expandingInventorySlotsByOneColumnPerRow
 */

/**
 * When the legacy five-column layout grows to six columns per row,
 * inserts a trailing empty slot on each row so storage pages keep their items.
 * Other capacity growth appends empty slots without remapping existing items.
 *
 * @param rawSlots - Persisted slot array (may be shorter than capacity)
 * @param capacity - Target slot count
 * @returns Remapped slots, or null when this expand pattern does not apply
 */
export function expandingInventorySlotsByOneColumnPerRow(
  rawSlots: readonly unknown[],
  capacity: number
): unknown[] | null {
  if (
    !Number.isFinite(capacity) ||
    capacity <= 0 ||
    rawSlots.length === 0 ||
    rawSlots.length >= capacity
  ) {
    return null;
  }

  for (let rowCount = rawSlots.length; rowCount >= 1; rowCount -= 1) {
    if (rawSlots.length % rowCount !== 0) {
      continue;
    }

    if (capacity % rowCount !== 0) {
      continue;
    }

    const fromColumns = rawSlots.length / rowCount;
    const toColumns = capacity / rowCount;

    if (fromColumns !== 5 || toColumns !== 6) {
      continue;
    }

    const nextSlots: unknown[] = Array.from({ length: capacity }, () => null);

    for (let rowIndex = 0; rowIndex < rowCount; rowIndex += 1) {
      for (let columnIndex = 0; columnIndex < fromColumns; columnIndex += 1) {
        nextSlots[rowIndex * toColumns + columnIndex] =
          rawSlots[rowIndex * fromColumns + columnIndex] ?? null;
      }
    }

    return nextSlots;
  }

  return null;
}
