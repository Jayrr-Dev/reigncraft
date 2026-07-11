/**
 * Biases visible tile bounds ahead of player movement for smoother prefetch.
 *
 * @module components/world/domains/computingWorldPlazaDirectionalTerrainPrefetchBounds
 */

import type { DefiningWorldPlazaVisibleTileBounds } from '@/components/world/domains/definingWorldPlazaVisibleTileBounds';
import type { ComputingWorldPlazaSmoothedMovementDirection } from '@/components/world/domains/computingWorldPlazaSmoothedMovementDirection';

/**
 * Expands symmetric bounds with extra tiles ahead of movement and trims behind.
 *
 * @param symmetricBounds - Base bounds from viewport + symmetric prefetch.
 * @param movementDirection - Smoothed movement direction.
 * @param forwardPrefetchTiles - Extra tile rings added ahead of travel.
 * @param behindRetentionTiles - Tile rings kept behind the player when moving.
 */
export function computingWorldPlazaDirectionalTerrainPrefetchBounds(
  symmetricBounds: DefiningWorldPlazaVisibleTileBounds,
  movementDirection: ComputingWorldPlazaSmoothedMovementDirection,
  forwardPrefetchTiles: number,
  behindRetentionTiles: number
): DefiningWorldPlazaVisibleTileBounds {
  if (
    movementDirection.magnitude <= 0.001 ||
    forwardPrefetchTiles <= 0
  ) {
    return symmetricBounds;
  }

  // Fixed per-axis offsets (not scaled by magnitude): scaling made the
  // rounded tile counts flip while walking at steady speed, which changed the
  // bounds cache key every few frames and forced downstream layers to
  // destroy/rebuild chunk graphics they were about to need again.
  const forwardTiles = Math.max(0, Math.round(forwardPrefetchTiles));
  const behindTrimTiles = Math.max(0, Math.round(behindRetentionTiles));

  let minTileX = symmetricBounds.minTileX;
  let maxTileX = symmetricBounds.maxTileX;
  let minTileY = symmetricBounds.minTileY;
  let maxTileY = symmetricBounds.maxTileY;

  if (movementDirection.x > 0.15) {
    maxTileX += forwardTiles;
    minTileX += behindTrimTiles;
  } else if (movementDirection.x < -0.15) {
    minTileX -= forwardTiles;
    maxTileX -= behindTrimTiles;
  }

  if (movementDirection.y > 0.15) {
    maxTileY += forwardTiles;
    minTileY += behindTrimTiles;
  } else if (movementDirection.y < -0.15) {
    minTileY -= forwardTiles;
    maxTileY -= behindTrimTiles;
  }

  return {
    minTileX,
    maxTileX,
    minTileY,
    maxTileY,
  };
}
