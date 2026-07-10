import { creatingWorldBuildingPlacedBlockGroundShadowBlurFilter } from '@/components/world/building/domains/creatingWorldBuildingPlacedBlockGroundShadowBlurFilter';
import type { Filter, Graphics } from 'pixi.js';

/**
 * Applies blur filters to the placed block ground shadow graphics instance.
 *
 * Pixi React does not always forward the `filters` JSX prop to Graphics, so
 * filters are assigned directly on the instance inside the draw callback.
 *
 * @module components/world/building/domains/applyingWorldBuildingPlacedBlockGroundShadowFiltersOnGraphics
 */

/** One blur filter per graphics instance; Pixi filters must not be shared. */
const APPLYING_WORLD_BUILDING_PLACED_BLOCK_GROUND_SHADOW_BLUR_FILTER_BY_GRAPHICS =
  new WeakMap<Graphics, Filter>();

/**
 * Ensures the shadow graphics has the soft-edge blur filter attached.
 *
 * @param graphics - Target graphics instance.
 */
export function applyingWorldBuildingPlacedBlockGroundShadowFiltersOnGraphics(
  graphics: Graphics
): void {
  let blurFilter =
    APPLYING_WORLD_BUILDING_PLACED_BLOCK_GROUND_SHADOW_BLUR_FILTER_BY_GRAPHICS.get(
      graphics
    ) ?? null;

  if (!blurFilter) {
    blurFilter = creatingWorldBuildingPlacedBlockGroundShadowBlurFilter();
    APPLYING_WORLD_BUILDING_PLACED_BLOCK_GROUND_SHADOW_BLUR_FILTER_BY_GRAPHICS.set(
      graphics,
      blurFilter
    );
  }

  const currentFilters = graphics.filters as Filter[] | null;

  if (currentFilters?.length === 1 && currentFilters[0] === blurFilter) {
    return;
  }

  graphics.filters = [blurFilter];
}

/**
 * Removes blur filters from a shadow graphics instance.
 *
 * @param graphics - Target graphics instance.
 */
export function clearingWorldBuildingPlacedBlockGroundShadowFiltersOnGraphics(
  graphics: Graphics
): void {
  const currentFilters = graphics.filters as Filter[] | null | undefined;

  if (currentFilters == null || currentFilters.length === 0) {
    return;
  }

  graphics.filters = [];
}
