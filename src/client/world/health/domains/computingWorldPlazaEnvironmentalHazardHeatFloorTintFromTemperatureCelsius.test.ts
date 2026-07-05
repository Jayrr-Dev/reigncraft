import {
  computingWorldPlazaEnvironmentalHazardHeatFloorTintFromTemperatureCelsius,
  computingWorldPlazaHeatFloorTintIntensityFromTemperatureCelsius,
} from '@/components/world/health/domains/computingWorldPlazaEnvironmentalHazardHeatFloorTintFromTemperatureCelsius';
import {
  DEFINING_WORLD_PLAZA_TEMPERATURE_COMFORT_HIGH_CELSIUS,
  DEFINING_WORLD_PLAZA_TEMPERATURE_LAVA_CELSIUS,
} from '@/components/world/health/domains/definingWorldPlazaTemperatureConstants';
import { describe, expect, it } from 'vitest';

function readingWorldPlazaRgbRedChannel(color: number): number {
  return (color >> 16) & 0xff;
}

function readingWorldPlazaRgbGreenChannel(color: number): number {
  return (color >> 8) & 0xff;
}

describe('computingWorldPlazaEnvironmentalHazardHeatFloorTintFromTemperatureCelsius', () => {
  it('ramps tint intensity from the heat threshold toward lava', () => {
    const mildIntensity =
      computingWorldPlazaHeatFloorTintIntensityFromTemperatureCelsius(
        DEFINING_WORLD_PLAZA_TEMPERATURE_COMFORT_HIGH_CELSIUS + 20
      );
    const hotIntensity =
      computingWorldPlazaHeatFloorTintIntensityFromTemperatureCelsius(180);
    const lavaIntensity =
      computingWorldPlazaHeatFloorTintIntensityFromTemperatureCelsius(
        DEFINING_WORLD_PLAZA_TEMPERATURE_LAVA_CELSIUS
      );

    expect(mildIntensity).toBeGreaterThan(0);
    expect(hotIntensity).toBeGreaterThan(mildIntensity);
    expect(lavaIntensity).toBe(1);
  });

  it('shifts hotter tiles closer to red with stronger alpha', () => {
    const warmTint =
      computingWorldPlazaEnvironmentalHazardHeatFloorTintFromTemperatureCelsius(
        DEFINING_WORLD_PLAZA_TEMPERATURE_COMFORT_HIGH_CELSIUS + 12
      );
    const hotTint =
      computingWorldPlazaEnvironmentalHazardHeatFloorTintFromTemperatureCelsius(
        180
      );
    const lavaTint =
      computingWorldPlazaEnvironmentalHazardHeatFloorTintFromTemperatureCelsius(
        DEFINING_WORLD_PLAZA_TEMPERATURE_LAVA_CELSIUS
      );

    const warmRedToGreenRatio =
      readingWorldPlazaRgbRedChannel(warmTint.color) /
      readingWorldPlazaRgbGreenChannel(warmTint.color);
    const hotRedToGreenRatio =
      readingWorldPlazaRgbRedChannel(hotTint.color) /
      readingWorldPlazaRgbGreenChannel(hotTint.color);
    const lavaRedToGreenRatio =
      readingWorldPlazaRgbRedChannel(lavaTint.color) /
      readingWorldPlazaRgbGreenChannel(lavaTint.color);

    expect(hotRedToGreenRatio).toBeGreaterThan(warmRedToGreenRatio);
    expect(lavaRedToGreenRatio).toBeGreaterThan(hotRedToGreenRatio);
    expect(hotTint.alpha).toBeGreaterThan(warmTint.alpha);
    expect(lavaTint.alpha).toBeGreaterThan(hotTint.alpha);
  });
});
