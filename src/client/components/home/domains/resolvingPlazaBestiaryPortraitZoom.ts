/**
 * Picks bestiary portrait zoom for land wildlife vs fishing catch sheets.
 *
 * @module components/home/domains/resolvingPlazaBestiaryPortraitZoom
 */

import {
  DEFINING_PLAZA_BESTIARY_PORTRAIT_CARD_ZOOM,
  DEFINING_PLAZA_BESTIARY_PORTRAIT_DETAIL_ZOOM,
  DEFINING_PLAZA_BESTIARY_PORTRAIT_FISH_CARD_ZOOM,
  DEFINING_PLAZA_BESTIARY_PORTRAIT_FISH_DETAIL_ZOOM,
} from '@/components/home/domains/definingPlazaBestiarySpritePortraitConstants';
import { checkingWildlifeFishMeatSpeciesId } from '@/components/world/wildlife/domains/definingWildlifeFishMeatCatalog';
import type { DefiningWildlifeSpeciesId } from '@/components/world/wildlife/domains/definingWildlifeTypes';

export type PlazaBestiaryPortraitZoomSurface = 'card' | 'detail';

/** Card or detail zoom for one species portrait. */
export function resolvingPlazaBestiaryPortraitZoom(
  speciesId: DefiningWildlifeSpeciesId,
  surface: PlazaBestiaryPortraitZoomSurface
): number {
  const isFish = checkingWildlifeFishMeatSpeciesId(speciesId);

  if (surface === 'detail') {
    return isFish
      ? DEFINING_PLAZA_BESTIARY_PORTRAIT_FISH_DETAIL_ZOOM
      : DEFINING_PLAZA_BESTIARY_PORTRAIT_DETAIL_ZOOM;
  }

  return isFish
    ? DEFINING_PLAZA_BESTIARY_PORTRAIT_FISH_CARD_ZOOM
    : DEFINING_PLAZA_BESTIARY_PORTRAIT_CARD_ZOOM;
}
