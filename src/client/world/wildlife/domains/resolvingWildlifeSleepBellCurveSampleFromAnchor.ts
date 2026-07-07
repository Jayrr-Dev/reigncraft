/**
 * Deterministic bell-curve sleep schedule roll per spawn anchor.
 *
 * @module components/world/wildlife/domains/resolvingWildlifeSleepBellCurveSampleFromAnchor
 */

import { seedingWorldPlazaGrassTileDecorationFromTileIndex } from '@/components/world/domains/seedingWorldPlazaGrassTileDecorationFromTileIndex';
import {
  DEFINING_WILDLIFE_SLEEP_SCHEDULE_BELL_CURVE_SEED_SALT_U1,
  DEFINING_WILDLIFE_SLEEP_SCHEDULE_BELL_CURVE_SEED_SALT_U2,
} from '@/components/world/wildlife/domains/definingWildlifeSleepScheduleConstants';
import type { DefiningWildlifeSpawnAnchor } from '@/components/world/wildlife/domains/definingWildlifeTypes';

/** Minimum uniform draw before log transform in Box-Muller. */
const RESOLVING_WILDLIFE_SLEEP_SCHEDULE_MIN_UNIFORM = 1e-6;

/** Full circle in radians for Box-Muller. */
const RESOLVING_WILDLIFE_SLEEP_SCHEDULE_TWO_PI = Math.PI * 2;

/**
 * Samples a standard-normal sleep schedule value for one spawn anchor.
 */
export function resolvingWildlifeSleepBellCurveSampleFromAnchor(
  anchor: DefiningWildlifeSpawnAnchor
): number {
  const uniformU1 = Math.max(
    RESOLVING_WILDLIFE_SLEEP_SCHEDULE_MIN_UNIFORM,
    seedingWorldPlazaGrassTileDecorationFromTileIndex(
      anchor.tileX,
      anchor.tileY,
      DEFINING_WILDLIFE_SLEEP_SCHEDULE_BELL_CURVE_SEED_SALT_U1 +
        anchor.packIndex
    )
  );
  const uniformU2 = seedingWorldPlazaGrassTileDecorationFromTileIndex(
    anchor.tileX,
    anchor.tileY,
    DEFINING_WILDLIFE_SLEEP_SCHEDULE_BELL_CURVE_SEED_SALT_U2 + anchor.packIndex
  );

  return (
    Math.sqrt(-2 * Math.log(uniformU1)) *
    Math.cos(RESOLVING_WILDLIFE_SLEEP_SCHEDULE_TWO_PI * uniformU2)
  );
}
