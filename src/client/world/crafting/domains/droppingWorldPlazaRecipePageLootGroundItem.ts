/**
 * Spawns a rolled leftover recipe page as a ground item.
 *
 * @module components/world/crafting/domains/droppingWorldPlazaRecipePageLootGroundItem
 */

import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import { droppingWorldPlazaTreeChopGroundItem } from '@/components/world/harvest/domains/droppingWorldPlazaTreeChopWoodGroundItem';
import type { DefiningWorldPlazaGroundItem } from '@/components/world/inventory/domains/definingWorldPlazaGroundItem';
import type { PlazaSaveSlotIndex } from '../../../../shared/plazaGameSession';

export type DroppingWorldPlazaRecipePageLootGroundItemParams = {
  readonly localPersistenceOwnerId: string | null;
  readonly redditUserId: string | null;
  readonly saveSlotIndex: PlazaSaveSlotIndex | null;
  readonly tileX: number;
  readonly tileY: number;
  readonly layer: number;
  readonly itemTypeId: string;
  readonly playerPosition: DefiningWorldPlazaWorldPoint;
};

export type DroppingWorldPlazaRecipePageLootGroundItemResult =
  | {
      readonly outcome: 'dropped';
      readonly groundItem: DefiningWorldPlazaGroundItem;
    }
  | { readonly outcome: 'failed' };

/**
 * Drops one recipe page beside harvest / kill loot.
 * Reuses the generic harvest ground-drop path.
 */
export async function droppingWorldPlazaRecipePageLootGroundItem(
  params: DroppingWorldPlazaRecipePageLootGroundItemParams
): Promise<DroppingWorldPlazaRecipePageLootGroundItemResult> {
  return droppingWorldPlazaTreeChopGroundItem({
    ...params,
    quantity: 1,
  });
}
