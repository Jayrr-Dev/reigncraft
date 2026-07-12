/**
 * True when a species has the Immortal passive (no damage, no vitals bars).
 *
 * @module components/world/wildlife/domains/checkingWildlifeSpeciesIsImmortal
 */

import { checkingWildlifeSpeciesHasPassiveTrait } from '@/components/world/wildlife/domains/checkingWildlifeSpeciesHasPassiveTrait';
import type { DefiningWildlifeSpeciesDefinition } from '@/components/world/wildlife/domains/definingWildlifeSpeciesRegistry';

export function checkingWildlifeSpeciesIsImmortal(
  species: Pick<DefiningWildlifeSpeciesDefinition, 'passiveTraitIds'>
): boolean {
  return checkingWildlifeSpeciesHasPassiveTrait(species, 'immortal');
}
