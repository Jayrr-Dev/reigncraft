/**
 * Devvit playtest UI simulator profiles in display order.
 *
 * Matches Reddit's UI simulator controls: Mobile → Desktop → Fullscreen.
 *
 * @see https://developers.reddit.com/docs/guides/tools/ui_simulator
 *
 * @module components/world/domains/definingWorldPlazaViewportProfileConstants
 */

/** Ordered plaza viewport profiles shown in the Devvit UI simulator. */
export const DEFINING_WORLD_PLAZA_VIEWPORT_PROFILES = [
  'mobile',
  'desktop',
  'fullscreen',
] as const;

export type DefiningWorldPlazaViewportProfile =
  (typeof DEFINING_WORLD_PLAZA_VIEWPORT_PROFILES)[number];

/** Max CSS width treated as mobile (matches Tailwind `md` and Devvit mobile sim). */
export const DEFINING_WORLD_PLAZA_VIEWPORT_MOBILE_MAX_WIDTH_PX = 767 as const;

/**
 * Wide inline playtest viewports at or above this HUD scale use fullscreen HUD
 * sizing. Desktop sim stays near 1.0; fullscreen sim clamps to 1.3.
 */
export const DEFINING_WORLD_PLAZA_VIEWPORT_SIMULATOR_FULLSCREEN_MIN_HUD_SCALE =
  1.12 as const;
