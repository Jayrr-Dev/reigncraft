import { DEFINING_WORLD_BUILDING_BLOCK_ID_UTILITY_CAMPFIRE } from '@/components/world/building/domains/definingWorldBuildingBlockRegistry';
import {
  resolvingWorldBuildingPlacedBlockWorldLayer,
  type DefiningWorldBuildingPlacedBlock,
} from '@/components/world/building/domains/definingWorldBuildingPlacedBlock';
import { readingWorldPlazaEnvironmentalTemperatureSamplingContext } from '@/components/world/health/domains/cachingWorldPlazaEnvironmentalTemperatureSamplingContext';
import { buildingWorldFireDevvitTileKey } from '../../../../shared/worldFireDevvit';

/**
 * Returns true when a campfire block should radiate environmental heat.
 *
 * Unlit / extinguished campfires keep their placed block but emit no heat.
 * Non-campfire blocks always return false here (caller handles other sources).
 */
export function checkingWorldPlazaCampfireBlockEmitsEnvironmentalHeat(
  block: DefiningWorldBuildingPlacedBlock
): boolean {
  if (
    block.definitionId !== DEFINING_WORLD_BUILDING_BLOCK_ID_UTILITY_CAMPFIRE
  ) {
    return false;
  }

  const litCampfireTileKeys =
    readingWorldPlazaEnvironmentalTemperatureSamplingContext()
      .litCampfireTileKeys;
  const tileKey = buildingWorldFireDevvitTileKey(
    block.tilePosition.tileX,
    block.tilePosition.tileY,
    resolvingWorldBuildingPlacedBlockWorldLayer(block)
  );

  return litCampfireTileKeys.has(tileKey);
}
