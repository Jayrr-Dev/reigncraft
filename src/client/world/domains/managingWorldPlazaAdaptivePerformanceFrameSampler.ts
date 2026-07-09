/**
 * Always-on frame-time sampler for adaptive plaza performance tiers.
 *
 * Records rAF deltas, then after warmup proposes one-step upgrades or
 * downgrades based on p95 and spike rules.
 *
 * @module components/world/domains/managingWorldPlazaAdaptivePerformanceFrameSampler
 */

import {
  DEFINING_WORLD_PLAZA_PERFORMANCE_ADAPTIVE_COOLDOWN_MS,
  DEFINING_WORLD_PLAZA_PERFORMANCE_ADAPTIVE_DOWNGRADE_P95_MS,
  DEFINING_WORLD_PLAZA_PERFORMANCE_ADAPTIVE_DOWNGRADE_SUSTAIN_MS,
  DEFINING_WORLD_PLAZA_PERFORMANCE_ADAPTIVE_HISTORY_FRAMES,
  DEFINING_WORLD_PLAZA_PERFORMANCE_ADAPTIVE_UPGRADE_P95_MS,
  DEFINING_WORLD_PLAZA_PERFORMANCE_ADAPTIVE_UPGRADE_SPIKE_MS,
  DEFINING_WORLD_PLAZA_PERFORMANCE_ADAPTIVE_WARMUP_MS,
} from '@/components/world/domains/definingWorldPlazaPerformanceTierAdaptiveConstants';
import {
  DEFINING_WORLD_PLAZA_PERFORMANCE_TIER_HIGH,
  DEFINING_WORLD_PLAZA_PERFORMANCE_TIER_LOW,
  DEFINING_WORLD_PLAZA_PERFORMANCE_TIER_MEDIUM,
  type DefiningWorldPlazaPerformanceTier,
} from '@/components/world/domains/definingWorldPlazaPerformanceProfileConstants';

export type ManagingWorldPlazaAdaptivePerformanceFrameSampler = {
  readonly startedAtMs: number;
  readonly frameDeltaMsHistory: number[];
  lastTierChangeAtMs: number;
  downgradeSlowSinceMs: number | null;
  currentTier: DefiningWorldPlazaPerformanceTier;
};

const DEFINING_WORLD_PLAZA_PERFORMANCE_TIER_ORDER: readonly DefiningWorldPlazaPerformanceTier[] =
  [
    DEFINING_WORLD_PLAZA_PERFORMANCE_TIER_LOW,
    DEFINING_WORLD_PLAZA_PERFORMANCE_TIER_MEDIUM,
    DEFINING_WORLD_PLAZA_PERFORMANCE_TIER_HIGH,
  ];

/**
 * Creates a sampler seeded with the initial (heuristic) tier.
 */
export function creatingWorldPlazaAdaptivePerformanceFrameSampler(
  initialTier: DefiningWorldPlazaPerformanceTier,
  nowMs: number
): ManagingWorldPlazaAdaptivePerformanceFrameSampler {
  return {
    startedAtMs: nowMs,
    frameDeltaMsHistory: [],
    lastTierChangeAtMs: nowMs,
    downgradeSlowSinceMs: null,
    currentTier: initialTier,
  };
}

/**
 * Percentile from a sorted copy of `values` (nearest-rank).
 */
export function computingWorldPlazaAdaptivePerformancePercentileMs(
  values: readonly number[],
  percentile: number
): number {
  if (values.length === 0) {
    return 0;
  }

  const sorted = [...values].sort((left, right) => left - right);
  const rankIndex = Math.min(
    sorted.length - 1,
    Math.max(0, Math.ceil((percentile / 100) * sorted.length) - 1)
  );

  return sorted[rankIndex] ?? 0;
}

function resolvingWorldPlazaAdjacentPerformanceTier(
  tier: DefiningWorldPlazaPerformanceTier,
  step: -1 | 1
): DefiningWorldPlazaPerformanceTier | null {
  const tierIndex = DEFINING_WORLD_PLAZA_PERFORMANCE_TIER_ORDER.indexOf(tier);

  if (tierIndex < 0) {
    return null;
  }

  const nextIndex = tierIndex + step;

  if (
    nextIndex < 0 ||
    nextIndex >= DEFINING_WORLD_PLAZA_PERFORMANCE_TIER_ORDER.length
  ) {
    return null;
  }

  return DEFINING_WORLD_PLAZA_PERFORMANCE_TIER_ORDER[nextIndex] ?? null;
}

/**
 * Records one frame delta. Returns a new tier when adaptation fires, else null.
 */
export function markingWorldPlazaAdaptivePerformanceFrame(
  sampler: ManagingWorldPlazaAdaptivePerformanceFrameSampler,
  frameDeltaMs: number,
  nowMs: number
): DefiningWorldPlazaPerformanceTier | null {
  const clampedDeltaMs = Math.max(0, frameDeltaMs);

  sampler.frameDeltaMsHistory.push(clampedDeltaMs);

  if (
    sampler.frameDeltaMsHistory.length >
    DEFINING_WORLD_PLAZA_PERFORMANCE_ADAPTIVE_HISTORY_FRAMES
  ) {
    sampler.frameDeltaMsHistory.shift();
  }

  if (nowMs - sampler.startedAtMs < DEFINING_WORLD_PLAZA_PERFORMANCE_ADAPTIVE_WARMUP_MS) {
    return null;
  }

  if (
    nowMs - sampler.lastTierChangeAtMs <
    DEFINING_WORLD_PLAZA_PERFORMANCE_ADAPTIVE_COOLDOWN_MS
  ) {
    return null;
  }

  if (
    sampler.frameDeltaMsHistory.length <
    DEFINING_WORLD_PLAZA_PERFORMANCE_ADAPTIVE_HISTORY_FRAMES
  ) {
    return null;
  }

  const p95Ms = computingWorldPlazaAdaptivePerformancePercentileMs(
    sampler.frameDeltaMsHistory,
    95
  );
  const hasUpgradeSpike = sampler.frameDeltaMsHistory.some(
    (deltaMs) =>
      deltaMs >= DEFINING_WORLD_PLAZA_PERFORMANCE_ADAPTIVE_UPGRADE_SPIKE_MS
  );

  if (
    p95Ms > DEFINING_WORLD_PLAZA_PERFORMANCE_ADAPTIVE_DOWNGRADE_P95_MS
  ) {
    if (sampler.downgradeSlowSinceMs === null) {
      sampler.downgradeSlowSinceMs = nowMs;
    }

    if (
      nowMs - sampler.downgradeSlowSinceMs >=
      DEFINING_WORLD_PLAZA_PERFORMANCE_ADAPTIVE_DOWNGRADE_SUSTAIN_MS
    ) {
      const downgradedTier = resolvingWorldPlazaAdjacentPerformanceTier(
        sampler.currentTier,
        -1
      );

      if (downgradedTier) {
        sampler.currentTier = downgradedTier;
        sampler.lastTierChangeAtMs = nowMs;
        sampler.downgradeSlowSinceMs = null;
        return downgradedTier;
      }
    }

    return null;
  }

  sampler.downgradeSlowSinceMs = null;

  if (
    p95Ms < DEFINING_WORLD_PLAZA_PERFORMANCE_ADAPTIVE_UPGRADE_P95_MS &&
    !hasUpgradeSpike
  ) {
    const upgradedTier = resolvingWorldPlazaAdjacentPerformanceTier(
      sampler.currentTier,
      1
    );

    if (upgradedTier) {
      sampler.currentTier = upgradedTier;
      sampler.lastTierChangeAtMs = nowMs;
      return upgradedTier;
    }
  }

  return null;
}
