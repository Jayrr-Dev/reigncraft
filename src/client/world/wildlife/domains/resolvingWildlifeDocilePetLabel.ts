/**
 * Player-facing Pet label copy for cats and dogs.
 *
 * @module components/world/wildlife/domains/resolvingWildlifeDocilePetLabel
 */

import {
  LABELING_WILDLIFE_DOCILE_PET_CAT_TITLE,
  LABELING_WILDLIFE_DOCILE_PET_DOG_TITLE,
  LABELING_WILDLIFE_DOCILE_PET_MONKEY_TITLE,
  LABELING_WILDLIFE_DOCILE_PET_PINGUIN_TITLE,
  LABELING_WILDLIFE_DOCILE_PETTING_TITLE,
  type DefiningWildlifeDocilePetKind,
} from '@/components/world/wildlife/domains/definingWildlifeDocilePetConstants';

/**
 * Idle Pet prompt for one companion kind.
 */
export function resolvingWildlifeDocilePetIdleLabel(
  petKind: DefiningWildlifeDocilePetKind
): string {
  if (petKind === 'cat') {
    return LABELING_WILDLIFE_DOCILE_PET_CAT_TITLE;
  }

  if (petKind === 'pinguin') {
    return LABELING_WILDLIFE_DOCILE_PET_PINGUIN_TITLE;
  }

  if (petKind === 'monkey') {
    return LABELING_WILDLIFE_DOCILE_PET_MONKEY_TITLE;
  }

  return LABELING_WILDLIFE_DOCILE_PET_DOG_TITLE;
}

/**
 * In-progress Pet label (shared for cats and dogs).
 */
export function resolvingWildlifeDocilePettingLabel(): string {
  return LABELING_WILDLIFE_DOCILE_PETTING_TITLE;
}
