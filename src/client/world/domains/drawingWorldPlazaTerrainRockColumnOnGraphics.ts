import { computingWorldBuildingWorldLayerScreenOffsetPx } from "@/components/world/building/domains/computingWorldBuildingWorldLayerScreenOffsetPx";
import { DEFINING_WORLD_BUILDING_WORLD_LAYER_GROUND } from "@/components/world/building/domains/definingWorldBuildingWorldLayerConstants";
import { adjustingWorldPlazaRgbColorBrightness } from "@/components/world/domains/blendingWorldPlazaRgbColors";
import { convertingWorldPlazaGridPointToIsometricScreenPoint } from "@/components/world/domains/convertingWorldPlazaGridPointToIsometricScreenPoint";
import {
  DEFINING_WORLD_PLAZA_ISOMETRIC_HALF_TILE_HEIGHT_PX,
  DEFINING_WORLD_PLAZA_ISOMETRIC_HALF_TILE_WIDTH_PX,
} from "@/components/world/domains/definingWorldPlazaIsometricConstants";
import {
  DEFINING_WORLD_PLAZA_TERRAIN_ROCK_BOULDER_BASE_FACET_BRIGHTNESS,
  DEFINING_WORLD_PLAZA_TERRAIN_ROCK_BOULDER_CRACK_ALPHA,
  DEFINING_WORLD_PLAZA_TERRAIN_ROCK_BOULDER_CRACK_WIDTH_PX,
  DEFINING_WORLD_PLAZA_TERRAIN_ROCK_BOULDER_CROWN_FACET_BRIGHTNESS,
  DEFINING_WORLD_PLAZA_TERRAIN_ROCK_BOULDER_OUTLINE_ALPHA,
  DEFINING_WORLD_PLAZA_TERRAIN_ROCK_BOULDER_OUTLINE_WIDTH_PX,
  DEFINING_WORLD_PLAZA_TERRAIN_ROCK_BOULDER_PEAK_OFFSET_SCALE,
  DEFINING_WORLD_PLAZA_TERRAIN_ROCK_BOULDER_PEAK_RAISE_SCALE,
  DEFINING_WORLD_PLAZA_TERRAIN_ROCK_BOULDER_TOP_FACET_BRIGHTNESS,
  DEFINING_WORLD_PLAZA_TERRAIN_ROCK_BOULDER_VERTEX_JITTER_SCALE,
  DEFINING_WORLD_PLAZA_TERRAIN_ROCK_COLUMN_SCREEN_OFFSET_Y_PX,
  DEFINING_WORLD_PLAZA_TERRAIN_ROCK_COLUMN_SIDE_FILL_ALPHA,
  DEFINING_WORLD_PLAZA_TERRAIN_ROCK_COLUMN_TOP_FILL_ALPHA,
  aligningWorldPlazaTerrainRockChunkSpecToSurfaceLayer,
  listingWorldPlazaTerrainRockChunkSpecsForShapeVariant,
  type DefiningWorldPlazaTerrainRockChunkSpec,
} from "@/components/world/domains/definingWorldPlazaTerrainRockConstants";
import type { DefiningWorldPlazaStoneDecoration } from "@/components/world/domains/resolvingWorldPlazaStoneDecorationAtTileIndex";
import { resolvingWorldPlazaTerrainElevationSurfaceLayerAtTileIndex } from "@/components/world/domains/resolvingWorldPlazaTerrainElevationAtTileIndex";
import type { Graphics } from "pixi.js";

/**
 * Draws procedural rounded boulders at H4 and H5 with faceted cartoon shading.
 *
 * @module components/world/domains/drawingWorldPlazaTerrainRockColumnOnGraphics
 */

/** Stroke color derived from a rock body fill. */
const DRAWING_WORLD_PLAZA_TERRAIN_ROCK_COLUMN_STROKE_CHANNEL_MULTIPLIER = 0.55;

/**
 * Returns a darker stroke color from the rock body fill.
 *
 * @param bodyColor - Rock body fill in 0xRRGGBB form.
 */
function computingWorldPlazaTerrainRockColumnStrokeColor(bodyColor: number): number {
  const redChannel = (bodyColor >> 16) & 0xff;
  const greenChannel = (bodyColor >> 8) & 0xff;
  const blueChannel = bodyColor & 0xff;
  const multiplier = DRAWING_WORLD_PLAZA_TERRAIN_ROCK_COLUMN_STROKE_CHANNEL_MULTIPLIER;

  const strokeRed = Math.max(
    0,
    Math.min(255, Math.floor(redChannel * multiplier)),
  );
  const strokeGreen = Math.max(
    0,
    Math.min(255, Math.floor(greenChannel * multiplier)),
  );
  const strokeBlue = Math.max(
    0,
    Math.min(255, Math.floor(blueChannel * multiplier)),
  );

  return (strokeRed << 16) | (strokeGreen << 8) | strokeBlue;
}

/**
 * Resolves screen Y for one world layer top face at a ground anchor.
 *
 * @param groundCenterY - Tile ground center Y in screen space.
 * @param worldLayer - One-based world layer.
 */
function resolvingWorldPlazaTerrainRockColumnTopCenterY(
  groundCenterY: number,
  worldLayer: number,
): number {
  return (
    groundCenterY + computingWorldBuildingWorldLayerScreenOffsetPx(worldLayer)
  );
}

/**
 * Resolves screen Y where a rock chunk meets the walkable landscape surface.
 *
 * @param groundCenterY - Tile ground center Y in screen space.
 * @param bottomWorldLayer - Absolute walkable surface world layer under the rock.
 */
function resolvingWorldPlazaTerrainRockColumnBottomCenterY(
  groundCenterY: number,
  bottomWorldLayer: number,
): number {
  if (bottomWorldLayer <= DEFINING_WORLD_BUILDING_WORLD_LAYER_GROUND) {
    return groundCenterY;
  }

  return resolvingWorldPlazaTerrainRockColumnTopCenterY(
    groundCenterY,
    bottomWorldLayer,
  );
}

/**
 * Returns a deterministic unit float in [0, 1) from rounded screen coords.
 *
 * @param seedX - Rounded screen X seed.
 * @param seedY - Rounded screen Y seed.
 * @param salt - Per-vertex salt so each point jitters independently.
 */
function seedingWorldPlazaTerrainRockBoulderUnit(
  seedX: number,
  seedY: number,
  salt: number,
): number {
  const raw = Math.sin(seedX * 127.1 + seedY * 311.7 + salt * 74.7) * 43758.5453;

  return raw - Math.floor(raw);
}

/**
 * Draws one rounded, faceted boulder chunk grounded on the terrain surface.
 *
 * The silhouette is a domed polygon resting on the front half of the tile
 * diamond. A lit cap facet, a small specular crown, and a shaded base give the
 * stone its volume, finished with a dark cartoon outline and crack seams.
 *
 * @param graphics - Pixi graphics instance.
 * @param groundCenterX - Tile ground center X in screen space.
 * @param groundCenterY - Tile ground center Y in screen space.
 * @param chunkSpec - Scaled chunk placement and layer span.
 * @param bodyFillColor - Mid body fill color.
 * @param strokeColor - Silhouette outline color.
 */
function drawingWorldPlazaScaledTerrainRockChunkOnGraphics(
  graphics: Graphics,
  groundCenterX: number,
  groundCenterY: number,
  chunkSpec: DefiningWorldPlazaTerrainRockChunkSpec,
  bodyFillColor: number,
  strokeColor: number,
): void {
  const centerX = groundCenterX + chunkSpec.offsetScreenX;
  const centerY = groundCenterY + chunkSpec.offsetScreenY;
  const halfWidth =
    DEFINING_WORLD_PLAZA_ISOMETRIC_HALF_TILE_WIDTH_PX * chunkSpec.halfWidthScale;
  const halfHeight =
    DEFINING_WORLD_PLAZA_ISOMETRIC_HALF_TILE_HEIGHT_PX *
    chunkSpec.halfHeightScale;
  const bottomWorldLayer = Math.max(
    DEFINING_WORLD_BUILDING_WORLD_LAYER_GROUND,
    chunkSpec.bottomWorldLayer,
  );
  const topWorldLayer = Math.max(bottomWorldLayer, chunkSpec.topWorldLayer);
  const topCenterY = resolvingWorldPlazaTerrainRockColumnTopCenterY(
    centerY,
    topWorldLayer,
  );
  const bottomCenterY = resolvingWorldPlazaTerrainRockColumnBottomCenterY(
    centerY,
    bottomWorldLayer,
  );

  if (topCenterY === bottomCenterY) {
    return;
  }

  const seedX = Math.round(centerX);
  const seedY = Math.round(topCenterY);
  const jitter = (salt: number): number =>
    (seedingWorldPlazaTerrainRockBoulderUnit(seedX, seedY, salt) * 2 - 1) *
    halfWidth *
    DEFINING_WORLD_PLAZA_TERRAIN_ROCK_BOULDER_VERTEX_JITTER_SCALE;

  const baseY = bottomCenterY;
  const peakY =
    topCenterY -
    halfHeight * DEFINING_WORLD_PLAZA_TERRAIN_ROCK_BOULDER_PEAK_RAISE_SCALE;
  const peakX =
    centerX +
    (seedingWorldPlazaTerrainRockBoulderUnit(seedX, seedY, 9) * 2 - 1) *
      halfWidth *
      DEFINING_WORLD_PLAZA_TERRAIN_ROCK_BOULDER_PEAK_OFFSET_SCALE;

  const heightAt = (frac: number): number => baseY + (peakY - baseY) * frac;

  const westBaseX = centerX - halfWidth;
  const eastBaseX = centerX + halfWidth;
  const southBaseY = baseY + halfHeight;

  const leftUpperX = centerX - halfWidth * 0.78 + jitter(2);
  const leftUpperY = heightAt(0.52);
  const leftShoulderX = centerX - halfWidth * 0.42 + jitter(3);
  const leftShoulderY = heightAt(0.84);
  const rightShoulderX = centerX + halfWidth * 0.42 + jitter(5);
  const rightShoulderY = heightAt(0.86);
  const rightUpperX = centerX + halfWidth * 0.8 + jitter(6);
  const rightUpperY = heightAt(0.5);

  const silhouettePoints = [
    westBaseX,
    baseY,
    centerX,
    southBaseY,
    eastBaseX,
    baseY,
    rightUpperX,
    rightUpperY,
    rightShoulderX,
    rightShoulderY,
    peakX,
    peakY,
    leftShoulderX,
    leftShoulderY,
    leftUpperX,
    leftUpperY,
  ];

  const baseFacetColor = adjustingWorldPlazaRgbColorBrightness(
    bodyFillColor,
    DEFINING_WORLD_PLAZA_TERRAIN_ROCK_BOULDER_BASE_FACET_BRIGHTNESS,
  );
  const topFacetColor = adjustingWorldPlazaRgbColorBrightness(
    bodyFillColor,
    DEFINING_WORLD_PLAZA_TERRAIN_ROCK_BOULDER_TOP_FACET_BRIGHTNESS,
  );
  const crownFacetColor = adjustingWorldPlazaRgbColorBrightness(
    bodyFillColor,
    DEFINING_WORLD_PLAZA_TERRAIN_ROCK_BOULDER_CROWN_FACET_BRIGHTNESS,
  );
  const northBaseY = baseY - halfHeight;

  graphics
    .poly([
      centerX,
      northBaseY,
      eastBaseX,
      baseY,
      centerX,
      southBaseY,
      westBaseX,
      baseY,
    ])
    .fill({
      color: baseFacetColor,
      alpha: DEFINING_WORLD_PLAZA_TERRAIN_ROCK_COLUMN_SIDE_FILL_ALPHA,
    });

  graphics.poly(silhouettePoints).fill({
    color: bodyFillColor,
    alpha: DEFINING_WORLD_PLAZA_TERRAIN_ROCK_COLUMN_SIDE_FILL_ALPHA,
  });

  graphics
    .poly([
      westBaseX,
      baseY,
      centerX,
      southBaseY,
      eastBaseX,
      baseY,
      rightUpperX,
      rightUpperY,
      centerX + jitter(7),
      heightAt(0.34),
      leftUpperX,
      leftUpperY,
    ])
    .fill({
      color: baseFacetColor,
      alpha: DEFINING_WORLD_PLAZA_TERRAIN_ROCK_COLUMN_SIDE_FILL_ALPHA,
    });

  graphics
    .poly([
      leftShoulderX,
      leftShoulderY,
      peakX,
      peakY,
      rightShoulderX,
      rightShoulderY,
      centerX + jitter(8),
      heightAt(0.5),
    ])
    .fill({
      color: topFacetColor,
      alpha: DEFINING_WORLD_PLAZA_TERRAIN_ROCK_COLUMN_TOP_FILL_ALPHA,
    });

  graphics
    .poly([
      peakX,
      peakY,
      peakX - halfWidth * 0.26,
      heightAt(0.72),
      peakX - halfWidth * 0.04,
      heightAt(0.68),
    ])
    .fill({
      color: crownFacetColor,
      alpha: DEFINING_WORLD_PLAZA_TERRAIN_ROCK_COLUMN_TOP_FILL_ALPHA,
    });

  graphics.poly(silhouettePoints).stroke({
    color: strokeColor,
    width: DEFINING_WORLD_PLAZA_TERRAIN_ROCK_BOULDER_OUTLINE_WIDTH_PX,
    alpha: DEFINING_WORLD_PLAZA_TERRAIN_ROCK_BOULDER_OUTLINE_ALPHA,
  });

  graphics.moveTo(peakX, peakY);
  graphics.lineTo(centerX - halfWidth * 0.2 + jitter(11), heightAt(0.28));
  graphics.moveTo(rightShoulderX, rightShoulderY);
  graphics.lineTo(centerX + halfWidth * 0.18 + jitter(12), heightAt(0.22));
  graphics.stroke({
    color: strokeColor,
    width: DEFINING_WORLD_PLAZA_TERRAIN_ROCK_BOULDER_CRACK_WIDTH_PX,
    alpha: DEFINING_WORLD_PLAZA_TERRAIN_ROCK_BOULDER_CRACK_ALPHA,
  });
}

/**
 * Draws one procedural terrain rock column for a tile.
 *
 * Mega-boulders draw once from their spacing anchor with the silhouette centered
 * on the footprint and scaled to the seeded width, height, and layer span.
 *
 * @param graphics - Pixi graphics instance dedicated to this rock tile.
 * @param tileX - Tile column index (spacing anchor).
 * @param tileY - Tile row index (spacing anchor).
 * @param decoration - Resolved stone decoration with column rock metadata.
 */
export function drawingWorldPlazaTerrainRockColumnOnGraphics(
  graphics: Graphics,
  tileX: number,
  tileY: number,
  decoration: DefiningWorldPlazaStoneDecoration,
): void {
  const surfaceWorldLayer = decoration.surfaceWorldLayer;

  if (surfaceWorldLayer === null) {
    return;
  }

  const anchorTileX = decoration.columnRockAnchorTileX ?? tileX;
  const anchorTileY = decoration.columnRockAnchorTileY ?? tileY;
  const footprintTileWidth = decoration.columnRockFootprintTileWidth ?? 1;
  const footprintTileHeight = decoration.columnRockFootprintTileHeight ?? 1;
  const footprintCenter = convertingWorldPlazaGridPointToIsometricScreenPoint({
    x: anchorTileX + (footprintTileWidth - 1) / 2,
    y: anchorTileY + (footprintTileHeight - 1) / 2,
  });
  const terrainSurfaceLayer = resolvingWorldPlazaTerrainElevationSurfaceLayerAtTileIndex(
    anchorTileX,
    anchorTileY,
  );
  const chunkSpecs = listingWorldPlazaTerrainRockChunkSpecsForShapeVariant(
    decoration.shapeVariantIndex,
    surfaceWorldLayer,
    footprintTileWidth,
    footprintTileHeight,
  ).map((chunkSpec) =>
    aligningWorldPlazaTerrainRockChunkSpecToSurfaceLayer(
      chunkSpec,
      terrainSurfaceLayer,
    ),
  );
  const bodyFillColor = decoration.bodyColor;
  const strokeColor = computingWorldPlazaTerrainRockColumnStrokeColor(
    decoration.bodyColor,
  );
  const anchorScreenX = footprintCenter.x + decoration.offsetX;
  const anchorScreenY =
    footprintCenter.y +
    decoration.offsetY +
    DEFINING_WORLD_PLAZA_TERRAIN_ROCK_COLUMN_SCREEN_OFFSET_Y_PX;

  for (const chunkSpec of chunkSpecs) {
    drawingWorldPlazaScaledTerrainRockChunkOnGraphics(
      graphics,
      anchorScreenX,
      anchorScreenY,
      chunkSpec,
      bodyFillColor,
      strokeColor,
    );
  }
}
