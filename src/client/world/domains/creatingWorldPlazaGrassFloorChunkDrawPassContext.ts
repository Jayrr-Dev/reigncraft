import { checkingWorldPlazaWaterIsFrozenAtTileIndex } from '@/components/world/domains/checkingWorldPlazaWaterIsFrozenAtTileIndex';
import { computingWorldPlazaDayNightSunState } from '@/components/world/domains/computingWorldPlazaDayNightSunState';
import type { DefiningWorldPlazaBiomeDefinition } from '@/components/world/domains/definingWorldPlazaBiomeConstants';
import type { DrawingWorldPlazaGrassFloorTileDrawOptions } from '@/components/world/domains/drawingWorldPlazaGrassFloorTileOnGraphics';
import { formattingWorldPlazaTileIndexCacheKey } from '@/components/world/domains/formattingWorldPlazaTileIndexCacheKey';
import { resolvingWorldPlazaBiomeAtTileIndex } from '@/components/world/domains/resolvingWorldPlazaBiomeAtTileIndex';
import { resolvingWorldPlazaGrassFloorTileFillColorAtTileIndex } from '@/components/world/domains/resolvingWorldPlazaGrassFloorTileFillColorAtTileIndex';
import { checkingWorldPlazaLakeShoreBlockAtTileIndex } from '@/components/world/domains/resolvingWorldPlazaLakeShoreDepthAtTileIndex';
import { checkingWorldPlazaOceanShoreBlockAtTileIndex } from '@/components/world/domains/resolvingWorldPlazaOceanShoreDepthAtTileIndex';
import { checkingWorldPlazaPondShoreBlockAtTileIndex } from '@/components/world/domains/resolvingWorldPlazaPondShoreFillColorAtTileIndex';
import {
  resolvingWorldPlazaWaterAtTileIndex,
  type DefiningWorldPlazaWaterTile,
} from '@/components/world/domains/resolvingWorldPlazaWaterAtTileIndex';
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
  resolvingGrassFloorTileFillColorAtTileIndex: (
    tileX: number,
    tileY: number
  ) => number;
  resolvingWaterAtTileIndex: (
    tileX: number,
    tileY: number
  ) => DefiningWorldPlazaWaterTile | null;
  resolvingBiomeAtTileIndex: (
    tileX: number,
    tileY: number
  ) => DefiningWorldPlazaBiomeDefinition;
  checkingLakeShoreBlockAtTileIndex: (tileX: number, tileY: number) => boolean;
  checkingOceanShoreBlockAtTileIndex: (tileX: number, tileY: number) => boolean;
  checkingPondShoreBlockAtTileIndex: (tileX: number, tileY: number) => boolean;
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
  const fillColorByTileKey = new Map<string, number>();
  const waterByTileKey = new Map<string, DefiningWorldPlazaWaterTile | null>();
  const biomeByTileKey = new Map<string, DefiningWorldPlazaBiomeDefinition>();
  const lakeShoreByTileKey = new Map<string, boolean>();
  const oceanShoreByTileKey = new Map<string, boolean>();
  const pondShoreByTileKey = new Map<string, boolean>();

  const resolvingTileKey = (tileX: number, tileY: number): string =>
    formattingWorldPlazaTileIndexCacheKey(tileX, tileY);

  const drawPassContextRef: CreatingWorldPlazaGrassFloorChunkDrawPassContext = {
    isDaytime,
    drawsEnvironmentalHazardFloorTint,
    checkingWaterIsFrozenAtTileIndex: (tileX, tileY) => {
      const tileKey = resolvingTileKey(tileX, tileY);
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

      const tileKey = resolvingTileKey(tileX, tileY);
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
    resolvingGrassFloorTileFillColorAtTileIndex: (tileX, tileY) => {
      const tileKey = resolvingTileKey(tileX, tileY);
      const cachedFillColor = fillColorByTileKey.get(tileKey);

      if (cachedFillColor !== undefined) {
        return cachedFillColor;
      }

      const fillColor = resolvingWorldPlazaGrassFloorTileFillColorAtTileIndex(
        tileX,
        tileY,
        drawPassContextRef
      );
      fillColorByTileKey.set(tileKey, fillColor);

      return fillColor;
    },
    resolvingWaterAtTileIndex: (tileX, tileY) => {
      const tileKey = resolvingTileKey(tileX, tileY);
      const cachedWater = waterByTileKey.get(tileKey);

      if (cachedWater !== undefined) {
        return cachedWater;
      }

      const waterTile = resolvingWorldPlazaWaterAtTileIndex(tileX, tileY);
      waterByTileKey.set(tileKey, waterTile);

      return waterTile;
    },
    resolvingBiomeAtTileIndex: (tileX, tileY) => {
      const tileKey = resolvingTileKey(tileX, tileY);
      const cachedBiome = biomeByTileKey.get(tileKey);

      if (cachedBiome !== undefined) {
        return cachedBiome;
      }

      const biome = resolvingWorldPlazaBiomeAtTileIndex(tileX, tileY);
      biomeByTileKey.set(tileKey, biome);

      return biome;
    },
    checkingLakeShoreBlockAtTileIndex: (tileX, tileY) => {
      const tileKey = resolvingTileKey(tileX, tileY);
      const cachedLakeShore = lakeShoreByTileKey.get(tileKey);

      if (cachedLakeShore !== undefined) {
        return cachedLakeShore;
      }

      const isLakeShore = checkingWorldPlazaLakeShoreBlockAtTileIndex(
        tileX,
        tileY
      );
      lakeShoreByTileKey.set(tileKey, isLakeShore);

      return isLakeShore;
    },
    checkingOceanShoreBlockAtTileIndex: (tileX, tileY) => {
      const tileKey = resolvingTileKey(tileX, tileY);
      const cachedOceanShore = oceanShoreByTileKey.get(tileKey);

      if (cachedOceanShore !== undefined) {
        return cachedOceanShore;
      }

      const isOceanShore = checkingWorldPlazaOceanShoreBlockAtTileIndex(
        tileX,
        tileY
      );
      oceanShoreByTileKey.set(tileKey, isOceanShore);

      return isOceanShore;
    },
    checkingPondShoreBlockAtTileIndex: (tileX, tileY) => {
      const tileKey = resolvingTileKey(tileX, tileY);
      const cachedPondShore = pondShoreByTileKey.get(tileKey);

      if (cachedPondShore !== undefined) {
        return cachedPondShore;
      }

      const isPondShore = checkingWorldPlazaPondShoreBlockAtTileIndex(
        tileX,
        tileY
      );
      pondShoreByTileKey.set(tileKey, isPondShore);

      return isPondShore;
    },
  };

  return drawPassContextRef;
}
