import {
  DEFINING_WORLD_PLAZA_WATER_PATCH_NOISE_MAX,
  DEFINING_WORLD_PLAZA_WATER_PATCH_NOISE_MIN,
  DEFINING_WORLD_PLAZA_WATER_TEMPERATURE_PATCH_NOISE_PENALTY,
} from "@/components/world/domains/definingWorldPlazaWaterConstants";

/**
 * Derives temperature-scaled surface-water patch thresholds.
 *
 * @module components/world/domains/computingWorldPlazaWaterPatchNoiseThresholdFromBiomeTemperature
 */

/**
 * Returns the minimum wet patch noise required for surface water in a biome.
 *
 * Higher {@link DefiningWorldPlazaBiomeDefinition.temperature} raises the bar,
 * so hot regions rarely spawn lakes, rivers, or streams.
 *
 * @param biomeTemperature - Representative biome temperature in [0, 1].
 */
export function computingWorldPlazaWaterPatchNoiseThresholdFromBiomeTemperature(
  biomeTemperature: number,
): number {
  const clampedTemperature = Math.min(1, Math.max(0, biomeTemperature));

  return Math.min(
    DEFINING_WORLD_PLAZA_WATER_PATCH_NOISE_MAX,
    DEFINING_WORLD_PLAZA_WATER_PATCH_NOISE_MIN +
      clampedTemperature * DEFINING_WORLD_PLAZA_WATER_TEMPERATURE_PATCH_NOISE_PENALTY,
  );
}
