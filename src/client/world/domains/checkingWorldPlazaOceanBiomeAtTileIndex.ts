import { checkingWorldPlazaOceanBiomeSpawnClearingAtTileIndex } from '@/components/world/domains/checkingWorldPlazaOceanBiomeSpawnClearingAtTileIndex';
import { DEFINING_WORLD_PLAZA_GENERATION_FEATURE } from '@/components/world/domains/definingWorldPlazaGenerationFeatureRegistry';
import { checkingWorldPlazaGenerationFeatureEnabled } from '@/components/world/domains/managingWorldPlazaGenerationFeatureStore';
import { resolvingWorldPlazaBiomeAtTileIndex } from '@/components/world/domains/resolvingWorldPlazaBiomeAtTileIndex';
import { checkingWorldPlazaIslandModeForcesOceanAtTileIndex } from '@/components/world/domains/resolvingWorldPlazaIslandModeZoneAtTileIndex';

/**
 * Ocean biome checks for procedural water and shoreline placement.
 *
 * @module components/world/domains/checkingWorldPlazaOceanBiomeAtTileIndex
 */

/**
 * Returns true when the tile belongs to the open ocean biome.
 *
 * @param tileX - Tile column index.
 * @param tileY - Tile row index.
 */
export function checkingWorldPlazaOceanBiomeAtTileIndex(
  tileX: number,
  tileY: number
): boolean {
  if (
    !checkingWorldPlazaGenerationFeatureEnabled(
      DEFINING_WORLD_PLAZA_GENERATION_FEATURE.OCEAN
    )
  ) {
    return false;
  }

  if (checkingWorldPlazaOceanBiomeSpawnClearingAtTileIndex(tileX, tileY)) {
    return false;
  }

  if (checkingWorldPlazaIslandModeForcesOceanAtTileIndex(tileX, tileY)) {
    return true;
  }

  return resolvingWorldPlazaBiomeAtTileIndex(tileX, tileY).kind === 'ocean';
}
