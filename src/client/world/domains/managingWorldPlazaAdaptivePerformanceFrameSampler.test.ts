import { describe, expect, it } from 'vitest';

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
} from '@/components/world/domains/definingWorldPlazaPerformanceProfileConstants';
import {
  computingWorldPlazaAdaptivePerformancePercentileMs,
  creatingWorldPlazaAdaptivePerformanceFrameSampler,
  markingWorldPlazaAdaptivePerformanceFrame,
} from '@/components/world/domains/managingWorldPlazaAdaptivePerformanceFrameSampler';
import { resolvingWorldPlazaInitialPerformanceTier } from '@/components/world/domains/resolvingWorldPlazaPerformanceProfile';

type AdaptivePerformanceTier =
  | typeof DEFINING_WORLD_PLAZA_PERFORMANCE_TIER_HIGH
  | typeof DEFINING_WORLD_PLAZA_PERFORMANCE_TIER_MEDIUM
  | typeof DEFINING_WORLD_PLAZA_PERFORMANCE_TIER_LOW;

function fillingSamplerHistory(
  sampler: ReturnType<
    typeof creatingWorldPlazaAdaptivePerformanceFrameSampler
  >,
  frameDeltaMs: number,
  frameCount: number,
  startNowMs: number
): AdaptivePerformanceTier | null {
  let lastChange: AdaptivePerformanceTier | null = null;

  for (let frameIndex = 0; frameIndex < frameCount; frameIndex += 1) {
    const nowMs = startNowMs + frameIndex;
    const nextTier = markingWorldPlazaAdaptivePerformanceFrame(
      sampler,
      frameDeltaMs,
      nowMs
    );

    if (nextTier) {
      lastChange = nextTier;
    }
  }

  return lastChange;
}

describe('resolvingWorldPlazaInitialPerformanceTier', () => {
  it('starts LOW on mobile viewport width', () => {
    expect(
      resolvingWorldPlazaInitialPerformanceTier({
        viewportWidthPx: 390,
        hasCoarsePointer: false,
      })
    ).toBe(DEFINING_WORLD_PLAZA_PERFORMANCE_TIER_LOW);
  });

  it('starts LOW on coarse pointer even when wide', () => {
    expect(
      resolvingWorldPlazaInitialPerformanceTier({
        viewportWidthPx: 1200,
        hasCoarsePointer: true,
      })
    ).toBe(DEFINING_WORLD_PLAZA_PERFORMANCE_TIER_LOW);
  });

  it('starts MEDIUM on desktop fine pointer', () => {
    expect(
      resolvingWorldPlazaInitialPerformanceTier({
        viewportWidthPx: 1280,
        hasCoarsePointer: false,
      })
    ).toBe(DEFINING_WORLD_PLAZA_PERFORMANCE_TIER_MEDIUM);
  });
});

describe('computingWorldPlazaAdaptivePerformancePercentileMs', () => {
  it('returns nearest-rank p95', () => {
    const values = Array.from({ length: 100 }, (_, index) => index + 1);

    expect(computingWorldPlazaAdaptivePerformancePercentileMs(values, 95)).toBe(
      95
    );
  });
});

describe('markingWorldPlazaAdaptivePerformanceFrame', () => {
  it('does not adapt during warmup', () => {
    const startedAtMs = 1_000;
    const sampler = creatingWorldPlazaAdaptivePerformanceFrameSampler(
      DEFINING_WORLD_PLAZA_PERFORMANCE_TIER_MEDIUM,
      startedAtMs
    );

    const nextTier = fillingSamplerHistory(
      sampler,
      10,
      DEFINING_WORLD_PLAZA_PERFORMANCE_ADAPTIVE_HISTORY_FRAMES,
      startedAtMs
    );

    expect(nextTier).toBeNull();
    expect(sampler.currentTier).toBe(
      DEFINING_WORLD_PLAZA_PERFORMANCE_TIER_MEDIUM
    );
  });

  it('upgrades when p95 is stable and under the upgrade threshold', () => {
    const startedAtMs = 1_000;
    const sampler = creatingWorldPlazaAdaptivePerformanceFrameSampler(
      DEFINING_WORLD_PLAZA_PERFORMANCE_TIER_MEDIUM,
      startedAtMs
    );
    const readyAtMs =
      startedAtMs +
      DEFINING_WORLD_PLAZA_PERFORMANCE_ADAPTIVE_WARMUP_MS +
      DEFINING_WORLD_PLAZA_PERFORMANCE_ADAPTIVE_COOLDOWN_MS;

    // Fill history without triggering (still in cooldown from start).
    for (
      let frameIndex = 0;
      frameIndex < DEFINING_WORLD_PLAZA_PERFORMANCE_ADAPTIVE_HISTORY_FRAMES;
      frameIndex += 1
    ) {
      markingWorldPlazaAdaptivePerformanceFrame(
        sampler,
        DEFINING_WORLD_PLAZA_PERFORMANCE_ADAPTIVE_UPGRADE_P95_MS - 2,
        startedAtMs + frameIndex
      );
    }

    const nextTier = markingWorldPlazaAdaptivePerformanceFrame(
      sampler,
      DEFINING_WORLD_PLAZA_PERFORMANCE_ADAPTIVE_UPGRADE_P95_MS - 2,
      readyAtMs
    );

    expect(nextTier).toBe(DEFINING_WORLD_PLAZA_PERFORMANCE_TIER_HIGH);
    expect(sampler.currentTier).toBe(
      DEFINING_WORLD_PLAZA_PERFORMANCE_TIER_HIGH
    );
  });

  it('blocks upgrade when any frame hits the spike threshold', () => {
    const startedAtMs = 1_000;
    const sampler = creatingWorldPlazaAdaptivePerformanceFrameSampler(
      DEFINING_WORLD_PLAZA_PERFORMANCE_TIER_MEDIUM,
      startedAtMs
    );
    const readyAtMs =
      startedAtMs +
      DEFINING_WORLD_PLAZA_PERFORMANCE_ADAPTIVE_WARMUP_MS +
      DEFINING_WORLD_PLAZA_PERFORMANCE_ADAPTIVE_COOLDOWN_MS;

    for (
      let frameIndex = 0;
      frameIndex < DEFINING_WORLD_PLAZA_PERFORMANCE_ADAPTIVE_HISTORY_FRAMES - 1;
      frameIndex += 1
    ) {
      markingWorldPlazaAdaptivePerformanceFrame(
        sampler,
        DEFINING_WORLD_PLAZA_PERFORMANCE_ADAPTIVE_UPGRADE_P95_MS - 2,
        startedAtMs + frameIndex
      );
    }

    markingWorldPlazaAdaptivePerformanceFrame(
      sampler,
      DEFINING_WORLD_PLAZA_PERFORMANCE_ADAPTIVE_UPGRADE_SPIKE_MS,
      startedAtMs + DEFINING_WORLD_PLAZA_PERFORMANCE_ADAPTIVE_HISTORY_FRAMES
    );

    const nextTier = markingWorldPlazaAdaptivePerformanceFrame(
      sampler,
      DEFINING_WORLD_PLAZA_PERFORMANCE_ADAPTIVE_UPGRADE_P95_MS - 2,
      readyAtMs
    );

    expect(nextTier).toBeNull();
    expect(sampler.currentTier).toBe(
      DEFINING_WORLD_PLAZA_PERFORMANCE_TIER_MEDIUM
    );
  });

  it('downgrades after sustained slow p95', () => {
    const startedAtMs = 1_000;
    const sampler = creatingWorldPlazaAdaptivePerformanceFrameSampler(
      DEFINING_WORLD_PLAZA_PERFORMANCE_TIER_MEDIUM,
      startedAtMs
    );
    const readyAtMs =
      startedAtMs +
      DEFINING_WORLD_PLAZA_PERFORMANCE_ADAPTIVE_WARMUP_MS +
      DEFINING_WORLD_PLAZA_PERFORMANCE_ADAPTIVE_COOLDOWN_MS;
    const slowDeltaMs =
      DEFINING_WORLD_PLAZA_PERFORMANCE_ADAPTIVE_DOWNGRADE_P95_MS + 5;

    for (
      let frameIndex = 0;
      frameIndex < DEFINING_WORLD_PLAZA_PERFORMANCE_ADAPTIVE_HISTORY_FRAMES;
      frameIndex += 1
    ) {
      markingWorldPlazaAdaptivePerformanceFrame(
        sampler,
        slowDeltaMs,
        startedAtMs + frameIndex
      );
    }

    // First ready frame starts the sustain timer.
    expect(
      markingWorldPlazaAdaptivePerformanceFrame(
        sampler,
        slowDeltaMs,
        readyAtMs
      )
    ).toBeNull();

    const nextTier = markingWorldPlazaAdaptivePerformanceFrame(
      sampler,
      slowDeltaMs,
      readyAtMs + DEFINING_WORLD_PLAZA_PERFORMANCE_ADAPTIVE_DOWNGRADE_SUSTAIN_MS
    );

    expect(nextTier).toBe(DEFINING_WORLD_PLAZA_PERFORMANCE_TIER_LOW);
    expect(sampler.currentTier).toBe(DEFINING_WORLD_PLAZA_PERFORMANCE_TIER_LOW);
  });
});
