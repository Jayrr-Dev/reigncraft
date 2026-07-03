import {
  DEFINING_WORLD_BUILDING_PLACED_BLOCK_GROUND_SHADOW_BLUR_QUALITY,
  DEFINING_WORLD_BUILDING_PLACED_BLOCK_GROUND_SHADOW_BLUR_STRENGTH_PX,
} from "@/components/world/building/domains/definingWorldBuildingPlacedBlockGroundShadowConstants";
import { BlurFilter } from "pixi.js";

/**
 * Creates the shared blur filter used to soften block ground shadow edges.
 *
 * @module components/world/building/domains/creatingWorldBuildingPlacedBlockGroundShadowBlurFilter
 */

/**
 * Builds one blur filter for the placed block ground shadow layer.
 *
 * Applied to the whole shadow graphics so edges feather uniformly without
 * per-tile overlap darkening.
 */
export function creatingWorldBuildingPlacedBlockGroundShadowBlurFilter(): BlurFilter {
  return new BlurFilter({
    strength: DEFINING_WORLD_BUILDING_PLACED_BLOCK_GROUND_SHADOW_BLUR_STRENGTH_PX,
    quality: DEFINING_WORLD_BUILDING_PLACED_BLOCK_GROUND_SHADOW_BLUR_QUALITY,
  });
}
