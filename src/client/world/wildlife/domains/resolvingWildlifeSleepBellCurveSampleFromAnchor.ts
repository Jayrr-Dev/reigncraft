/**
 * Deterministic bell-curve sleep schedule roll per spawn anchor.
 *
 * @module components/world/wildlife/domains/resolvingWildlifeSleepBellCurveSampleFromAnchor
 */

import { computingWildlifeStandardNormalSampleFromAnchor } from '@/components/world/wildlife/domains/computingWildlifeStandardNormalSampleFromAnchor';
import {
  DEFINING_WILDLIFE_SLEEP_SCHEDULE_BELL_CURVE_SEED_SALT_U1,
  DEFINING_WILDLIFE_SLEEP_SCHEDULE_BELL_CURVE_SEED_SALT_U2,
} from '@/components/world/wildlife/domains/definingWildlifeSleepScheduleConstants';
import type { DefiningWildlifeSpawnAnchor } from '@/components/world/wildlife/domains/definingWildlifeTypes';

/**
 * Samples a standard-normal sleep schedule value for one spawn anchor.
 */
export function resolvingWildlifeSleepBellCurveSampleFromAnchor(
  anchor: DefiningWildlifeSpawnAnchor
): number {
  return computingWildlifeStandardNormalSampleFromAnchor(anchor, {
    seedSaltU1: DEFINING_WILDLIFE_SLEEP_SCHEDULE_BELL_CURVE_SEED_SALT_U1,
    seedSaltU2: DEFINING_WILDLIFE_SLEEP_SCHEDULE_BELL_CURVE_SEED_SALT_U2,
  });
}
