import {
  DEFINING_WORLD_BUILDING_PINE_WOOD_PLANK_TEXTURE_GROOVE_ALPHA,
  DEFINING_WORLD_BUILDING_PINE_WOOD_PLANK_TEXTURE_GROOVE_DARKEN_AMOUNT,
  DEFINING_WORLD_BUILDING_PINE_WOOD_PLANK_TEXTURE_GROOVE_LINE_WIDTH_PX,
  DEFINING_WORLD_BUILDING_PINE_WOOD_PLANK_TEXTURE_JOINT_ALPHA,
  DEFINING_WORLD_BUILDING_PINE_WOOD_PLANK_TEXTURE_JOINT_DARKEN_AMOUNT,
  DEFINING_WORLD_BUILDING_PINE_WOOD_PLANK_TEXTURE_JOINT_LINE_WIDTH_PX,
  DEFINING_WORLD_BUILDING_PINE_WOOD_PLANK_TEXTURE_JOINT_SEED_SALT,
  DEFINING_WORLD_BUILDING_PINE_WOOD_PLANK_TEXTURE_NOISE_DARKEN_AMOUNT,
  DEFINING_WORLD_BUILDING_PINE_WOOD_PLANK_TEXTURE_NOISE_LIGHTEN_AMOUNT,
  DEFINING_WORLD_BUILDING_PINE_WOOD_PLANK_TEXTURE_NOISE_SEED_SALT,
  DEFINING_WORLD_BUILDING_PINE_WOOD_PLANK_TEXTURE_NOISE_SPECK_ALPHA,
  DEFINING_WORLD_BUILDING_PINE_WOOD_PLANK_TEXTURE_NOISE_SPECK_COUNT_PER_ROW,
  DEFINING_WORLD_BUILDING_PINE_WOOD_PLANK_TEXTURE_NOISE_SPECK_RADIUS_PX,
  DEFINING_WORLD_BUILDING_PINE_WOOD_PLANK_TEXTURE_ROW_COUNT,
} from "@/components/world/building/domains/definingWorldBuildingPineWoodTopFaceTextureConstants";
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
 * Shared Minecraft-style plank line drawing for pine block faces.
 *
 * @module components/world/building/domains/drawingWorldBuildingPineWoodPlankTextureOnGraphics
 */

/** Screen-space point for plank geometry helpers. */
interface DrawingWorldBuildingPineWoodPlankTexturePoint {
  readonly x: number;
  readonly y: number;
}

/**
 * Linearly interpolates between two numeric values.
 *
 * @param startValue - Start value.
 * @param endValue - End value.
 * @param mixRatio - Blend weight in [0, 1].
 */
function drawingWorldBuildingPineWoodPlankTextureLerp(
  startValue: number,
  endValue: number,
  mixRatio: number,
): number {
  return startValue + (endValue - startValue) * mixRatio;
}

/**
 * Interpolates between two screen points.
 *
 * @param startPoint - Start point.
 * @param endPoint - End point.
 * @param mixRatio - Blend weight in [0, 1].
 */
function drawingWorldBuildingPineWoodPlankTextureLerpPoint(
  startPoint: DrawingWorldBuildingPineWoodPlankTexturePoint,
  endPoint: DrawingWorldBuildingPineWoodPlankTexturePoint,
  mixRatio: number,
): DrawingWorldBuildingPineWoodPlankTexturePoint {
  return {
    x: drawingWorldBuildingPineWoodPlankTextureLerp(
      startPoint.x,
      endPoint.x,
      mixRatio,
    ),
    y: drawingWorldBuildingPineWoodPlankTextureLerp(
      startPoint.y,
      endPoint.y,
      mixRatio,
    ),
  };
}

/**
 * Resolves a point on a parallelogram face from edge mix ratios.
 *
 * @param cornerWestTop - West top corner.
 * @param cornerSouthTop - South top corner.
 * @param cornerSouthBottom - South bottom corner.
 * @param cornerWestBottom - West bottom corner.
 * @param horizontalMix - 0 at west edge, 1 at south edge.
 * @param verticalMix - 0 at top edge, 1 at bottom edge.
 */
function resolvingWorldBuildingPineWoodPlankParallelogramPoint(
  cornerWestTop: DrawingWorldBuildingPineWoodPlankTexturePoint,
  cornerSouthTop: DrawingWorldBuildingPineWoodPlankTexturePoint,
  cornerSouthBottom: DrawingWorldBuildingPineWoodPlankTexturePoint,
  cornerWestBottom: DrawingWorldBuildingPineWoodPlankTexturePoint,
  horizontalMix: number,
  verticalMix: number,
): DrawingWorldBuildingPineWoodPlankTexturePoint {
  const topEdgePoint = drawingWorldBuildingPineWoodPlankTextureLerpPoint(
    cornerWestTop,
    cornerSouthTop,
    horizontalMix,
  );
  const bottomEdgePoint = drawingWorldBuildingPineWoodPlankTextureLerpPoint(
    cornerWestBottom,
    cornerSouthBottom,
    horizontalMix,
  );

  return drawingWorldBuildingPineWoodPlankTextureLerpPoint(
    topEdgePoint,
    bottomEdgePoint,
    verticalMix,
  );
}

/**
 * Draws one plank line segment.
 *
 * @param graphics - Pixi graphics instance.
 * @param startPoint - Segment start.
 * @param endPoint - Segment end.
 * @param strokeColor - Line color.
 * @param strokeAlpha - Line opacity.
 * @param strokeWidthPx - Line width in pixels.
 */
function drawingWorldBuildingPineWoodPlankLineOnGraphics(
  graphics: Graphics,
  startPoint: DrawingWorldBuildingPineWoodPlankTexturePoint,
  endPoint: DrawingWorldBuildingPineWoodPlankTexturePoint,
  strokeColor: number,
  strokeAlpha: number,
  strokeWidthPx: number,
): void {
  graphics
    .moveTo(startPoint.x, startPoint.y)
    .lineTo(endPoint.x, endPoint.y)
    .stroke({
      width: strokeWidthPx,
      color: strokeColor,
      alpha: strokeAlpha,
      cap: "square",
      join: "miter",
    });
}

/**
 * Draws staggered joints and noise inside one plank row band.
 *
 * @param graphics - Pixi graphics instance.
 * @param tileX - Tile column index.
 * @param tileY - Tile row index.
 * @param faceSalt - Face discriminator for seeding.
 * @param rowIndex - Plank row index within the current band.
 * @param cornerWestTop - West top corner.
 * @param cornerSouthTop - South top corner.
 * @param cornerSouthBottom - South bottom corner.
 * @param cornerWestBottom - West bottom corner.
 * @param verticalMixStart - Top of the row band in [0, 1].
 * @param verticalMixEnd - Bottom of the row band in [0, 1].
 * @param baseFillColor - Base plank fill color.
 */
function drawingWorldBuildingPineWoodPlankRowDetailsOnGraphics(
  graphics: Graphics,
  tileX: number,
  tileY: number,
  faceSalt: number,
  rowIndex: number,
  cornerWestTop: DrawingWorldBuildingPineWoodPlankTexturePoint,
  cornerSouthTop: DrawingWorldBuildingPineWoodPlankTexturePoint,
  cornerSouthBottom: DrawingWorldBuildingPineWoodPlankTexturePoint,
  cornerWestBottom: DrawingWorldBuildingPineWoodPlankTexturePoint,
  verticalMixStart: number,
  verticalMixEnd: number,
  baseFillColor: number,
): void {
  const jointMix = mappingWorldPlazaGrassSeededUnitToFloatRange(
    seedingWorldPlazaGrassTileDecorationFromTileIndex(
      tileX,
      tileY,
      DEFINING_WORLD_BUILDING_PINE_WOOD_PLANK_TEXTURE_JOINT_SEED_SALT +
        faceSalt +
        rowIndex * 17,
    ),
    0.18,
    0.82,
  );
  const jointColor = adjustingWorldPlazaRgbColorBrightness(
    baseFillColor,
    DEFINING_WORLD_BUILDING_PINE_WOOD_PLANK_TEXTURE_JOINT_DARKEN_AMOUNT,
  );
  const jointStart = resolvingWorldBuildingPineWoodPlankParallelogramPoint(
    cornerWestTop,
    cornerSouthTop,
    cornerSouthBottom,
    cornerWestBottom,
    jointMix,
    verticalMixStart,
  );
  const jointEnd = resolvingWorldBuildingPineWoodPlankParallelogramPoint(
    cornerWestTop,
    cornerSouthTop,
    cornerSouthBottom,
    cornerWestBottom,
    jointMix,
    verticalMixEnd,
  );

  drawingWorldBuildingPineWoodPlankLineOnGraphics(
    graphics,
    jointStart,
    jointEnd,
    jointColor,
    DEFINING_WORLD_BUILDING_PINE_WOOD_PLANK_TEXTURE_JOINT_ALPHA,
    DEFINING_WORLD_BUILDING_PINE_WOOD_PLANK_TEXTURE_JOINT_LINE_WIDTH_PX,
  );

  for (
    let speckIndex = 0;
    speckIndex <
    DEFINING_WORLD_BUILDING_PINE_WOOD_PLANK_TEXTURE_NOISE_SPECK_COUNT_PER_ROW;
    speckIndex += 1
  ) {
    const speckSeed = seedingWorldPlazaGrassTileDecorationFromTileIndex(
      tileX,
      tileY,
      DEFINING_WORLD_BUILDING_PINE_WOOD_PLANK_TEXTURE_NOISE_SEED_SALT +
        faceSalt +
        rowIndex * 31 +
        speckIndex,
    );
    const speckHorizontalMix = mappingWorldPlazaGrassSeededUnitToFloatRange(
      speckSeed,
      0.08,
      0.92,
    );
    const speckVerticalMix = mappingWorldPlazaGrassSeededUnitToFloatRange(
      seedingWorldPlazaGrassTileDecorationFromTileIndex(
        tileX,
        tileY,
        900 + faceSalt + rowIndex * 13 + speckIndex,
      ),
      verticalMixStart + 0.08,
      verticalMixEnd - 0.08,
    );
    const speckPoint = resolvingWorldBuildingPineWoodPlankParallelogramPoint(
      cornerWestTop,
      cornerSouthTop,
      cornerSouthBottom,
      cornerWestBottom,
      speckHorizontalMix,
      speckVerticalMix,
    );
    const speckColor = adjustingWorldPlazaRgbColorBrightness(
      baseFillColor,
      speckSeed > 0.5
        ? DEFINING_WORLD_BUILDING_PINE_WOOD_PLANK_TEXTURE_NOISE_LIGHTEN_AMOUNT
        : DEFINING_WORLD_BUILDING_PINE_WOOD_PLANK_TEXTURE_NOISE_DARKEN_AMOUNT,
    );

    graphics
      .circle(
        speckPoint.x,
        speckPoint.y,
        DEFINING_WORLD_BUILDING_PINE_WOOD_PLANK_TEXTURE_NOISE_SPECK_RADIUS_PX,
      )
      .fill({
        color: speckColor,
        alpha: DEFINING_WORLD_BUILDING_PINE_WOOD_PLANK_TEXTURE_NOISE_SPECK_ALPHA,
      });
  }
}

/**
 * Draws Minecraft-style plank grooves, joints, and noise on a parallelogram face.
 *
 * @param graphics - Pixi graphics instance.
 * @param tileX - Tile column index.
 * @param tileY - Tile row index.
 * @param faceSalt - Face discriminator for seeding.
 * @param cornerWestTop - West top corner.
 * @param cornerSouthTop - South top corner.
 * @param cornerSouthBottom - South bottom corner.
 * @param cornerWestBottom - West bottom corner.
 * @param verticalMixStart - Top of the drawable band in [0, 1].
 * @param verticalMixEnd - Bottom of the drawable band in [0, 1].
 * @param baseFillColor - Base plank fill color.
 */
function drawingWorldBuildingPineWoodPlankParallelogramBandOnGraphics(
  graphics: Graphics,
  tileX: number,
  tileY: number,
  faceSalt: number,
  cornerWestTop: DrawingWorldBuildingPineWoodPlankTexturePoint,
  cornerSouthTop: DrawingWorldBuildingPineWoodPlankTexturePoint,
  cornerSouthBottom: DrawingWorldBuildingPineWoodPlankTexturePoint,
  cornerWestBottom: DrawingWorldBuildingPineWoodPlankTexturePoint,
  verticalMixStart: number,
  verticalMixEnd: number,
  baseFillColor: number,
): void {
  const grooveColor = adjustingWorldPlazaRgbColorBrightness(
    baseFillColor,
    DEFINING_WORLD_BUILDING_PINE_WOOD_PLANK_TEXTURE_GROOVE_DARKEN_AMOUNT,
  );
  const rowCount = DEFINING_WORLD_BUILDING_PINE_WOOD_PLANK_TEXTURE_ROW_COUNT;
  const bandHeight = verticalMixEnd - verticalMixStart;

  for (let grooveIndex = 1; grooveIndex < rowCount; grooveIndex += 1) {
    const verticalMix =
      verticalMixStart + (bandHeight * grooveIndex) / rowCount;
    const grooveStart = resolvingWorldBuildingPineWoodPlankParallelogramPoint(
      cornerWestTop,
      cornerSouthTop,
      cornerSouthBottom,
      cornerWestBottom,
      0,
      verticalMix,
    );
    const grooveEnd = resolvingWorldBuildingPineWoodPlankParallelogramPoint(
      cornerWestTop,
      cornerSouthTop,
      cornerSouthBottom,
      cornerWestBottom,
      1,
      verticalMix,
    );

    drawingWorldBuildingPineWoodPlankLineOnGraphics(
      graphics,
      grooveStart,
      grooveEnd,
      grooveColor,
      DEFINING_WORLD_BUILDING_PINE_WOOD_PLANK_TEXTURE_GROOVE_ALPHA,
      DEFINING_WORLD_BUILDING_PINE_WOOD_PLANK_TEXTURE_GROOVE_LINE_WIDTH_PX,
    );
  }

  for (let rowIndex = 0; rowIndex < rowCount; rowIndex += 1) {
    const rowVerticalMixStart =
      verticalMixStart + (bandHeight * rowIndex) / rowCount;
    const rowVerticalMixEnd =
      verticalMixStart + (bandHeight * (rowIndex + 1)) / rowCount;

    drawingWorldBuildingPineWoodPlankRowDetailsOnGraphics(
      graphics,
      tileX,
      tileY,
      faceSalt,
      rowIndex,
      cornerWestTop,
      cornerSouthTop,
      cornerSouthBottom,
      cornerWestBottom,
      rowVerticalMixStart,
      rowVerticalMixEnd,
      baseFillColor,
    );
  }
}

/**
 * Draws Minecraft-style planks on an isometric top diamond face.
 *
 * @param graphics - Pixi graphics instance.
 * @param tileX - Tile column index.
 * @param tileY - Tile row index.
 * @param centerX - Tile center X in screen space.
 * @param centerY - Tile center Y in screen space.
 * @param baseFillColor - Base plank fill color.
 * @param halfWidthPx - Diamond half width, defaults to a full tile.
 * @param halfHeightPx - Diamond half height, defaults to a full tile.
 */
export function drawingWorldBuildingPineWoodPlankTopFaceOnGraphics(
  graphics: Graphics,
  tileX: number,
  tileY: number,
  centerX: number,
  centerY: number,
  baseFillColor: number,
  halfWidthPx: number = DEFINING_WORLD_PLAZA_ISOMETRIC_HALF_TILE_WIDTH_PX,
  halfHeightPx: number = DEFINING_WORLD_PLAZA_ISOMETRIC_HALF_TILE_HEIGHT_PX,
): void {
  const halfWidth = halfWidthPx;
  const halfHeight = halfHeightPx;
  const grooveColor = adjustingWorldPlazaRgbColorBrightness(
    baseFillColor,
    DEFINING_WORLD_BUILDING_PINE_WOOD_PLANK_TEXTURE_GROOVE_DARKEN_AMOUNT,
  );
  const rowCount = DEFINING_WORLD_BUILDING_PINE_WOOD_PLANK_TEXTURE_ROW_COUNT;
  const usableHalfHeight = halfHeight * 0.92;

  for (let grooveIndex = 1; grooveIndex < rowCount; grooveIndex += 1) {
    const rowOffsetY =
      -usableHalfHeight +
      ((usableHalfHeight * 2) * grooveIndex) / rowCount;
    const normalizedRow = Math.abs(rowOffsetY) / halfHeight;

    if (normalizedRow >= 1) {
      continue;
    }

    const rowHalfWidth = halfWidth * (1 - normalizedRow);
    const rowCenterY = centerY + rowOffsetY;

    graphics
      .moveTo(centerX - rowHalfWidth, rowCenterY)
      .lineTo(centerX + rowHalfWidth, rowCenterY)
      .stroke({
        width: DEFINING_WORLD_BUILDING_PINE_WOOD_PLANK_TEXTURE_GROOVE_LINE_WIDTH_PX,
        color: grooveColor,
        alpha: DEFINING_WORLD_BUILDING_PINE_WOOD_PLANK_TEXTURE_GROOVE_ALPHA,
        cap: "square",
      });
  }

  for (let rowIndex = 0; rowIndex < rowCount; rowIndex += 1) {
    const rowStartOffsetY =
      -usableHalfHeight + ((usableHalfHeight * 2) * rowIndex) / rowCount;
    const rowEndOffsetY =
      -usableHalfHeight + ((usableHalfHeight * 2) * (rowIndex + 1)) / rowCount;
    const jointMix = mappingWorldPlazaGrassSeededUnitToFloatRange(
      seedingWorldPlazaGrassTileDecorationFromTileIndex(
        tileX,
        tileY,
        DEFINING_WORLD_BUILDING_PINE_WOOD_PLANK_TEXTURE_JOINT_SEED_SALT +
          rowIndex * 17,
      ),
      0.18,
      0.82,
    );
    const jointColor = adjustingWorldPlazaRgbColorBrightness(
      baseFillColor,
      DEFINING_WORLD_BUILDING_PINE_WOOD_PLANK_TEXTURE_JOINT_DARKEN_AMOUNT,
    );
    const startNormalized = Math.abs(rowStartOffsetY) / halfHeight;
    const endNormalized = Math.abs(rowEndOffsetY) / halfHeight;

    if (startNormalized >= 1 || endNormalized >= 1) {
      continue;
    }

    const startHalfWidth = halfWidth * (1 - startNormalized);
    const endHalfWidth = halfWidth * (1 - endNormalized);
    const jointStartX = drawingWorldBuildingPineWoodPlankTextureLerp(
      centerX - startHalfWidth,
      centerX + startHalfWidth,
      jointMix,
    );
    const jointEndX = drawingWorldBuildingPineWoodPlankTextureLerp(
      centerX - endHalfWidth,
      centerX + endHalfWidth,
      jointMix,
    );

    drawingWorldBuildingPineWoodPlankLineOnGraphics(
      graphics,
      { x: jointStartX, y: centerY + rowStartOffsetY },
      { x: jointEndX, y: centerY + rowEndOffsetY },
      jointColor,
      DEFINING_WORLD_BUILDING_PINE_WOOD_PLANK_TEXTURE_JOINT_ALPHA,
      DEFINING_WORLD_BUILDING_PINE_WOOD_PLANK_TEXTURE_JOINT_LINE_WIDTH_PX,
    );

    for (
      let speckIndex = 0;
      speckIndex <
      DEFINING_WORLD_BUILDING_PINE_WOOD_PLANK_TEXTURE_NOISE_SPECK_COUNT_PER_ROW;
      speckIndex += 1
    ) {
      const speckSeed = seedingWorldPlazaGrassTileDecorationFromTileIndex(
        tileX,
        tileY,
        DEFINING_WORLD_BUILDING_PINE_WOOD_PLANK_TEXTURE_NOISE_SEED_SALT +
          rowIndex * 31 +
          speckIndex,
      );
      const speckVerticalMix = mappingWorldPlazaGrassSeededUnitToFloatRange(
        speckSeed,
        rowStartOffsetY + usableHalfHeight * 0.04,
        rowEndOffsetY - usableHalfHeight * 0.04,
      );
      const speckNormalized = Math.abs(speckVerticalMix) / halfHeight;

      if (speckNormalized >= 1) {
        continue;
      }

      const speckHalfWidth = halfWidth * (1 - speckNormalized);
      const speckHorizontalMix = mappingWorldPlazaGrassSeededUnitToFloatRange(
        seedingWorldPlazaGrassTileDecorationFromTileIndex(
          tileX,
          tileY,
          1100 + rowIndex * 13 + speckIndex,
        ),
        0.08,
        0.92,
      );
      const speckX = drawingWorldBuildingPineWoodPlankTextureLerp(
        centerX - speckHalfWidth,
        centerX + speckHalfWidth,
        speckHorizontalMix,
      );
      const speckColor = adjustingWorldPlazaRgbColorBrightness(
        baseFillColor,
        speckSeed > 0.5
          ? DEFINING_WORLD_BUILDING_PINE_WOOD_PLANK_TEXTURE_NOISE_LIGHTEN_AMOUNT
          : DEFINING_WORLD_BUILDING_PINE_WOOD_PLANK_TEXTURE_NOISE_DARKEN_AMOUNT,
      );

      graphics
        .circle(
          speckX,
          centerY + speckVerticalMix,
          DEFINING_WORLD_BUILDING_PINE_WOOD_PLANK_TEXTURE_NOISE_SPECK_RADIUS_PX,
        )
        .fill({
          color: speckColor,
          alpha:
            DEFINING_WORLD_BUILDING_PINE_WOOD_PLANK_TEXTURE_NOISE_SPECK_ALPHA,
        });
    }
  }
}

/**
 * Draws Minecraft-style planks on one isometric column side face.
 *
 * @param graphics - Pixi graphics instance.
 * @param tileX - Tile column index.
 * @param tileY - Tile row index.
 * @param faceSalt - Face discriminator for seeding.
 * @param cornerWestTop - West top corner.
 * @param cornerSouthTop - South top corner.
 * @param cornerSouthBottom - South bottom corner.
 * @param cornerWestBottom - West bottom corner.
 * @param baseFillColor - Base plank fill color.
 */
export function drawingWorldBuildingPineWoodPlankSideFaceOnGraphics(
  graphics: Graphics,
  tileX: number,
  tileY: number,
  faceSalt: number,
  cornerWestTop: DrawingWorldBuildingPineWoodPlankTexturePoint,
  cornerSouthTop: DrawingWorldBuildingPineWoodPlankTexturePoint,
  cornerSouthBottom: DrawingWorldBuildingPineWoodPlankTexturePoint,
  cornerWestBottom: DrawingWorldBuildingPineWoodPlankTexturePoint,
  baseFillColor: number,
): void {
  drawingWorldBuildingPineWoodPlankParallelogramBandOnGraphics(
    graphics,
    tileX,
    tileY,
    faceSalt,
    cornerWestTop,
    cornerSouthTop,
    cornerSouthBottom,
    cornerWestBottom,
    0,
    1,
    baseFillColor,
  );
}
