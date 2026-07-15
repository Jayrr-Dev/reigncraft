/**
 * Deterministic bell-curve size roll per spawn anchor.
 *
 * @module components/world/wildlife/domains/resolvingWildlifeSizeBellCurveSampleFromAnchor
 */

import { computingWorldPlazaDistanceDangerBandFromOrigin } from '@/components/world/domains/computingWorldPlazaDistanceDangerBandFromOrigin';
import { computingWildlifeStandardNormalSampleFromAnchor } from '@/components/world/wildlife/domains/computingWildlifeStandardNormalSampleFromAnchor';
import {
  DEFINING_WILDLIFE_SIZE_SCALE_BELL_CURVE_SEED_SALT_U1,
  DEFINING_WILDLIFE_SIZE_SCALE_BELL_CURVE_SEED_SALT_U2,
} from '@/components/world/wildlife/domains/definingWildlifeSizeScaleConstants';
import type { DefiningWildlifeSpawnAnchor } from '@/components/world/wildlife/domains/definingWildlifeTypes';
import { resolvingWildlifeDistanceDangerSizeMeanShift } from '@/components/world/wildlife/domains/resolvingWildlifeDistanceDangerLevers';

/**
 * Samples a standard-normal size value for one spawn anchor.
 * Farther from origin shifts the mean toward +2σ / +3σ / +4σ animals.
 */
export function resolvingWildlifeSizeBellCurveSampleFromAnchor(
  anchor: DefiningWildlifeSpawnAnchor
): number {
  const dangerBand = computingWorldPlazaDistanceDangerBandFromOrigin(
    anchor.tileX,
    anchor.tileY
  );

  return (
    computingWildlifeStandardNormalSampleFromAnchor(anchor, {
      seedSaltU1: DEFINING_WILDLIFE_SIZE_SCALE_BELL_CURVE_SEED_SALT_U1,
      seedSaltU2: DEFINING_WILDLIFE_SIZE_SCALE_BELL_CURVE_SEED_SALT_U2,
    }) + resolvingWildlifeDistanceDangerSizeMeanShift(dangerBand)
  );
}
