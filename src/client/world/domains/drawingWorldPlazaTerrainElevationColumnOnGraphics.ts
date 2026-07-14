import { computingWorldBuildingWorldLayerScreenOffsetPx } from '@/components/world/building/domains/computingWorldBuildingWorldLayerScreenOffsetPx';
import { DEFINING_WORLD_BUILDING_WORLD_LAYER_GROUND } from '@/components/world/building/domains/definingWorldBuildingWorldLayerConstants';
import { drawingWorldBuildingIsometricTileColumnExtrusionSpanOnGraphics } from '@/components/world/building/domains/drawingWorldBuildingIsometricTileColumnExtrusionOnGraphics';
import { checkingWorldPlazaLavaAtTileIndex } from '@/components/world/domains/checkingWorldPlazaLavaAtTileIndex';
import { checkingWorldPlazaTreeBlocksGridTile } from '@/components/world/domains/checkingWorldPlazaTreeBlocksGridTile';
import { computingWorldPlazaDayNightSunState } from '@/components/world/domains/computingWorldPlazaDayNightSunState';
import { convertingWorldPlazaGridPointToIsometricScreenPoint } from '@/components/world/domains/convertingWorldPlazaGridPointToIsometricScreenPoint';
import {
  DEFINING_WORLD_PLAZA_ISOMETRIC_HALF_TILE_HEIGHT_PX,
  DEFINING_WORLD_PLAZA_ISOMETRIC_HALF_TILE_WIDTH_PX,
} from '@/components/world/domains/definingWorldPlazaIsometricConstants';
import { DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_COLUMN_STROKE_ALPHA } from '@/components/world/domains/definingWorldPlazaTerrainElevationConstants';
import { drawingWorldPlazaBiomeTileSurfaceDecorationsOnGraphics } from '@/components/world/domains/drawingWorldPlazaBiomeTileSurfaceDecorationsOnGraphics';
import { drawingWorldPlazaElevatedLavaTopOnGraphics } from '@/components/world/domains/drawingWorldPlazaElevatedLavaTopOnGraphics';
import { drawingWorldPlazaTerrainElevationColumnDepthBandSideFacesOnGraphics } from '@/components/world/domains/drawingWorldPlazaTerrainElevationColumnDepthBandSideFacesOnGraphics';
import { drawingWorldPlazaTerrainElevationExposedCliffEdgesOnGraphics } from '@/components/world/domains/drawingWorldPlazaTerrainElevationExposedCliffEdgesOnGraphics';
import { resolvingWorldPlazaGrassFloorTileFillColorAtTileIndex } from '@/components/world/domains/resolvingWorldPlazaGrassFloorTileFillColorAtTileIndex';
import { resolvingWorldPlazaTerrainElevationSurfaceLayerAtTileIndex } from '@/components/world/domains/resolvingWorldPlazaTerrainElevationAtTileIndex';
import {
  resolvingWorldPlazaTerrainElevationBlockColorsAtTileIndex,
  resolvingWorldPlazaTerrainElevationTerrainSideFillColorAtTileIndex,
} from '@/components/world/domains/resolvingWorldPlazaTerrainElevationBlockColorsAtTileIndex';
import { resolvingWorldPlazaEnvironmentalHazardFloorTintAtTileIndex } from '@/components/world/health/domains/resolvingWorldPlazaEnvironmentalHazardFloorTintAtTileIndex';
import type { Graphics } from 'pixi.js';

/**
 * Draws procedural hill and mountain columns using the build block extrusion renderer.
 *
 * @module components/world/domains/drawingWorldPlazaTerrainElevationColumnOnGraphics
 */

/** Optional toggles for adaptive elevation column quality. */
export interface DrawingWorldPlazaTerrainElevationColumnDrawOptions {
  readonly drawsSurfaceDecorations?: boolean;
}

/** Default decoration flags (full quality). */
const DRAWING_WORLD_PLAZA_TERRAIN_ELEVATION_COLUMN_DEFAULT_DRAW_OPTIONS: Required<DrawingWorldPlazaTerrainElevationColumnDrawOptions> =
  {
    drawsSurfaceDecorations: true,
  };

/**
 * Overlays the environmental hazard tint diamond on a raised surface cap so
 * elevated grass/rock tops red-shift near lava exactly like ground tiles.
 */
function drawingWorldPlazaTerrainElevationSurfaceHazardTintOnGraphics(
  graphics: Graphics,
  tileX: number,
  tileY: number,
  centerX: number,
  surfaceCenterY: number
): void {
  const hazardTint = resolvingWorldPlazaEnvironmentalHazardFloorTintAtTileIndex(
    tileX,
    tileY,
    computingWorldPlazaDayNightSunState().isDaytime
  );

  if (!hazardTint) {
    return;
  }

  const halfWidth = DEFINING_WORLD_PLAZA_ISOMETRIC_HALF_TILE_WIDTH_PX;
  const halfHeight = DEFINING_WORLD_PLAZA_ISOMETRIC_HALF_TILE_HEIGHT_PX;

  graphics
    .poly([
      centerX,
      surfaceCenterY - halfHeight,
      centerX + halfWidth,
      surfaceCenterY,
      centerX,
      surfaceCenterY + halfHeight,
      centerX - halfWidth,
      surfaceCenterY,
    ])
    .fill({ color: hazardTint.color, alpha: hazardTint.alpha });
}

/**
 * Draws a solid terrain column from the ground (layer 1) up to the surface.
 *
 * Side faces use a vertical brightness gradient (darker bases, brighter tops).
 * The top cap still uses the shared extrusion renderer.
 *
 * @param graphics - Pixi graphics instance dedicated to this tile column.
 * @param tileX - Tile column index.
 * @param tileY - Tile row index.
 * @param drawOptions - Decoration toggles for adaptive quality.
 */
export function drawingWorldPlazaTerrainElevationColumnOnGraphics(
  graphics: Graphics,
  tileX: number,
  tileY: number,
  drawOptions: DrawingWorldPlazaTerrainElevationColumnDrawOptions = {}
): void {
  const surfaceLayer =
    resolvingWorldPlazaTerrainElevationSurfaceLayerAtTileIndex(tileX, tileY);

  if (surfaceLayer <= DEFINING_WORLD_BUILDING_WORLD_LAYER_GROUND) {
    return;
  }

  const resolvedDrawOptions = {
    drawsSurfaceDecorations:
      drawOptions.drawsSurfaceDecorations ??
      DRAWING_WORLD_PLAZA_TERRAIN_ELEVATION_COLUMN_DEFAULT_DRAW_OPTIONS.drawsSurfaceDecorations,
  };
  const colors = resolvingWorldPlazaTerrainElevationBlockColorsAtTileIndex(
    tileX,
    tileY
  );
  const center = convertingWorldPlazaGridPointToIsometricScreenPoint({
    x: tileX,
    y: tileY,
  });
  const isTreeTile = checkingWorldPlazaTreeBlocksGridTile(tileX, tileY);
  const surfaceCenterY =
    center.y + computingWorldBuildingWorldLayerScreenOffsetPx(surfaceLayer);

  if (isTreeTile) {
    const terrainSideFillColor =
      resolvingWorldPlazaTerrainElevationTerrainSideFillColorAtTileIndex(
        tileX,
        tileY
      );

    drawingWorldPlazaTerrainElevationColumnDepthBandSideFacesOnGraphics({
      graphics,
      centerX: center.x,
      groundCenterY: center.y,
      surfaceLayer,
      baseSideFillColor: terrainSideFillColor,
      leftFaceNeighborSurfaceLayer:
        resolvingWorldPlazaTerrainElevationSurfaceLayerAtTileIndex(
          tileX,
          tileY + 1
        ),
      rightFaceNeighborSurfaceLayer:
        resolvingWorldPlazaTerrainElevationSurfaceLayerAtTileIndex(
          tileX + 1,
          tileY
        ),
    });

    drawingWorldBuildingIsometricTileColumnExtrusionSpanOnGraphics({
      graphics,
      tileX,
      tileY,
      worldLayer: surfaceLayer,
      blockHeightLayers: surfaceLayer,
      topFillColor: resolvingWorldPlazaGrassFloorTileFillColorAtTileIndex(
        tileX,
        tileY
      ),
      strokeColor: colors.strokeColor,
      topStrokeAlpha:
        DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_COLUMN_STROKE_ALPHA,
      drawsSideFaces: false,
    });

    drawingWorldPlazaTerrainElevationExposedCliffEdgesOnGraphics({
      graphics,
      tileX,
      tileY,
      centerX: center.x,
      groundCenterY: center.y,
      surfaceLayer,
    });

    drawingWorldPlazaTerrainElevationSurfaceHazardTintOnGraphics(
      graphics,
      tileX,
      tileY,
      center.x,
      surfaceCenterY
    );

    if (!resolvedDrawOptions.drawsSurfaceDecorations) {
      return;
    }

    drawingWorldPlazaBiomeTileSurfaceDecorationsOnGraphics({
      graphics,
      tileX,
      tileY,
      centerX: center.x,
      centerY: surfaceCenterY,
      // Flowers live on the dedicated floor overlay; caps must not bake a twin.
      drawOptions: { drawsFlowerDecorations: false },
    });

    return;
  }

  drawingWorldPlazaTerrainElevationColumnDepthBandSideFacesOnGraphics({
    graphics,
    centerX: center.x,
    groundCenterY: center.y,
    surfaceLayer,
    baseSideFillColor: colors.sideFillColor,
    leftFaceNeighborSurfaceLayer:
      resolvingWorldPlazaTerrainElevationSurfaceLayerAtTileIndex(
        tileX,
        tileY + 1
      ),
    rightFaceNeighborSurfaceLayer:
      resolvingWorldPlazaTerrainElevationSurfaceLayerAtTileIndex(
        tileX + 1,
        tileY
      ),
  });

  drawingWorldBuildingIsometricTileColumnExtrusionSpanOnGraphics({
    graphics,
    tileX,
    tileY,
    worldLayer: surfaceLayer,
    blockHeightLayers: surfaceLayer,
    topFillColor: colors.topFillColor,
    strokeColor: colors.strokeColor,
    topStrokeAlpha: DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_COLUMN_STROKE_ALPHA,
    drawsSideFaces: false,
  });

  drawingWorldPlazaTerrainElevationExposedCliffEdgesOnGraphics({
    graphics,
    tileX,
    tileY,
    centerX: center.x,
    groundCenterY: center.y,
    surfaceLayer,
  });

  // Lava tiles get a molten cap drawn into the same graphics so avatars and
  // neighboring columns depth-sort against it correctly.
  if (checkingWorldPlazaLavaAtTileIndex(tileX, tileY)) {
    drawingWorldPlazaElevatedLavaTopOnGraphics(
      graphics,
      tileX,
      tileY,
      surfaceLayer
    );

    return;
  }

  drawingWorldPlazaTerrainElevationSurfaceHazardTintOnGraphics(
    graphics,
    tileX,
    tileY,
    center.x,
    surfaceCenterY
  );

  if (!resolvedDrawOptions.drawsSurfaceDecorations) {
    return;
  }

  drawingWorldPlazaBiomeTileSurfaceDecorationsOnGraphics({
    graphics,
    tileX,
    tileY,
    centerX: center.x,
    centerY: surfaceCenterY,
    // Flowers live on the dedicated floor overlay; caps must not bake a twin.
    drawOptions: { drawsFlowerDecorations: false },
  });
}
