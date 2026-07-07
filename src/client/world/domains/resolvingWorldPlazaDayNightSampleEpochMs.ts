import { DEFINING_WORLD_PLAZA_DAY_NIGHT_CYCLE_DURATION_MS } from "@/components/world/domains/definingWorldPlazaDayNightCycleConstants";
import { gettingWorldPlazaDayNightDebugOverrideCyclePhase } from "@/components/world/domains/managingWorldPlazaDayNightDebugOverrideStore";

/**
 * Resolves the UTC epoch milliseconds used to sample the shared day/night cycle.
 *
 * `Date.now()` is timezone-independent: two multiplayer clients anywhere in the
 * world pass the same value at the same real-world instant. Debug overrides
 * replace that epoch with a fixed local preview phase.
 *
 * @param epochMs - UTC epoch milliseconds (defaults to `Date.now()`).
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
