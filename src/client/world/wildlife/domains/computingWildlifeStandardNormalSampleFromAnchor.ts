/**
 * Shared Box-Muller standard-normal sampling for wildlife spawn anchors.
 *
 * @module components/world/wildlife/domains/computingWildlifeStandardNormalSampleFromAnchor
 */

import { seedingWorldPlazaGrassTileDecorationFromTileIndex } from '@/components/world/domains/seedingWorldPlazaGrassTileDecorationFromTileIndex';
import type { DefiningWildlifeSpawnAnchor } from '@/components/world/wildlife/domains/definingWildlifeTypes';

/** Minimum uniform draw before log transform in Box-Muller. */
const COMPUTING_WILDLIFE_STANDARD_NORMAL_SAMPLE_MIN_UNIFORM = 1e-6;

/** Full circle in radians for Box-Muller. */
const COMPUTING_WILDLIFE_STANDARD_NORMAL_SAMPLE_TWO_PI = Math.PI * 2;

/** Seed salts passed by each wildlife bell-curve domain. */
export type ComputingWildlifeStandardNormalSampleFromAnchorSalts = {
  seedSaltU1: number;
  seedSaltU2: number;
};

/**
 * Samples a standard-normal value for one spawn anchor using Box-Muller.
 * Stable per anchor tile and pack index.
 */
export function computingWildlifeStandardNormalSampleFromAnchor(
  anchor: DefiningWildlifeSpawnAnchor,
  salts: ComputingWildlifeStandardNormalSampleFromAnchorSalts
): number {
  const uniformU1 = Math.max(
    COMPUTING_WILDLIFE_STANDARD_NORMAL_SAMPLE_MIN_UNIFORM,
    seedingWorldPlazaGrassTileDecorationFromTileIndex(
      anchor.tileX,
      anchor.tileY,
      salts.seedSaltU1 + anchor.packIndex
    )
  );
  const uniformU2 = seedingWorldPlazaGrassTileDecorationFromTileIndex(
    anchor.tileX,
    anchor.tileY,
    salts.seedSaltU2 + anchor.packIndex
  );

  return (
    Math.sqrt(-2 * Math.log(uniformU1)) *
    Math.cos(COMPUTING_WILDLIFE_STANDARD_NORMAL_SAMPLE_TWO_PI * uniformU2)
  );
}
