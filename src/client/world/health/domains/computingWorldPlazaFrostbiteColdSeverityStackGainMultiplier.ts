/**
 * Cold-severity multiplier for frostbite stack gain per cold tick.
 *
 * @module components/world/health/domains/computingWorldPlazaFrostbiteColdSeverityStackGainMultiplier
 */

import {
  DEFINING_WORLD_PLAZA_ENTITY_FROSTBITE_COLD_SEVERITY_GAIN_MULTIPLIER_MAX,
  DEFINING_WORLD_PLAZA_ENTITY_FROSTBITE_COLD_SEVERITY_GAIN_MULTIPLIER_MIN,
  DEFINING_WORLD_PLAZA_ENTITY_FROSTBITE_COLD_SEVERITY_REFERENCE_DEFICIT_CELSIUS,
} from '@/components/world/health/domains/definingWorldPlazaEntityFrostbiteConstants';

/**
 * Returns how many stacks to add per cold tick relative to base (1 at comfort edge).
 * Colder past comfort low raises gain so fixed stage thresholds arrive sooner.
 */
export function computingWorldPlazaFrostbiteColdSeverityStackGainMultiplier(
  deficitCelsius: number
): number {
  const safeDeficit = Math.max(0, deficitCelsius);
  const raw =
    1 +
    safeDeficit /
      DEFINING_WORLD_PLAZA_ENTITY_FROSTBITE_COLD_SEVERITY_REFERENCE_DEFICIT_CELSIUS;

  return Math.min(
    DEFINING_WORLD_PLAZA_ENTITY_FROSTBITE_COLD_SEVERITY_GAIN_MULTIPLIER_MAX,
    Math.max(
      DEFINING_WORLD_PLAZA_ENTITY_FROSTBITE_COLD_SEVERITY_GAIN_MULTIPLIER_MIN,
      raw
    )
  );
}
