/**
 * Day/night cycle timing and lighting tuning.
 *
 * The cycle is derived from UTC epoch milliseconds (`Date.now()`), which is the
 * same instant everywhere regardless of local timezone. Every client in a post
 * samples that shared epoch to get identical sun position, darkness, and
 * wildlife sleep timing without server sync.
 *
 * @module components/world/domains/definingWorldPlazaDayNightCycleConstants
 */

/** Real-time duration of one full in-game day (ms). */
export const DEFINING_WORLD_PLAZA_DAY_NIGHT_CYCLE_DURATION_MS = 40 * 60 * 1000;

/** Wall-clock anchor when the shared in-game day counter starts. */
export const DEFINING_WORLD_PLAZA_DAY_NIGHT_EPOCH_ANCHOR_MS = 1_735_689_600_000;

/** HUD day counter wraps to Day 1–N for readability. */
export const DEFINING_WORLD_PLAZA_DAY_NIGHT_DISPLAY_DAY_WRAP = 30;

/** Cycle phase at which the sun rises (0 = midnight, 0.5 = noon). */
export const DEFINING_WORLD_PLAZA_DAY_NIGHT_SUNRISE_PHASE = 0.2;

/** Cycle phase at which the sun sets. */
export const DEFINING_WORLD_PLAZA_DAY_NIGHT_SUNSET_PHASE = 0.82;

/**
 * Quantization buckets per cycle. Sun state is cached per bucket so per-frame
 * callers get a stable object, and shadow layers only redraw when the bucket
 * advances (~10s at a 40 minute cycle with 240 buckets).
 */
export const DEFINING_WORLD_PLAZA_DAY_NIGHT_SUN_STATE_BUCKET_COUNT = 240;

/** Poll interval for React consumers of the sun state (ms). */
export const DEFINING_WORLD_PLAZA_DAY_NIGHT_SUN_STATE_POLL_INTERVAL_MS = 1000;

/** Moon altitude relative to the sun arc (moonlight sits lower in the sky). */
export const DEFINING_WORLD_PLAZA_DAY_NIGHT_MOON_ALTITUDE_SCALE = 0.6;

/** Constant downward screen component of the cast shadow direction. */
export const DEFINING_WORLD_PLAZA_DAY_NIGHT_SHADOW_DIRECTION_DOWN_COMPONENT = 0.55;

/** Maximum sideways screen component of the cast shadow direction. */
export const DEFINING_WORLD_PLAZA_DAY_NIGHT_SHADOW_DIRECTION_SIDE_COMPONENT = 0.95;

/** Shortest cast shadow length multiplier (sun overhead at noon). */
export const DEFINING_WORLD_PLAZA_DAY_NIGHT_SHADOW_LENGTH_SCALE_MIN = 0.75;

/** Longest cast shadow length multiplier (sun near the horizon). */
export const DEFINING_WORLD_PLAZA_DAY_NIGHT_SHADOW_LENGTH_SCALE_MAX = 2.1;

/** Shadow opacity multiplier at high noon. */
export const DEFINING_WORLD_PLAZA_DAY_NIGHT_SHADOW_ALPHA_SCALE_NOON = 1;

/** Shadow opacity multiplier at the day/night boundary (diffuse twilight). */
export const DEFINING_WORLD_PLAZA_DAY_NIGHT_SHADOW_ALPHA_SCALE_TWILIGHT = 0.3;

/** Shadow opacity multiplier under full moonlight. */
export const DEFINING_WORLD_PLAZA_DAY_NIGHT_SHADOW_ALPHA_SCALE_MOONLIT = 0.42;

/** Shadow opacity multiplier on a moonless deep-night floor. */
export const DEFINING_WORLD_PLAZA_DAY_NIGHT_SHADOW_ALPHA_SCALE_NIGHT_FLOOR = 0.16;

/** Edge vignette opacity at high noon (barely visible). */
export const DEFINING_WORLD_PLAZA_DAY_NIGHT_EDGE_VIGNETTE_ALPHA_NOON = 0.02;

/** Edge vignette opacity during golden hour twilight bands. */
export const DEFINING_WORLD_PLAZA_DAY_NIGHT_EDGE_VIGNETTE_ALPHA_TWILIGHT = 0.1;

/** Edge vignette opacity at the deepest point of night (midnight). */
export const DEFINING_WORLD_PLAZA_DAY_NIGHT_EDGE_VIGNETTE_ALPHA_MIDNIGHT = 0.56;

/**
 * Exponent applied to the night arc when ramping toward midnight darkness.
 * Values above 1 keep twilight softer while concentrating peak darkness around
 * true midnight so there is a short window that feels almost pitch black.
 */
export const DEFINING_WORLD_PLAZA_DAY_NIGHT_MIDNIGHT_DARKNESS_CURVE_EXPONENT = 2.4;

/** One sky tint keyframe along the cycle. */
export type DefiningWorldPlazaDayNightSkyTintKeyframe = {
  /** Cycle phase of this keyframe (0..1, 0 = midnight). */
  readonly phase: number;
  /** Overlay red channel (0..255). */
  readonly red: number;
  /** Overlay green channel (0..255). */
  readonly green: number;
  /** Overlay blue channel (0..255). */
  readonly blue: number;
  /** Overlay opacity (0..1). */
  readonly alpha: number;
};

/**
 * Sky tint keyframes, interpolated linearly across the cycle.
 *
 * Deep blue at night, warm orange bands around sunrise/sunset, and fully
 * transparent through midday. Must stay sorted by phase; the list wraps.
 */
export const DEFINING_WORLD_PLAZA_DAY_NIGHT_SKY_TINT_KEYFRAMES: ReadonlyArray<DefiningWorldPlazaDayNightSkyTintKeyframe> =
  [
    { phase: 0, red: 2, green: 3, blue: 16, alpha: 0.74 },
    { phase: 0.16, red: 4, green: 6, blue: 24, alpha: 0.66 },
    { phase: 0.2, red: 120, green: 70, blue: 90, alpha: 0.3 },
    { phase: 0.25, red: 255, green: 140, blue: 66, alpha: 0.18 },
    { phase: 0.32, red: 255, green: 214, blue: 130, alpha: 0.05 },
    { phase: 0.41, red: 255, green: 255, blue: 255, alpha: 0 },
    { phase: 0.61, red: 255, green: 255, blue: 255, alpha: 0 },
    { phase: 0.73, red: 255, green: 196, blue: 110, alpha: 0.08 },
    { phase: 0.82, red: 255, green: 120, blue: 60, alpha: 0.34 },
    { phase: 0.86, red: 18, green: 14, blue: 40, alpha: 0.72 },
    { phase: 0.9, red: 2, green: 3, blue: 16, alpha: 0.9 },
  ] as const;
