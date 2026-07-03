import { drawingWorldBuildingPineWoodPlankTopFaceOnGraphics } from "@/components/world/building/domains/drawingWorldBuildingPineWoodPlankTextureOnGraphics";
import type { Graphics } from "pixi.js";

/**
 * Draws Minecraft-style pine planks on one isometric block top face.
 *
 * @module components/world/building/domains/drawingWorldBuildingPineWoodTopFaceTextureOnGraphics
 */

/**
 * Draws pine plank grooves, joints, and noise on a block top face.
 *
 * @param graphics - Pixi graphics instance.
 * @param tileX - Tile column index.
 * @param tileY - Tile row index.
 * @param centerX - Tile center X in screen space.
 * @param centerY - Tile center Y in screen space.
 * @param baseFillColor - Block top face fill color in 0xRRGGBB form.
 */
export function drawingWorldBuildingPineWoodTopFaceTextureOnGraphics(
  graphics: Graphics,
  tileX: number,
  tileY: number,
  centerX: number,
  centerY: number,
  baseFillColor: number,
): void {
  drawingWorldBuildingPineWoodPlankTopFaceOnGraphics(
    graphics,
    tileX,
    tileY,
    centerX,
    centerY,
    baseFillColor,
  );
}
