/**
 * Runtime lookup for chopped-tree state (set by the plaza scene).
 *
 * @module components/world/harvest/domains/registeringWorldPlazaChoppedTreesVisualLayerLookup
 */

import type { DefiningWorldPlazaChoppedTreeTileState } from '@/components/world/harvest/domains/managingWorldPlazaLocalChoppedTrees';

export type ReadingWorldPlazaChoppedTreeStateAtTile = (
  tileX: number,
  tileY: number
) => DefiningWorldPlazaChoppedTreeTileState | undefined;

let readingWorldPlazaChoppedTreeStateAtTile: ReadingWorldPlazaChoppedTreeStateAtTile | null =
  null;

/**
 * Registers the active chopped-tree lookup for collision and tree resolution.
 */
export function registeringWorldPlazaChoppedTreesVisualLayerLookup(
  reader: ReadingWorldPlazaChoppedTreeStateAtTile | null
): void {
  readingWorldPlazaChoppedTreeStateAtTile = reader;
}

/**
 * Reads the runtime chop state for a tree tile, if any.
 */
export function readingWorldPlazaRuntimeChoppedTreeState(
  tileX: number,
  tileY: number
): DefiningWorldPlazaChoppedTreeTileState | undefined {
  return readingWorldPlazaChoppedTreeStateAtTile?.(tileX, tileY);
}

/**
 * Reads the runtime remaining visual layer for a tree tile, if any.
 */
export function readingWorldPlazaRuntimeChoppedTreeRemainingVisualLayer(
  tileX: number,
  tileY: number
): number | undefined {
  const tileState = readingWorldPlazaRuntimeChoppedTreeState(tileX, tileY);

  if (!tileState || tileState.isStump) {
    return undefined;
  }

  return tileState.remainingVisualLayer;
}
