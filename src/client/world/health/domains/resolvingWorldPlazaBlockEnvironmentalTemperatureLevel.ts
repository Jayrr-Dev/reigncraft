import { resolvingWorldBuildingBlockDefinition } from '@/components/world/building/domains/definingWorldBuildingBlockRegistry';
import type { DefiningWorldBuildingPlacedBlock } from '@/components/world/building/domains/definingWorldBuildingPlacedBlock';
import type { DefiningWorldPlazaEnvironmentalTemperatureLevel } from '@/components/world/health/domains/definingWorldPlazaTemperatureTypes';

/**
 * Reads assignable temperature levels from a block definition.
 */
export function resolvingWorldPlazaBlockEnvironmentalTemperatureLevel(
  block: DefiningWorldBuildingPlacedBlock
): DefiningWorldPlazaEnvironmentalTemperatureLevel | null {
  const definition = resolvingWorldBuildingBlockDefinition(block.definitionId);

  return definition?.environmentalTemperature ?? null;
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
