'use client';

/**
 * Always-on rAF sampler that steps plaza performance tiers up or down.
 *
 * @module components/world/hooks/usingWorldPlazaAdaptivePerformanceTier
 */

import {
  DEFINING_WORLD_PLAZA_PERFORMANCE_PROFILES,
  type DefiningWorldPlazaPerformanceProfile,
  type DefiningWorldPlazaPerformanceTier,
} from '@/components/world/domains/definingWorldPlazaPerformanceProfileConstants';
import {
  creatingWorldPlazaAdaptivePerformanceFrameSampler,
  markingWorldPlazaAdaptivePerformanceFrame,
} from '@/components/world/domains/managingWorldPlazaAdaptivePerformanceFrameSampler';
import { useEffect, useRef } from 'react';

/**
 * Samples frame deltas while mounted and calls `onTierChange` when the
 * adaptive sampler steps the tier.
 */
export function usingWorldPlazaAdaptivePerformanceTier(
  initialTier: DefiningWorldPlazaPerformanceTier,
  onTierChange: (profile: DefiningWorldPlazaPerformanceProfile) => void
): void {
  const onTierChangeRef = useRef(onTierChange);
  onTierChangeRef.current = onTierChange;

  const initialTierRef = useRef(initialTier);
  initialTierRef.current = initialTier;

  useEffect(() => {
    const sampler = creatingWorldPlazaAdaptivePerformanceFrameSampler(
      initialTierRef.current,
      performance.now()
    );
    let lastFrameAtMs = performance.now();
    let rafId = 0;

    const tick = (nowMs: number) => {
      const frameDeltaMs = nowMs - lastFrameAtMs;
      lastFrameAtMs = nowMs;

      const nextTier = markingWorldPlazaAdaptivePerformanceFrame(
        sampler,
        frameDeltaMs,
        nowMs
      );

      if (nextTier) {
        onTierChangeRef.current(
          DEFINING_WORLD_PLAZA_PERFORMANCE_PROFILES[nextTier]
        );
      }

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId);
    };
  }, []);
}
