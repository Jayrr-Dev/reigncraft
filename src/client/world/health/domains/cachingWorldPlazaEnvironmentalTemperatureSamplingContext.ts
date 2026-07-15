import type { DefiningWorldBuildingPlacedBlock } from '@/components/world/building/domains/definingWorldBuildingPlacedBlock';
import type { IndexingWorldBuildingPlacedBlocksByTile } from '@/components/world/building/domains/indexingWorldBuildingPlacedBlocksByTile';
import { gettingWorldPlazaActiveOreSmeltingHeatTilesCacheKey } from '@/components/world/crafting/domains/managingWorldPlazaActiveOreSmeltingHeatTilesStore';
import { gettingWorldPlazaLitCampfireHeatTilesCacheKey } from '@/components/world/fire/domains/managingWorldPlazaLitCampfireHeatTilesStore';
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
  if (gettingWorldPlazaLitCampfireHeatTilesCacheKey().length > 0) {
    return true;
  }

  if (gettingWorldPlazaActiveOreSmeltingHeatTilesCacheKey().length > 0) {
    return true;
  }

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
 * Identity-scoped heat-emitter key so terrain ticks skip filter/map/sort when
 * the placed-block array reference is unchanged.
 */
const CACHING_WORLD_PLAZA_PLACED_BLOCK_HEAT_KEY_BY_BLOCKS = new WeakMap<
  readonly DefiningWorldBuildingPlacedBlock[],
  string
>();

/**
 * Builds a stable cache key for placed blocks that emit environmental heat.
 */
export function buildingWorldPlazaPlacedEnvironmentalTemperatureBlocksCacheKey(
  blocks: readonly DefiningWorldBuildingPlacedBlock[]
): string {
  let placedBlockHeatKey =
    CACHING_WORLD_PLAZA_PLACED_BLOCK_HEAT_KEY_BY_BLOCKS.get(blocks);

  if (placedBlockHeatKey === undefined) {
    placedBlockHeatKey = blocks
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
    CACHING_WORLD_PLAZA_PLACED_BLOCK_HEAT_KEY_BY_BLOCKS.set(
      blocks,
      placedBlockHeatKey
    );
  }

  const litCampfireHeatKey = gettingWorldPlazaLitCampfireHeatTilesCacheKey();
  const activeOreSmeltingHeatKey =
    gettingWorldPlazaActiveOreSmeltingHeatTilesCacheKey();

  if (
    placedBlockHeatKey.length === 0 &&
    litCampfireHeatKey.length === 0 &&
    activeOreSmeltingHeatKey.length === 0
  ) {
    return '';
  }

  return `${placedBlockHeatKey}|lit:${litCampfireHeatKey}|smelt:${activeOreSmeltingHeatKey}`;
}
