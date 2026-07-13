import {
  DEFINING_WORLD_PLAZA_TEMPERATURE_COMFORT_HIGH_CELSIUS,
  DEFINING_WORLD_PLAZA_TEMPERATURE_COMFORT_LOW_CELSIUS,
} from '@/components/world/health/domains/definingWorldPlazaTemperatureConstants';
import type {
  DefiningWorldPlazaEntityTemperatureComfortBand,
  DefiningWorldPlazaEntityTemperatureResistance,
} from '@/components/world/health/domains/definingWorldPlazaTemperatureTypes';

/**
 * Resolves the entity comfort band from innate base edges plus tolerance bonuses.
 *
 * Heat tolerance raises the high bound; cold tolerance lowers the low bound.
 * Missing base edges fall back to the global human default band.
 */
export function resolvingWorldPlazaEntityTemperatureComfortBand(
  resistance?: Pick<
    DefiningWorldPlazaEntityTemperatureResistance,
    | 'baseComfortLowCelsius'
    | 'baseComfortHighCelsius'
    | 'heatComfortBonusCelsius'
    | 'coldComfortBonusCelsius'
  > | null
): DefiningWorldPlazaEntityTemperatureComfortBand {
  const heatBonusCelsius = Math.max(
    0,
    resistance?.heatComfortBonusCelsius ?? 0
  );
  const coldBonusCelsius = Math.max(
    0,
    resistance?.coldComfortBonusCelsius ?? 0
  );
  const baseLowCelsius =
    resistance?.baseComfortLowCelsius ??
    DEFINING_WORLD_PLAZA_TEMPERATURE_COMFORT_LOW_CELSIUS;
  const baseHighCelsius =
    resistance?.baseComfortHighCelsius ??
    DEFINING_WORLD_PLAZA_TEMPERATURE_COMFORT_HIGH_CELSIUS;
  const comfortLowCelsius = baseLowCelsius - coldBonusCelsius;
  const comfortHighCelsius = Math.max(
    comfortLowCelsius,
    baseHighCelsius + heatBonusCelsius
  );

  return {
    comfortHighCelsius,
    comfortLowCelsius,
  };
}
