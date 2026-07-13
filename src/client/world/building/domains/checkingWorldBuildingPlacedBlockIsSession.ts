import type { DefiningWorldBuildingPlacedBlock } from '@/components/world/building/domains/definingWorldBuildingPlacedBlock';
import {
  DEFINING_WORLD_BUILDING_SESSION_PLOT_ID,
  WORLD_BUILDING_DEVVIT_SESSION_BLOCK_METADATA_IS_SESSION_KEY,
} from '@/components/world/building/domains/definingWorldBuildingSessionBlockConstants';

/**
 * Returns true when a placed block is session-scoped (not persisted to a claim).
 *
 * @param block - Placed block entity.
 */
export function checkingWorldBuildingPlacedBlockIsSession(
  block: DefiningWorldBuildingPlacedBlock,
): boolean {
  return (
    block.plotId === DEFINING_WORLD_BUILDING_SESSION_PLOT_ID ||
    block.metadata[WORLD_BUILDING_DEVVIT_SESSION_BLOCK_METADATA_IS_SESSION_KEY] ===
      true
  );
}
