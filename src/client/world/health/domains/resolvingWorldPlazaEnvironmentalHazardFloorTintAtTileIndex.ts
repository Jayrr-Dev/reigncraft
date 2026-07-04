import type { DefiningWorldPlazaEnvironmentalHazardKind } from '@/components/world/health/domains/definingWorldPlazaEnvironmentalHazardTypes';
import { resolvingWorldPlazaEnvironmentalHazardAtTileIndex } from '@/components/world/health/domains/resolvingWorldPlazaEnvironmentalHazardAtTileIndex';

const DRAWING_WORLD_PLAZA_ENVIRONMENTAL_HAZARD_TINT_BY_KIND: Record<
  DefiningWorldPlazaEnvironmentalHazardKind,
  { color: number; alpha: number }
> = {
  lava: { color: 0xff3b1f, alpha: 0.28 },
  heat: { color: 0xff8c1a, alpha: 0.16 },
  cold: { color: 0x7ec8ff, alpha: 0.18 },
};

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

  return DRAWING_WORLD_PLAZA_ENVIRONMENTAL_HAZARD_TINT_BY_KIND[hazard.kind];
}
