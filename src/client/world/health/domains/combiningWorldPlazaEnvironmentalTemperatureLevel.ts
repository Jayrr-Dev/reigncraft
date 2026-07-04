import type { DefiningWorldPlazaEnvironmentalTemperatureLevel } from '@/components/world/health/domains/definingWorldPlazaTemperatureTypes';

/**
 * Merges ambient temperature with an assignable heat/cold/local profile.
 */
export function combiningWorldPlazaEnvironmentalTemperatureLevel(
  ambientCelsius: number,
  level: DefiningWorldPlazaEnvironmentalTemperatureLevel | null | undefined
): number {
  if (!level) {
    return ambientCelsius;
  }

  if (typeof level.localTemperatureCelsius === 'number') {
    return level.localTemperatureCelsius;
  }

  let nextCelsius = ambientCelsius;

  if (typeof level.heatLevelCelsius === 'number') {
    nextCelsius = Math.max(nextCelsius, level.heatLevelCelsius);
  }

  if (typeof level.coldLevelCelsius === 'number') {
    nextCelsius = Math.min(nextCelsius, level.coldLevelCelsius);
  }

  return nextCelsius;
}

/**
 * Picks the most extreme effective temperature from ambient plus many profiles.
 */
export function mergingWorldPlazaEnvironmentalTemperatureLevels(
  ambientCelsius: number,
  levels: readonly (
    | DefiningWorldPlazaEnvironmentalTemperatureLevel
    | null
    | undefined
  )[]
): number {
  let resolvedCelsius = ambientCelsius;

  for (const level of levels) {
    if (!level) {
      continue;
    }

    if (typeof level.localTemperatureCelsius === 'number') {
      resolvedCelsius = level.localTemperatureCelsius;
      continue;
    }

    if (typeof level.heatLevelCelsius === 'number') {
      resolvedCelsius = Math.max(resolvedCelsius, level.heatLevelCelsius);
    }

    if (typeof level.coldLevelCelsius === 'number') {
      resolvedCelsius = Math.min(resolvedCelsius, level.coldLevelCelsius);
    }
  }

  return resolvedCelsius;
}
