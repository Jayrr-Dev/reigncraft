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

/** Fraction of base craft duration removed per hammer hit at combo 1x.
 * Cut ~65% from the old 0.14 feel (was too strong). */
export const DEFINING_WORLD_PLAZA_CRAFT_MODE_BOOST_RATIO_OF_BASE = 0.049;

/** Floor for one hammer boost at combo 1x (also cut ~65% from 2500). */
export const DEFINING_WORLD_PLAZA_CRAFT_MODE_BOOST_MS_MIN = 875;

/** Extra base-duration fraction added per consecutive strike beyond the first. */
export const DEFINING_WORLD_PLAZA_CRAFT_MODE_BOOST_COMBO_RATIO_STEP = 0.012;

/** Never finish a craft in the same frame as a hammer hit. */
export const DEFINING_WORLD_PLAZA_CRAFT_MODE_BOOST_MIN_REMAINING_MS = 250;

export const LABELING_WORLD_PLAZA_CRAFT_MODE_ALREADY_CRAFTING_TOAST =
  'Already crafting something.' as const;

/** Status line when the beat timer finishes and confirm actions show. */
export const LABELING_WORLD_PLAZA_CRAFT_MODE_READY_STATUS = 'Ready' as const;

/** Cancel label on the post-craft confirm row. */
export const LABELING_WORLD_PLAZA_CRAFT_MODE_CONFIRM_CANCEL = 'Cancel' as const;

/** Confirm label for inventory-output crafts. */
export const LABELING_WORLD_PLAZA_CRAFT_MODE_CONFIRM_OK = 'Ok' as const;

/** Prefix for placeable crafts: `Place Campfire`. */
export const LABELING_WORLD_PLAZA_CRAFT_MODE_CONFIRM_PLACE_PREFIX =
  'Place' as const;

/** Builds the Place action label for a finished placeable craft. */
export function formattingWorldPlazaCraftModeConfirmPlaceLabel(
  displayName: string
): string {
  return `${LABELING_WORLD_PLAZA_CRAFT_MODE_CONFIRM_PLACE_PREFIX} ${displayName}`;
}

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
  /** Consecutive hammer hits (1 = first). Higher = stronger speed-up. */
  readonly strikeCombo?: number;
};

/** Pulls craft end time forward; consecutive strikes amplify the cut. */
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

  const strikeCombo = Math.max(1, params.strikeCombo ?? 1);
  const comboRatio =
    DEFINING_WORLD_PLAZA_CRAFT_MODE_BOOST_RATIO_OF_BASE +
    (strikeCombo - 1) * DEFINING_WORLD_PLAZA_CRAFT_MODE_BOOST_COMBO_RATIO_STEP;
  const desiredBoostMs = Math.max(
    DEFINING_WORLD_PLAZA_CRAFT_MODE_BOOST_MS_MIN * strikeCombo,
    Math.round(params.baseDurationMs * comboRatio)
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
