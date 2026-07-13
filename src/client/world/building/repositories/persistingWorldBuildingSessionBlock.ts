import type { DefiningWorldBuildingPlacedBlock } from '@/components/world/building/domains/definingWorldBuildingPlacedBlock';
import {
  resolvingWorldBuildingPlacedBlockBlockHeight,
  resolvingWorldBuildingPlacedBlockWorldLayer,
} from '@/components/world/building/domains/definingWorldBuildingPlacedBlock';
import { placingWorldBuildingDevvitSessionBlock } from '@/components/world/building/repositories/callingWorldBuildingDevvitApi';
import { WORLD_BUILDING_DEVVIT_SESSION_BLOCKS_API_PATH } from '../../../../shared/worldBuildingDevvit';

/**
 * Persists a session block to the Devvit world-building API.
 *
 * @module components/world/building/repositories/persistingWorldBuildingSessionBlock
 */

/**
 * Writes one session block row to Redis through the Devvit API.
 *
 * @param block - Local session block entity to persist.
 */
export async function persistingWorldBuildingSessionBlock(
  block: DefiningWorldBuildingPlacedBlock,
): Promise<void> {
  await placingWorldBuildingDevvitSessionBlock(
    WORLD_BUILDING_DEVVIT_SESSION_BLOCKS_API_PATH,
    {
      blockId: block.blockId,
      definitionId: block.definitionId,
      tileX: block.tilePosition.tileX,
      tileY: block.tilePosition.tileY,
      worldLayer: resolvingWorldBuildingPlacedBlockWorldLayer(block),
      blockHeight: resolvingWorldBuildingPlacedBlockBlockHeight(block),
      placedAt: block.placedAt,
      metadata: block.metadata,
    },
  );
}
