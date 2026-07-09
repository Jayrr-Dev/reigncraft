import type { WorldInventoryDevvitGroundItemRow } from './worldInventoryDevvit';
import { WORLD_INVENTORY_DEVVIT_GROUND_ITEM_DESPAWN_MS } from './worldInventoryDevvit';

/**
 * True when a ground stack has lived past the shared despawn lifetime.
 */
export function checkingWorldInventoryGroundItemIsExpired(
  groundItem: Pick<WorldInventoryDevvitGroundItemRow, 'spawnedAt'>,
  nowMs: number
): boolean {
  return (
    groundItem.spawnedAt + WORLD_INVENTORY_DEVVIT_GROUND_ITEM_DESPAWN_MS <=
    nowMs
  );
}
