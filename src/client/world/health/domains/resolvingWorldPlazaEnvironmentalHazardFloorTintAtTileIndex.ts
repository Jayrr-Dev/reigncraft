import { computingWorldPlazaEnvironmentalHazardHeatFloorTintFromTemperatureCelsius } from '@/components/world/health/domains/computingWorldPlazaEnvironmentalHazardHeatFloorTintFromTemperatureCelsius';
import { resolvingWorldPlazaEnvironmentalHazardAtTileIndex } from '@/components/world/health/domains/resolvingWorldPlazaEnvironmentalHazardAtTileIndex';

const DRAWING_WORLD_PLAZA_ENVIRONMENTAL_COLD_FLOOR_TINT = {
  color: 0x7ec8ff,
  alpha: 0.18,
} as const;

/**
 * Returns a subtle floor tint for hazard tiles, or null when the tile is safe.
 */
export function resolvingWorldPlazaEnvironmentalHazardFloorTintAtTileIndex(
  tileX: number,
  tileY: number,
  isDaytime: boolean
): { color: number; alpha: number } | null {
  const hazard = resolvingWorldPlazaEnvironmentalHazardAtTileIndex(
    tileX,
    tileY,
    isDaytime
  );

  if (!hazard) {
    return null;
  }

  if (hazard.kind === 'cold') {
    return DRAWING_WORLD_PLAZA_ENVIRONMENTAL_COLD_FLOOR_TINT;
  }

  return computingWorldPlazaEnvironmentalHazardHeatFloorTintFromTemperatureCelsius(
    hazard.temperatureCelsius
  );
}
