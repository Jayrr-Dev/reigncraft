/**
 * Metrics nuance badge styling (green→red by group index band).
 *
 * @module components/world/domains/definingWorldPlazaPerformanceDiagnosticsMetricNuanceBadgeConstants
 */

/** Shared badge chrome (size / padding). */
const DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_METRIC_NUANCE_BADGE_BASE_CLASS_NAME =
  'rounded-full border px-2 py-0.5 text-[9px] font-semibold shadow-sm transition focus-visible:outline-none focus-visible:ring-1' as const;

/** Index below 0.25: healthy. */
export const DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_METRIC_NUANCE_BADGE_HEALTHY_CLASS_NAME =
  `${DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_METRIC_NUANCE_BADGE_BASE_CLASS_NAME} border-lime-300/70 bg-lime-500/25 text-lime-50 hover:bg-lime-500/40 focus-visible:ring-lime-300/70` as const;

/** Index 0.25–0.5 — watch. */
export const DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_METRIC_NUANCE_BADGE_WATCH_CLASS_NAME =
  `${DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_METRIC_NUANCE_BADGE_BASE_CLASS_NAME} border-yellow-300/70 bg-yellow-500/25 text-yellow-50 hover:bg-yellow-500/40 focus-visible:ring-yellow-300/70` as const;

/** Index 0.5–0.75 — strained. */
export const DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_METRIC_NUANCE_BADGE_STRAINED_CLASS_NAME =
  `${DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_METRIC_NUANCE_BADGE_BASE_CLASS_NAME} border-amber-300/70 bg-amber-500/30 text-amber-50 hover:bg-amber-500/45 focus-visible:ring-amber-300/70` as const;

/** Index ≥ 0.75 — critical. */
export const DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_METRIC_NUANCE_BADGE_CRITICAL_CLASS_NAME =
  `${DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_METRIC_NUANCE_BADGE_BASE_CLASS_NAME} border-red-300/70 bg-red-500/30 text-red-50 hover:bg-red-500/45 focus-visible:ring-red-300/70` as const;

/** Selected badge ring (any band). */
export const DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_METRIC_NUANCE_BADGE_SELECTED_CLASS_NAME =
  'ring-1 ring-white/70' as const;

/** Hint under the badge strip. */
export const DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_METRIC_NUANCE_HINT =
  'Tap a group. Badge index 0=ok → 1=bad (worst signal).' as const;

/** Index band cutoffs (inclusive lower bound for each tier). */
export const DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_METRIC_NUANCE_INDEX_BAND =
  {
    HEALTHY_MAX: 0.25,
    WATCH_MAX: 0.5,
    STRAINED_MAX: 0.75,
  } as const;
