/**
 * Whether a damaged animal is a baby that can trigger defend-young.
 *
 * @module components/world/wildlife/domains/checkingWildlifeInstanceIsDefendYoungVictim
 */

import { DEFINING_WILDLIFE_DEFEND_YOUNG_MAX_VICTIM_SIZE_TIER } from '@/components/world/wildlife/domains/definingWildlifeDefendYoungConstants';
import type { DefiningWildlifeSpeciesDefinition } from '@/components/world/wildlife/domains/definingWildlifeSpeciesRegistry';
import type { DefiningWildlifeInstance } from '@/components/world/wildlife/domains/definingWildlifeTypes';
import { resolvingWildlifeInstanceSizeTierFromSample } from '@/components/world/wildlife/domains/resolvingWildlifeInstanceSizeTierFromSample';

/** True when the instance is a baby (σ tier −2) of a species that defends young. */
export function checkingWildlifeInstanceIsDefendYoungVictim(
  instance: DefiningWildlifeInstance,
  species: DefiningWildlifeSpeciesDefinition
): boolean {
  // Default on for all species; set socialBehavior.defendsYoung: false to opt out.
  if (species.socialBehavior?.defendsYoung === false) {
    return false;
  }

  if (instance.isDead) {
    return false;
  }

  const sizeTier = resolvingWildlifeInstanceSizeTierFromSample(
    instance.sizeScaleSample,
    species
  );

  return sizeTier <= DEFINING_WILDLIFE_DEFEND_YOUNG_MAX_VICTIM_SIZE_TIER;
}
