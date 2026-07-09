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
import { resolvingWildlifeSpriteSheetFrameHeightPx } from '@/components/world/wildlife/domains/definingWildlifeSpriteSheetFrameHeightByFolder';

/** Returns the render layout for one wildlife species. */
export function resolvingWildlifeSpeciesSpritePresentation(
  species: Pick<DefiningWildlifeSpeciesDefinition, 'speciesId' | 'spriteFolder'>
): DefiningWildlifeSpeciesSpritePresentation {
  const override =
    DEFINING_WILDLIFE_SPECIES_SPRITE_PRESENTATION_OVERRIDES[species.speciesId];
  const frameHeightPx =
    override?.frameHeightPx ??
    resolvingWildlifeSpriteSheetFrameHeightPx(species.spriteFolder);

  return {
    anchorYNormalized:
      override?.anchorYNormalized ??
      DEFINING_WILDLIFE_DEFAULT_SPRITE_PRESENTATION.anchorYNormalized,
    footYNormalized:
      override?.footYNormalized ??
      DEFINING_WILDLIFE_DEFAULT_SPRITE_PRESENTATION.footYNormalized,
    frameHeightPx,
  };
}
