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

  const forwardTiles = Math.max(
    0,
    Math.round(
      forwardPrefetchTiles *
        Math.max(Math.abs(movementDirection.x), Math.abs(movementDirection.y))
    )
  );
  const behindTrimTiles = Math.max(
    0,
    Math.round(
      behindRetentionTiles *
        Math.max(Math.abs(movementDirection.x), Math.abs(movementDirection.y))
    )
  );

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
