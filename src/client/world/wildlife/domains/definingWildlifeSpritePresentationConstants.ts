/**
 * Per-species sprite anchor and foot layout for wildlife rendering.
 *
 * Most quadruped sheets paint feet near 0.70–0.88 of frame height. Small birds
 * like chickens sit higher in 64px frames, so the shared 0.72 anchor lifts them.
 *
 * @module components/world/wildlife/domains/definingWildlifeSpritePresentationConstants
 */

import type { DefiningWildlifeSpeciesId } from '@/components/world/wildlife/domains/definingWildlifeTypes';

export type DefiningWildlifeSpeciesSpritePresentation = {
  anchorYNormalized: number;
  footYNormalized: number;
  frameHeightPx: number;
};

/** Default anchor/foot layout tuned for median 84px quadruped frames. */
export const DEFINING_WILDLIFE_DEFAULT_SPRITE_PRESENTATION: DefiningWildlifeSpeciesSpritePresentation =
  {
    anchorYNormalized: 0.72,
    footYNormalized: 0.88,
    frameHeightPx: 84,
  };

/**
 * Species whose painted feet diverge from the default quadruped layout.
 * Values are sampled from Idle/Run shadowless sheets (Down-facing rows).
 */
export const DEFINING_WILDLIFE_SPECIES_SPRITE_PRESENTATION_OVERRIDES: Partial<
  Record<DefiningWildlifeSpeciesId, DefiningWildlifeSpeciesSpritePresentation>
> = {
  chicken: {
    anchorYNormalized: 0.65,
    footYNormalized: 0.65,
    frameHeightPx: 64,
  },
};
