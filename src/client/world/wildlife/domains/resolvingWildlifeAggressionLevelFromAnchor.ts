/**
 * Deterministic bell-curve aggression level roll per spawn anchor.
 *
 * @module components/world/wildlife/domains/resolvingWildlifeAggressionLevelFromAnchor
 */

import { computingWorldPlazaDistanceDangerBandFromOrigin } from '@/components/world/domains/computingWorldPlazaDistanceDangerBandFromOrigin';
import { computingWildlifeStandardNormalSampleFromAnchor } from '@/components/world/wildlife/domains/computingWildlifeStandardNormalSampleFromAnchor';
import {
  DEFINING_WILDLIFE_AGGRESSION_LEVEL_AGGRESSIVE_THRESHOLD,
  DEFINING_WILDLIFE_AGGRESSION_LEVEL_BELL_CURVE_SEED_SALT_U1,
  DEFINING_WILDLIFE_AGGRESSION_LEVEL_BELL_CURVE_SEED_SALT_U2,
  DEFINING_WILDLIFE_AGGRESSION_LEVEL_PROFILES,
  DEFINING_WILDLIFE_AGGRESSION_LEVEL_TAME_THRESHOLD,
  type DefiningWildlifeAggressionLevelProfile,
} from '@/components/world/wildlife/domains/definingWildlifeAggressionLevelConstants';
import type { DefiningWildlifeSpeciesDefinition } from '@/components/world/wildlife/domains/definingWildlifeSpeciesRegistry';
import type {
  DefiningWildlifeAggressionLevel,
  DefiningWildlifeSpawnAnchor,
} from '@/components/world/wildlife/domains/definingWildlifeTypes';
import { resolvingWildlifeDistanceDangerAggressionMeanShift } from '@/components/world/wildlife/domains/resolvingWildlifeDistanceDangerLevers';

function mappingWildlifeAggressionBellCurveSampleToLevel(
  standardNormal: number,
  bellCurveMeanShift: number
): DefiningWildlifeAggressionLevel {
  const shiftedSample = standardNormal + bellCurveMeanShift;

  if (shiftedSample < DEFINING_WILDLIFE_AGGRESSION_LEVEL_TAME_THRESHOLD) {
    return 'tame';
  }

  if (shiftedSample > DEFINING_WILDLIFE_AGGRESSION_LEVEL_AGGRESSIVE_THRESHOLD) {
    return 'aggressive';
  }

  return 'normal';
}

/**
 * Samples a standard-normal value for one spawn anchor using Box-Muller.
 * Stable per anchor tile and pack index.
 */
export function resolvingWildlifeAggressionBellCurveSampleFromAnchor(
  anchor: DefiningWildlifeSpawnAnchor
): number {
  return computingWildlifeStandardNormalSampleFromAnchor(anchor, {
    seedSaltU1: DEFINING_WILDLIFE_AGGRESSION_LEVEL_BELL_CURVE_SEED_SALT_U1,
    seedSaltU2: DEFINING_WILDLIFE_AGGRESSION_LEVEL_BELL_CURVE_SEED_SALT_U2,
  });
}

/** Resolves the aggression tier for one spawn anchor. */
export function resolvingWildlifeAggressionLevelFromAnchor(
  anchor: DefiningWildlifeSpawnAnchor,
  species: DefiningWildlifeSpeciesDefinition
): DefiningWildlifeAggressionLevel {
  const dangerBand = computingWorldPlazaDistanceDangerBandFromOrigin(
    anchor.tileX,
    anchor.tileY
  );

  return mappingWildlifeAggressionBellCurveSampleToLevel(
    resolvingWildlifeAggressionBellCurveSampleFromAnchor(anchor),
    species.aggressionSpawn.bellCurveMeanShift +
      resolvingWildlifeDistanceDangerAggressionMeanShift(dangerBand)
  );
}

/** Returns the gameplay profile for one aggression tier. */
export function resolvingWildlifeAggressionLevelProfile(
  aggressionLevel: DefiningWildlifeAggressionLevel
): DefiningWildlifeAggressionLevelProfile {
  return DEFINING_WILDLIFE_AGGRESSION_LEVEL_PROFILES[aggressionLevel];
}
