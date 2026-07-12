import {
  DEFINING_WORLD_BUILDING_BLOCK_ID_UTILITY_CAMPFIRE,
  resolvingWorldBuildingBlockDefinition,
} from '@/components/world/building/domains/definingWorldBuildingBlockRegistry';
import type { DefiningWorldBuildingPlacedBlock } from '@/components/world/building/domains/definingWorldBuildingPlacedBlock';
import { checkingWorldPlazaCampfireBlockEmitsEnvironmentalHeat } from '@/components/world/health/domains/checkingWorldPlazaCampfireBlockEmitsEnvironmentalHeat';
import type { DefiningWorldPlazaEnvironmentalTemperatureLevel } from '@/components/world/health/domains/definingWorldPlazaTemperatureTypes';

/**
 * Reads assignable temperature levels from a block definition.
 *
 * Campfires only radiate heat while lit (active campfire fire cell).
 */
export function resolvingWorldPlazaBlockEnvironmentalTemperatureLevel(
  block: DefiningWorldBuildingPlacedBlock
): DefiningWorldPlazaEnvironmentalTemperatureLevel | null {
  const definition = resolvingWorldBuildingBlockDefinition(block.definitionId);
  const level = definition?.environmentalTemperature ?? null;

  if (level === null) {
    return null;
  }

  if (
    block.definitionId === DEFINING_WORLD_BUILDING_BLOCK_ID_UTILITY_CAMPFIRE &&
    !checkingWorldPlazaCampfireBlockEmitsEnvironmentalHeat(block)
  ) {
    return null;
  }

  return level;
}

/**
 * Collects temperature levels from all blocks on one tile.
 */
export function listingWorldPlazaBlockEnvironmentalTemperatureLevelsAtTile(
  placedBlocks: readonly DefiningWorldBuildingPlacedBlock[]
): DefiningWorldPlazaEnvironmentalTemperatureLevel[] {
  const levels: DefiningWorldPlazaEnvironmentalTemperatureLevel[] = [];

  for (const block of placedBlocks) {
    const level = resolvingWorldPlazaBlockEnvironmentalTemperatureLevel(block);

    if (level) {
      levels.push(level);
    }
  }

  return levels;
}
