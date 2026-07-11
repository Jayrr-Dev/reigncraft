/**
 * Fantasy UI SFX for corpse Study completion.
 *
 * Assets live under `public/home/sfx/fantasy-ui/`.
 *
 * @module components/world/wildlife/domains/definingWildlifeStudySfxConstants
 */

/** Public URL prefix for shipped Fantasy UI study clips. */
export const DEFINING_WILDLIFE_STUDY_SFX_ASSET_BASE_URL =
  '/home/sfx/fantasy-ui' as const;

/** Stable id for the study-complete clip. */
export type DefiningWildlifeStudySfxClipId = 'study_learn';

/** Base one-shot volume before the SFX volume slider is applied. */
export const DEFINING_WILDLIFE_STUDY_SFX_TARGET_VOLUME = 0.62;
