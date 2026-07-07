/**
 * Resolves sprite anchor, foot line, and frame height for one wildlife species.
 *
 * @module components/world/wildlife/domains/resolvingWildlifeSpeciesSpritePresentation
 */

import type { DefiningWildlifeSpeciesDefinition } from '@/components/world/wildlife/domains/definingWildlifeSpeciesRegistry';
import {
  DEFINING_WILDLIFE_DEFAULT_SPRITE_PRESENTATION,
  DEFINING_WILDLIFE_SPECIES_SPRITE_PRESENTATION_OVERRIDES,
  type DefiningWildlifeSpeciesSpritePresentation,
} from '@/components/world/wildlife/domains/definingWildlifeSpritePresentationConstants';

/** Returns the render layout for one wildlife species. */
export function resolvingWildlifeSpeciesSpritePresentation(
  species: Pick<DefiningWildlifeSpeciesDefinition, 'speciesId'>
): DefiningWildlifeSpeciesSpritePresentation {
  const override =
    DEFINING_WILDLIFE_SPECIES_SPRITE_PRESENTATION_OVERRIDES[species.speciesId];

  if (!override) {
    return DEFINING_WILDLIFE_DEFAULT_SPRITE_PRESENTATION;
  }

  return {
    anchorYNormalized:
      override.anchorYNormalized ??
      DEFINING_WILDLIFE_DEFAULT_SPRITE_PRESENTATION.anchorYNormalized,
    footYNormalized:
      override.footYNormalized ??
      DEFINING_WILDLIFE_DEFAULT_SPRITE_PRESENTATION.footYNormalized,
    frameHeightPx:
      override.frameHeightPx ??
      DEFINING_WILDLIFE_DEFAULT_SPRITE_PRESENTATION.frameHeightPx,
  };
}
