'use client';

/**
 * Always-on rAF sampler that steps plaza performance tiers up or down.
 *
 * @module components/world/hooks/usingWorldPlazaAdaptivePerformanceTier
 */

import { checkingWorldPlazaDevQaLoadEnabled } from '@/components/world/domains/managingWorldPlazaDevQaLoadStore';
import {
  DEFINING_WORLD_PLAZA_PERFORMANCE_PROFILES,
  type DefiningWorldPlazaPerformanceProfile,
  type DefiningWorldPlazaPerformanceTier,
} from '@/components/world/domains/definingWorldPlazaPerformanceProfileConstants';
import {
  creatingWorldPlazaAdaptivePerformanceFrameSampler,
  markingWorldPlazaAdaptivePerformanceFrame,
} from '@/components/world/domains/managingWorldPlazaAdaptivePerformanceFrameSampler';
import { resolvingWorldPlazaAdaptivePerformanceTierCeiling } from '@/components/world/domains/resolvingWorldPlazaPerformanceProfile';
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
    const initialTier = initialTierRef.current;
    const sampler = creatingWorldPlazaAdaptivePerformanceFrameSampler(
      initialTier,
      performance.now(),
      resolvingWorldPlazaAdaptivePerformanceTierCeiling(initialTier)
    );
    let lastFrameAtMs = performance.now();
    let rafId = 0;

    const tick = (nowMs: number) => {
      if (
        typeof document !== 'undefined' &&
        document.visibilityState !== 'visible'
      ) {
        rafId = requestAnimationFrame(tick);
        return;
      }

      // Dev QA blank-slate bisect: freeze tier so adaptive rAF + profile churn
      // cannot inject hitch while measuring a stripped world.
      if (checkingWorldPlazaDevQaLoadEnabled()) {
        lastFrameAtMs = nowMs;
        rafId = requestAnimationFrame(tick);
        return;
      }

      const frameDeltaMs = nowMs - lastFrameAtMs;
      lastFrameAtMs = nowMs;

      const nextTier = markingWorldPlazaAdaptivePerformanceFrame(
        sampler,
        frameDeltaMs,
        nowMs,
        typeof document === 'undefined'
          ? true
          : document.visibilityState === 'visible'
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
