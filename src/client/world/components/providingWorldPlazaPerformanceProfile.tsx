"use client";

import {
  DEFINING_WORLD_PLAZA_PERFORMANCE_PROFILE_HIGH,
  type DefiningWorldPlazaPerformanceProfile,
} from "@/components/world/domains/definingWorldPlazaPerformanceProfileConstants";
import { resolvingWorldPlazaPerformanceProfile } from "@/components/world/domains/resolvingWorldPlazaPerformanceProfile";
import { createContext, useContext, useMemo } from "react";

/**
 * React context for the plaza adaptive performance profile.
 *
 * @module components/world/components/providingWorldPlazaPerformanceProfile
 */

const ProvidingWorldPlazaPerformanceProfileContext =
  createContext<DefiningWorldPlazaPerformanceProfile>(
    DEFINING_WORLD_PLAZA_PERFORMANCE_PROFILE_HIGH,
  );

export interface ProvidingWorldPlazaPerformanceProfileProps {
  readonly children: React.ReactNode;
}

/**
 * Resolves hardware tier once and exposes tuning to plaza descendants.
 */
export function ProvidingWorldPlazaPerformanceProfile({
  children,
}: ProvidingWorldPlazaPerformanceProfileProps): React.JSX.Element {
  const performanceProfile = useMemo(
    () => resolvingWorldPlazaPerformanceProfile(),
    [],
  );

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
