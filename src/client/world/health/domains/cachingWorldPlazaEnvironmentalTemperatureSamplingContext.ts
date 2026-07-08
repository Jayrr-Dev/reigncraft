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
  hasEnvironmentalHeatSources: boolean;
};

const CACHING_WORLD_PLAZA_ENVIRONMENTAL_TEMPERATURE_SAMPLING_CONTEXT_EMPTY: CachingWorldPlazaEnvironmentalTemperatureSamplingContext =
  {
    placedBlocksByTile: new Map(),
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
 * Updates the placed-block index used when sampling tile temperature.
 */
export function updatingWorldPlazaEnvironmentalTemperatureSamplingContext({
  placedBlocksByTile,
}: Pick<
  CachingWorldPlazaEnvironmentalTemperatureSamplingContext,
  'placedBlocksByTile'
>): void {
  cachedSamplingContext = {
    placedBlocksByTile,
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
