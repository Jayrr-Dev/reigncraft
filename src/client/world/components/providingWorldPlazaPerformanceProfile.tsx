'use client';

import {
  DEFINING_WORLD_PLAZA_PERFORMANCE_PROFILE_HIGH,
  type DefiningWorldPlazaPerformanceProfile,
} from '@/components/world/domains/definingWorldPlazaPerformanceProfileConstants';
import { registeringWorldPlazaPerformanceBenchmarkTier } from '@/components/world/domains/registeringWorldPlazaPerformanceBenchmarkTier';
import { resolvingWorldPlazaPerformanceProfile } from '@/components/world/domains/resolvingWorldPlazaPerformanceProfile';
import { usingWorldPlazaAdaptivePerformanceTier } from '@/components/world/hooks/usingWorldPlazaAdaptivePerformanceTier';
import { createContext, useContext, useEffect, useState } from 'react';

/**
 * React context for the plaza adaptive performance profile.
 *
 * @module components/world/components/providingWorldPlazaPerformanceProfile
 */

const ProvidingWorldPlazaPerformanceProfileContext =
  createContext<DefiningWorldPlazaPerformanceProfile>(
    DEFINING_WORLD_PLAZA_PERFORMANCE_PROFILE_HIGH
  );

export type ProvidingWorldPlazaPerformanceProfileProps = {
  readonly children: React.ReactNode;
};

/**
 * Resolves an initial tier from viewport hints, then adapts from frame times.
 */
export function ProvidingWorldPlazaPerformanceProfile({
  children,
}: ProvidingWorldPlazaPerformanceProfileProps): React.JSX.Element {
  const [performanceProfile, setPerformanceProfile] = useState(
    resolvingWorldPlazaPerformanceProfile
  );

  usingWorldPlazaAdaptivePerformanceTier(
    performanceProfile.tier,
    setPerformanceProfile
  );

  useEffect(() => {
    registeringWorldPlazaPerformanceBenchmarkTier(performanceProfile.tier);
  }, [performanceProfile.tier]);

  return (
    <ProvidingWorldPlazaPerformanceProfileContext.Provider
      value={performanceProfile}
    >
      {children}
    </ProvidingWorldPlazaPerformanceProfileContext.Provider>
  );
}

/**
 * Returns the active plaza performance profile for this session.
 */
export function usingWorldPlazaPerformanceProfile(): DefiningWorldPlazaPerformanceProfile {
  return useContext(ProvidingWorldPlazaPerformanceProfileContext);
}
