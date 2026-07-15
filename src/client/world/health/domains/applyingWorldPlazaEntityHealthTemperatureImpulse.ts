/**
 * Applies and decays combat on-hit temperature impulses on entity health state.
 *
 * @module components/world/health/domains/applyingWorldPlazaEntityHealthTemperatureImpulse
 */

import {
  DEFINING_WORLD_PLAZA_COMBAT_TEMPERATURE_OFFSET_DECAY_RATE_PER_SECOND,
  DEFINING_WORLD_PLAZA_COMBAT_TEMPERATURE_OFFSET_MAX_ABS_CELSIUS,
} from '@/components/world/health/domains/definingWorldPlazaTemperatureConstants';
import type { DefiningWorldPlazaEntityHealthState } from '@/components/world/health/domains/definingWorldPlazaEntityHealthTypes';

function clampingWorldPlazaCombatTemperatureOffsetCelsius(offsetCelsius: number): number {
  if (!Number.isFinite(offsetCelsius) || offsetCelsius === 0) {
    return 0;
  }

  const maxAbs = DEFINING_WORLD_PLAZA_COMBAT_TEMPERATURE_OFFSET_MAX_ABS_CELSIUS;

  return Math.max(-maxAbs, Math.min(maxAbs, offsetCelsius));
}

/**
 * Adds a heat (positive) or cold (negative) °C impulse to the combat offset.
 */
export function applyingWorldPlazaEntityHealthTemperatureImpulse(
  state: DefiningWorldPlazaEntityHealthState,
  deltaCelsius: number
): DefiningWorldPlazaEntityHealthState {
  if (!Number.isFinite(deltaCelsius) || deltaCelsius === 0 || state.isDead) {
    return state;
  }

  return {
    ...state,
    combatTemperatureOffsetCelsius: clampingWorldPlazaCombatTemperatureOffsetCelsius(
      state.combatTemperatureOffsetCelsius + deltaCelsius
    ),
  };
}

/**
 * Eases combat temperature offset toward 0 with frame-rate-independent decay.
 */
export function advancingWorldPlazaEntityHealthCombatTemperatureOffset(
  state: DefiningWorldPlazaEntityHealthState,
  deltaMs: number,
  decayRatePerSecond: number = DEFINING_WORLD_PLAZA_COMBAT_TEMPERATURE_OFFSET_DECAY_RATE_PER_SECOND
): DefiningWorldPlazaEntityHealthState {
  const currentOffset = state.combatTemperatureOffsetCelsius;

  if (
    !Number.isFinite(currentOffset) ||
    currentOffset === 0 ||
    deltaMs <= 0 ||
    decayRatePerSecond <= 0
  ) {
    if (currentOffset === 0) {
      return state;
    }

    return {
      ...state,
      combatTemperatureOffsetCelsius: 0,
    };
  }

  const decayAlpha = 1 - Math.exp(-decayRatePerSecond * (deltaMs / 1000));
  const nextOffset = currentOffset * (1 - decayAlpha);

  return {
    ...state,
    combatTemperatureOffsetCelsius:
      Math.abs(nextOffset) < 0.01
        ? 0
        : clampingWorldPlazaCombatTemperatureOffsetCelsius(nextOffset),
  };
}

/**
 * Ambient sample plus combat on-hit offset (°C).
 */
export function resolvingWorldPlazaEntityEffectiveLocalTemperatureCelsius(
  ambientTemperatureCelsius: number,
  state: DefiningWorldPlazaEntityHealthState
): number {
  return ambientTemperatureCelsius + state.combatTemperatureOffsetCelsius;
}
