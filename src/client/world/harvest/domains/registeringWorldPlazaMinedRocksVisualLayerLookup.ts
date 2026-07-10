/**
 * Runtime lookup for mined-rock state (set by the plaza scene).
 *
 * @module components/world/harvest/domains/registeringWorldPlazaMinedRocksVisualLayerLookup
 */

import type { DefiningWorldPlazaMinedRockTileState } from '@/components/world/harvest/domains/managingWorldPlazaLocalMinedRocks';

export type ReadingWorldPlazaMinedRockStateAtTile = (
  anchorTileX: number,
  anchorTileY: number
) => DefiningWorldPlazaMinedRockTileState | undefined;

let readingWorldPlazaMinedRockStateAtTile: ReadingWorldPlazaMinedRockStateAtTile | null =
  null;

/**
 * Registers the active mined-rock lookup for collision and rock resolution.
 */
export function registeringWorldPlazaMinedRocksVisualLayerLookup(
  reader: ReadingWorldPlazaMinedRockStateAtTile | null
): void {
  readingWorldPlazaMinedRockStateAtTile = reader;
}

/**
 * Reads the runtime mine state for a rock anchor tile, if any.
 */
export function readingWorldPlazaRuntimeMinedRockState(
  anchorTileX: number,
  anchorTileY: number
): DefiningWorldPlazaMinedRockTileState | undefined {
  return readingWorldPlazaMinedRockStateAtTile?.(anchorTileX, anchorTileY);
}

/**
 * Reads the runtime remaining visual layer for a rock anchor tile, if any.
 */
export function readingWorldPlazaRuntimeMinedRockRemainingVisualLayer(
  anchorTileX: number,
  anchorTileY: number
): number | undefined {
  const tileState = readingWorldPlazaRuntimeMinedRockState(
    anchorTileX,
    anchorTileY
  );

  if (!tileState || tileState.isDepleted) {
    return undefined;
  }

  return tileState.remainingVisualLayer;
}
