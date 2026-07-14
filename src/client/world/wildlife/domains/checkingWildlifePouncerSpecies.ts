/**
 * Species that use the pouncer attack pattern (retreat, then jump).
 *
 * @module components/world/wildlife/domains/checkingWildlifePouncerSpecies
 */

import { resolvingWildlifeSpeciesPouncerConfig } from '@/components/world/wildlife/domains/definingWildlifeSpeciesPouncerRegistry';

/** True when the species has a pouncer combat registry row. */
export function checkingWildlifePouncerSpecies(speciesId: string): boolean {
  return resolvingWildlifeSpeciesPouncerConfig(speciesId) !== null;
}
