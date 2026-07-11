/**
 * Multistep plaza performance tester tuning and UI copy.
 *
 * @module components/world/domains/definingWorldPlazaPerformanceTesterConstants
 */

/** Default wait after applying a step config before sampling (ms). */
export const DEFINING_WORLD_PLAZA_PERFORMANCE_TESTER_DEFAULT_SETTLE_MS = 2000;

/** Longer settle after procedural tree/rock toggles (terrain rebuild). */
export const DEFINING_WORLD_PLAZA_PERFORMANCE_TESTER_PROCEDURAL_SETTLE_MS = 3000;

/** Default measurement window per step (ms). */
export const DEFINING_WORLD_PLAZA_PERFORMANCE_TESTER_DEFAULT_SAMPLE_MS = 5000;

/** Warmup discarded before each trial sample window (ms). */
export const DEFINING_WORLD_PLAZA_PERFORMANCE_TESTER_DEFAULT_WARMUP_MS = 1000;

/** Repeated trials per step; median row is stored when greater than 1. */
export const DEFINING_WORLD_PLAZA_PERFORMANCE_TESTER_DEFAULT_TRIAL_COUNT = 1;

/** Features panel section heading. */
export const DEFINING_WORLD_PLAZA_PERFORMANCE_TESTER_SECTION_HEADING =
  'Perf tester' as const;

/** Runs the full declarative step suite. */
export const DEFINING_WORLD_PLAZA_PERFORMANCE_TESTER_RUN_SUITE_BUTTON_LABEL =
  'Run suite' as const;

/** Stops the active suite or single step. */
export const DEFINING_WORLD_PLAZA_PERFORMANCE_TESTER_CANCEL_BUTTON_LABEL =
  'Cancel' as const;

/** Copies the plain-text report to the clipboard. */
export const DEFINING_WORLD_PLAZA_PERFORMANCE_TESTER_COPY_REPORT_BUTTON_LABEL =
  'Copy report' as const;

/** Clears stored step results. */
export const DEFINING_WORLD_PLAZA_PERFORMANCE_TESTER_CLEAR_BUTTON_LABEL =
  'Clear' as const;

/** Per-step run button prefix. */
export const DEFINING_WORLD_PLAZA_PERFORMANCE_TESTER_RUN_STEP_BUTTON_LABEL =
  'Run' as const;

/** Banner shown during the walk-prompt step. */
export const DEFINING_WORLD_PLAZA_PERFORMANCE_TESTER_WALK_PROMPT_BANNER =
  'Walk now — sampling movement cost for this window.' as const;

/** Toast after a successful report copy. */
export const DEFINING_WORLD_PLAZA_PERFORMANCE_TESTER_COPY_SUCCESS_TOAST =
  'Perf tester report copied.' as const;

/** Toast when clipboard copy fails. */
export const DEFINING_WORLD_PLAZA_PERFORMANCE_TESTER_COPY_FAILURE_TOAST =
  'Could not copy perf tester report.' as const;

/** Progress label while settling before a sample window. */
export const LABELING_WORLD_PLAZA_PERFORMANCE_TESTER_PHASE_SETTLING =
  'settling' as const;

/** Progress label while collecting frame stats. */
export const LABELING_WORLD_PLAZA_PERFORMANCE_TESTER_PHASE_SAMPLING =
  'sampling' as const;
