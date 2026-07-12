/**
 * True when a species opted into a declarative passive trait.
 *
 * @module components/world/wildlife/domains/checkingWildlifeSpeciesHasPassiveTrait
 */

import type { DefiningWildlifePassiveTraitId } from '@/components/world/wildlife/domains/definingWildlifePassiveTraitRegistry';
import type { DefiningWildlifeSpeciesDefinition } from '@/components/world/wildlife/domains/definingWildlifeSpeciesRegistry';

export function checkingWildlifeSpeciesHasPassiveTrait(
  species: Pick<DefiningWildlifeSpeciesDefinition, 'passiveTraitIds'>,
  traitId: DefiningWildlifePassiveTraitId
): boolean {
  return species.passiveTraitIds?.includes(traitId) === true;
}
