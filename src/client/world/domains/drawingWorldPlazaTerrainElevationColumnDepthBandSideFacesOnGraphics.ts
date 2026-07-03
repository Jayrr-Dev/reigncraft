import { computingWorldBuildingWorldLayerScreenOffsetPx } from "@/components/world/building/domains/computingWorldBuildingWorldLayerScreenOffsetPx";
import { DEFINING_WORLD_BUILDING_WORLD_LAYER_GROUND } from "@/components/world/building/domains/definingWorldBuildingWorldLayerConstants";
import { adjustingWorldPlazaRgbColorBrightness } from "@/components/world/domains/blendingWorldPlazaRgbColors";
import { computingWorldPlazaIsometricColumnSideFaceFillColorsFromBaseSideFillColor } from "@/components/world/domains/computingWorldPlazaIsometricColumnSideFaceFillColorsFromBaseSideFillColor";
import { computingWorldPlazaTerrainElevationSideFillBrightnessAdjustmentFromNormalizedElevation } from "@/components/world/domains/computingWorldPlazaTerrainElevationSideFillBrightnessAdjustmentFromNormalizedElevation";
import {
  DEFINING_WORLD_PLAZA_ISOMETRIC_HALF_TILE_HEIGHT_PX,
  DEFINING_WORLD_PLAZA_ISOMETRIC_HALF_TILE_WIDTH_PX,
} from "@/components/world/domains/definingWorldPlazaIsometricConstants";
import {
  DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_COLUMN_SIDE_FILL_ALPHA,
  DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_MAX_LAYER,
  DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_MIN_LAYER,
  DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_SIDE_FILL_ABSOLUTE_ELEVATION_BLEND_WEIGHT,
  DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_SIDE_FILL_COLUMN_DEPTH_BLEND_WEIGHT,
  DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_SIDE_FILL_DEPTH_BAND_LAYER_SPAN,
  DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_SIDE_FILL_DEPTH_BAND_MAX_COUNT,
} from "@/components/world/domains/definingWorldPlazaTerrainElevationConstants";
import type { Graphics } from "pixi.js";

/**
 * Draws terrain column side faces with a vertical brightness gradient.
 *
 * @module components/world/domains/drawingWorldPlazaTerrainElevationColumnDepthBandSideFacesOnGraphics
 */

/** Input for depth-banded terrain side faces. */
export interface DrawingWorldPlazaTerrainElevationColumnDepthBandSideFacesParams {
  readonly graphics: Graphics;
  readonly centerX: number;
  readonly groundCenterY: number;
  readonly surfaceLayer: number;
  readonly baseSideFillColor: number;
}

/**
 * Resolves the screen Y center for the top of a world layer column segment.
 *
 * @param groundCenterY - Ground tile center Y in screen space.
 * @param worldLayer - One-based world layer.
 */
function resolvingWorldPlazaTerrainElevationColumnTopCenterY(
  groundCenterY: number,
  worldLayer: number,
): number {
  if (worldLayer <= DEFINING_WORLD_BUILDING_WORLD_LAYER_GROUND) {
    return groundCenterY;
  }

  return (
    groundCenterY + computingWorldBuildingWorldLayerScreenOffsetPx(worldLayer)
  );
}

/**
 * Resolves the screen Y center for the bottom of a world layer column segment.
 *
 * @param groundCenterY - Ground tile center Y in screen space.
 * @param worldLayer - One-based world layer.
 */
function resolvingWorldPlazaTerrainElevationColumnBottomCenterY(
  groundCenterY: number,
  worldLayer: number,
): number {
  if (worldLayer <= DEFINING_WORLD_BUILDING_WORLD_LAYER_GROUND) {
    return groundCenterY;
  }

  return resolvingWorldPlazaTerrainElevationColumnTopCenterY(
    groundCenterY,
    worldLayer - 1,
  );
}

/**
 * Draws one isometric side-face pair for a vertical band on a terrain column.
 *
 * @param graphics - Pixi graphics instance.
 * @param centerX - Tile center X in screen space.
 * @param topCenterY - Top of the band in screen space.
 * @param bottomCenterY - Bottom of the band in screen space.
 * @param sideFillColor - Band side fill color.
 */
function drawingWorldPlazaTerrainElevationColumnSideFaceBandOnGraphics(
  graphics: Graphics,
  centerX: number,
  topCenterY: number,
  bottomCenterY: number,
  sideFillColor: number,
): void {
  const halfWidth = DEFINING_WORLD_PLAZA_ISOMETRIC_HALF_TILE_WIDTH_PX;
  const halfHeight = DEFINING_WORLD_PLAZA_ISOMETRIC_HALF_TILE_HEIGHT_PX;
  const { leftSideFillColor, rightSideFillColor } =
    computingWorldPlazaIsometricColumnSideFaceFillColorsFromBaseSideFillColor(
      sideFillColor,
    );

  const westTopX = centerX - halfWidth;
  const westTopY = topCenterY;
  const southTopX = centerX;
  const southTopY = topCenterY + halfHeight;
  const eastTopX = centerX + halfWidth;
  const eastTopY = topCenterY;
  const westBottomX = centerX - halfWidth;
  const westBottomY = bottomCenterY;
  const southBottomX = centerX;
  const southBottomY = bottomCenterY + halfHeight;
  const eastBottomX = centerX + halfWidth;
  const eastBottomY = bottomCenterY;

  graphics
    .poly([
      westTopX,
      westTopY,
      southTopX,
      southTopY,
      southBottomX,
      southBottomY,
      westBottomX,
      westBottomY,
    ])
    .fill({
      color: leftSideFillColor,
      alpha: DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_COLUMN_SIDE_FILL_ALPHA,
    });

  graphics
    .poly([
      southTopX,
      southTopY,
      eastTopX,
      eastTopY,
      eastBottomX,
      eastBottomY,
      southBottomX,
      southBottomY,
    ])
    .fill({
      color: rightSideFillColor,
      alpha: DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_COLUMN_SIDE_FILL_ALPHA,
    });
}

/**
 * Resolves side brightness from absolute elevation and position within the column.
 *
 * @param surfaceLayer - Surface world layer for the column.
 * @param bandMidLayer - Midpoint layer of the current depth band.
 */
function resolvingWorldPlazaTerrainElevationColumnSideFillBrightnessAdjustment(
  surfaceLayer: number,
  bandMidLayer: number,
): number {
  const elevationLayerSpan =
    DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_MAX_LAYER -
    DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_MIN_LAYER;
  const absoluteNormalizedElevation =
    elevationLayerSpan <= 0
      ? 0
      : (surfaceLayer - DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_MIN_LAYER) /
        elevationLayerSpan;
  const columnLayerSpan = Math.max(
    1,
    surfaceLayer - DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_MIN_LAYER,
  );
  const columnNormalizedElevation =
    (bandMidLayer - DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_MIN_LAYER) /
    columnLayerSpan;
  const blendedNormalizedElevation =
    columnNormalizedElevation *
      DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_SIDE_FILL_COLUMN_DEPTH_BLEND_WEIGHT +
    absoluteNormalizedElevation *
      DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_SIDE_FILL_ABSOLUTE_ELEVATION_BLEND_WEIGHT;

  return computingWorldPlazaTerrainElevationSideFillBrightnessAdjustmentFromNormalizedElevation(
    blendedNormalizedElevation,
  );
}

/**
 * Draws terrain column side faces with darker bases and brighter upper strata.
 *
 * @param params - Tile center, surface layer, and base side color.
 */
export function drawingWorldPlazaTerrainElevationColumnDepthBandSideFacesOnGraphics(
  params: DrawingWorldPlazaTerrainElevationColumnDepthBandSideFacesParams,
): void {
  const { graphics, centerX, groundCenterY, surfaceLayer, baseSideFillColor } =
    params;

  if (surfaceLayer <= DEFINING_WORLD_BUILDING_WORLD_LAYER_GROUND) {
    return;
  }

  const bandCount = Math.min(
    DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_SIDE_FILL_DEPTH_BAND_MAX_COUNT,
    Math.max(
      1,
      Math.ceil(
        surfaceLayer /
          DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_SIDE_FILL_DEPTH_BAND_LAYER_SPAN,
      ),
    ),
  );

  for (let bandIndex = 0; bandIndex < bandCount; bandIndex += 1) {
    const bandBottomLayer =
      DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_MIN_LAYER +
      Math.floor((bandIndex * (surfaceLayer - 1)) / bandCount);
    let bandTopLayer =
      DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_MIN_LAYER +
      Math.floor(((bandIndex + 1) * (surfaceLayer - 1)) / bandCount);

    if (bandIndex === bandCount - 1) {
      bandTopLayer = surfaceLayer;
    }

    if (bandTopLayer <= bandBottomLayer) {
      continue;
    }

    const bandMidLayer = (bandBottomLayer + bandTopLayer) / 2;
    const brightnessAdjustment =
      resolvingWorldPlazaTerrainElevationColumnSideFillBrightnessAdjustment(
        surfaceLayer,
        bandMidLayer,
      );
    const bandSideFillColor = adjustingWorldPlazaRgbColorBrightness(
      baseSideFillColor,
      brightnessAdjustment,
    );
    const bandTopCenterY = resolvingWorldPlazaTerrainElevationColumnTopCenterY(
      groundCenterY,
      bandTopLayer,
    );
    const bandBottomCenterY =
      bandBottomLayer <= DEFINING_WORLD_BUILDING_WORLD_LAYER_GROUND
        ? groundCenterY
        : resolvingWorldPlazaTerrainElevationColumnBottomCenterY(
            groundCenterY,
            bandBottomLayer,
          );

    drawingWorldPlazaTerrainElevationColumnSideFaceBandOnGraphics(
      graphics,
      centerX,
      bandTopCenterY,
      bandBottomCenterY,
      bandSideFillColor,
    );
  }
}
