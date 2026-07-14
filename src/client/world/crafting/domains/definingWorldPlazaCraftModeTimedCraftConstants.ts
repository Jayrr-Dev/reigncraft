/**
 * Declarative knobs for cookbook craft duration and the tap-to-speed mini-game.
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

/** Fraction of base craft duration removed per successful tap. */
export const DEFINING_WORLD_PLAZA_CRAFT_MODE_BOOST_RATIO_OF_BASE = 0.14;

/** Floor for one tap boost so short crafts still feel snappy. */
export const DEFINING_WORLD_PLAZA_CRAFT_MODE_BOOST_MS_MIN = 2_500;

/** Never finish a craft in the same frame as a tap. */
export const DEFINING_WORLD_PLAZA_CRAFT_MODE_BOOST_MIN_REMAINING_MS = 250;

/** How long the tappable prompt stays on screen. */
export const DEFINING_WORLD_PLAZA_CRAFT_MODE_BOOST_PROMPT_VISIBLE_MS = 1_800;

/** Random delay before the next prompt appears (inclusive min). */
export const DEFINING_WORLD_PLAZA_CRAFT_MODE_BOOST_PROMPT_SPAWN_MIN_MS = 2_200;

/** Random delay before the next prompt appears (inclusive max). */
export const DEFINING_WORLD_PLAZA_CRAFT_MODE_BOOST_PROMPT_SPAWN_MAX_MS = 5_500;

/** Horizontal spawn band for the tap prompt (percent of bar width). */
export const DEFINING_WORLD_PLAZA_CRAFT_MODE_BOOST_PROMPT_LEFT_PERCENT_MIN = 12;
export const DEFINING_WORLD_PLAZA_CRAFT_MODE_BOOST_PROMPT_LEFT_PERCENT_MAX = 88;

/** Iconify id for the tappable boost prompt (must be bundled). */
export const DEFINING_WORLD_PLAZA_CRAFT_MODE_BOOST_PROMPT_ICON =
  'mdi:hammer' as const;

export const LABELING_WORLD_PLAZA_CRAFT_MODE_BOOST_PROMPT =
  'Tap to speed up crafting' as const;

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

export type ComputingWorldPlazaCraftModeBoostedEndsAtMsParams = {
  readonly nowMs: number;
  readonly endsAtMs: number;
  readonly baseDurationMs: number;
};

/** Pulls craft end time forward by a noticeable chunk of the base duration. */
export function computingWorldPlazaCraftModeBoostedEndsAtMs(
  params: ComputingWorldPlazaCraftModeBoostedEndsAtMsParams
): number {
  const remainingMs = Math.max(0, params.endsAtMs - params.nowMs);

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

  return params.endsAtMs - boostMs;
}
