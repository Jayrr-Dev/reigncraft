/**
 * Plaza player profile popover open-state marker for label stacking.
 *
 * @module components/world/domains/definingWorldPlazaPlayerProfilePopoverConstants
 */

/** Data attribute set on a name row while its profile popover is open. */
export const DEFINING_WORLD_PLAZA_PLAYER_PROFILE_POPOVER_OPEN_DATA_ATTRIBUTE =
  "data-plaza-profile-popover-open" as const;

/** Gap between the name row and the profile card below it (CSS px). */
export const DEFINING_WORLD_PLAZA_PLAYER_PROFILE_POPOVER_BELOW_LABEL_OFFSET_PX = 4;

/** Default z-index for floating name labels. */
export const DEFINING_WORLD_PLAZA_PLAYER_NAME_LABEL_Z_INDEX = 10;

/** z-index for the name label whose profile popover is open. */
export const DEFINING_WORLD_PLAZA_PLAYER_PROFILE_POPOVER_OPEN_LABEL_Z_INDEX = 100;
