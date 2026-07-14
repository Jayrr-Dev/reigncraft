/**
 * Icons and lift for wildlife forage / graze eat overlays.
 *
 * @module components/world/wildlife/domains/definingWildlifeForageEatOverlayConstants
 */

/** Progress ring center icon while chewing long grass. */
export const DEFINING_WILDLIFE_FORAGE_EAT_OVERLAY_ICON_GRASS =
  'mdi:grass' as const;

/** Progress ring center icon while chewing flowers. */
export const DEFINING_WILDLIFE_FORAGE_EAT_OVERLAY_ICON_FLOWER =
  'mdi:flower' as const;

/** Progress ring center icon while chewing berry shrubs. */
export const DEFINING_WILDLIFE_FORAGE_EAT_OVERLAY_ICON_BERRY =
  'mdi:leaf' as const;

/** Progress ring center icon while chewing dropped food stacks. */
export const DEFINING_WILDLIFE_FORAGE_EAT_OVERLAY_ICON_FOOD =
  'mdi:food-apple-outline' as const;

/** Progress ring center icon during abstract graze (no tile target). */
export const DEFINING_WILDLIFE_FORAGE_EAT_OVERLAY_ICON_GRAZE =
  'mdi:grass' as const;

/**
 * Extra lift above the name-tag anchor so the eat ring sits near the head
 * without covering the species label.
 */
export const DEFINING_WILDLIFE_FORAGE_EAT_OVERLAY_LIFT_ABOVE_NAME_TAG_PX = 18;

/** Soft fill shown for abstract graze (no chew timer). */
export const DEFINING_WILDLIFE_GRAZE_OVERLAY_PROGRESS_RATIO = 0.55;
