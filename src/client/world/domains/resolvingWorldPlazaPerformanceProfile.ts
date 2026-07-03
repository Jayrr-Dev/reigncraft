import {
  DEFINING_WORLD_PLAZA_PERFORMANCE_PROFILE_LOW,
  type DefiningWorldPlazaPerformanceProfile,
} from "@/components/world/domains/definingWorldPlazaPerformanceProfileConstants";

/**
 * Resolves the plaza performance profile for the current session.
 *
 * The plaza is pinned to the low tier so every device runs the lightest
 * rendering path for the smoothest possible movement.
 *
 * @module components/world/domains/resolvingWorldPlazaPerformanceProfile
 */

/**
 * Returns the forced low performance profile.
 */
export function resolvingWorldPlazaPerformanceProfile(): DefiningWorldPlazaPerformanceProfile {
  return DEFINING_WORLD_PLAZA_PERFORMANCE_PROFILE_LOW;
}
