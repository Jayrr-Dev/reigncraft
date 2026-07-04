/**
 * Day/night cycle timing and lighting tuning.
 *
 * The cycle is derived from shared wall-clock time (epoch milliseconds), so
 * every client in a post sees the same sun position without server sync.
 *
 * @module components/world/domains/definingWorldPlazaDayNightCycleConstants
 */

/** Real-time duration of one full in-game day (ms). */
export const DEFINING_WORLD_PLAZA_DAY_NIGHT_CYCLE_DURATION_MS = 10 * 60 * 1000;

/** Cycle phase at which the sun rises (0 = midnight, 0.5 = noon). */
export const DEFINING_WORLD_PLAZA_DAY_NIGHT_SUNRISE_PHASE = 0.25;

/** Cycle phase at which the sun sets. */
export const DEFINING_WORLD_PLAZA_DAY_NIGHT_SUNSET_PHASE = 0.75;

/**
 * Quantization buckets per cycle. Sun state is cached per bucket so per-frame
 * callers get a stable object, and shadow layers only redraw when the bucket
 * advances (~2.5s at a 10 minute cycle with 240 buckets).
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
export const DEFINING_WORLD_PLAZA_DAY_NIGHT_EDGE_VIGNETTE_ALPHA_MIDNIGHT = 0.38;

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
    { phase: 0, red: 4, green: 6, blue: 28, alpha: 0.62 },
    { phase: 0.2, red: 6, green: 8, blue: 32, alpha: 0.58 },
    { phase: 0.25, red: 120, green: 70, blue: 90, alpha: 0.3 },
    { phase: 0.29, red: 255, green: 140, blue: 66, alpha: 0.18 },
    { phase: 0.35, red: 255, green: 214, blue: 130, alpha: 0.05 },
    { phase: 0.42, red: 255, green: 255, blue: 255, alpha: 0 },
    { phase: 0.58, red: 255, green: 255, blue: 255, alpha: 0 },
    { phase: 0.68, red: 255, green: 196, blue: 110, alpha: 0.08 },
    { phase: 0.75, red: 255, green: 120, blue: 60, alpha: 0.24 },
    { phase: 0.8, red: 24, green: 18, blue: 52, alpha: 0.52 },
    { phase: 0.86, red: 4, green: 6, blue: 28, alpha: 0.62 },
  ] as const;
