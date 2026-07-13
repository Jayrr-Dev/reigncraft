/**
 * Action-bar day/night orb: sky fill colors, celestial icons, and labels.
 *
 * @module components/world/domains/definingWorldPlazaDayNightIndicatorConstants
 */

/** Accessible name for the day/night orb. */
export const LABELING_WORLD_PLAZA_ACTION_BAR_DAY_NIGHT = 'Time of day' as const;

/** Daytime celestial icon (bundled Iconify id). */
export const DEFINING_WORLD_PLAZA_DAY_NIGHT_INDICATOR_SUN_ICON =
  'mdi:weather-sunny' as const;

/** Nighttime celestial icon (bundled Iconify id). */
export const DEFINING_WORLD_PLAZA_DAY_NIGHT_INDICATOR_MOON_ICON =
  'mdi:weather-night' as const;

/** Sunny stop at the top of the daylight fill. */
export const DEFINING_WORLD_PLAZA_DAY_NIGHT_INDICATOR_SUNNY_TOP_COLOR =
  '#ffe566' as const;

/** Mid gold in the daylight fill. */
export const DEFINING_WORLD_PLAZA_DAY_NIGHT_INDICATOR_SUNNY_MID_COLOR =
  '#f0a429' as const;

/** Deeper amber at the bottom of the daylight fill. */
export const DEFINING_WORLD_PLAZA_DAY_NIGHT_INDICATOR_SUNNY_BOTTOM_COLOR =
  '#d97812' as const;

/** Near-black empty track for night / pre-dawn. */
export const DEFINING_WORLD_PLAZA_DAY_NIGHT_INDICATOR_NIGHT_COLOR =
  'rgba(8, 10, 18, 0.88)' as const;

/**
 * Top-to-bottom sunny gradient for rising daylight fill.
 * Night leaves only the black track visible.
 */
export const DEFINING_WORLD_PLAZA_DAY_NIGHT_INDICATOR_FILL_BACKGROUND_CSS =
  `linear-gradient(180deg, ${DEFINING_WORLD_PLAZA_DAY_NIGHT_INDICATOR_SUNNY_TOP_COLOR} 0%, ${DEFINING_WORLD_PLAZA_DAY_NIGHT_INDICATOR_SUNNY_MID_COLOR} 48%, ${DEFINING_WORLD_PLAZA_DAY_NIGHT_INDICATOR_SUNNY_BOTTOM_COLOR} 100%)` as const;

/**
 * Horizontal/vertical inset for the sun/moon inside the fill disc (0..0.5).
 * Keeps the icon from clipping the bronze ring.
 */
export const DEFINING_WORLD_PLAZA_DAY_NIGHT_INDICATOR_CELESTIAL_INSET = 0.16;

/** Wrapper anchoring the day/night orb in the action bar. */
export const STYLING_WORLD_PLAZA_ACTION_BAR_DAY_NIGHT_ANCHOR_CLASS_NAME =
  'relative flex shrink-0 items-center' as const;

/** CSS class for the day/night orb shell (bronze ring). */
export const STYLING_WORLD_PLAZA_DAY_NIGHT_INDICATOR_ORB_CLASS_NAME =
  'plaza-day-night-orb relative flex shrink-0 items-center justify-center rounded-full' as const;

/** CSS class for the clipped sky fill disc. */
export const STYLING_WORLD_PLAZA_DAY_NIGHT_INDICATOR_FILL_DISC_CLASS_NAME =
  'absolute inset-[3px] overflow-hidden rounded-full' as const;

/** CSS class for the moving sun/moon icon. */
export const STYLING_WORLD_PLAZA_DAY_NIGHT_INDICATOR_CELESTIAL_CLASS_NAME =
  'pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-1/2 text-white drop-shadow-[0_1px_1px_rgba(0,0,0,0.85)] transition-[left,top,color] duration-500 ease-out' as const;
