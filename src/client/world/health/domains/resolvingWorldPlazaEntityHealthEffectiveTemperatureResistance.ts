import type {
  DefiningWorldPlazaEntityHealthState,
  DefiningWorldPlazaEntityHealthTimedTemperatureModifier,
} from '@/components/world/health/domains/definingWorldPlazaEntityHealthTypes';
import type { DefiningWorldPlazaEntityTemperatureResistance } from '@/components/world/health/domains/definingWorldPlazaTemperatureTypes';

/**
 * Merges innate temperature resistance with active timed herb modifiers.
 */
export function resolvingWorldPlazaEntityHealthEffectiveTemperatureResistance(
  state: DefiningWorldPlazaEntityHealthState,
  nowMs: number
): DefiningWorldPlazaEntityTemperatureResistance {
  const activeModifiers = state.timedTemperatureModifiers.filter(
    (modifier) => modifier.expiresAtMs > nowMs
  );

  if (activeModifiers.length === 0) {
    return state.temperatureResistance;
  }

  let heatComfortBonusCelsius =
    state.temperatureResistance.heatComfortBonusCelsius;
  let coldComfortBonusCelsius =
    state.temperatureResistance.coldComfortBonusCelsius;
  let heatResistance = state.temperatureResistance.heatResistance;
  let coldResistance = state.temperatureResistance.coldResistance;

  for (const modifier of activeModifiers) {
    heatComfortBonusCelsius += modifier.heatComfortBonusCelsius;
    coldComfortBonusCelsius += modifier.coldComfortBonusCelsius;
    heatResistance += modifier.heatResistance;
    coldResistance += modifier.coldResistance;
  }

  return {
    ...state.temperatureResistance,
    heatComfortBonusCelsius,
    coldComfortBonusCelsius,
    heatResistance,
    coldResistance,
  };
}

/**
 * Active infection-resist multiplier from timed herb modifiers (1 = unchanged).
 */
export function resolvingWorldPlazaEntityHealthDiseaseContractionTimedMultiplier(
  state: DefiningWorldPlazaEntityHealthState,
  nowMs: number
): number {
  let multiplier = 1;

  for (const modifier of state.timedTemperatureModifiers) {
    if (modifier.expiresAtMs <= nowMs) {
      continue;
    }

    multiplier *= modifier.diseaseContractionChanceMultiplier;
  }

  return multiplier;
}

/**
 * Builds a timed temperature / infection modifier row.
 */
export function creatingWorldPlazaEntityHealthTimedTemperatureModifier(
  id: string,
  patch: Omit<DefiningWorldPlazaEntityHealthTimedTemperatureModifier, 'id'>
): DefiningWorldPlazaEntityHealthTimedTemperatureModifier {
  return {
    id,
    ...patch,
  };
}
