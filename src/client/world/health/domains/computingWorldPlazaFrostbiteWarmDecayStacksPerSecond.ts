/**
 * Warm recovery decay rate for frostbite stacks (per-second view of tick loss).
 *
 * @module components/world/health/domains/computingWorldPlazaFrostbiteWarmDecayStacksPerSecond
 */

import { computingWorldPlazaFrostbiteStacksLostFromWarmSurplus } from '@/components/world/health/domains/computingWorldPlazaFrostbiteStacksLostFromWarmSurplus';
import { DEFINING_WORLD_PLAZA_ENTITY_HEALTH_ENVIRONMENTAL_TEMPERATURE_TICK_INTERVAL_MS } from '@/components/world/health/domains/definingWorldPlazaEntityHealthFloatTextConstants';

/**
 * Equivalent stacks lost per second while strictly warmer than comfort low.
 * Returns 0 when still at or below comfort low.
 */
export function computingWorldPlazaFrostbiteWarmDecayStacksPerSecond(
  warmthAboveComfortCelsius: number,
  stackCount: number
): number {
  if (
    warmthAboveComfortCelsius <= 0 ||
    stackCount <= 0 ||
    DEFINING_WORLD_PLAZA_ENTITY_HEALTH_ENVIRONMENTAL_TEMPERATURE_TICK_INTERVAL_MS <=
      0
  ) {
    return 0;
  }

  const stacksPerTick = computingWorldPlazaFrostbiteStacksLostFromWarmSurplus({
    warmthAboveComfortCelsius,
    stackCount,
  });

  return (
    stacksPerTick *
    (1000 /
      DEFINING_WORLD_PLAZA_ENTITY_HEALTH_ENVIRONMENTAL_TEMPERATURE_TICK_INTERVAL_MS)
  );
}
