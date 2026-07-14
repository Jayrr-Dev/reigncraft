/**
 * Resolves biome-aware ore species for one column-rock anchor.
 *
 * @module components/world/domains/resolvingWorldPlazaOreSpeciesAtAnchorTileIndex
 */

import { checkingWorldPlazaLandNearSurfaceWaterAtTileIndex } from '@/components/world/domains/checkingWorldPlazaLandNearSurfaceWaterAtTileIndex';
import { checkingWorldPlazaTileIsRockyBiomeAtTileIndex } from '@/components/world/domains/checkingWorldPlazaTileIsRockyBiomeAtTileIndex';
import { resolvingWorldPlazaOreBiomePoolResolution } from '@/components/world/domains/definingWorldPlazaOreBiomeRarityConstants';
import { resolvingWorldPlazaBiomeAtTileIndex } from '@/components/world/domains/resolvingWorldPlazaBiomeAtTileIndex';
import {
  checkingWorldOreVeinAtTileIndex,
  resolvingWorldOreSpeciesFromWeightedEntries,
  type WorldOreSpeciesId,
} from '../../../shared/worldOreRarity';

/**
 * Picks ore species for a column-rock anchor using biome / shore tables.
 * Returns null when the vein gate fails (plain stone boulder).
 */
export function resolvingWorldPlazaOreSpeciesAtAnchorTileIndex(
  anchorTileX: number,
  anchorTileY: number
): WorldOreSpeciesId | null {
  const biome = resolvingWorldPlazaBiomeAtTileIndex(anchorTileX, anchorTileY);
  const isRockyBiome = checkingWorldPlazaTileIsRockyBiomeAtTileIndex(
    anchorTileX,
    anchorTileY
  );
  const isNearSurfaceWater = checkingWorldPlazaLandNearSurfaceWaterAtTileIndex(
    anchorTileX,
    anchorTileY
  );
  const pool = resolvingWorldPlazaOreBiomePoolResolution({
    biomeKind: biome.kind,
    isNearSurfaceWater,
    isRockyBiome,
  });

  if (
    !checkingWorldOreVeinAtTileIndex(
      anchorTileX,
      anchorTileY,
      pool.veinChance
    )
  ) {
    return null;
  }

  return resolvingWorldOreSpeciesFromWeightedEntries(
    anchorTileX,
    anchorTileY,
    pool.weights
  );
}
