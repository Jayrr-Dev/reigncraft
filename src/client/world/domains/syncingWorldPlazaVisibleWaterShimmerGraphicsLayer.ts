import { DEFINING_WORLD_PLAZA_WATER_SHIMMER_LAYER_Z_INDEX } from "@/components/world/domains/definingWorldPlazaWaterConstants";
import { drawingWorldPlazaWaterShimmerOnGraphics } from "@/components/world/domains/drawingWorldPlazaWaterShimmerOnGraphics";
import type { DefiningWorldPlazaVisibleTileBounds } from "@/components/world/domains/definingWorldPlazaVisibleTileBounds";
import { Graphics } from "pixi.js";

/**
 * Maintains one shimmer overlay graphics child for visible water tiles.
 *
 * @module components/world/domains/syncingWorldPlazaVisibleWaterShimmerGraphicsLayer
 */

/** Input for {@link updatingWorldPlazaVisibleWaterShimmerGraphicsLayer}. */
export interface UpdatingWorldPlazaVisibleWaterShimmerGraphicsLayerInput {
  readonly shimmerGraphics: Graphics;
  readonly bounds: DefiningWorldPlazaVisibleTileBounds;
  readonly animationTimeMs: number;
}

/**
 * Clears and redraws the shimmer overlay for the current visible bounds.
 *
 * @param input - Shimmer graphics instance, bounds, and animation clock.
 */
export function updatingWorldPlazaVisibleWaterShimmerGraphicsLayer(
  input: UpdatingWorldPlazaVisibleWaterShimmerGraphicsLayerInput,
): void {
  input.shimmerGraphics.clear();
  drawingWorldPlazaWaterShimmerOnGraphics(
    input.shimmerGraphics,
    input.bounds,
    input.animationTimeMs,
  );
}

/**
 * Creates the shimmer overlay graphics child when missing.
 *
 * @param parentContainer - Floor layer container that owns floor chunks.
 * @param shimmerGraphics - Existing shimmer graphics, if any.
 */
export function ensuringWorldPlazaVisibleWaterShimmerGraphicsLayer(
  parentContainer: { addChild: (child: Graphics) => void },
  shimmerGraphics: Graphics | null,
): Graphics {
  if (shimmerGraphics) {
    return shimmerGraphics;
  }

  const createdShimmerGraphics = new Graphics();
  createdShimmerGraphics.eventMode = "none";
  createdShimmerGraphics.zIndex = DEFINING_WORLD_PLAZA_WATER_SHIMMER_LAYER_Z_INDEX;
  parentContainer.addChild(createdShimmerGraphics);

  return createdShimmerGraphics;
}
