/**
 * Runtime lookup for picked-pebble state (set by the plaza scene).
 *
 * @module components/world/harvest/domains/registeringWorldPlazaPickedPebblesLookup
 */

import type { DefiningWorldPlazaPickedPebbleTileState } from '@/components/world/harvest/domains/managingWorldPlazaLocalPickedPebbles';

export type ReadingWorldPlazaPickedPebbleStateAtTile = (
  tileX: number,
  tileY: number
) => DefiningWorldPlazaPickedPebbleTileState | undefined;

let readingWorldPlazaPickedPebbleStateAtTile: ReadingWorldPlazaPickedPebbleStateAtTile | null =
  null;

/**
 * Registers the active picked-pebble lookup for stone decoration resolution.
 */
export function registeringWorldPlazaPickedPebblesLookup(
  reader: ReadingWorldPlazaPickedPebbleStateAtTile | null
): void {
  readingWorldPlazaPickedPebbleStateAtTile = reader;
}

/**
 * Reads the runtime pick state for a pebble tile, if any.
 */
export function readingWorldPlazaRuntimePickedPebbleState(
  tileX: number,
  tileY: number
): DefiningWorldPlazaPickedPebbleTileState | undefined {
  return readingWorldPlazaPickedPebbleStateAtTile?.(tileX, tileY);
}

/**
 * True when the runtime lookup says this pebble tile is already picked.
 */
export function checkingWorldPlazaRuntimePebbleIsPicked(
  tileX: number,
  tileY: number
): boolean {
  return readingWorldPlazaRuntimePickedPebbleState(tileX, tileY)?.isPicked === true;
}
