/**
 * Distance-aware wildlife spawn / temperament / combat danger levers.
 *
 * @module components/world/wildlife/domains/resolvingWildlifeDistanceDangerLevers
 */

import { computingWorldPlazaDistanceDangerBandFromOrigin } from '@/components/world/domains/computingWorldPlazaDistanceDangerBandFromOrigin';
import {
  DEFINING_WORLD_PLAZA_DISTANCE_DANGER_AGGRESSION_MEAN_SHIFT_PER_BAND,
  DEFINING_WORLD_PLAZA_DISTANCE_DANGER_FRIENDLY_WEIGHT_PENALTY_PER_BAND,
  DEFINING_WORLD_PLAZA_DISTANCE_DANGER_MIN_SPAWN_WEIGHT_MULTIPLIER,
  DEFINING_WORLD_PLAZA_DISTANCE_DANGER_PREDATOR_WEIGHT_BONUS_PER_BAND,
  DEFINING_WORLD_PLAZA_DISTANCE_DANGER_PREY_WEIGHT_PENALTY_PER_BAND,
  DEFINING_WORLD_PLAZA_DISTANCE_DANGER_SIZE_MEAN_SHIFT_PER_BAND,
} from '@/components/world/domains/definingWorldPlazaDistanceDangerConstants';
import {
  DEFINING_WILDLIFE_DIFFICULTY_LEVERS,
  type DefiningWildlifeDifficultyLevers,
} from '@/components/world/wildlife/domains/definingWildlifeDifficultyLevers';
import type { DefiningWildlifeTemperamentId } from '@/components/world/wildlife/domains/definingWildlifeTypes';

function clampingWildlifeDistanceDangerWeightMultiplier(
  multiplier: number
): number {
  return Math.max(
    DEFINING_WORLD_PLAZA_DISTANCE_DANGER_MIN_SPAWN_WEIGHT_MULTIPLIER,
    multiplier
  );
}

/** Aggression bell-curve mean shift from distance band. */
export function resolvingWildlifeDistanceDangerAggressionMeanShift(
  dangerBand: number
): number {
  if (dangerBand <= 0) {
    return 0;
  }

  return (
    DEFINING_WORLD_PLAZA_DISTANCE_DANGER_AGGRESSION_MEAN_SHIFT_PER_BAND *
    dangerBand
  );
}

/** Size σ mean shift from distance band (pushes +2σ / +3σ / +4σ). */
export function resolvingWildlifeDistanceDangerSizeMeanShift(
  dangerBand: number
): number {
  if (dangerBand <= 0) {
    return 0;
  }

  return (
    DEFINING_WORLD_PLAZA_DISTANCE_DANGER_SIZE_MEAN_SHIFT_PER_BAND * dangerBand
  );
}

/**
 * Extra spawn-weight multiplier for friendly temperaments (docile / passive).
 * Stacks on prey role scaling.
 */
export function resolvingWildlifeDistanceDangerFriendlyTemperamentWeightMultiplier(
  dangerBand: number,
  temperamentId: DefiningWildlifeTemperamentId
): number {
  if (
    dangerBand <= 0 ||
    (temperamentId !== 'docile' && temperamentId !== 'passive')
  ) {
    return 1;
  }

  return clampingWildlifeDistanceDangerWeightMultiplier(
    1 -
      DEFINING_WORLD_PLAZA_DISTANCE_DANGER_FRIENDLY_WEIGHT_PENALTY_PER_BAND *
        dangerBand
  );
}

/**
 * Merges global difficulty levers with distance prey/predator weight bias.
 */
export function resolvingWildlifeDistanceDangerDifficultyLevers(
  dangerBand: number,
  baseLevers: DefiningWildlifeDifficultyLevers = DEFINING_WILDLIFE_DIFFICULTY_LEVERS
): DefiningWildlifeDifficultyLevers {
  if (dangerBand <= 0) {
    return baseLevers;
  }

  const preyMultiplier = clampingWildlifeDistanceDangerWeightMultiplier(
    1 -
      DEFINING_WORLD_PLAZA_DISTANCE_DANGER_PREY_WEIGHT_PENALTY_PER_BAND *
        dangerBand
  );
  const predatorMultiplier =
    1 +
    DEFINING_WORLD_PLAZA_DISTANCE_DANGER_PREDATOR_WEIGHT_BONUS_PER_BAND *
      dangerBand;

  return {
    ...baseLevers,
    spawnWeightByRole: {
      prey: baseLevers.spawnWeightByRole.prey * preyMultiplier,
      predator: baseLevers.spawnWeightByRole.predator * predatorMultiplier,
    },
  };
}

/** Convenience: levers for a spawn tile from origin distance. */
export function resolvingWildlifeDistanceDangerDifficultyLeversAtTile(
  tileX: number,
  tileY: number,
  baseLevers: DefiningWildlifeDifficultyLevers = DEFINING_WILDLIFE_DIFFICULTY_LEVERS
): DefiningWildlifeDifficultyLevers {
  return resolvingWildlifeDistanceDangerDifficultyLevers(
    computingWorldPlazaDistanceDangerBandFromOrigin(tileX, tileY),
    baseLevers
  );
}
