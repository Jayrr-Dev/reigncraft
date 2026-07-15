/**
 * Fantasy UI SFX for study completion and related reward grants.
 *
 * Most sections share `study_learn` at different volumes. World chest open
 * uses a dedicated key-insertion clip so loot reads as a physical open.
 *
 * Assets live under `public/home/sfx/fantasy-ui/`.
 *
 * @module components/world/wildlife/domains/definingWildlifeStudySfxConstants
 */

/** Public URL prefix for shipped Fantasy UI study clips. */
export const DEFINING_WILDLIFE_STUDY_SFX_ASSET_BASE_URL =
  '/home/sfx/fantasy-ui' as const;

/** Stable ids for study / reward one-shots. */
export type DefiningWildlifeStudySfxClipId = 'study_learn' | 'chest_open';

/**
 * Reward / learn contexts that pick a clip and base volume.
 */
export type DefiningWildlifeStudySfxSectionId =
  | 'study'
  | 'codex'
  | 'chest'
  | 'key'
  | 'recipe';

/**
 * Which clip each reward section plays.
 */
export const DEFINING_WILDLIFE_STUDY_SFX_CLIP_ID_BY_SECTION: Record<
  DefiningWildlifeStudySfxSectionId,
  DefiningWildlifeStudySfxClipId
> = {
  study: 'study_learn',
  codex: 'study_learn',
  chest: 'chest_open',
  key: 'study_learn',
  recipe: 'study_learn',
};

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
  /** World chest loot: key-in-lock open beat. */
  chest: 0.5,
  /** Finding a chest key while foraging: softest of the set. */
  key: 0.38,
  /** Auto-granted recipe pages (Bestiary / Lapidary). */
  recipe: 0.68,
};

/** @deprecated Prefer {@link DEFINING_WILDLIFE_STUDY_SFX_TARGET_VOLUME_BY_SECTION}.study */
export const DEFINING_WILDLIFE_STUDY_SFX_TARGET_VOLUME =
  DEFINING_WILDLIFE_STUDY_SFX_TARGET_VOLUME_BY_SECTION.study;
