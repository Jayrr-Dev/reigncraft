import { checkingWorldPlazaWaterIsFrozenAtTileIndex } from '@/components/world/domains/checkingWorldPlazaWaterIsFrozenAtTileIndex';
import { checkingWorldPlazaWaterTileIsShoreAtTileIndex } from '@/components/world/domains/checkingWorldPlazaWaterTileIsShoreAtTileIndex';
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
import { resolvingWorldPlazaBiomeWaterPaletteAtTileIndex } from '@/components/world/domains/resolvingWorldPlazaBiomeWaterPaletteAtTileIndex';
import { resolvingWorldPlazaFlowingWaterLakeTransitionSurfaceAppearanceAtTileIndex } from '@/components/world/domains/resolvingWorldPlazaFlowingWaterLakeTransitionSurfaceAppearanceAtTileIndex';
import { resolvingWorldPlazaFrozenWaterSurfaceAppearanceAtTileIndex } from '@/components/world/domains/resolvingWorldPlazaFrozenWaterSurfaceAppearanceAtTileIndex';
import { resolvingWorldPlazaLakeSurfaceAppearanceAtTileIndex } from '@/components/world/domains/resolvingWorldPlazaLakeWaterDepthAtTileIndex';
import {
  resolvingWorldPlazaWaterAtTileIndex,
  type DefiningWorldPlazaWaterTile,
} from '@/components/world/domains/resolvingWorldPlazaWaterAtTileIndex';
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
type DrawingWorldPlazaWaterSurfaceBatch = {
  color: number;
  alpha: number;
  tileX: number;
  tileY: number;
};

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
 * Resolves the translucent surface tint for one unfrozen water tile.
 */
function resolvingWorldPlazaUnfrozenWaterSurfaceAppearance(
  tileX: number,
  tileY: number,
  waterTile: DefiningWorldPlazaWaterTile
): { color: number; alpha: number } | null {
  if (waterTile.kind === DEFINING_WORLD_PLAZA_WATER_KIND_LAKE) {
    return resolvingWorldPlazaLakeSurfaceAppearanceAtTileIndex(tileX, tileY);
  }

  if (
    waterTile.kind === DEFINING_WORLD_PLAZA_WATER_KIND_POND ||
    waterTile.kind === DEFINING_WORLD_PLAZA_WATER_KIND_SWAMP_POND
  ) {
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

  if (
    waterTile.kind === DEFINING_WORLD_PLAZA_WATER_KIND_RIVER ||
    waterTile.kind === DEFINING_WORLD_PLAZA_WATER_KIND_STREAM
  ) {
    return resolvingWorldPlazaFlowingWaterLakeTransitionSurfaceAppearanceAtTileIndex(
      tileX,
      tileY,
      waterTile.kind
    );
  }

  return null;
}

/**
 * Appends one tile into the color/alpha batch map used for merged fills.
 */
function appendingWorldPlazaWaterSurfaceBatchTile(
  batchesByKey: Map<string, DrawingWorldPlazaWaterSurfaceBatch[]>,
  tileX: number,
  tileY: number,
  surfaceAppearance: { color: number; alpha: number }
): void {
  const batchKey = `${surfaceAppearance.color}-${surfaceAppearance.alpha}`;
  const existingBatch = batchesByKey.get(batchKey);

  if (existingBatch) {
    existingBatch.push({
      color: surfaceAppearance.color,
      alpha: surfaceAppearance.alpha,
      tileX,
      tileY,
    });
    return;
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

/**
 * Draws visible lake, river, and stream surfaces beneath biome decorations.
 *
 * One bounds pass collects every water tile into color batches and shore work,
 * instead of rescanning the full window once per water kind.
 *
 * @param graphics - Pixi graphics instance (caller clears before calling).
 * @param bounds - Visible tile index range.
 * @returns Count of water tiles drawn, for the perf water tile gauge.
 */
export function drawingWorldPlazaVisibleWaterOnGraphics(
  graphics: Graphics,
  bounds: DefiningWorldPlazaVisibleTileBounds
): number {
  const isDaytime = computingWorldPlazaDayNightSunState().isDaytime;
  const batchesByKey = new Map<string, DrawingWorldPlazaWaterSurfaceBatch[]>();
  const shoreTiles: Array<{ tileX: number; tileY: number }> = [];
  let waterTileCount = 0;

  for (let tileY = bounds.minTileY; tileY <= bounds.maxTileY; tileY += 1) {
    for (let tileX = bounds.minTileX; tileX <= bounds.maxTileX; tileX += 1) {
      const waterTile = resolvingWorldPlazaWaterAtTileIndex(tileX, tileY);

      if (!waterTile) {
        continue;
      }

      waterTileCount += 1;

      const isFrozen = checkingWorldPlazaWaterIsFrozenAtTileIndex(
        tileX,
        tileY,
        {
          isDaytime,
        }
      );

      if (isFrozen) {
        const frozenAppearance =
          resolvingWorldPlazaFrozenWaterSurfaceAppearanceAtTileIndex(
            tileX,
            tileY
          );

        if (frozenAppearance) {
          appendingWorldPlazaWaterSurfaceBatchTile(
            batchesByKey,
            tileX,
            tileY,
            frozenAppearance
          );
        }

        continue;
      }

      const surfaceAppearance =
        resolvingWorldPlazaUnfrozenWaterSurfaceAppearance(
          tileX,
          tileY,
          waterTile
        );

      if (surfaceAppearance) {
        appendingWorldPlazaWaterSurfaceBatchTile(
          batchesByKey,
          tileX,
          tileY,
          surfaceAppearance
        );
      }

      if (checkingWorldPlazaWaterTileIsShoreAtTileIndex(tileX, tileY)) {
        shoreTiles.push({ tileX, tileY });
      }
    }
  }

  for (const batch of batchesByKey.values()) {
    fillingWorldPlazaWaterSurfaceBatchOnGraphics(graphics, batch);
  }

  for (const shoreTile of shoreTiles) {
    drawingWorldPlazaWaterShoreDetailsOnGraphics(
      graphics,
      shoreTile.tileX,
      shoreTile.tileY
    );
  }

  return waterTileCount;
}
