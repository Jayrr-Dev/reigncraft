import {
  DEFINING_WORLD_PLAZA_TEMPERATURE_COMFORT_HIGH_CELSIUS,
  DEFINING_WORLD_PLAZA_TEMPERATURE_COMFORT_LOW_CELSIUS,
} from '@/components/world/health/domains/definingWorldPlazaTemperatureConstants';
import type {
  DefiningWorldPlazaEntityTemperatureComfortBand,
  DefiningWorldPlazaEntityTemperatureResistance,
} from '@/components/world/health/domains/definingWorldPlazaTemperatureTypes';

/**
 * Resolves the entity comfort band after heat/cold tolerance bonuses.
 *
 * Heat tolerance raises the high bound; cold tolerance lowers the low bound.
 */
export function resolvingWorldPlazaEntityTemperatureComfortBand(
  resistance?: Pick<
    DefiningWorldPlazaEntityTemperatureResistance,
    'heatComfortBonusCelsius' | 'coldComfortBonusCelsius'
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

  return {
    comfortHighCelsius:
      DEFINING_WORLD_PLAZA_TEMPERATURE_COMFORT_HIGH_CELSIUS + heatBonusCelsius,
    comfortLowCelsius:
      DEFINING_WORLD_PLAZA_TEMPERATURE_COMFORT_LOW_CELSIUS - coldBonusCelsius,
  };
}
