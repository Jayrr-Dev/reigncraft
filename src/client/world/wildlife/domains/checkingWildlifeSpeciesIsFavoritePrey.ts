/**
 * Whether a prey species is a configured favorite for one predator.
 *
 * @module components/world/wildlife/domains/checkingWildlifeSpeciesIsFavoritePrey
 */

import type { DefiningWildlifeSpeciesDefinition } from '@/components/world/wildlife/domains/definingWildlifeSpeciesRegistry';
import type { DefiningWildlifeSpeciesId } from '@/components/world/wildlife/domains/definingWildlifeTypes';

/** True when the predator is wired to drop everything for this prey species. */
export function checkingWildlifeSpeciesIsFavoritePrey(
  predator: DefiningWildlifeSpeciesDefinition,
  preySpeciesId: DefiningWildlifeSpeciesId
): boolean {
  return predator.favoritePreySpeciesIds?.includes(preySpeciesId) ?? false;
}
