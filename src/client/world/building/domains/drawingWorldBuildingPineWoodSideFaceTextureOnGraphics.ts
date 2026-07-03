import {
  DEFINING_WORLD_BUILDING_PINE_WOOD_SIDE_FACE_TEXTURE_LEFT_FACE_SALT,
  DEFINING_WORLD_BUILDING_PINE_WOOD_SIDE_FACE_TEXTURE_MIN_COLUMN_HEIGHT_PX,
  DEFINING_WORLD_BUILDING_PINE_WOOD_SIDE_FACE_TEXTURE_RIGHT_FACE_SALT,
} from "@/components/world/building/domains/definingWorldBuildingPineWoodTopFaceTextureConstants";
import { drawingWorldBuildingPineWoodPlankSideFaceOnGraphics } from "@/components/world/building/domains/drawingWorldBuildingPineWoodPlankTextureOnGraphics";
import { DEFINING_WORLD_BUILDING_WORLD_LAYER_HEIGHT_PX } from "@/components/world/building/domains/definingWorldBuildingWorldLayerConstants";
import {
  DEFINING_WORLD_PLAZA_ISOMETRIC_HALF_TILE_HEIGHT_PX,
  DEFINING_WORLD_PLAZA_ISOMETRIC_HALF_TILE_WIDTH_PX,
} from "@/components/world/domains/definingWorldPlazaIsometricConstants";
import type { Graphics } from "pixi.js";

/**
 * Draws Minecraft-style pine planks on isometric column side faces.
 *
 * @module components/world/building/domains/drawingWorldBuildingPineWoodSideFaceTextureOnGraphics
 */

/**
 * Draws one vertical stack of four plank rows on a side face band.
 *
 * @param graphics - Pixi graphics instance.
 * @param tileX - Tile column index.
 * @param tileY - Tile row index.
 * @param faceSalt - Face discriminator for seeding.
 * @param cornerWestTop - West top corner.
 * @param cornerSouthTop - South top corner.
 * @param cornerSouthBottom - South bottom corner.
 * @param cornerWestBottom - West bottom corner.
 * @param verticalMixStart - Top of the band in [0, 1].
 * @param verticalMixEnd - Bottom of the band in [0, 1].
 * @param baseFillColor - Base plank fill color.
 */
function drawingWorldBuildingPineWoodSideFacePlankBandOnGraphics(
  graphics: Graphics,
  tileX: number,
  tileY: number,
  faceSalt: number,
  cornerWestTop: { readonly x: number; readonly y: number },
  cornerSouthTop: { readonly x: number; readonly y: number },
  cornerSouthBottom: { readonly x: number; readonly y: number },
  cornerWestBottom: { readonly x: number; readonly y: number },
  verticalMixStart: number,
  verticalMixEnd: number,
  baseFillColor: number,
): void {
  const bandWestTop = {
    x: cornerWestTop.x + (cornerWestBottom.x - cornerWestTop.x) * verticalMixStart,
    y: cornerWestTop.y + (cornerWestBottom.y - cornerWestTop.y) * verticalMixStart,
  };
  const bandSouthTop = {
    x: cornerSouthTop.x + (cornerSouthBottom.x - cornerSouthTop.x) * verticalMixStart,
    y: cornerSouthTop.y + (cornerSouthBottom.y - cornerSouthTop.y) * verticalMixStart,
  };
  const bandSouthBottom = {
    x: cornerSouthTop.x + (cornerSouthBottom.x - cornerSouthTop.x) * verticalMixEnd,
    y: cornerSouthTop.y + (cornerSouthBottom.y - cornerSouthTop.y) * verticalMixEnd,
  };
  const bandWestBottom = {
    x: cornerWestTop.x + (cornerWestBottom.x - cornerWestTop.x) * verticalMixEnd,
    y: cornerWestTop.y + (cornerWestBottom.y - cornerWestTop.y) * verticalMixEnd,
  };

  drawingWorldBuildingPineWoodPlankSideFaceOnGraphics(
    graphics,
    tileX,
    tileY,
    faceSalt,
    bandWestTop,
    bandSouthTop,
    bandSouthBottom,
    bandWestBottom,
    baseFillColor,
  );
}

/**
 * Draws pine plank grooves, joints, and noise on the left and right column faces.
 *
 * @param graphics - Pixi graphics instance.
 * @param tileX - Tile column index.
 * @param tileY - Tile row index.
 * @param centerX - Tile center X in screen space.
 * @param topCenterY - Top face center Y.
 * @param bottomCenterY - Bottom face center Y.
 * @param baseFillColor - Block top face fill color in 0xRRGGBB form.
 */
export function drawingWorldBuildingPineWoodSideFaceTextureOnGraphics(
  graphics: Graphics,
  tileX: number,
  tileY: number,
  centerX: number,
  topCenterY: number,
  bottomCenterY: number,
  baseFillColor: number,
): void {
  if (
    Math.abs(topCenterY - bottomCenterY) <
    DEFINING_WORLD_BUILDING_PINE_WOOD_SIDE_FACE_TEXTURE_MIN_COLUMN_HEIGHT_PX
  ) {
    return;
  }

  const halfWidth = DEFINING_WORLD_PLAZA_ISOMETRIC_HALF_TILE_WIDTH_PX;
  const halfHeight = DEFINING_WORLD_PLAZA_ISOMETRIC_HALF_TILE_HEIGHT_PX;
  const columnSpanPx =
    Math.abs(topCenterY - bottomCenterY) + halfHeight * 2;
  const plankBandCount = Math.max(
    1,
    Math.round(columnSpanPx / DEFINING_WORLD_BUILDING_WORLD_LAYER_HEIGHT_PX),
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

  const leftWestTop = { x: westTopX, y: westTopY };
  const leftSouthTop = { x: southTopX, y: southTopY };
  const leftSouthBottom = { x: southBottomX, y: southBottomY };
  const leftWestBottom = { x: westBottomX, y: westBottomY };
  const rightSouthTop = { x: southTopX, y: southTopY };
  const rightEastTop = { x: eastTopX, y: eastTopY };
  const rightEastBottom = { x: eastBottomX, y: eastBottomY };
  const rightSouthBottom = { x: southBottomX, y: southBottomY };

  for (let bandIndex = 0; bandIndex < plankBandCount; bandIndex += 1) {
    const verticalMixStart = bandIndex / plankBandCount;
    const verticalMixEnd = (bandIndex + 1) / plankBandCount;

    drawingWorldBuildingPineWoodSideFacePlankBandOnGraphics(
      graphics,
      tileX,
      tileY,
      DEFINING_WORLD_BUILDING_PINE_WOOD_SIDE_FACE_TEXTURE_LEFT_FACE_SALT +
        bandIndex * 101,
      leftWestTop,
      leftSouthTop,
      leftSouthBottom,
      leftWestBottom,
      verticalMixStart,
      verticalMixEnd,
      baseFillColor,
    );

    drawingWorldBuildingPineWoodSideFacePlankBandOnGraphics(
      graphics,
      tileX,
      tileY,
      DEFINING_WORLD_BUILDING_PINE_WOOD_SIDE_FACE_TEXTURE_RIGHT_FACE_SALT +
        bandIndex * 101,
      rightSouthTop,
      rightEastTop,
      rightEastBottom,
      rightSouthBottom,
      verticalMixStart,
      verticalMixEnd,
      baseFillColor,
    );
  }
}
