import { DEFINING_WORLD_PLAZA_DAY_NIGHT_CYCLE_DURATION_MS } from "@/components/world/domains/definingWorldPlazaDayNightCycleConstants";
import { gettingWorldPlazaDayNightDebugOverrideCyclePhase } from "@/components/world/domains/managingWorldPlazaDayNightDebugOverrideStore";

/**
 * Resolves the epoch time used to sample the shared day/night cycle.
 *
 * Debug overrides replace wall-clock time with a fixed cycle phase.
 *
 * @param epochMs - Wall-clock sample time (defaults to `Date.now()`).
 */
export function resolvingWorldPlazaDayNightSampleEpochMs(
  epochMs = Date.now(),
): number {
  const overrideCyclePhase = gettingWorldPlazaDayNightDebugOverrideCyclePhase();

  if (overrideCyclePhase === null) {
    return epochMs;
  }

  return overrideCyclePhase * DEFINING_WORLD_PLAZA_DAY_NIGHT_CYCLE_DURATION_MS;
}
