import { buildingWorldPlazaVisibleTreeDrawEntries } from "@/components/world/domains/buildingWorldPlazaVisibleTreeDrawEntries";
import { drawingWorldPlazaTreeOnGraphicsAtScreenPoint } from "@/components/world/domains/drawingWorldPlazaTreeOnGraphics";
import type { DefiningWorldPlazaVisibleTileBounds } from "@/components/world/domains/definingWorldPlazaVisibleTileBounds";
import type { Graphics } from "pixi.js";

/**
 * Batched viewport tree drawing (one Graphics, many trees).
 *
 * @module components/world/domains/drawingWorldPlazaVisibleTreesOnGraphics
 */

/**
 * Draws every visible tree onto a single Graphics instance.
 *
 * Prefer per-tree entity-layer sprites with {@link resolvingWorldPlazaTreeTrunkEntityZIndex}
 * for depth sorting; this helper remains for single-layer batch draws.
 *
 * @param graphics - Target Pixi Graphics (caller clears before calling).
 * @param bounds - Visible tile index range.
 */
export function drawingWorldPlazaVisibleTreesOnGraphics(
  graphics: Graphics,
  bounds: DefiningWorldPlazaVisibleTileBounds,
): void {
  const drawEntries = buildingWorldPlazaVisibleTreeDrawEntries(bounds);

  if (drawEntries.length === 0) {
    return;
  }

  drawEntries.sort(
    (entryA, entryB) => entryA.baseScreenY - entryB.baseScreenY,
  );

  for (const entry of drawEntries) {
    drawingWorldPlazaTreeOnGraphicsAtScreenPoint(
      graphics,
      entry.tree,
      entry.baseScreenX,
      entry.baseScreenY + entry.elevationOffsetYPx,
    );
  }
}
