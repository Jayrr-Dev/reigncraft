/**
 * Whether an instance is young enough for separation anxiety (σ ≤ −1).
 *
 * @module components/world/wildlife/domains/checkingWildlifeInstanceHasSeparationAnxiety
 */

import { DEFINING_WILDLIFE_SEPARATION_ANXIETY_MAX_YOUNG_SIZE_TIER } from '@/components/world/wildlife/domains/definingWildlifeSeparationAnxietyConstants';
import type { DefiningWildlifeSpeciesDefinition } from '@/components/world/wildlife/domains/definingWildlifeSpeciesRegistry';
import type { DefiningWildlifeInstance } from '@/components/world/wildlife/domains/definingWildlifeTypes';
import { resolvingWildlifeInstanceSizeTierFromSample } from '@/components/world/wildlife/domains/resolvingWildlifeInstanceSizeTierFromSample';

/**
 * True for living young/babies of species that keep social follow behavior.
 * Defaults on; opt out with `socialBehavior.separationAnxiety: false`.
 */
export function checkingWildlifeInstanceHasSeparationAnxiety(
  instance: DefiningWildlifeInstance,
  species: DefiningWildlifeSpeciesDefinition
): boolean {
  if (species.socialBehavior?.separationAnxiety === false) {
    return false;
  }

  if (instance.isDead) {
    return false;
  }

  const sizeTier = resolvingWildlifeInstanceSizeTierFromSample(
    instance.sizeScaleSample,
    species
  );

  return sizeTier <= DEFINING_WILDLIFE_SEPARATION_ANXIETY_MAX_YOUNG_SIZE_TIER;
}
