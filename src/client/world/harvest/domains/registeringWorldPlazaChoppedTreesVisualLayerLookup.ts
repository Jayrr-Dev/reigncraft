/**
 * Runtime lookup for chopped-tree visual layers (set by the plaza scene).
 *
 * @module components/world/harvest/domains/registeringWorldPlazaChoppedTreesVisualLayerLookup
 */

export type ReadingWorldPlazaChoppedTreeRemainingVisualLayerAtTile = (
  tileX: number,
  tileY: number
) => number | undefined;

let readingWorldPlazaChoppedTreeRemainingVisualLayerAtTile: ReadingWorldPlazaChoppedTreeRemainingVisualLayerAtTile | null =
  null;

/**
 * Registers the active chopped-tree lookup for collision and tree resolution.
 */
export function registeringWorldPlazaChoppedTreesVisualLayerLookup(
  reader: ReadingWorldPlazaChoppedTreeRemainingVisualLayerAtTile | null
): void {
  readingWorldPlazaChoppedTreeRemainingVisualLayerAtTile = reader;
}

/**
 * Reads the runtime remaining visual layer for a tree tile, if any.
 */
export function readingWorldPlazaRuntimeChoppedTreeRemainingVisualLayer(
  tileX: number,
  tileY: number
): number | undefined {
  return readingWorldPlazaChoppedTreeRemainingVisualLayerAtTile?.(tileX, tileY);
}
