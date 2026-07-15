/**
 * Reel opportunity window tuning for fishing casts.
 *
 * @module components/world/fishing/domains/definingWorldPlazaFishingReelOpportunityConstants
 */

export type DefiningWorldPlazaFishingReelOpportunityWindow = {
  readonly startMs: number;
  readonly durationMs: number;
};

/** Min reel-ready windows rolled per cast. */
export const DEFINING_WORLD_PLAZA_FISHING_REEL_OPPORTUNITY_WINDOW_COUNT_MIN = 1;

/** Max reel-ready windows rolled per cast. */
export const DEFINING_WORLD_PLAZA_FISHING_REEL_OPPORTUNITY_WINDOW_COUNT_MAX = 3;

/** Shortest reel-ready window length. */
export const DEFINING_WORLD_PLAZA_FISHING_REEL_OPPORTUNITY_WINDOW_DURATION_MS_MIN = 450;

/** Longest reel-ready window length. */
export const DEFINING_WORLD_PLAZA_FISHING_REEL_OPPORTUNITY_WINDOW_DURATION_MS_MAX = 1400;

/** Earliest window start as a fraction of total cast duration. */
export const DEFINING_WORLD_PLAZA_FISHING_REEL_OPPORTUNITY_WINDOW_START_CAST_RATIO_MIN = 0.12;

/** Latest window start as a fraction of total cast duration. */
export const DEFINING_WORLD_PLAZA_FISHING_REEL_OPPORTUNITY_WINDOW_START_CAST_RATIO_MAX = 0.72;

/** Minimum gap between reel-ready windows as a fraction of cast duration. */
export const DEFINING_WORLD_PLAZA_FISHING_REEL_OPPORTUNITY_WINDOW_MIN_GAP_CAST_RATIO = 0.08;

/** Windows must end before this fraction of the cast completes. */
export const DEFINING_WORLD_PLAZA_FISHING_REEL_OPPORTUNITY_WINDOW_END_CAST_RATIO_MAX = 0.92;

/** Max placement attempts per window before giving up on that slot. */
export const DEFINING_WORLD_PLAZA_FISHING_REEL_OPPORTUNITY_WINDOW_PLACEMENT_ATTEMPTS = 24;

/**
 * Extra elapsed cast time gained per real millisecond while holding reel
 * during an active opportunity window. 1 means effective 2x speed.
 */
export const DEFINING_WORLD_PLAZA_FISHING_REEL_HOLD_ACCELERATION_EXTRA_RATIO = 1;

/** CSS class toggled while a reel opportunity window is active (green Reel text). */
export const DEFINING_WORLD_PLAZA_FISHING_REEL_READY_FLASH_CLASS_NAME =
  'world-plaza-fishing-reel-ready-flash' as const;

/** Yellow glow: only the first ready window of a cast. */
export const DEFINING_WORLD_PLAZA_FISHING_REEL_READY_YELLOW_ONCE_CLASS_NAME =
  'world-plaza-fishing-reel-ready-yellow-once' as const;

/** CSS class toggled while the player is holding reel during a ready window. */
export const DEFINING_WORLD_PLAZA_FISHING_REEL_HOLD_GLOW_CLASS_NAME =
  'world-plaza-fishing-reel-hold-glow' as const;
