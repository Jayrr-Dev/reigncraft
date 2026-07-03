import {
  DEFINING_WORLD_BUILDING_WATER_STREAM_TOP_FACE_TEXTURE_FLOW_STREAK_ALPHA,
  DEFINING_WORLD_BUILDING_WATER_STREAM_TOP_FACE_TEXTURE_FLOW_STREAK_COUNT,
  DEFINING_WORLD_BUILDING_WATER_STREAM_TOP_FACE_TEXTURE_FLOW_STREAK_HALF_LENGTH_PX,
  DEFINING_WORLD_BUILDING_WATER_STREAM_TOP_FACE_TEXTURE_FLOW_STREAK_SEED_SALT,
  DEFINING_WORLD_BUILDING_WATER_STREAM_TOP_FACE_TEXTURE_FLOW_STREAK_WIDTH_PX,
  DEFINING_WORLD_BUILDING_WATER_STREAM_TOP_FACE_TEXTURE_SHIMMER_ALPHA,
  DEFINING_WORLD_BUILDING_WATER_STREAM_TOP_FACE_TEXTURE_SHIMMER_RADIUS_PX,
  DEFINING_WORLD_BUILDING_WATER_STREAM_TOP_FACE_TEXTURE_SHIMMER_SEED_SALT,
  DEFINING_WORLD_BUILDING_WATER_STREAM_TOP_FACE_TEXTURE_SHIMMER_TILE_THRESHOLD,
} from "@/components/world/building/domains/definingWorldBuildingWaterStreamTopFaceTextureConstants";
import { adjustingWorldPlazaRgbColorBrightness } from "@/components/world/domains/blendingWorldPlazaRgbColors";
import {
  DEFINING_WORLD_PLAZA_ISOMETRIC_HALF_TILE_HEIGHT_PX,
  DEFINING_WORLD_PLAZA_ISOMETRIC_HALF_TILE_WIDTH_PX,
} from "@/components/world/domains/definingWorldPlazaIsometricConstants";
import {
  mappingWorldPlazaGrassSeededUnitToFloatRange,
  seedingWorldPlazaGrassTileDecorationFromTileIndex,
} from "@/components/world/domains/seedingWorldPlazaGrassTileDecorationFromTileIndex";
import type { Graphics } from "pixi.js";

/**
 * Draws static flow streaks on one placed stream water block top face.
 *
 * @module components/world/building/domains/drawingWorldBuildingWaterStreamTopFaceTextureOnGraphics
 */

/** Flow direction angle for placed stream streaks (northeast flow). */
const DRAWING_WORLD_BUILDING_WATER_STREAM_TOP_FACE_TEXTURE_FLOW_ANGLE_RADIANS =
  Math.PI * 0.28;

/**
 * Draws flow streaks and a shimmer dot on a stream block top face.
 *
 * @param graphics - Pixi graphics instance.
 * @param tileX - Tile column index.
 * @param tileY - Tile row index.
 * @param centerX - Tile center X in screen space.
 * @param centerY - Tile center Y in screen space.
 * @param baseFillColor - Block top face fill color in 0xRRGGBB form.
 */
export function drawingWorldBuildingWaterStreamTopFaceTextureOnGraphics(
  graphics: Graphics,
  tileX: number,
  tileY: number,
  centerX: number,
  centerY: number,
  baseFillColor: number,
): void {
  const streakColor = adjustingWorldPlazaRgbColorBrightness(baseFillColor, 0.18);
  const directionX = Math.cos(
    DRAWING_WORLD_BUILDING_WATER_STREAM_TOP_FACE_TEXTURE_FLOW_ANGLE_RADIANS,
  );
  const directionY = Math.sin(
    DRAWING_WORLD_BUILDING_WATER_STREAM_TOP_FACE_TEXTURE_FLOW_ANGLE_RADIANS,
  );
  const halfStreakLengthPx =
    DEFINING_WORLD_BUILDING_WATER_STREAM_TOP_FACE_TEXTURE_FLOW_STREAK_HALF_LENGTH_PX;

  for (
    let streakIndex = 0;
    streakIndex <
    DEFINING_WORLD_BUILDING_WATER_STREAM_TOP_FACE_TEXTURE_FLOW_STREAK_COUNT;
    streakIndex += 1
  ) {
    const streakSeed = seedingWorldPlazaGrassTileDecorationFromTileIndex(
      tileX,
      tileY,
      DEFINING_WORLD_BUILDING_WATER_STREAM_TOP_FACE_TEXTURE_FLOW_STREAK_SEED_SALT +
        streakIndex,
    );
    const offsetX =
      (seedingWorldPlazaGrassTileDecorationFromTileIndex(
        tileX,
        tileY,
        1201 + streakIndex,
      ) -
        0.5) *
      DEFINING_WORLD_PLAZA_ISOMETRIC_HALF_TILE_WIDTH_PX *
      0.55;
    const offsetY =
      (seedingWorldPlazaGrassTileDecorationFromTileIndex(
        tileX,
        tileY,
        1303 + streakIndex,
      ) -
        0.5) *
      DEFINING_WORLD_PLAZA_ISOMETRIC_HALF_TILE_HEIGHT_PX *
      0.55;
    const streakCenterX = centerX + offsetX;
    const streakCenterY = centerY + offsetY;
    const streakAlpha =
      DEFINING_WORLD_BUILDING_WATER_STREAM_TOP_FACE_TEXTURE_FLOW_STREAK_ALPHA *
      mappingWorldPlazaGrassSeededUnitToFloatRange(streakSeed, 0.65, 1);

    graphics
      .moveTo(
        streakCenterX - directionX * halfStreakLengthPx,
        streakCenterY - directionY * halfStreakLengthPx,
      )
      .lineTo(
        streakCenterX + directionX * halfStreakLengthPx,
        streakCenterY + directionY * halfStreakLengthPx,
      )
      .stroke({
        width:
          DEFINING_WORLD_BUILDING_WATER_STREAM_TOP_FACE_TEXTURE_FLOW_STREAK_WIDTH_PX,
        color: streakColor,
        alpha: streakAlpha,
        cap: "round",
      });
  }

  const shimmerSeed = seedingWorldPlazaGrassTileDecorationFromTileIndex(
    tileX,
    tileY,
    DEFINING_WORLD_BUILDING_WATER_STREAM_TOP_FACE_TEXTURE_SHIMMER_SEED_SALT,
  );

  if (
    shimmerSeed <
    DEFINING_WORLD_BUILDING_WATER_STREAM_TOP_FACE_TEXTURE_SHIMMER_TILE_THRESHOLD
  ) {
    return;
  }

  const shimmerOffsetX =
    (seedingWorldPlazaGrassTileDecorationFromTileIndex(tileX, tileY, 1405) - 0.5) *
    DEFINING_WORLD_PLAZA_ISOMETRIC_HALF_TILE_WIDTH_PX *
    0.35;
  const shimmerOffsetY =
    (seedingWorldPlazaGrassTileDecorationFromTileIndex(tileX, tileY, 1507) - 0.5) *
    DEFINING_WORLD_PLAZA_ISOMETRIC_HALF_TILE_HEIGHT_PX *
    0.35;

  graphics
    .circle(
      centerX + shimmerOffsetX,
      centerY + shimmerOffsetY -
        DEFINING_WORLD_PLAZA_ISOMETRIC_HALF_TILE_HEIGHT_PX * 0.08,
      DEFINING_WORLD_BUILDING_WATER_STREAM_TOP_FACE_TEXTURE_SHIMMER_RADIUS_PX,
    )
    .fill({
      color: adjustingWorldPlazaRgbColorBrightness(baseFillColor, 0.28),
      alpha: DEFINING_WORLD_BUILDING_WATER_STREAM_TOP_FACE_TEXTURE_SHIMMER_ALPHA,
    });
}
