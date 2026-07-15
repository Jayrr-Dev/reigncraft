/**
 * Fantasy UI SFX for study completion and related reward grants.
 *
 * Same `study_learn` clip for every section; volumes differ so codex,
 * chest, and key finds read as distinct reward beats.
 *
 * Assets live under `public/home/sfx/fantasy-ui/`.
 *
 * @module components/world/wildlife/domains/definingWildlifeStudySfxConstants
 */

/** Public URL prefix for shipped Fantasy UI study clips. */
export const DEFINING_WILDLIFE_STUDY_SFX_ASSET_BASE_URL =
  '/home/sfx/fantasy-ui' as const;

/** Stable id for the shared study / reward clip. */
export type DefiningWildlifeStudySfxClipId = 'study_learn';

/**
 * Reward / learn contexts that reuse the study clip at different volumes.
 */
export type DefiningWildlifeStudySfxSectionId =
  | 'study'
  | 'codex'
  | 'chest'
  | 'key';

/**
 * Base one-shot volume per section before the SFX volume slider is applied.
 * Study stays at the original learn level; other grants sit nearby so they
 * feel related but not identical.
 */
export const DEFINING_WILDLIFE_STUDY_SFX_TARGET_VOLUME_BY_SECTION: Record<
  DefiningWildlifeStudySfxSectionId,
  number
> = {
  study: 0.62,
  /** Codex milestone claim: slightly louder celebration. */
  codex: 0.74,
  /** World chest loot: a touch quieter than study. */
  chest: 0.5,
  /** Finding a chest key while foraging: softest of the set. */
  key: 0.38,
};

/** @deprecated Prefer {@link DEFINING_WILDLIFE_STUDY_SFX_TARGET_VOLUME_BY_SECTION}.study */
export const DEFINING_WILDLIFE_STUDY_SFX_TARGET_VOLUME =
  DEFINING_WILDLIFE_STUDY_SFX_TARGET_VOLUME_BY_SECTION.study;
