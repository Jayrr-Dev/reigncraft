/**
 * Whether a species instance uses the social-hunter pack gate.
 *
 * @module components/world/wildlife/domains/checkingWildlifeInstanceIsSocialHunter
 */

import type { DefiningWildlifeSpeciesDefinition } from '@/components/world/wildlife/domains/definingWildlifeSpeciesRegistry';
import type { DefiningWildlifeInstance } from '@/components/world/wildlife/domains/definingWildlifeTypes';

/**
 * True when the living instance opted into `socialBehavior.socialHunter`.
 * Opt-in (unlike defend-young / separation anxiety defaults).
 */
export function checkingWildlifeInstanceIsSocialHunter(
  instance: DefiningWildlifeInstance,
  species: DefiningWildlifeSpeciesDefinition
): boolean {
  if (instance.isDead) {
    return false;
  }

  return species.socialBehavior?.socialHunter === true;
}
