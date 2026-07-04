import {
  DEFINING_WORLD_PLAZA_DAY_NIGHT_CYCLE_DURATION_MS,
  DEFINING_WORLD_PLAZA_DAY_NIGHT_MOON_ALTITUDE_SCALE,
  DEFINING_WORLD_PLAZA_DAY_NIGHT_SHADOW_ALPHA_SCALE_MOONLIT,
  DEFINING_WORLD_PLAZA_DAY_NIGHT_SHADOW_ALPHA_SCALE_NIGHT_FLOOR,
  DEFINING_WORLD_PLAZA_DAY_NIGHT_SHADOW_ALPHA_SCALE_NOON,
  DEFINING_WORLD_PLAZA_DAY_NIGHT_SHADOW_ALPHA_SCALE_TWILIGHT,
  DEFINING_WORLD_PLAZA_DAY_NIGHT_SHADOW_DIRECTION_DOWN_COMPONENT,
  DEFINING_WORLD_PLAZA_DAY_NIGHT_SHADOW_DIRECTION_SIDE_COMPONENT,
  DEFINING_WORLD_PLAZA_DAY_NIGHT_SHADOW_LENGTH_SCALE_MAX,
  DEFINING_WORLD_PLAZA_DAY_NIGHT_SHADOW_LENGTH_SCALE_MIN,
  DEFINING_WORLD_PLAZA_DAY_NIGHT_SKY_TINT_KEYFRAMES,
  DEFINING_WORLD_PLAZA_DAY_NIGHT_SUN_STATE_BUCKET_COUNT,
  DEFINING_WORLD_PLAZA_DAY_NIGHT_SUNRISE_PHASE,
  DEFINING_WORLD_PLAZA_DAY_NIGHT_SUNSET_PHASE,
} from "@/components/world/domains/definingWorldPlazaDayNightCycleConstants";

/**
 * Derives the current sun position and lighting state from wall-clock time.
 *
 * All shadow layers read one shared state so trees, blocks, and avatars cast
 * shadows in the same direction: away from the sun, sweeping from screen-left
 * at sunrise, through straight-down at noon, to screen-right at sunset. At
 * night the moon takes over as a dim key light on the same arc.
 *
 * @module components/world/domains/computingWorldPlazaDayNightSunState
 */

/** Lighting snapshot for one moment of the day/night cycle. */
export type ComputingWorldPlazaDayNightSunState = {
  /** Cycle phase (0..1, 0 = midnight, 0.5 = noon). */
  readonly cyclePhase: number;
  /** Quantized bucket index; changes when shadows should redraw. */
  readonly bucketIndex: number;
  /** True between sunrise and sunset. */
  readonly isDaytime: boolean;
  /** Key light altitude (0 = horizon, 1 = zenith) for sun or moon. */
  readonly lightAltitude: number;
  /** Normalized screen-space cast shadow direction X (away from the light). */
  readonly shadowDirectionX: number;
  /** Normalized screen-space cast shadow direction Y (positive = down). */
  readonly shadowDirectionY: number;
  /** Cast shadow length multiplier (short at noon, long near the horizon). */
  readonly shadowLengthScale: number;
  /** Shadow opacity multiplier (strong midday, faint moonlight). */
  readonly shadowAlphaScale: number;
  /** Sky overlay tint as a CSS color, transparent through midday. */
  readonly skyTintCssColor: string;
};

/**
 * Linearly interpolates between two values.
 *
 * @param from - Start value.
 * @param to - End value.
 * @param mix - Blend factor (0..1).
 */
function interpolatingWorldPlazaDayNightValue(
  from: number,
  to: number,
  mix: number,
): number {
  return from + (to - from) * mix;
}

/**
 * Resolves how far the key light has traveled along its arc (0..1).
 *
 * During the day this tracks the sun from sunrise to sunset; at night it
 * tracks the moon across the remaining phase span.
 *
 * @param cyclePhase - Cycle phase (0..1).
 */
function resolvingWorldPlazaDayNightArcProgress(cyclePhase: number): {
  readonly arcProgress: number;
  readonly isDaytime: boolean;
} {
  const sunrise = DEFINING_WORLD_PLAZA_DAY_NIGHT_SUNRISE_PHASE;
  const sunset = DEFINING_WORLD_PLAZA_DAY_NIGHT_SUNSET_PHASE;

  if (cyclePhase >= sunrise && cyclePhase < sunset) {
    return {
      arcProgress: (cyclePhase - sunrise) / (sunset - sunrise),
      isDaytime: true,
    };
  }

  const nightSpan = 1 - (sunset - sunrise);
  const nightElapsed =
    cyclePhase >= sunset ? cyclePhase - sunset : cyclePhase + (1 - sunset);

  return { arcProgress: nightElapsed / nightSpan, isDaytime: false };
}

/**
 * Interpolates the sky tint keyframes at a cycle phase.
 *
 * @param cyclePhase - Cycle phase (0..1).
 */
function resolvingWorldPlazaDayNightSkyTintCssColor(cyclePhase: number): string {
  const keyframes = DEFINING_WORLD_PLAZA_DAY_NIGHT_SKY_TINT_KEYFRAMES;
  let previous = keyframes[keyframes.length - 1];
  let next = keyframes[0];
  let spanPhase = 0;

  if (!previous || !next) {
    return "rgba(0, 0, 0, 0)";
  }

  if (cyclePhase < next.phase || cyclePhase >= previous.phase) {
    // Wrapped segment between the last and first keyframes.
    const wrappedSpan = 1 - previous.phase + next.phase;
    const wrappedElapsed =
      cyclePhase >= previous.phase
        ? cyclePhase - previous.phase
        : cyclePhase + (1 - previous.phase);
    spanPhase = wrappedSpan > 0 ? wrappedElapsed / wrappedSpan : 0;
  } else {
    for (let index = 0; index < keyframes.length - 1; index += 1) {
      const start = keyframes[index];
      const end = keyframes[index + 1];

      if (!start || !end) {
        continue;
      }

      if (cyclePhase >= start.phase && cyclePhase < end.phase) {
        previous = start;
        next = end;
        spanPhase =
          end.phase > start.phase
            ? (cyclePhase - start.phase) / (end.phase - start.phase)
            : 0;
        break;
      }
    }
  }

  const red = Math.round(
    interpolatingWorldPlazaDayNightValue(previous.red, next.red, spanPhase),
  );
  const green = Math.round(
    interpolatingWorldPlazaDayNightValue(previous.green, next.green, spanPhase),
  );
  const blue = Math.round(
    interpolatingWorldPlazaDayNightValue(previous.blue, next.blue, spanPhase),
  );
  const alpha = interpolatingWorldPlazaDayNightValue(
    previous.alpha,
    next.alpha,
    spanPhase,
  );

  return `rgba(${red}, ${green}, ${blue}, ${alpha.toFixed(3)})`;
}

/**
 * Computes the sun state for one quantized cycle bucket.
 *
 * @param bucketIndex - Quantized bucket index within the cycle.
 */
function computingWorldPlazaDayNightSunStateForBucket(
  bucketIndex: number,
): ComputingWorldPlazaDayNightSunState {
  const cyclePhase =
    (bucketIndex + 0.5) / DEFINING_WORLD_PLAZA_DAY_NIGHT_SUN_STATE_BUCKET_COUNT;
  const { arcProgress, isDaytime } =
    resolvingWorldPlazaDayNightArcProgress(cyclePhase);

  // The light rises at screen-right (shadow points left), peaks overhead, and
  // sets at screen-left (shadow points right).
  const altitudeScale = isDaytime
    ? 1
    : DEFINING_WORLD_PLAZA_DAY_NIGHT_MOON_ALTITUDE_SCALE;
  const lightAltitude = Math.sin(arcProgress * Math.PI) * altitudeScale;
  const shadowSideComponent =
    -Math.cos(arcProgress * Math.PI) *
    DEFINING_WORLD_PLAZA_DAY_NIGHT_SHADOW_DIRECTION_SIDE_COMPONENT;
  const rawDirectionX = shadowSideComponent;
  const rawDirectionY =
    DEFINING_WORLD_PLAZA_DAY_NIGHT_SHADOW_DIRECTION_DOWN_COMPONENT;
  const directionLength = Math.hypot(rawDirectionX, rawDirectionY);
  const shadowDirectionX = rawDirectionX / directionLength;
  const shadowDirectionY = rawDirectionY / directionLength;

  // Low light means long shadows; clamp so dawn shadows stay readable.
  const shadowLengthScale = interpolatingWorldPlazaDayNightValue(
    DEFINING_WORLD_PLAZA_DAY_NIGHT_SHADOW_LENGTH_SCALE_MAX,
    DEFINING_WORLD_PLAZA_DAY_NIGHT_SHADOW_LENGTH_SCALE_MIN,
    Math.sin(arcProgress * Math.PI),
  );

  const shadowAlphaScale = isDaytime
    ? interpolatingWorldPlazaDayNightValue(
        DEFINING_WORLD_PLAZA_DAY_NIGHT_SHADOW_ALPHA_SCALE_TWILIGHT,
        DEFINING_WORLD_PLAZA_DAY_NIGHT_SHADOW_ALPHA_SCALE_NOON,
        Math.sin(arcProgress * Math.PI),
      )
    : interpolatingWorldPlazaDayNightValue(
        DEFINING_WORLD_PLAZA_DAY_NIGHT_SHADOW_ALPHA_SCALE_NIGHT_FLOOR,
        DEFINING_WORLD_PLAZA_DAY_NIGHT_SHADOW_ALPHA_SCALE_MOONLIT,
        Math.sin(arcProgress * Math.PI),
      );

  return {
    cyclePhase,
    bucketIndex,
    isDaytime,
    lightAltitude,
    shadowDirectionX,
    shadowDirectionY,
    shadowLengthScale,
    shadowAlphaScale,
    skyTintCssColor: resolvingWorldPlazaDayNightSkyTintCssColor(cyclePhase),
  };
}

/** Last computed bucket, reused so per-frame callers get a stable object. */
let cachedSunState: ComputingWorldPlazaDayNightSunState | null = null;

/**
 * Returns the sun state for the given epoch time (defaults to now).
 *
 * The result is cached per quantized bucket, so identity changes only when
 * the sun has visibly moved and consumers can use it as a redraw key.
 *
 * @param epochMs - Epoch milliseconds to sample (defaults to `Date.now()`).
 */
export function computingWorldPlazaDayNightSunState(
  epochMs = Date.now(),
): ComputingWorldPlazaDayNightSunState {
  const cycleElapsedMs =
    ((epochMs % DEFINING_WORLD_PLAZA_DAY_NIGHT_CYCLE_DURATION_MS) +
      DEFINING_WORLD_PLAZA_DAY_NIGHT_CYCLE_DURATION_MS) %
    DEFINING_WORLD_PLAZA_DAY_NIGHT_CYCLE_DURATION_MS;
  const bucketIndex = Math.min(
    DEFINING_WORLD_PLAZA_DAY_NIGHT_SUN_STATE_BUCKET_COUNT - 1,
    Math.floor(
      (cycleElapsedMs / DEFINING_WORLD_PLAZA_DAY_NIGHT_CYCLE_DURATION_MS) *
        DEFINING_WORLD_PLAZA_DAY_NIGHT_SUN_STATE_BUCKET_COUNT,
    ),
  );

  if (cachedSunState && cachedSunState.bucketIndex === bucketIndex) {
    return cachedSunState;
  }

  cachedSunState = computingWorldPlazaDayNightSunStateForBucket(bucketIndex);

  return cachedSunState;
}
