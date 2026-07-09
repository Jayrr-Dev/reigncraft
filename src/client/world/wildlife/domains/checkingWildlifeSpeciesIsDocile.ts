/**
 * Predicate for the docile temperament (friendly stock that needs Attack?).
 *
 * @module components/world/wildlife/domains/checkingWildlifeSpeciesIsDocile
 */

import type { DefiningWildlifeSpeciesDefinition } from '@/components/world/wildlife/domains/definingWildlifeSpeciesRegistry';

/**
 * Returns true when the species uses the docile behavior tree.
 */
export function checkingWildlifeSpeciesIsDocile(
  species: DefiningWildlifeSpeciesDefinition | null | undefined
): boolean {
  return species?.temperamentId === 'docile';
}
