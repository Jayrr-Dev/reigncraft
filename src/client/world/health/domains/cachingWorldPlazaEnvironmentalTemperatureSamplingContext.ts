import type { DefiningWorldBuildingPlacedBlock } from '@/components/world/building/domains/definingWorldBuildingPlacedBlock';
import type { IndexingWorldBuildingPlacedBlocksByTile } from '@/components/world/building/domains/indexingWorldBuildingPlacedBlocksByTile';
import { resolvingWorldPlazaBlockEnvironmentalTemperatureLevel } from '@/components/world/health/domains/resolvingWorldPlazaBlockEnvironmentalTemperatureLevel';

/**
 * Scene snapshot for environmental temperature sampling outside React hooks.
 *
 * @module components/world/health/domains/cachingWorldPlazaEnvironmentalTemperatureSamplingContext
 */

export type CachingWorldPlazaEnvironmentalTemperatureSamplingContext = {
  placedBlocksByTile: IndexingWorldBuildingPlacedBlocksByTile;
  /**
   * Fire-tile keys (`tileX,tileY,worldLayer`) for campfires that are lit.
   * Campfire blocks only radiate heat while their key is present.
   */
  litCampfireTileKeys: ReadonlySet<string>;
  hasEnvironmentalHeatSources: boolean;
};

const CACHING_WORLD_PLAZA_ENVIRONMENTAL_TEMPERATURE_SAMPLING_CONTEXT_EMPTY: CachingWorldPlazaEnvironmentalTemperatureSamplingContext =
  {
    placedBlocksByTile: new Map(),
    litCampfireTileKeys: new Set(),
    hasEnvironmentalHeatSources: false,
  };

export function checkingWorldPlazaPlacedBlocksByTileHasEnvironmentalHeatSources(
  placedBlocksByTile: IndexingWorldBuildingPlacedBlocksByTile
): boolean {
  for (const placedBlocks of placedBlocksByTile.values()) {
    for (const placedBlock of placedBlocks) {
      if (
        resolvingWorldPlazaBlockEnvironmentalTemperatureLevel(placedBlock) !==
        null
      ) {
        return true;
      }
    }
  }

  return false;
}

let cachedSamplingContext: CachingWorldPlazaEnvironmentalTemperatureSamplingContext =
  CACHING_WORLD_PLAZA_ENVIRONMENTAL_TEMPERATURE_SAMPLING_CONTEXT_EMPTY;

/**
 * Updates the placed-block index and lit campfire set used when sampling tile
 * temperature.
 */
export function updatingWorldPlazaEnvironmentalTemperatureSamplingContext({
  placedBlocksByTile,
  litCampfireTileKeys = cachedSamplingContext.litCampfireTileKeys,
}: {
  placedBlocksByTile: IndexingWorldBuildingPlacedBlocksByTile;
  litCampfireTileKeys?: ReadonlySet<string>;
}): void {
  // Publish lit keys before the heat-source scan so campfire gating sees them.
  cachedSamplingContext = {
    placedBlocksByTile,
    litCampfireTileKeys,
    hasEnvironmentalHeatSources: false,
  };
  cachedSamplingContext = {
    placedBlocksByTile,
    litCampfireTileKeys,
    hasEnvironmentalHeatSources:
      checkingWorldPlazaPlacedBlocksByTileHasEnvironmentalHeatSources(
        placedBlocksByTile
      ),
  };
}

/**
 * Returns the latest placed-block index for environmental temperature sampling.
 */
export function readingWorldPlazaEnvironmentalTemperatureSamplingContext(): CachingWorldPlazaEnvironmentalTemperatureSamplingContext {
  return cachedSamplingContext;
}

/**
 * Builds a stable cache key for placed blocks that emit environmental heat.
 *
 * Lit campfires are included only while their fire cell is active; lighting or
 * extinguishing changes this key so thaw visuals refresh.
 */
export function buildingWorldPlazaPlacedEnvironmentalTemperatureBlocksCacheKey(
  blocks: readonly DefiningWorldBuildingPlacedBlock[]
): string {
  return blocks
    .filter(
      (block) =>
        resolvingWorldPlazaBlockEnvironmentalTemperatureLevel(block) !== null
    )
    .map(
      (block) =>
        `${block.tilePosition.tileX},${block.tilePosition.tileY}:${block.definitionId}:${block.blockId}`
    )
    .sort()
    .join('|');
}
