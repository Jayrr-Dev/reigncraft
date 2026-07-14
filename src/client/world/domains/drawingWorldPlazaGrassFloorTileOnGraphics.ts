import { checkingWorldPlazaLavaAtTileIndex } from '@/components/world/domains/checkingWorldPlazaLavaAtTileIndex';
import { checkingWorldPlazaTerrainElevationTileIsCliffEdgeAtTileIndex } from '@/components/world/domains/checkingWorldPlazaTerrainElevationTileIsCliffEdgeAtTileIndex';
import {
  checkingWorldPlazaTileFloorIsOccludedByColumnRockAtTileIndex,
  checkingWorldPlazaTileHasColumnRockAtTileIndex,
} from '@/components/world/domains/checkingWorldPlazaTileFloorIsOccludedByColumnRockAtTileIndex';
import { checkingWorldPlazaWaterIsFrozenAtTileIndex } from '@/components/world/domains/checkingWorldPlazaWaterIsFrozenAtTileIndex';
import { computingWorldPlazaDayNightSunState } from '@/components/world/domains/computingWorldPlazaDayNightSunState';
import { computingWorldPlazaTerrainElevationScreenOffsetPxAtTileIndex } from '@/components/world/domains/computingWorldPlazaTerrainElevationScreenOffsetPxAtTileIndex';
import { convertingWorldPlazaGridPointToIsometricScreenPoint } from '@/components/world/domains/convertingWorldPlazaGridPointToIsometricScreenPoint';
import type { CreatingWorldPlazaGrassFloorChunkDrawPassContext } from '@/components/world/domains/creatingWorldPlazaGrassFloorChunkDrawPassContext';
import {
  DEFINING_WORLD_PLAZA_ISOMETRIC_HALF_TILE_HEIGHT_PX,
  DEFINING_WORLD_PLAZA_ISOMETRIC_HALF_TILE_WIDTH_PX,
} from '@/components/world/domains/definingWorldPlazaIsometricConstants';
import { DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_PROCEDURAL_ENABLED } from '@/components/world/domains/definingWorldPlazaTerrainElevationConstants';
import {
  drawingWorldPlazaBiomeTileSurfaceDecorationsOnGraphics,
  type DrawingWorldPlazaBiomeTileSurfaceDecorationsDrawOptions,
} from '@/components/world/domains/drawingWorldPlazaBiomeTileSurfaceDecorationsOnGraphics';
import { drawingWorldPlazaFrozenWaterIceTextureOnGraphics } from '@/components/world/domains/drawingWorldPlazaFrozenWaterIceTextureOnGraphics';
import {
  checkingWorldPlazaGrassFloorTileIsBurntAtTileIndex,
  resolvingWorldPlazaBurntGrassFloorTileFillColorAtTileIndex,
} from '@/components/world/domains/resolvingWorldPlazaBurntGrassFloorTileFillColorAtTileIndex';
import { resolvingWorldPlazaGrassFloorTileFillColorAtTileIndex } from '@/components/world/domains/resolvingWorldPlazaGrassFloorTileFillColorAtTileIndex';
import { checkingWorldPlazaTerrainElevationHasRaisedSurfaceAtTileIndex } from '@/components/world/domains/resolvingWorldPlazaSurfaceLayerAtTileIndex';
import { resolvingWorldPlazaWaterAtTileIndex } from '@/components/world/domains/resolvingWorldPlazaWaterAtTileIndex';
import { resolvingWorldPlazaEnvironmentalHazardFloorTintAtTileIndex } from '@/components/world/health/domains/resolvingWorldPlazaEnvironmentalHazardFloorTintAtTileIndex';
import type { Graphics } from 'pixi.js';

/**
 * Draws one procedural grass or water floor tile with local decorations.
 *
 * @module components/world/domains/drawingWorldPlazaGrassFloorTileOnGraphics
 */

/** Optional decoration toggles for adaptive performance tiers. */
export interface DrawingWorldPlazaGrassFloorTileDrawOptions extends DrawingWorldPlazaBiomeTileSurfaceDecorationsDrawOptions {
  /** Scorched procedural grass tiles keyed by fire tile keys. */
  readonly burntGrassTileKeys?: ReadonlySet<string>;
  /** Day/night flag shared across one chunk draw pass. */
  readonly isDaytime?: boolean;
  /** When false, skip cold/heat floor tints while baking chunks. */
  readonly drawsEnvironmentalHazardFloorTint?: boolean;
  /**
   * When false, skip the grass/water diamond fill (decoration-only pass).
   * Chunks bake fills first, then decorations, so neighbor tiles cannot bury flowers.
   */
  readonly drawsFloorFill?: boolean;
  /** Per-chunk memoization for frozen water and hazard tints. */
  readonly drawPassContext?: CreatingWorldPlazaGrassFloorChunkDrawPassContext;
}

/**
 * Draws a single isometric floor tile at its grid index.
 *
 * @param graphics - Pixi graphics instance dedicated to this tile.
 * @param tileX - Tile column index.
 * @param tileY - Tile row index.
 * @param drawOptions - Decoration toggles for adaptive quality.
 */
export function drawingWorldPlazaGrassFloorTileOnGraphics(
  graphics: Graphics,
  tileX: number,
  tileY: number,
  drawOptions: DrawingWorldPlazaGrassFloorTileDrawOptions = {}
): void {
  const hasColumnRockFootprint = checkingWorldPlazaTileHasColumnRockAtTileIndex(
    tileX,
    tileY
  );
  const hasRaisedSurface =
    DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_PROCEDURAL_ENABLED &&
    checkingWorldPlazaTerrainElevationHasRaisedSurfaceAtTileIndex(tileX, tileY);

  // Cliff-edge raised tiles (and raised lava) render as entity-layer block
  // columns so side faces and molten caps depth-sort against avatars. Column
  // rock footprints skip those columns, so they still need a lifted floor
  // diamond here — otherwise the rock sits in a ground-level pit.
  const usesElevationColumn =
    hasRaisedSurface &&
    !hasColumnRockFootprint &&
    (checkingWorldPlazaLavaAtTileIndex(tileX, tileY) ||
      checkingWorldPlazaTerrainElevationTileIsCliffEdgeAtTileIndex(
        tileX,
        tileY
      ));

  if (usesElevationColumn) {
    return;
  }

  // Interior raised tiles (and rock footprints on raised terrain) draw a flat
  // cap diamond lifted to their surface layer inside the batched floor chunk.
  const surfaceLiftY = hasRaisedSurface
    ? computingWorldPlazaTerrainElevationScreenOffsetPxAtTileIndex(tileX, tileY)
    : 0;

  // Column rocks render on the entity layer above the floor grass diamond.
  if (
    checkingWorldPlazaTileFloorIsOccludedByColumnRockAtTileIndex(tileX, tileY)
  ) {
    return;
  }

  const halfWidth = DEFINING_WORLD_PLAZA_ISOMETRIC_HALF_TILE_WIDTH_PX;
  const halfHeight = DEFINING_WORLD_PLAZA_ISOMETRIC_HALF_TILE_HEIGHT_PX;
  const drawsFloorFill = drawOptions.drawsFloorFill !== false;
  const baseFillColor = drawOptions.drawPassContext
    ? drawOptions.drawPassContext.resolvingGrassFloorTileFillColorAtTileIndex(
        tileX,
        tileY
      )
    : resolvingWorldPlazaGrassFloorTileFillColorAtTileIndex(
        tileX,
        tileY,
        drawOptions.drawPassContext
      );
  const fillColor = resolvingWorldPlazaBurntGrassFloorTileFillColorAtTileIndex({
    tileX,
    tileY,
    baseFillColor,
    burntGrassTileKeys: drawOptions.burntGrassTileKeys,
  });
  const isBurntGrassTile = checkingWorldPlazaGrassFloorTileIsBurntAtTileIndex(
    tileX,
    tileY,
    drawOptions.burntGrassTileKeys
  );
  const groundCenter = convertingWorldPlazaGridPointToIsometricScreenPoint({
    x: tileX,
    y: tileY,
  });
  const center = {
    x: groundCenter.x,
    y: groundCenter.y + surfaceLiftY,
  };

  if (drawsFloorFill) {
    graphics
      .poly([
        center.x,
        center.y - halfHeight,
        center.x + halfWidth,
        center.y,
        center.x,
        center.y + halfHeight,
        center.x - halfWidth,
        center.y,
      ])
      .fill({ color: fillColor });

    const isDaytime =
      drawOptions.drawPassContext?.isDaytime ??
      drawOptions.isDaytime ??
      computingWorldPlazaDayNightSunState().isDaytime;
    const hazardTint = drawOptions.drawPassContext
      ? drawOptions.drawPassContext.resolvingEnvironmentalHazardFloorTintAtTileIndex(
          tileX,
          tileY
        )
      : drawOptions.drawsEnvironmentalHazardFloorTint === false
        ? null
        : resolvingWorldPlazaEnvironmentalHazardFloorTintAtTileIndex(
            tileX,
            tileY,
            isDaytime
          );

    if (hazardTint) {
      graphics
        .poly([
          center.x,
          center.y - halfHeight,
          center.x + halfWidth,
          center.y,
          center.x,
          center.y + halfHeight,
          center.x - halfWidth,
          center.y,
        ])
        .fill({ color: hazardTint.color, alpha: hazardTint.alpha });
    }

    const waterTile = drawOptions.drawPassContext
      ? drawOptions.drawPassContext.resolvingWaterAtTileIndex(tileX, tileY)
      : resolvingWorldPlazaWaterAtTileIndex(tileX, tileY);

    if (
      waterTile &&
      (drawOptions.drawPassContext
        ? drawOptions.drawPassContext.checkingWaterIsFrozenAtTileIndex(
            tileX,
            tileY
          )
        : checkingWorldPlazaWaterIsFrozenAtTileIndex(tileX, tileY, {
            isDaytime,
          }))
    ) {
      drawingWorldPlazaFrozenWaterIceTextureOnGraphics(
        graphics,
        tileX,
        tileY,
        center.x,
        center.y
      );
    }
  }

  if (!isBurntGrassTile) {
    drawingWorldPlazaBiomeTileSurfaceDecorationsOnGraphics({
      graphics,
      tileX,
      tileY,
      centerX: center.x,
      centerY: center.y,
      drawOptions,
    });
  }
}

/**
 * Depth sort key for one floor tile graphics child.
 *
 * @param tileX - Tile column index.
 * @param tileY - Tile row index.
 */
export function resolvingWorldPlazaGrassFloorTileGraphicsZIndex(
  tileX: number,
  tileY: number
): number {
  return tileX + tileY;
}
