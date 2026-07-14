/**
 * Tunables for the herbarium codex flower portraits.
 *
 * Portraits crop a single cell out of the flower inventory sprite sheet
 * (4 columns x 3 rows @ 32px) using CSS background positioning.
 *
 * @module components/home/domains/definingPlazaHerbariumFlowerPortraitConstants
 */

/** Zoom applied to the cropped cell so petals fill past sheet padding. */
export const DEFINING_PLAZA_HERBARIUM_FLOWER_PORTRAIT_CARD_ZOOM = 2.4;

/** Zoom applied on the larger detail page hero. */
export const DEFINING_PLAZA_HERBARIUM_FLOWER_PORTRAIT_DETAIL_ZOOM = 3.2;

/** CSS filter that flattens the sprite into a locked-entry silhouette. */
export const DEFINING_PLAZA_HERBARIUM_FLOWER_PORTRAIT_SILHOUETTE_FILTER =
  'brightness(0) opacity(0.8)' as const;
