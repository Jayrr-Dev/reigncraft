import { buildingWorldPlazaVisibleTreeDrawEntries } from "@/components/world/domains/buildingWorldPlazaVisibleTreeDrawEntries";
import { drawingWorldPlazaTreeTrunkOnGraphicsAtScreenPoint } from "@/components/world/domains/drawingWorldPlazaTreeOnGraphics";
import type { DefiningWorldPlazaVisibleTileBounds } from "@/components/world/domains/definingWorldPlazaVisibleTileBounds";
import type { Graphics } from "pixi.js";

/**
 * Batched trunk + shadow drawing for the floor layer.
 *
 * @module components/world/domains/drawingWorldPlazaVisibleTreeTrunksOnGraphics
 */

/**
 * Draws every visible tree trunk onto one Graphics instance.
 *
 * @param graphics - Target Pixi Graphics (caller clears before calling).
 * @param bounds - Visible tile index range.
 */
export function drawingWorldPlazaVisibleTreeTrunksOnGraphics(
  graphics: Graphics,
  bounds: DefiningWorldPlazaVisibleTileBounds,
): void {
  const drawEntries = buildingWorldPlazaVisibleTreeDrawEntries(bounds);

  drawEntries.sort(
    (entryA, entryB) => entryA.baseScreenY - entryB.baseScreenY,
  );

  for (const entry of drawEntries) {
    drawingWorldPlazaTreeTrunkOnGraphicsAtScreenPoint(
      graphics,
      entry.tree,
      entry.baseScreenX,
      entry.baseScreenY + entry.elevationOffsetYPx,
    );
  }
}
