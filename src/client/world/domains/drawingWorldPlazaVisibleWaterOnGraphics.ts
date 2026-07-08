import { checkingWorldPlazaWaterIsFrozenAtTileIndex } from '@/components/world/domains/checkingWorldPlazaWaterIsFrozenAtTileIndex';
import { computingWorldPlazaDayNightSunState } from '@/components/world/domains/computingWorldPlazaDayNightSunState';
import { convertingWorldPlazaGridPointToIsometricScreenPoint } from '@/components/world/domains/convertingWorldPlazaGridPointToIsometricScreenPoint';
import {
  DEFINING_WORLD_PLAZA_ISOMETRIC_HALF_TILE_HEIGHT_PX,
  DEFINING_WORLD_PLAZA_ISOMETRIC_HALF_TILE_WIDTH_PX,
} from '@/components/world/domains/definingWorldPlazaIsometricConstants';
import type { DefiningWorldPlazaVisibleTileBounds } from '@/components/world/domains/definingWorldPlazaVisibleTileBounds';
import {
  DEFINING_WORLD_PLAZA_WATER_KIND_LAKE,
  DEFINING_WORLD_PLAZA_WATER_KIND_POND,
  DEFINING_WORLD_PLAZA_WATER_KIND_RIVER,
  DEFINING_WORLD_PLAZA_WATER_KIND_STREAM,
  DEFINING_WORLD_PLAZA_WATER_KIND_SWAMP_POND,
} from '@/components/world/domains/definingWorldPlazaWaterKind';
import { drawingWorldPlazaWaterShoreDetailsOnGraphics } from '@/components/world/domains/drawingWorldPlazaWaterTileOnGraphics';
import { formattingWorldPlazaTileIndexCacheKey } from '@/components/world/domains/formattingWorldPlazaTileIndexCacheKey';
import { resolvingWorldPlazaBiomeWaterPaletteAtTileIndex } from '@/components/world/domains/resolvingWorldPlazaBiomeWaterPaletteAtTileIndex';
import { resolvingWorldPlazaFlowingWaterLakeTransitionSurfaceAppearanceAtTileIndex } from '@/components/world/domains/resolvingWorldPlazaFlowingWaterLakeTransitionSurfaceAppearanceAtTileIndex';
import { resolvingWorldPlazaFrozenWaterSurfaceAppearanceAtTileIndex } from '@/components/world/domains/resolvingWorldPlazaFrozenWaterSurfaceAppearanceAtTileIndex';
import { resolvingWorldPlazaLakeSurfaceAppearanceAtTileIndex } from '@/components/world/domains/resolvingWorldPlazaLakeWaterDepthAtTileIndex';
import { resolvingWorldPlazaWaterAtTileIndex } from '@/components/world/domains/resolvingWorldPlazaWaterAtTileIndex';
import type { Graphics } from 'pixi.js';

/**
 * Draws the translucent water surface for the visible tile window.
 *
 * Every visible water diamond is added to one path and filled once, so the
 * surface is a single translucent shape with no per-tile or per-chunk seams.
 * The textured ground baked into the floor chunks shows through, and shore foam
 * is layered on top only where water meets land.
 *
 * @module components/world/domains/drawingWorldPlazaVisibleWaterOnGraphics
 */

/** One batched surface fill keyed by color and opacity. */
interface DrawingWorldPlazaWaterSurfaceBatch {
  color: number;
  alpha: number;
  tileX: number;
  tileY: number;
}

/**
 * Adds one tile's diamond outline to the current graphics path.
 *
 * @param graphics - Pixi graphics instance.
 * @param tileX - Tile column index.
 * @param tileY - Tile row index.
 */
function addingWorldPlazaWaterTileDiamondPath(
  graphics: Graphics,
  tileX: number,
  tileY: number
): void {
  const center = convertingWorldPlazaGridPointToIsometricScreenPoint({
    x: tileX,
    y: tileY,
  });
  const halfWidth = DEFINING_WORLD_PLAZA_ISOMETRIC_HALF_TILE_WIDTH_PX;
  const halfHeight = DEFINING_WORLD_PLAZA_ISOMETRIC_HALF_TILE_HEIGHT_PX;

  graphics.poly([
    center.x,
    center.y - halfHeight,
    center.x + halfWidth,
    center.y,
    center.x,
    center.y + halfHeight,
    center.x - halfWidth,
    center.y,
  ]);
}

/**
 * Fills one batch of water tiles that share the same surface tint.
 *
 * @param graphics - Pixi graphics instance.
 * @param batch - Tiles and shared surface tint.
 */
function fillingWorldPlazaWaterSurfaceBatchOnGraphics(
  graphics: Graphics,
  batch: readonly DrawingWorldPlazaWaterSurfaceBatch[]
): void {
  for (const tile of batch) {
    addingWorldPlazaWaterTileDiamondPath(graphics, tile.tileX, tile.tileY);
  }

  graphics.fill({
    color: batch[0].color,
    alpha: batch[0].alpha,
  });
}

/**
 * Groups water tiles by matching surface color and opacity, then fills each group.
 *
 * @param graphics - Pixi graphics instance.
 * @param bounds - Visible tile index range.
 * @param includesWaterTile - Returns true when the tile should be included.
 * @param resolvingSurfaceAppearance - Returns surface tint for one tile.
 */
function fillingWorldPlazaWaterSurfaceTilesOnGraphics(
  graphics: Graphics,
  bounds: DefiningWorldPlazaVisibleTileBounds,
  includesWaterTile: (
    tileX: number,
    tileY: number,
    waterTile: NonNullable<
      ReturnType<typeof resolvingWorldPlazaWaterAtTileIndex>
    >
  ) => boolean,
  resolvingSurfaceAppearance: (
    tileX: number,
    tileY: number,
    waterTile: NonNullable<
      ReturnType<typeof resolvingWorldPlazaWaterAtTileIndex>
    >
  ) => { color: number; alpha: number } | null
): void {
  const batchesByKey = new Map<string, DrawingWorldPlazaWaterSurfaceBatch[]>();

  for (let tileY = bounds.minTileY; tileY <= bounds.maxTileY; tileY += 1) {
    for (let tileX = bounds.minTileX; tileX <= bounds.maxTileX; tileX += 1) {
      const waterTile = resolvingWorldPlazaWaterAtTileIndex(tileX, tileY);

      if (!waterTile || !includesWaterTile(tileX, tileY, waterTile)) {
        continue;
      }

      const surfaceAppearance = resolvingSurfaceAppearance(
        tileX,
        tileY,
        waterTile
      );

      if (!surfaceAppearance) {
        continue;
      }

      const batchKey = `${surfaceAppearance.color}-${surfaceAppearance.alpha}`;
      const existingBatch = batchesByKey.get(batchKey);

      if (existingBatch) {
        existingBatch.push({
          color: surfaceAppearance.color,
          alpha: surfaceAppearance.alpha,
          tileX,
          tileY,
        });
        continue;
      }

      batchesByKey.set(batchKey, [
        {
          color: surfaceAppearance.color,
          alpha: surfaceAppearance.alpha,
          tileX,
          tileY,
        },
      ]);
    }
  }

  for (const batch of batchesByKey.values()) {
    fillingWorldPlazaWaterSurfaceBatchOnGraphics(graphics, batch);
  }
}

/**
 * Cached frozen-water lookup for one visible-bounds redraw pass.
 */
function creatingWorldPlazaCachedWaterFrozenChecker(isDaytime: boolean) {
  const frozenByTileKey = new Map<string, boolean>();

  return (tileX: number, tileY: number): boolean => {
    const tileKey = formattingWorldPlazaTileIndexCacheKey(tileX, tileY);
    const cachedFrozen = frozenByTileKey.get(tileKey);

    if (cachedFrozen !== undefined) {
      return cachedFrozen;
    }

    const isFrozen = checkingWorldPlazaWaterIsFrozenAtTileIndex(tileX, tileY, {
      isDaytime,
    });
    frozenByTileKey.set(tileKey, isFrozen);

    return isFrozen;
  };
}

/**
 * Draws visible lake, river, and stream surfaces beneath biome decorations.
 *
 * @param graphics - Pixi graphics instance (caller clears before calling).
 * @param bounds - Visible tile index range.
 */
export function drawingWorldPlazaVisibleWaterOnGraphics(
  graphics: Graphics,
  bounds: DefiningWorldPlazaVisibleTileBounds
): void {
  const isDaytime = computingWorldPlazaDayNightSunState().isDaytime;
  const checkingWaterIsFrozen =
    creatingWorldPlazaCachedWaterFrozenChecker(isDaytime);

  fillingWorldPlazaWaterSurfaceTilesOnGraphics(
    graphics,
    bounds,
    (tileX, tileY) => checkingWaterIsFrozen(tileX, tileY),
    (tileX, tileY) =>
      resolvingWorldPlazaFrozenWaterSurfaceAppearanceAtTileIndex(tileX, tileY)
  );

  fillingWorldPlazaWaterSurfaceTilesOnGraphics(
    graphics,
    bounds,
    (tileX, tileY, waterTile) =>
      !checkingWaterIsFrozen(tileX, tileY) &&
      waterTile.kind === DEFINING_WORLD_PLAZA_WATER_KIND_LAKE,
    (tileX, tileY) =>
      resolvingWorldPlazaLakeSurfaceAppearanceAtTileIndex(tileX, tileY)
  );

  fillingWorldPlazaWaterSurfaceTilesOnGraphics(
    graphics,
    bounds,
    (tileX, tileY, waterTile) =>
      !checkingWaterIsFrozen(tileX, tileY) &&
      waterTile.kind === DEFINING_WORLD_PLAZA_WATER_KIND_POND,
    (tileX, tileY, waterTile) => {
      const palette = resolvingWorldPlazaBiomeWaterPaletteAtTileIndex(
        tileX,
        tileY,
        waterTile.kind
      );

      return palette
        ? {
            color: palette.surfaceLayerColor,
            alpha: palette.surfaceLayerAlpha,
          }
        : null;
    }
  );

  fillingWorldPlazaWaterSurfaceTilesOnGraphics(
    graphics,
    bounds,
    (tileX, tileY, waterTile) =>
      !checkingWaterIsFrozen(tileX, tileY) &&
      waterTile.kind === DEFINING_WORLD_PLAZA_WATER_KIND_SWAMP_POND,
    (tileX, tileY, waterTile) => {
      const palette = resolvingWorldPlazaBiomeWaterPaletteAtTileIndex(
        tileX,
        tileY,
        waterTile.kind
      );

      return palette
        ? {
            color: palette.surfaceLayerColor,
            alpha: palette.surfaceLayerAlpha,
          }
        : null;
    }
  );

  fillingWorldPlazaWaterSurfaceTilesOnGraphics(
    graphics,
    bounds,
    (tileX, tileY, waterTile) =>
      !checkingWaterIsFrozen(tileX, tileY) &&
      (waterTile.kind === DEFINING_WORLD_PLAZA_WATER_KIND_RIVER ||
        waterTile.kind === DEFINING_WORLD_PLAZA_WATER_KIND_STREAM),
    (tileX, tileY, waterTile) =>
      resolvingWorldPlazaFlowingWaterLakeTransitionSurfaceAppearanceAtTileIndex(
        tileX,
        tileY,
        waterTile.kind
      )
  );

  for (let tileY = bounds.minTileY; tileY <= bounds.maxTileY; tileY += 1) {
    for (let tileX = bounds.minTileX; tileX <= bounds.maxTileX; tileX += 1) {
      if (
        !resolvingWorldPlazaWaterAtTileIndex(tileX, tileY) ||
        checkingWaterIsFrozen(tileX, tileY)
      ) {
        continue;
      }

      drawingWorldPlazaWaterShoreDetailsOnGraphics(graphics, tileX, tileY);
    }
  }
}
