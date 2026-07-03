import { DEFINING_WORLD_PLAZA_WATER_SURFACE_LAYER_Z_INDEX } from "@/components/world/domains/definingWorldPlazaWaterConstants";
import type { DefiningWorldPlazaVisibleTileBounds } from "@/components/world/domains/definingWorldPlazaVisibleTileBounds";
import { drawingWorldPlazaVisibleWaterOnGraphics } from "@/components/world/domains/drawingWorldPlazaVisibleWaterOnGraphics";
import { Graphics } from "pixi.js";

/**
 * Maintains one translucent water surface overlay above the textured floor.
 *
 * The overlay is a single graphics child of the floor layer with a z-index high
 * enough to render above every floor chunk, so the baked ground texture stays
 * visible through the merged translucent water fill.
 *
 * @module components/world/domains/syncingWorldPlazaVisibleWaterSurfaceGraphicsLayer
 */

/** Input for {@link updatingWorldPlazaVisibleWaterSurfaceGraphicsLayer}. */
export interface UpdatingWorldPlazaVisibleWaterSurfaceGraphicsLayerInput {
  readonly surfaceGraphics: Graphics;
  readonly bounds: DefiningWorldPlazaVisibleTileBounds;
}

/**
 * Clears and redraws the water surface overlay for the current visible bounds.
 *
 * @param input - Surface graphics instance and visible bounds.
 */
export function updatingWorldPlazaVisibleWaterSurfaceGraphicsLayer(
  input: UpdatingWorldPlazaVisibleWaterSurfaceGraphicsLayerInput,
): void {
  input.surfaceGraphics.clear();
  drawingWorldPlazaVisibleWaterOnGraphics(input.surfaceGraphics, input.bounds);
}

/**
 * Creates the water surface overlay graphics child when missing.
 *
 * @param parentContainer - Floor layer container that owns floor chunks.
 * @param surfaceGraphics - Existing surface graphics, if any.
 */
export function ensuringWorldPlazaVisibleWaterSurfaceGraphicsLayer(
  parentContainer: { addChild: (child: Graphics) => void },
  surfaceGraphics: Graphics | null,
): Graphics {
  if (surfaceGraphics) {
    return surfaceGraphics;
  }

  const createdSurfaceGraphics = new Graphics();
  createdSurfaceGraphics.eventMode = "none";
  createdSurfaceGraphics.zIndex =
    DEFINING_WORLD_PLAZA_WATER_SURFACE_LAYER_Z_INDEX;
  parentContainer.addChild(createdSurfaceGraphics);

  return createdSurfaceGraphics;
}
