/**
 * Declarative passive traits: Unnoticed (neverTriggersWildlifeAggro path).
 *
 * @module components/world/wildlife/domains/checkingWildlifeSpeciesNeverTriggersWildlifeAggro
 */

import { checkingWildlifeSpeciesHasPassiveTrait } from '@/components/world/wildlife/domains/checkingWildlifeSpeciesHasPassiveTrait';
import type { DefiningWildlifeSpeciesDefinition } from '@/components/world/wildlife/domains/definingWildlifeSpeciesRegistry';

export function checkingWildlifeSpeciesNeverTriggersWildlifeAggro(
  species: Pick<DefiningWildlifeSpeciesDefinition, 'passiveTraitIds'>
): boolean {
  return checkingWildlifeSpeciesHasPassiveTrait(
    species,
    'never-triggers-wildlife-aggro'
  );
}
