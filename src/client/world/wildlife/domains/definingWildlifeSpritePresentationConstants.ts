/**
 * Per-species sprite anchor and foot layout for wildlife rendering.
 *
 * Frame height comes from the measured sheet map
 * (`definingWildlifeSpriteSheetFrameHeightByFolder.ts`). Overrides here only
 * cover painted-foot / anchor exceptions (e.g. chicken).
 *
 * @module components/world/wildlife/domains/definingWildlifeSpritePresentationConstants
 */

import type { DefiningWildlifeSpeciesId } from '@/components/world/wildlife/domains/definingWildlifeTypes';
import { DEFINING_WILDLIFE_SPRITE_SHEET_DEFAULT_FRAME_HEIGHT_PX } from '@/components/world/wildlife/domains/definingWildlifeSpriteSheetFrameHeightByFolder';

export type DefiningWildlifeSpeciesSpritePresentation = {
  anchorYNormalized: number;
  footYNormalized: number;
  frameHeightPx: number;
};

/** Partial override; omitted fields fall back to the shared quadruped defaults. */
export type DefiningWildlifeSpeciesSpritePresentationOverride = Partial<
  DefiningWildlifeSpeciesSpritePresentation
>;

/** Default anchor/foot layout; frame height is filled from the sheet map. */
export const DEFINING_WILDLIFE_DEFAULT_SPRITE_PRESENTATION: DefiningWildlifeSpeciesSpritePresentation =
  {
    anchorYNormalized: 0.72,
    footYNormalized: 0.88,
    frameHeightPx: DEFINING_WILDLIFE_SPRITE_SHEET_DEFAULT_FRAME_HEIGHT_PX,
  };

/**
 * Species whose painted feet diverge from the default quadruped layout.
 * Values are sampled from Idle/Run shadowless sheets (Down-facing rows).
 */
export const DEFINING_WILDLIFE_SPECIES_SPRITE_PRESENTATION_OVERRIDES: Partial<
  Record<
    DefiningWildlifeSpeciesId,
    DefiningWildlifeSpeciesSpritePresentationOverride
  >
> = {
  // Chicken body sits high in a 64px frame; feet share the grid anchor.
  chicken: {
    anchorYNormalized: 0.65,
    footYNormalized: 0.65,
  },
};
