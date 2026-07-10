/**
 * Frostbite stacks gained from degrees below comfort low.
 *
 * @module components/world/health/domains/computingWorldPlazaFrostbiteColdSeverityStackGainMultiplier
 */

import { DEFINING_WORLD_PLAZA_ENTITY_FROSTBITE_STACKS_PER_DEFICIT_CELSIUS } from '@/components/world/health/domains/definingWorldPlazaEntityFrostbiteConstants';

/**
 * Stacks added on one cold damage tick from °C below comfort low.
 * Example: comfort −10°C, local −20°C → deficit 10 → +10 stacks.
 */
export function computingWorldPlazaFrostbiteStacksGainedFromColdDeficit(
  deficitCelsius: number
): number {
  const safeDeficit = Math.max(0, deficitCelsius);

  return (
    safeDeficit * DEFINING_WORLD_PLAZA_ENTITY_FROSTBITE_STACKS_PER_DEFICIT_CELSIUS
  );
}

/**
 * @deprecated Prefer {@link computingWorldPlazaFrostbiteStacksGainedFromColdDeficit}.
 * Kept as an alias so older call sites resolve to stacks-per-tick (not a multiplier).
 */
export function computingWorldPlazaFrostbiteColdSeverityStackGainMultiplier(
  deficitCelsius: number
): number {
  return computingWorldPlazaFrostbiteStacksGainedFromColdDeficit(deficitCelsius);
}
