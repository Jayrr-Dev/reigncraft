import { checkingWorldPlazaTileIsFirelandsBiomeAtTileIndex } from '@/components/world/domains/checkingWorldPlazaTileIsFirelandsBiomeAtTileIndex';
import { DEFINING_WORLD_PLAZA_FIRELANDS_BODY_NOISE_THRESHOLD } from '@/components/world/domains/definingWorldPlazaFirelandsBiomeConstants';
import { resolvingWorldPlazaFirelandsBodyNoiseAtTileIndex } from '@/components/world/domains/resolvingWorldPlazaFirelandsBodyNoiseAtTileIndex';

/**
 * Firelands centrality from body-noise distance above the spawn threshold.
 *
 * @module components/world/domains/resolvingWorldPlazaFirelandsCentralityAtTileIndex
 */

/**
 * Returns a [0, 1] centrality for a tile within a Firelands body.
 *
 * Returns 0 outside the Firelands biome or below the body-noise threshold.
 * Values rise toward 1 at the hottest core of each volcanic region.
 *
 * @param tileX - Tile column index.
 * @param tileY - Tile row index.
 */
export function resolvingWorldPlazaFirelandsCentralityAtTileIndex(
  tileX: number,
  tileY: number
): number {
  if (!checkingWorldPlazaTileIsFirelandsBiomeAtTileIndex(tileX, tileY)) {
    return 0;
  }

  const bodyNoise = resolvingWorldPlazaFirelandsBodyNoiseAtTileIndex(
    tileX,
    tileY
  );

  if (bodyNoise < DEFINING_WORLD_PLAZA_FIRELANDS_BODY_NOISE_THRESHOLD) {
    return 0;
  }

  const normalizedCoreDepth =
    (bodyNoise - DEFINING_WORLD_PLAZA_FIRELANDS_BODY_NOISE_THRESHOLD) /
    (1 - DEFINING_WORLD_PLAZA_FIRELANDS_BODY_NOISE_THRESHOLD);

  return Math.min(1, Math.max(0, normalizedCoreDepth));
}
