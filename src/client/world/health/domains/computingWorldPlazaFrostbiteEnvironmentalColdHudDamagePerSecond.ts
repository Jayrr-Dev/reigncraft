/**
 * Cold HUD DPS including Frostnip+ percent max HP and Frostbite+ multipliers.
 *
 * @module components/world/health/domains/computingWorldPlazaFrostbiteEnvironmentalColdHudDamagePerSecond
 */

import { computingWorldPlazaFrostbiteColdTickDamage } from '@/components/world/health/domains/computingWorldPlazaFrostbiteColdTickDamage';
import { DEFINING_WORLD_PLAZA_ENTITY_HEALTH_ENVIRONMENTAL_TEMPERATURE_TICK_INTERVAL_MS } from '@/components/world/health/domains/definingWorldPlazaEntityHealthFloatTextConstants';
import type { DefiningWorldPlazaEntityFrostbiteState } from '@/components/world/health/domains/definingWorldPlazaEntityFrostbiteTypes';

/**
 * Resisted ambient cold DPS scaled to match one environmental cold tick,
 * including frostbite percent max HP and frost damage taken multipliers.
 */
export function computingWorldPlazaFrostbiteEnvironmentalColdHudDamagePerSecond({
  ambientDamagePerSecond,
  frostbite,
  effectiveMaxHealth,
  tickIntervalMs = DEFINING_WORLD_PLAZA_ENTITY_HEALTH_ENVIRONMENTAL_TEMPERATURE_TICK_INTERVAL_MS,
}: {
  ambientDamagePerSecond: number;
  frostbite: DefiningWorldPlazaEntityFrostbiteState | null;
  effectiveMaxHealth: number;
  tickIntervalMs?: number;
}): number {
  if (ambientDamagePerSecond <= 0 || tickIntervalMs <= 0) {
    return 0;
  }

  const ambientTickDamage =
    ambientDamagePerSecond * (tickIntervalMs / 1000);
  const frostTick = computingWorldPlazaFrostbiteColdTickDamage({
    ambientTickDamage,
    frostbite,
    effectiveMaxHealth,
  });

  return frostTick.totalDamage * (1000 / tickIntervalMs);
}
