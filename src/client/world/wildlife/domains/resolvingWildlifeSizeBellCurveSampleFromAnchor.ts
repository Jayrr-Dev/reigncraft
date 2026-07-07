/**
 * Deterministic bell-curve size roll per spawn anchor.
 *
 * @module components/world/wildlife/domains/resolvingWildlifeSizeBellCurveSampleFromAnchor
 */

import { computingWildlifeStandardNormalSampleFromAnchor } from '@/components/world/wildlife/domains/computingWildlifeStandardNormalSampleFromAnchor';
import {
  DEFINING_WILDLIFE_SIZE_SCALE_BELL_CURVE_SEED_SALT_U1,
  DEFINING_WILDLIFE_SIZE_SCALE_BELL_CURVE_SEED_SALT_U2,
} from '@/components/world/wildlife/domains/definingWildlifeSizeScaleConstants';
import type { DefiningWildlifeSpawnAnchor } from '@/components/world/wildlife/domains/definingWildlifeTypes';

/** Samples a standard-normal size value for one spawn anchor. */
export function resolvingWildlifeSizeBellCurveSampleFromAnchor(
  anchor: DefiningWildlifeSpawnAnchor
): number {
  return computingWildlifeStandardNormalSampleFromAnchor(anchor, {
    seedSaltU1: DEFINING_WILDLIFE_SIZE_SCALE_BELL_CURVE_SEED_SALT_U1,
    seedSaltU2: DEFINING_WILDLIFE_SIZE_SCALE_BELL_CURVE_SEED_SALT_U2,
  });
}
