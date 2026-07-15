/**
 * Tunables for the bestiary codex sprite portraits.
 *
 * Portraits crop a single front-facing idle frame out of each species'
 * 15x8 sprite sheet using CSS background positioning.
 *
 * @module components/home/domains/definingPlazaBestiarySpritePortraitConstants
 */

/** Animation column sampled from the idle sheet (first frame). */
export const DEFINING_PLAZA_BESTIARY_PORTRAIT_FRAME_COLUMN_INDEX = 0;

/** Direction row sampled from the idle sheet (Down = facing the camera). */
export const DEFINING_PLAZA_BESTIARY_PORTRAIT_FRAME_ROW_INDEX = 2;

/** Zoom applied to the cropped frame so animals fill past sheet padding. */
export const DEFINING_PLAZA_BESTIARY_PORTRAIT_CARD_ZOOM = 1.55;

/** Zoom applied on the larger detail page hero. */
export const DEFINING_PLAZA_BESTIARY_PORTRAIT_DETAIL_ZOOM = 1.35;

/**
 * Fishing catch loot cells already fill most of the 32px frame, so card zoom
 * stays near 1 (land walk sheets need ~1.55 to punch past padding).
 */
export const DEFINING_PLAZA_BESTIARY_PORTRAIT_FISH_CARD_ZOOM = 0.9;

/** Detail hero zoom for fishing catch portraits. */
export const DEFINING_PLAZA_BESTIARY_PORTRAIT_FISH_DETAIL_ZOOM = 0.8;

/** CSS filter that flattens the sprite into a locked-entry silhouette. */
export const DEFINING_PLAZA_BESTIARY_PORTRAIT_SILHOUETTE_FILTER =
  'brightness(0) opacity(0.8)' as const;
