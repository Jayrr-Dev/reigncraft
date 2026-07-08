import { checkingWorldPlazaWaterIsFrozenAtTileIndex } from '@/components/world/domains/checkingWorldPlazaWaterIsFrozenAtTileIndex';
import { computingWorldPlazaDayNightSunState } from '@/components/world/domains/computingWorldPlazaDayNightSunState';
import type { DrawingWorldPlazaGrassFloorTileDrawOptions } from '@/components/world/domains/drawingWorldPlazaGrassFloorTileOnGraphics';
import { formattingWorldPlazaTileIndexCacheKey } from '@/components/world/domains/formattingWorldPlazaTileIndexCacheKey';
import { resolvingWorldPlazaEnvironmentalHazardFloorTintAtTileIndex } from '@/components/world/health/domains/resolvingWorldPlazaEnvironmentalHazardFloorTintAtTileIndex';

/**
 * Per-chunk memoization for expensive floor tile draw lookups.
 *
 * @module components/world/domains/creatingWorldPlazaGrassFloorChunkDrawPassContext
 */

/** Shared draw-pass caches for one floor chunk build. */
export type CreatingWorldPlazaGrassFloorChunkDrawPassContext = {
  readonly isDaytime: boolean;
  readonly drawsEnvironmentalHazardFloorTint: boolean;
  checkingWaterIsFrozenAtTileIndex: (tileX: number, tileY: number) => boolean;
  resolvingEnvironmentalHazardFloorTintAtTileIndex: (
    tileX: number,
    tileY: number
  ) => { color: number; alpha: number } | null;
};

/**
 * Builds draw-pass caches reused across every tile in one floor chunk.
 */
export function creatingWorldPlazaGrassFloorChunkDrawPassContext(
  drawOptions: DrawingWorldPlazaGrassFloorTileDrawOptions = {}
): CreatingWorldPlazaGrassFloorChunkDrawPassContext {
  const isDaytime =
    drawOptions.isDaytime ?? computingWorldPlazaDayNightSunState().isDaytime;
  const drawsEnvironmentalHazardFloorTint =
    drawOptions.drawsEnvironmentalHazardFloorTint ?? true;
  const frozenByTileKey = new Map<string, boolean>();
  const hazardTintByTileKey = new Map<
    string,
    { color: number; alpha: number } | null
  >();

  return {
    isDaytime,
    drawsEnvironmentalHazardFloorTint,
    checkingWaterIsFrozenAtTileIndex: (tileX, tileY) => {
      const tileKey = formattingWorldPlazaTileIndexCacheKey(tileX, tileY);
      const cachedFrozen = frozenByTileKey.get(tileKey);

      if (cachedFrozen !== undefined) {
        return cachedFrozen;
      }

      const isFrozen = checkingWorldPlazaWaterIsFrozenAtTileIndex(
        tileX,
        tileY,
        {
          isDaytime,
        }
      );
      frozenByTileKey.set(tileKey, isFrozen);

      return isFrozen;
    },
    resolvingEnvironmentalHazardFloorTintAtTileIndex: (tileX, tileY) => {
      if (!drawsEnvironmentalHazardFloorTint) {
        return null;
      }

      const tileKey = formattingWorldPlazaTileIndexCacheKey(tileX, tileY);
      const cachedTint = hazardTintByTileKey.get(tileKey);

      if (cachedTint !== undefined) {
        return cachedTint;
      }

      const hazardTint =
        resolvingWorldPlazaEnvironmentalHazardFloorTintAtTileIndex(
          tileX,
          tileY,
          isDaytime
        );
      hazardTintByTileKey.set(tileKey, hazardTint);

      return hazardTint;
    },
  };
}
