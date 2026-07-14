/**
 * Declarative knobs for cookbook craft duration and beat-lane boost/halt.
 *
 * @module components/world/crafting/domains/definingWorldPlazaCraftModeTimedCraftConstants
 */

/** Complexity scale (1 = fastest, 10 = slowest). */
export const DEFINING_WORLD_PLAZA_CRAFT_MODE_COMPLEXITY_MIN = 1;
export const DEFINING_WORLD_PLAZA_CRAFT_MODE_COMPLEXITY_MAX = 10;

/** Fastest craft duration (complexity 1). */
export const DEFINING_WORLD_PLAZA_CRAFT_MODE_DURATION_MS_MIN = 5_000;

/** Slowest craft duration (complexity 10). */
export const DEFINING_WORLD_PLAZA_CRAFT_MODE_DURATION_MS_MAX = 180_000;

/** Fraction of base craft duration removed per successful hammer hit. */
export const DEFINING_WORLD_PLAZA_CRAFT_MODE_BOOST_RATIO_OF_BASE = 0.14;

/** Floor for one hammer boost so short crafts still feel snappy. */
export const DEFINING_WORLD_PLAZA_CRAFT_MODE_BOOST_MS_MIN = 2_500;

/** Never finish a craft in the same frame as a hammer hit. */
export const DEFINING_WORLD_PLAZA_CRAFT_MODE_BOOST_MIN_REMAINING_MS = 250;

export const LABELING_WORLD_PLAZA_CRAFT_MODE_ALREADY_CRAFTING_TOAST =
  'Already crafting something.' as const;

/**
 * Maps recipe complexity (1–10) to craft duration in ms (5s–3min).
 */
export function computingWorldPlazaCraftModeDurationMsFromComplexity(
  complexity: number
): number {
  const clampedComplexity = Math.min(
    DEFINING_WORLD_PLAZA_CRAFT_MODE_COMPLEXITY_MAX,
    Math.max(DEFINING_WORLD_PLAZA_CRAFT_MODE_COMPLEXITY_MIN, complexity)
  );
  const complexitySpan =
    DEFINING_WORLD_PLAZA_CRAFT_MODE_COMPLEXITY_MAX -
    DEFINING_WORLD_PLAZA_CRAFT_MODE_COMPLEXITY_MIN;
  const durationSpan =
    DEFINING_WORLD_PLAZA_CRAFT_MODE_DURATION_MS_MAX -
    DEFINING_WORLD_PLAZA_CRAFT_MODE_DURATION_MS_MIN;
  const t =
    (clampedComplexity - DEFINING_WORLD_PLAZA_CRAFT_MODE_COMPLEXITY_MIN) /
    complexitySpan;

  return Math.round(
    DEFINING_WORLD_PLAZA_CRAFT_MODE_DURATION_MS_MIN + t * durationSpan
  );
}

export type ComputingWorldPlazaCraftModeRemainingMsParams = {
  readonly nowMs: number;
  readonly endsAtMs: number;
  readonly pausedUntilMs: number | null;
};

/** Remaining craft time, frozen while a cracked-hammer halt is active. */
export function computingWorldPlazaCraftModeRemainingMs(
  params: ComputingWorldPlazaCraftModeRemainingMsParams
): number {
  if (
    params.pausedUntilMs !== null &&
    params.nowMs < params.pausedUntilMs
  ) {
    return Math.max(0, params.endsAtMs - params.pausedUntilMs);
  }

  return Math.max(0, params.endsAtMs - params.nowMs);
}

export type ComputingWorldPlazaCraftModeBoostedEndsAtMsParams = {
  readonly nowMs: number;
  readonly endsAtMs: number;
  readonly baseDurationMs: number;
  readonly pausedUntilMs?: number | null;
};

/** Pulls craft end time forward by a noticeable chunk of the base duration. */
export function computingWorldPlazaCraftModeBoostedEndsAtMs(
  params: ComputingWorldPlazaCraftModeBoostedEndsAtMsParams
): number {
  const remainingMs = computingWorldPlazaCraftModeRemainingMs({
    nowMs: params.nowMs,
    endsAtMs: params.endsAtMs,
    pausedUntilMs: params.pausedUntilMs ?? null,
  });

  if (remainingMs <= DEFINING_WORLD_PLAZA_CRAFT_MODE_BOOST_MIN_REMAINING_MS) {
    return params.endsAtMs;
  }

  const desiredBoostMs = Math.max(
    DEFINING_WORLD_PLAZA_CRAFT_MODE_BOOST_MS_MIN,
    Math.round(
      params.baseDurationMs * DEFINING_WORLD_PLAZA_CRAFT_MODE_BOOST_RATIO_OF_BASE
    )
  );
  const maxBoostMs =
    remainingMs - DEFINING_WORLD_PLAZA_CRAFT_MODE_BOOST_MIN_REMAINING_MS;
  const boostMs = Math.min(desiredBoostMs, maxBoostMs);
  const anchorMs =
    params.pausedUntilMs !== null &&
    params.pausedUntilMs !== undefined &&
    params.nowMs < params.pausedUntilMs
      ? params.pausedUntilMs
      : params.nowMs;

  return anchorMs + remainingMs - boostMs;
}

export type ComputingWorldPlazaCraftModeHaltedEndsAtMsParams = {
  readonly nowMs: number;
  readonly endsAtMs: number;
  readonly pausedUntilMs: number | null;
  readonly haltMs: number;
};

export type ComputingWorldPlazaCraftModeHaltedSchedule = {
  readonly endsAtMs: number;
  readonly pausedUntilMs: number;
};

/** Freezes craft progress for `haltMs`, then resumes with the same remaining time. */
export function computingWorldPlazaCraftModeHaltedSchedule(
  params: ComputingWorldPlazaCraftModeHaltedEndsAtMsParams
): ComputingWorldPlazaCraftModeHaltedSchedule {
  const remainingMs = computingWorldPlazaCraftModeRemainingMs({
    nowMs: params.nowMs,
    endsAtMs: params.endsAtMs,
    pausedUntilMs: params.pausedUntilMs,
  });
  const pauseAnchorMs =
    params.pausedUntilMs !== null && params.nowMs < params.pausedUntilMs
      ? params.pausedUntilMs
      : params.nowMs;
  const pausedUntilMs = pauseAnchorMs + params.haltMs;

  return {
    pausedUntilMs,
    endsAtMs: pausedUntilMs + remainingMs,
  };
}
