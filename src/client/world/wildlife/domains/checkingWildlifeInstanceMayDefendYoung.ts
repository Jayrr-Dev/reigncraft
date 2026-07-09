/**
 * Whether a nearby animal may join a defend-young counterattack.
 *
 * @module components/world/wildlife/domains/checkingWildlifeInstanceMayDefendYoung
 */

import { DEFINING_WILDLIFE_DEFEND_YOUNG_MIN_DEFENDER_SIZE_TIER } from '@/components/world/wildlife/domains/definingWildlifeDefendYoungConstants';
import type { DefiningWildlifeSpeciesDefinition } from '@/components/world/wildlife/domains/definingWildlifeSpeciesRegistry';
import type { DefiningWildlifeInstance } from '@/components/world/wildlife/domains/definingWildlifeTypes';
import { resolvingWildlifeInstanceSizeTierFromSample } from '@/components/world/wildlife/domains/resolvingWildlifeInstanceSizeTierFromSample';

export type CheckingWildlifeInstanceMayDefendYoungParams = {
  instance: DefiningWildlifeInstance;
  species: DefiningWildlifeSpeciesDefinition;
  victimInstanceId: string;
  victimSpeciesId: string;
};

/**
 * Same species, living adult (σ tier ≥ 0), not the baby victim, species defends young.
 */
export function checkingWildlifeInstanceMayDefendYoung({
  instance,
  species,
  victimInstanceId,
  victimSpeciesId,
}: CheckingWildlifeInstanceMayDefendYoungParams): boolean {
  // Default on for all species; set socialBehavior.defendsYoung: false to opt out.
  if (species.socialBehavior?.defendsYoung === false) {
    return false;
  }

  if (instance.isDead) {
    return false;
  }

  if (instance.instanceId === victimInstanceId) {
    return false;
  }

  if (instance.speciesId !== victimSpeciesId) {
    return false;
  }

  const sizeTier = resolvingWildlifeInstanceSizeTierFromSample(
    instance.sizeScaleSample,
    species
  );

  return sizeTier >= DEFINING_WILDLIFE_DEFEND_YOUNG_MIN_DEFENDER_SIZE_TIER;
}

/**
 * True while this animal is actively defending a baby (threat lock from defend-young).
 * Used by passive/skittish trees so adults fight instead of fleeing.
 */
export function checkingWildlifeInstanceIsDefendingYoung(
  instance: DefiningWildlifeInstance
): boolean {
  return (
    instance.aggroState.defendingYoungUntilMs !== null &&
    instance.aggroState.defendingYoungUntilMs !== undefined &&
    instance.aggroState.activeTargetId !== null
  );
}
