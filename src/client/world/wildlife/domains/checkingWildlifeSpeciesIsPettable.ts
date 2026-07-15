/**
 * Resolves whether a wildlife species can be petted for study points.
 *
 * @module components/world/wildlife/domains/checkingWildlifeSpeciesIsPettable
 */

import {
  DEFINING_WILDLIFE_DOCILE_PET_CAT_SPECIES_IDS,
  DEFINING_WILDLIFE_DOCILE_PET_DOG_SPECIES_IDS,
  DEFINING_WILDLIFE_DOCILE_PET_MONKEY_SPECIES_IDS,
  DEFINING_WILDLIFE_DOCILE_PET_PINGUIN_SPECIES_IDS,
  type DefiningWildlifeDocilePetKind,
} from '@/components/world/wildlife/domains/definingWildlifeDocilePetConstants';
import type { DefiningWildlifeSpeciesId } from '@/components/world/wildlife/domains/definingWildlifeTypes';

const DEFINING_WILDLIFE_DOCILE_PET_KIND_BY_SPECIES_ID: ReadonlyMap<
  string,
  DefiningWildlifeDocilePetKind
> = new Map([
  ...DEFINING_WILDLIFE_DOCILE_PET_CAT_SPECIES_IDS.map(
    (speciesId) => [speciesId, 'cat'] as const
  ),
  ...DEFINING_WILDLIFE_DOCILE_PET_DOG_SPECIES_IDS.map(
    (speciesId) => [speciesId, 'dog'] as const
  ),
  ...DEFINING_WILDLIFE_DOCILE_PET_PINGUIN_SPECIES_IDS.map(
    (speciesId) => [speciesId, 'pinguin'] as const
  ),
  ...DEFINING_WILDLIFE_DOCILE_PET_MONKEY_SPECIES_IDS.map(
    (speciesId) => [speciesId, 'monkey'] as const
  ),
]);

/**
 * Returns the pet kind for a species, or null when it cannot be petted.
 */
export function resolvingWildlifeDocilePetKind(
  speciesId: DefiningWildlifeSpeciesId | string | null | undefined
): DefiningWildlifeDocilePetKind | null {
  if (!speciesId) {
    return null;
  }

  return DEFINING_WILDLIFE_DOCILE_PET_KIND_BY_SPECIES_ID.get(speciesId) ?? null;
}

/**
 * True when the species supports Pet the Cat / Pet the Dog / Pet the Pinguin.
 */
export function checkingWildlifeSpeciesIsPettable(
  speciesId: DefiningWildlifeSpeciesId | string | null | undefined
): boolean {
  return resolvingWildlifeDocilePetKind(speciesId) !== null;
}
