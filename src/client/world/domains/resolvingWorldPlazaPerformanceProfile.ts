/**
 * Resolves the initial plaza performance tier from viewport / pointer hints.
 *
 * Never starts on HIGH. Runtime adaptation may step up later via the
 * always-on frame sampler.
 *
 * @module components/world/domains/resolvingWorldPlazaPerformanceProfile
 */

import {
  DEFINING_WORLD_PLAZA_PERFORMANCE_PROFILES,
  DEFINING_WORLD_PLAZA_PERFORMANCE_TIER_HIGH,
  DEFINING_WORLD_PLAZA_PERFORMANCE_TIER_LOW,
  DEFINING_WORLD_PLAZA_PERFORMANCE_TIER_MEDIUM,
  type DefiningWorldPlazaPerformanceProfile,
  type DefiningWorldPlazaPerformanceTier,
} from '@/components/world/domains/definingWorldPlazaPerformanceProfileConstants';
import { DEFINING_WORLD_PLAZA_VIEWPORT_MOBILE_MAX_WIDTH_PX } from '@/components/world/domains/definingWorldPlazaViewportProfileConstants';

export type ResolvingWorldPlazaInitialPerformanceTierParams = {
  readonly viewportWidthPx: number;
  readonly hasCoarsePointer: boolean;
};

/**
 * Picks the mount-time tier: LOW on mobile / coarse pointer, else MEDIUM.
 */
export function resolvingWorldPlazaInitialPerformanceTier(
  params: ResolvingWorldPlazaInitialPerformanceTierParams
): DefiningWorldPlazaPerformanceTier {
  if (
    params.viewportWidthPx <=
      DEFINING_WORLD_PLAZA_VIEWPORT_MOBILE_MAX_WIDTH_PX ||
    params.hasCoarsePointer
  ) {
    return DEFINING_WORLD_PLAZA_PERFORMANCE_TIER_LOW;
  }

  return DEFINING_WORLD_PLAZA_PERFORMANCE_TIER_MEDIUM;
}

/**
 * Highest tier adaptive sampling may reach for this device class.
 *
 * Mobile and coarse-pointer sessions start on LOW and must not upgrade: frame
 * rate is a poor proxy for memory pressure on phones.
 */
export function resolvingWorldPlazaAdaptivePerformanceTierCeiling(
  initialTier: DefiningWorldPlazaPerformanceTier
): DefiningWorldPlazaPerformanceTier {
  if (initialTier === DEFINING_WORLD_PLAZA_PERFORMANCE_TIER_LOW) {
    return DEFINING_WORLD_PLAZA_PERFORMANCE_TIER_LOW;
  }

  return DEFINING_WORLD_PLAZA_PERFORMANCE_TIER_HIGH;
}

/**
 * Reads browser viewport / pointer media and returns the matching profile.
 */
export function resolvingWorldPlazaPerformanceProfile(): DefiningWorldPlazaPerformanceProfile {
  const viewportWidthPx =
    typeof window !== 'undefined' ? window.innerWidth : 1024;
  const hasCoarsePointer =
    typeof window !== 'undefined' &&
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(pointer: coarse)').matches;

  const tier = resolvingWorldPlazaInitialPerformanceTier({
    viewportWidthPx,
    hasCoarsePointer,
  });

  return DEFINING_WORLD_PLAZA_PERFORMANCE_PROFILES[tier];
}
