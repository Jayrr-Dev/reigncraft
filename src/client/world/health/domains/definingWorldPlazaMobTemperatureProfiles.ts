import type { DefiningWorldPlazaMobTemperatureProfile } from '@/components/world/health/domains/definingWorldPlazaTemperatureTypes';

/**
 * Assignable mob temperature auras and innate resistance.
 *
 * Wire mob instances to these profiles when NPCs are added to the plaza.
 */
export const DEFINING_WORLD_PLAZA_MOB_TEMPERATURE_PROFILES: Record<
  string,
  DefiningWorldPlazaMobTemperatureProfile
> = {
  'mob:ember-wisp': {
    mobKind: 'mob:ember-wisp',
    label: 'Ember wisp',
    aura: {
      heatLevelCelsius: 46,
    },
    resistance: {
      heatResistance: 0.75,
      coldResistance: 0,
      heatWeakness: 0,
      coldWeakness: 0.25,
      isHeatImmune: false,
      isColdImmune: false,
    },
  },
  'mob:frost-sprite': {
    mobKind: 'mob:frost-sprite',
    label: 'Frost sprite',
    aura: {
      coldLevelCelsius: -18,
    },
    resistance: {
      heatResistance: 0,
      coldResistance: 0.75,
      heatWeakness: 0.25,
      coldWeakness: 0,
      isHeatImmune: false,
      isColdImmune: false,
    },
  },
};

/**
 * Resolves a mob temperature profile by kind id.
 */
export function resolvingWorldPlazaMobTemperatureProfile(
  mobKind: string
): DefiningWorldPlazaMobTemperatureProfile | null {
  return DEFINING_WORLD_PLAZA_MOB_TEMPERATURE_PROFILES[mobKind] ?? null;
}
