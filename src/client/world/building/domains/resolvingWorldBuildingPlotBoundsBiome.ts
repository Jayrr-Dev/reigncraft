/**
 * Resolves the dominant biome for a claimed plot region.
 *
 * @module components/world/building/domains/resolvingWorldBuildingPlotBoundsBiome
 */

import type { DefiningWorldBuildingPlotBounds } from '@/components/world/building/domains/definingWorldBuildingPlotBounds';
import type { DefiningWorldPlazaBiomeDefinition } from '@/components/world/domains/definingWorldPlazaBiomeConstants';
import { resolvingWorldPlazaBiomeAtTileIndex } from '@/components/world/domains/resolvingWorldPlazaBiomeAtTileIndex';

/**
 * Samples the biome at the center tile of one plot's bounds.
 *
 * Center-tile sampling keeps the lookup cheap (single cached noise sample)
 * while matching what the player sees standing on their plot.
 *
 * @param bounds - Inclusive plot tile bounds.
 */
export function resolvingWorldBuildingPlotBoundsBiome(
  bounds: DefiningWorldBuildingPlotBounds
): DefiningWorldPlazaBiomeDefinition {
  const centerTileX = Math.round((bounds.minTileX + bounds.maxTileX) / 2);
  const centerTileY = Math.round((bounds.minTileY + bounds.maxTileY) / 2);

  return resolvingWorldPlazaBiomeAtTileIndex(centerTileX, centerTileY);
}
