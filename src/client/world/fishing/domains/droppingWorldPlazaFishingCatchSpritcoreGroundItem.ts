/**
 * Spawns fishing-catch Spritcore as a ground item near the player.
 *
 * @module components/world/fishing/domains/droppingWorldPlazaFishingCatchSpritcoreGroundItem
 */

import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import { resolvingWorldPlazaFishingCatchGroundDropTile } from '@/components/world/fishing/domains/resolvingWorldPlazaFishingCatchGroundDropTile';
import type { ResolvingWorldPlazaFishingCatchSpritcoreDrop } from '@/components/world/fishing/domains/resolvingWorldPlazaFishingCatchSpritcoreDrop';
import { droppingWorldPlazaTreeChopGroundItem } from '@/components/world/harvest/domains/droppingWorldPlazaTreeChopWoodGroundItem';
import type { DefiningWorldPlazaGroundItem } from '@/components/world/inventory/domains/definingWorldPlazaGroundItem';
import type { PlazaSaveSlotIndex } from '../../../../shared/plazaGameSession';

export type DroppingWorldPlazaFishingCatchSpritcoreGroundItemParams = {
  readonly localPersistenceOwnerId: string | null;
  readonly redditUserId: string | null;
  readonly saveSlotIndex: PlazaSaveSlotIndex | null;
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
 * Drops the rolled Spritcore stack on a random land tile beside the player.
 */
export async function droppingWorldPlazaFishingCatchSpritcoreGroundItem(
  params: DroppingWorldPlazaFishingCatchSpritcoreGroundItemParams
): Promise<DroppingWorldPlazaFishingCatchSpritcoreGroundItemResult> {
  const dropTile = resolvingWorldPlazaFishingCatchGroundDropTile({
    playerPosition: params.playerPosition,
  });

  return droppingWorldPlazaTreeChopGroundItem({
    localPersistenceOwnerId: params.localPersistenceOwnerId,
    redditUserId: params.redditUserId,
    saveSlotIndex: params.saveSlotIndex,
    tileX: dropTile.tileX,
    tileY: dropTile.tileY,
    layer: params.layer,
    itemTypeId: params.spritcoreDrop.itemTypeId,
    quantity: params.spritcoreDrop.amount,
    playerPosition: params.playerPosition,
  });
}
