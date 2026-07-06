/**
 * Predicate for Zelda-style aggressive chicken spawns.
 *
 * @module components/world/wildlife/domains/checkingWildlifeIsAggressiveChicken
 */

import { DEFINING_WILDLIFE_AGGRESSIVE_CHICKEN_SPECIES_ID } from '@/components/world/wildlife/domains/definingWildlifeAggressiveChickenConstants';
import type { DefiningWildlifeInstance } from '@/components/world/wildlife/domains/definingWildlifeTypes';

/** Returns true when this instance is an aggressive chicken spawn. */
export function checkingWildlifeIsAggressiveChicken(
  instance: Pick<DefiningWildlifeInstance, 'speciesId' | 'aggressionLevel'>
): boolean {
  return (
    instance.speciesId === DEFINING_WILDLIFE_AGGRESSIVE_CHICKEN_SPECIES_ID &&
    instance.aggressionLevel === 'aggressive'
  );
}
