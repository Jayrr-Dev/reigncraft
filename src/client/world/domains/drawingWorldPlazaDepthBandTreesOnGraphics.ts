import type { BuildingWorldPlazaVisibleTreeDrawEntry } from "@/components/world/domains/buildingWorldPlazaVisibleTreeDrawEntries";
import { drawingWorldPlazaTreeOnGraphicsAtScreenPoint } from "@/components/world/domains/drawingWorldPlazaTreeOnGraphics";
import type { Graphics } from "pixi.js";

/**
 * Draws all trees in one depth band onto a shared Graphics instance.
 *
 * @module components/world/domains/drawingWorldPlazaDepthBandTreesOnGraphics
 */

/**
 * Draws every tree entry in a band (caller clears the Graphics first).
 *
 * @param graphics - Target Pixi Graphics for this depth band.
 * @param bandEntries - Trees belonging to the band, sorted back-to-front.
 */
export function drawingWorldPlazaDepthBandTreesOnGraphics(
  graphics: Graphics,
  bandEntries: readonly BuildingWorldPlazaVisibleTreeDrawEntry[],
): void {
  for (const entry of bandEntries) {
    drawingWorldPlazaTreeOnGraphicsAtScreenPoint(
      graphics,
      entry.tree,
      entry.baseScreenX,
      entry.baseScreenY + entry.elevationOffsetYPx,
    );
  }
}
