/**
 * Deterministic bell-curve aggression level roll per spawn anchor.
 *
 * @module components/world/wildlife/domains/resolvingWildlifeAggressionLevelFromAnchor
 */

import type { DefiningWildlifeSpeciesDefinition } from '@/components/world/wildlife/domains/definingWildlifeSpeciesRegistry';
import { seedingWorldPlazaGrassTileDecorationFromTileIndex } from '@/components/world/domains/seedingWorldPlazaGrassTileDecorationFromTileIndex';
import {
  DEFINING_WILDLIFE_AGGRESSION_LEVEL_AGGRESSIVE_THRESHOLD,
  DEFINING_WILDLIFE_AGGRESSION_LEVEL_BELL_CURVE_SEED_SALT_U1,
  DEFINING_WILDLIFE_AGGRESSION_LEVEL_BELL_CURVE_SEED_SALT_U2,
  DEFINING_WILDLIFE_AGGRESSION_LEVEL_PROFILES,
  DEFINING_WILDLIFE_AGGRESSION_LEVEL_TAME_THRESHOLD,
  type DefiningWildlifeAggressionLevelProfile,
} from '@/components/world/wildlife/domains/definingWildlifeAggressionLevelConstants';
import type {
  DefiningWildlifeAggressionLevel,
  DefiningWildlifeSpawnAnchor,
} from '@/components/world/wildlife/domains/definingWildlifeTypes';

/** Minimum uniform draw before log transform in Box-Muller. */
const RESOLVING_WILDLIFE_AGGRESSION_LEVEL_MIN_UNIFORM = 1e-6;

/** Full circle in radians for Box-Muller. */
const RESOLVING_WILDLIFE_AGGRESSION_LEVEL_TWO_PI = Math.PI * 2;

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
  const uniformU1 = Math.max(
    RESOLVING_WILDLIFE_AGGRESSION_LEVEL_MIN_UNIFORM,
    seedingWorldPlazaGrassTileDecorationFromTileIndex(
      anchor.tileX,
      anchor.tileY,
      DEFINING_WILDLIFE_AGGRESSION_LEVEL_BELL_CURVE_SEED_SALT_U1 +
        anchor.packIndex
    )
  );
  const uniformU2 = seedingWorldPlazaGrassTileDecorationFromTileIndex(
    anchor.tileX,
    anchor.tileY,
    DEFINING_WILDLIFE_AGGRESSION_LEVEL_BELL_CURVE_SEED_SALT_U2 +
      anchor.packIndex
  );

  return (
    Math.sqrt(-2 * Math.log(uniformU1)) *
    Math.cos(RESOLVING_WILDLIFE_AGGRESSION_LEVEL_TWO_PI * uniformU2)
  );
}

/** Resolves the aggression tier for one spawn anchor. */
export function resolvingWildlifeAggressionLevelFromAnchor(
  anchor: DefiningWildlifeSpawnAnchor,
  species: DefiningWildlifeSpeciesDefinition
): DefiningWildlifeAggressionLevel {
  return mappingWildlifeAggressionBellCurveSampleToLevel(
    resolvingWildlifeAggressionBellCurveSampleFromAnchor(anchor),
    species.aggressionSpawn.bellCurveMeanShift
  );
}

/** Returns the gameplay profile for one aggression tier. */
export function resolvingWildlifeAggressionLevelProfile(
  aggressionLevel: DefiningWildlifeAggressionLevel
): DefiningWildlifeAggressionLevelProfile {
  return DEFINING_WILDLIFE_AGGRESSION_LEVEL_PROFILES[aggressionLevel];
}
