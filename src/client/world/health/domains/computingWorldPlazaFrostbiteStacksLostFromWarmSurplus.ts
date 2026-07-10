/**
 * Warm recovery stack loss — 1:1 mirror of cold deficit gain.
 *
 * @module components/world/health/domains/computingWorldPlazaFrostbiteStacksLostFromWarmSurplus
 */

import { DEFINING_WORLD_PLAZA_ENTITY_FROSTBITE_STACKS_PER_DEFICIT_CELSIUS } from '@/components/world/health/domains/definingWorldPlazaEntityFrostbiteConstants';

/**
 * Stacks removed on one warm environmental tick.
 * Symmetric to {@link computingWorldPlazaFrostbiteStacksGainedFromColdDeficit}:
 * warmth °C above comfort low × stacks-per-°C (default 1:1).
 */
export function computingWorldPlazaFrostbiteStacksLostFromWarmSurplus({
  warmthAboveComfortCelsius,
  stackCount,
}: {
  warmthAboveComfortCelsius: number;
  stackCount: number;
}): number {
  if (warmthAboveComfortCelsius <= 0 || stackCount <= 0) {
    return 0;
  }

  return (
    warmthAboveComfortCelsius *
    DEFINING_WORLD_PLAZA_ENTITY_FROSTBITE_STACKS_PER_DEFICIT_CELSIUS
  );
}
