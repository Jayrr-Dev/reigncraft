/**
 * Maps wildlife registry vitals into playable transform character-engine space.
 *
 * Wildlife HP/atk are authored then multiplied by the difficulty lever at
 * registry build. Transforms undo that lever and re-scale so a mid-tier
 * predator (lion author baseline) lands near the girl strength baseline.
 *
 * @module components/world/domains/definingWorldPlazaAnimalTransformVitalsScaleConstants
 */

import { DEFINING_WORLD_PLAZA_STRENGTH_BASELINE_REFERENCE } from '@/components/world/strength/domains/definingWorldPlazaStrengthIndexConstants';
import { DEFINING_WILDLIFE_DIFFICULTY_LEVERS } from '@/components/world/wildlife/domains/definingWildlifeDifficultyLevers';

/**
 * Author-space wildlife reference (lion) used to pin transform combat scaling.
 * Must stay aligned with `definingWildlifeSpeciesRegistry` lion vitals.
 */
export const DEFINING_WORLD_PLAZA_ANIMAL_TRANSFORM_WILDLIFE_AUTHOR_REFERENCE = {
  baseMaxHealth: 100,
  attackPower: 26,
} as const;

/** Difficulty lever applied to wildlife HP/atk at registry build. */
export const DEFINING_WORLD_PLAZA_ANIMAL_TRANSFORM_WILDLIFE_COMBAT_SCALE =
  DEFINING_WILDLIFE_DIFFICULTY_LEVERS.healthAndAttackPowerScale;

/**
 * Author HP → player transform HP.
 * Lion 100 author → girl baseline 1000.
 */
export const DEFINING_WORLD_PLAZA_ANIMAL_TRANSFORM_HEALTH_FROM_AUTHOR_MULTIPLIER =
  DEFINING_WORLD_PLAZA_STRENGTH_BASELINE_REFERENCE.maxHealth /
  DEFINING_WORLD_PLAZA_ANIMAL_TRANSFORM_WILDLIFE_AUTHOR_REFERENCE.baseMaxHealth;

/**
 * Author attack → player transform attack EV.
 * Lion 26 author → girl baseline 300.
 */
export const DEFINING_WORLD_PLAZA_ANIMAL_TRANSFORM_ATTACK_FROM_AUTHOR_MULTIPLIER =
  DEFINING_WORLD_PLAZA_STRENGTH_BASELINE_REFERENCE.attackPower /
  DEFINING_WORLD_PLAZA_ANIMAL_TRANSFORM_WILDLIFE_AUTHOR_REFERENCE.attackPower;

/**
 * Converts a wildlife runtime (post-lever) combat vital into transform mature space.
 */
export function computingWorldPlazaAnimalTransformMatureCombatStat(input: {
  readonly wildlifeRuntimeStat: number;
  readonly fromAuthorMultiplier: number;
}): number {
  const authorStat =
    input.wildlifeRuntimeStat /
    Math.max(1, DEFINING_WORLD_PLAZA_ANIMAL_TRANSFORM_WILDLIFE_COMBAT_SCALE);

  return authorStat * input.fromAuthorMultiplier;
}
