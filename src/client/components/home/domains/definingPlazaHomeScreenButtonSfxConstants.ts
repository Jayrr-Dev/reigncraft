/**
 * TomMusic fantasy chest-close clips for home screen button clicks.
 *
 * Assets live under `public/sfx/fantasy-ui/`.
 *
 * @module components/home/domains/definingPlazaHomeScreenButtonSfxConstants
 */

/** Public URL prefix for shipped home screen button clips. */
export const DEFINING_PLAZA_HOME_SCREEN_BUTTON_SFX_ASSET_BASE_URL =
  '/sfx/fantasy-ui' as const;

/** Stable ids for every bundled home screen button clip. */
export type DefiningPlazaHomeScreenButtonSfxClipId =
  | 'chest_close_01'
  | 'chest_close_02';

/** Ordered variants cycled on each button click. */
export const DEFINING_PLAZA_HOME_SCREEN_BUTTON_SFX_CLIP_VARIANTS: readonly DefiningPlazaHomeScreenButtonSfxClipId[] =
  ['chest_close_01', 'chest_close_02'];

/** Base one-shot volume before the SFX volume slider is applied. */
export const DEFINING_PLAZA_HOME_SCREEN_BUTTON_SFX_TARGET_VOLUME = 0.55;
