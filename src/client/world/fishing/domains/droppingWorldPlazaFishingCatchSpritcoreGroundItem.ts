/**
 * Spawns fishing-catch Spritcore as a ground item at the cast tile.
 *
 * @module components/world/fishing/domains/droppingWorldPlazaFishingCatchSpritcoreGroundItem
 */

import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import { droppingWorldPlazaTreeChopGroundItem } from '@/components/world/harvest/domains/droppingWorldPlazaTreeChopWoodGroundItem';
import type { DefiningWorldPlazaGroundItem } from '@/components/world/inventory/domains/definingWorldPlazaGroundItem';
import type { ResolvingWorldPlazaFishingCatchSpritcoreDrop } from '@/components/world/fishing/domains/resolvingWorldPlazaFishingCatchSpritcoreDrop';
import type { PlazaSaveSlotIndex } from '../../../../shared/plazaGameSession';

export type DroppingWorldPlazaFishingCatchSpritcoreGroundItemParams = {
  readonly localPersistenceOwnerId: string | null;
  readonly redditUserId: string | null;
  readonly saveSlotIndex: PlazaSaveSlotIndex | null;
  readonly tileX: number;
  readonly tileY: number;
  readonly layer: number;
  readonly spritcoreDrop: ResolvingWorldPlazaFishingCatchSpritcoreDrop;
  readonly playerPosition: DefiningWorldPlazaWorldPoint;
};

export type DroppingWorldPlazaFishingCatchSpritcoreGroundItemResult =
  | {
      readonly outcome: 'dropped';
      readonly groundItem: DefiningWorldPlazaGroundItem;
    }
  | { readonly outcome: 'failed' };

/**
 * Drops the rolled Spritcore stack beside the fishing tile (pick up from ground).
 */
export async function droppingWorldPlazaFishingCatchSpritcoreGroundItem(
  params: DroppingWorldPlazaFishingCatchSpritcoreGroundItemParams
): Promise<DroppingWorldPlazaFishingCatchSpritcoreGroundItemResult> {
  return droppingWorldPlazaTreeChopGroundItem({
    localPersistenceOwnerId: params.localPersistenceOwnerId,
    redditUserId: params.redditUserId,
    saveSlotIndex: params.saveSlotIndex,
    tileX: params.tileX,
    tileY: params.tileY,
    layer: params.layer,
    itemTypeId: params.spritcoreDrop.itemTypeId,
    quantity: params.spritcoreDrop.amount,
    playerPosition: params.playerPosition,
  });
}
