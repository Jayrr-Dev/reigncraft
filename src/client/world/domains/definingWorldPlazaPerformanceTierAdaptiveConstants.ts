/**
 * Adaptive performance tier thresholds for always-on frame sampling.
 *
 * Starts conservative (never HIGH on mount). Sampler may step
 * LOW ↔ MEDIUM ↔ HIGH after warmup when frame times stay stable or slow.
 *
 * @module components/world/domains/definingWorldPlazaPerformanceTierAdaptiveConstants
 */

/** Ignore frames until the plaza has been mounted this long. */
export const DEFINING_WORLD_PLAZA_PERFORMANCE_ADAPTIVE_WARMUP_MS = 5_000;

/** Rolling window of frame deltas used for p95 / spike checks. */
export const DEFINING_WORLD_PLAZA_PERFORMANCE_ADAPTIVE_HISTORY_FRAMES = 180;

/**
 * Upgrade when p95 frame time is below this and no frame in the window is
 * at or above {@link DEFINING_WORLD_PLAZA_PERFORMANCE_ADAPTIVE_UPGRADE_SPIKE_MS}.
 */
export const DEFINING_WORLD_PLAZA_PERFORMANCE_ADAPTIVE_UPGRADE_P95_MS = 17;

/** Any frame at or above this blocks an upgrade. */
export const DEFINING_WORLD_PLAZA_PERFORMANCE_ADAPTIVE_UPGRADE_SPIKE_MS = 20;

/** Downgrade when p95 stays above this for the sustained window. */
export const DEFINING_WORLD_PLAZA_PERFORMANCE_ADAPTIVE_DOWNGRADE_P95_MS = 22;

/** Immediate downgrade when p99 reaches this threshold. */
export const DEFINING_WORLD_PLAZA_PERFORMANCE_ADAPTIVE_DOWNGRADE_P99_MS = 50;

/** How long p95 must stay above the downgrade threshold before dropping a tier. */
export const DEFINING_WORLD_PLAZA_PERFORMANCE_ADAPTIVE_DOWNGRADE_SUSTAIN_MS = 2_000;

/** Minimum gap between tier changes. */
export const DEFINING_WORLD_PLAZA_PERFORMANCE_ADAPTIVE_COOLDOWN_MS = 10_000;

/** Ignore frame deltas above this after tab resume (ms). */
export const DEFINING_WORLD_PLAZA_PERFORMANCE_ADAPTIVE_RESUME_GAP_IGNORE_MS = 500;

/** Evaluate tier changes on this interval instead of every frame (ms). */
export const DEFINING_WORLD_PLAZA_PERFORMANCE_ADAPTIVE_EVALUATION_INTERVAL_MS = 500;
