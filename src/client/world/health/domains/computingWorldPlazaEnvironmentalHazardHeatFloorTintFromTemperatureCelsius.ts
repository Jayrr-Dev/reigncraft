import { blendingWorldPlazaRgbColors } from '@/components/world/domains/blendingWorldPlazaRgbColors';
import {
  DEFINING_WORLD_PLAZA_TEMPERATURE_COMFORT_HIGH_CELSIUS,
  DEFINING_WORLD_PLAZA_TEMPERATURE_LAVA_CELSIUS,
} from '@/components/world/health/domains/definingWorldPlazaTemperatureConstants';

/** Golden-orange tint at the heat damage threshold. */
const COMPUTING_WORLD_PLAZA_ENVIRONMENTAL_HEAT_FLOOR_TINT_WARM_COLOR = 0xffb347;

/** Deep red tint at lava temperature. */
const COMPUTING_WORLD_PLAZA_ENVIRONMENTAL_HEAT_FLOOR_TINT_HOT_COLOR = 0xff2a10;

/** Overlay alpha at the heat damage threshold. */
const COMPUTING_WORLD_PLAZA_ENVIRONMENTAL_HEAT_FLOOR_TINT_WARM_ALPHA = 0.14;

/** Overlay alpha at lava temperature. */
const COMPUTING_WORLD_PLAZA_ENVIRONMENTAL_HEAT_FLOOR_TINT_HOT_ALPHA = 0.3;

/**
 * Curves heat excess into [0, 1] so mid-range hot tiles visibly redden before lava.
 */
export function computingWorldPlazaHeatFloorTintIntensityFromTemperatureCelsius(
  celsius: number
): number {
  if (celsius <= DEFINING_WORLD_PLAZA_TEMPERATURE_COMFORT_HIGH_CELSIUS) {
    return 0;
  }

  const normalizedHeat = Math.min(
    1,
    (celsius - DEFINING_WORLD_PLAZA_TEMPERATURE_COMFORT_HIGH_CELSIUS) /
      (DEFINING_WORLD_PLAZA_TEMPERATURE_LAVA_CELSIUS -
        DEFINING_WORLD_PLAZA_TEMPERATURE_COMFORT_HIGH_CELSIUS)
  );

  return Math.pow(normalizedHeat, 0.35);
}

/**
 * Maps effective tile temperature to a warm-orange → deep-red floor overlay.
 */
export function computingWorldPlazaEnvironmentalHazardHeatFloorTintFromTemperatureCelsius(
  celsius: number
): { color: number; alpha: number } {
  const intensity =
    computingWorldPlazaHeatFloorTintIntensityFromTemperatureCelsius(celsius);

  return {
    color: blendingWorldPlazaRgbColors(
      COMPUTING_WORLD_PLAZA_ENVIRONMENTAL_HEAT_FLOOR_TINT_WARM_COLOR,
      COMPUTING_WORLD_PLAZA_ENVIRONMENTAL_HEAT_FLOOR_TINT_HOT_COLOR,
      intensity
    ),
    alpha:
      COMPUTING_WORLD_PLAZA_ENVIRONMENTAL_HEAT_FLOOR_TINT_WARM_ALPHA +
      intensity *
        (COMPUTING_WORLD_PLAZA_ENVIRONMENTAL_HEAT_FLOOR_TINT_HOT_ALPHA -
          COMPUTING_WORLD_PLAZA_ENVIRONMENTAL_HEAT_FLOOR_TINT_WARM_ALPHA),
  };
}
