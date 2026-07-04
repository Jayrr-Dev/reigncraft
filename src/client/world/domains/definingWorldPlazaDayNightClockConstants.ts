/**
 * In-game day/night clock HUD tuning.
 *
 * @module components/world/domains/definingWorldPlazaDayNightClockConstants
 */

/** DOM refresh interval for the in-game clock label. */
export const DEFINING_WORLD_PLAZA_DAY_NIGHT_CLOCK_REFRESH_INTERVAL_MS = 1000;

/** Top-left anchor for the in-game clock. */
export const DEFINING_WORLD_PLAZA_DAY_NIGHT_CLOCK_ANCHOR_CLASS_NAME =
  "pointer-events-none absolute left-3 top-3 z-20 flex select-none" as const;

/** Clock label styling, matched to other plaza HUD readouts. */
export const DEFINING_WORLD_PLAZA_DAY_NIGHT_CLOCK_TEXT_CLASS_NAME =
  "text-xs font-semibold tabular-nums leading-none tracking-wide text-white/90 drop-shadow-[0_1px_1px_rgba(0,0,0,0.85)]" as const;
