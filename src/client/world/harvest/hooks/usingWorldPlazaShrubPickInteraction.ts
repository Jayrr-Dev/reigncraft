'use client';

import type { DefiningInventoryState } from '@/components/inventory/domains/definingInventoryItem';
import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import { recordingWorldPlazaHerbariumBerrySighted } from '@/components/world/domains/managingWorldPlazaHerbariumDiscoveryStore';
import type { DefiningWorldPlazaPickedShrubTileState } from '@/components/world/harvest/domains/managingWorldPlazaLocalPickedShrubs';
import {
  checkingWorldPlazaShrubPickEligibility,
  formattingWorldPlazaPickedShrubTileKey,
  listingWorldPlazaLocalPickedShrubs,
  pickingWorldPlazaLocalShrub,
} from '@/components/world/harvest/domains/managingWorldPlazaLocalPickedShrubs';
import { checkingWorldPlazaRuntimeShrubIsPicked } from '@/components/world/harvest/domains/registeringWorldPlazaPickedShrubsLookup';
import type { ListingWorldPlazaShrubsInInteractionRangeEntry } from '@/components/world/harvest/hooks/usingWorldPlazaShrubPickProgress';
import { addingWorldPlazaInventoryItemWithStacking } from '@/components/world/inventory/domains/addingWorldPlazaInventoryItemWithStacking';
import { resolvingWorldPlazaBerryItemTypeIdFromLootKind } from '@/components/world/inventory/domains/definingWorldPlazaInventoryBerrySpriteSheetConstants';
import { DEFINING_WORLD_PLAZA_INVENTORY_ITEM_REGISTRY } from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemTypes';
import { formattingWorldPlazaInventoryItemPickupToastMessage } from '@/components/world/inventory/domains/formattingWorldPlazaInventoryItemPickupToastMessage';
import { notifyingWorldPlazaInventoryItemAdded } from '@/components/world/inventory/domains/notifyingWorldPlazaInventoryItemAdded';
import { useQueryClient } from '@tanstack/react-query';
import { useCallback, useRef, type RefObject } from 'react';
import {
  resolvingWorldShrubBerryLootKindAtTileIndex,
  WORLD_SHRUB_BERRY_LOOT_QUANTITY,
} from '../../../../shared/worldShrubBerryLoot';

export const DEFINING_WORLD_PLAZA_PICKED_SHRUBS_QUERY_KEY_ROOT =
  'world-plaza-picked-shrubs' as const;

export type UsingWorldPlazaShrubPickInteractionParams = {
  readonly localPersistenceOwnerId: string | null;
  readonly pickedShrubStateByTileKey: ReadonlyMap<
    string,
    DefiningWorldPlazaPickedShrubTileState
  >;
  readonly playerPositionRef: RefObject<DefiningWorldPlazaWorldPoint>;
  readonly inventoryState: DefiningInventoryState;
  readonly updatingInventoryState: (
    updater: (
      currentState: DefiningInventoryState
    ) => DefiningInventoryState | null
  ) => void;
  readonly showingGameplayHudToast: (message: string) => void;
};

export type UsingWorldPlazaShrubPickInteractionResult = {
  readonly validatingShrubPickStart: (
    entry: ListingWorldPlazaShrubsInInteractionRangeEntry
  ) => boolean;
  readonly completingShrubPick: (
    entry: ListingWorldPlazaShrubsInInteractionRangeEntry
  ) => Promise<void>;
};

function probingWorldPlazaShrubPickInventoryCapacity(
  inventoryState: DefiningInventoryState,
  itemTypeId: string,
  quantity: number
): boolean {
  if (quantity <= 0) {
    return false;
  }

  const capacityProbe = addingWorldPlazaInventoryItemWithStacking(
    inventoryState,
    {
      id: 'shrub-pick-capacity-probe',
      itemTypeId,
      quantity,
    },
    DEFINING_WORLD_PLAZA_INVENTORY_ITEM_REGISTRY
  );

  return capacityProbe.quantityAccepted >= quantity;
}

/**
 * Validates and completes berry-shrub picks after the progress indicator finishes.
 */
export function usingWorldPlazaShrubPickInteraction({
  localPersistenceOwnerId,
  pickedShrubStateByTileKey,
  playerPositionRef,
  inventoryState,
  updatingInventoryState,
  showingGameplayHudToast,
}: UsingWorldPlazaShrubPickInteractionParams): UsingWorldPlazaShrubPickInteractionResult {
  const queryClient = useQueryClient();
  const isCompletionPendingRef = useRef(false);
  const inventoryStateRef = useRef(inventoryState);
  inventoryStateRef.current = inventoryState;
  const persistenceOwnerId = localPersistenceOwnerId;

  const validatingShrubPickStart = useCallback(
    (entry: ListingWorldPlazaShrubsInInteractionRangeEntry): boolean => {
      if (!persistenceOwnerId) {
        showingGameplayHudToast(
          'Berry picking is unavailable in this session.'
        );
        return false;
      }

      const playerPosition = playerPositionRef.current;

      if (!playerPosition) {
        return false;
      }

      const tileKey = formattingWorldPlazaPickedShrubTileKey(
        entry.tileX,
        entry.tileY
      );
      const lootKind = resolvingWorldShrubBerryLootKindAtTileIndex(
        entry.tileX,
        entry.tileY
      );
      const itemTypeId =
        resolvingWorldPlazaBerryItemTypeIdFromLootKind(lootKind);

      if (checkingWorldPlazaRuntimeShrubIsPicked(entry.tileX, entry.tileY)) {
        return false;
      }

      const rangeCheck = checkingWorldPlazaShrubPickEligibility({
        persistenceOwnerId,
        tileX: entry.tileX,
        tileY: entry.tileY,
        playerX: playerPosition.x,
        playerY: playerPosition.y,
        existingTileState: pickedShrubStateByTileKey.get(tileKey),
      });

      if (rangeCheck.outcome === 'out-of-range') {
        showingGameplayHudToast('Move closer to pick this shrub.');
        return false;
      }

      if (rangeCheck.outcome === 'already-picked') {
        showingGameplayHudToast('This shrub is already picked.');
        return false;
      }

      if (
        !probingWorldPlazaShrubPickInventoryCapacity(
          inventoryStateRef.current,
          itemTypeId,
          WORLD_SHRUB_BERRY_LOOT_QUANTITY
        )
      ) {
        showingGameplayHudToast('Your inventory is full.');
        return false;
      }

      return true;
    },
    [
      pickedShrubStateByTileKey,
      persistenceOwnerId,
      playerPositionRef,
      showingGameplayHudToast,
    ]
  );

  const completingShrubPick = useCallback(
    async (
      entry: ListingWorldPlazaShrubsInInteractionRangeEntry
    ): Promise<void> => {
      if (isCompletionPendingRef.current || !persistenceOwnerId) {
        return;
      }

      const playerPosition = playerPositionRef.current;

      if (!playerPosition) {
        return;
      }

      isCompletionPendingRef.current = true;

      try {
        if (checkingWorldPlazaRuntimeShrubIsPicked(entry.tileX, entry.tileY)) {
          return;
        }

        const tileKey = formattingWorldPlazaPickedShrubTileKey(
          entry.tileX,
          entry.tileY
        );
        const lootKind = resolvingWorldShrubBerryLootKindAtTileIndex(
          entry.tileX,
          entry.tileY
        );
        const itemTypeId =
          resolvingWorldPlazaBerryItemTypeIdFromLootKind(lootKind);
        const berryQuantity = WORLD_SHRUB_BERRY_LOOT_QUANTITY;

        const eligibility = checkingWorldPlazaShrubPickEligibility({
          persistenceOwnerId,
          tileX: entry.tileX,
          tileY: entry.tileY,
          playerX: playerPosition.x,
          playerY: playerPosition.y,
          existingTileState: pickedShrubStateByTileKey.get(tileKey),
        });

        if (eligibility.outcome !== 'eligible') {
          if (eligibility.outcome === 'out-of-range') {
            showingGameplayHudToast('Move closer to pick this shrub.');
          } else if (eligibility.outcome === 'already-picked') {
            showingGameplayHudToast('This shrub is already picked.');
          }

          return;
        }

        recordingWorldPlazaHerbariumBerrySighted(lootKind);

        if (
          !probingWorldPlazaShrubPickInventoryCapacity(
            inventoryStateRef.current,
            itemTypeId,
            berryQuantity
          )
        ) {
          showingGameplayHudToast('Your inventory is full.');
          return;
        }

        let quantityAccepted = 0;

        updatingInventoryState((currentState) => {
          const addResult = addingWorldPlazaInventoryItemWithStacking(
            currentState,
            {
              id: crypto.randomUUID(),
              itemTypeId,
              quantity: berryQuantity,
            },
            DEFINING_WORLD_PLAZA_INVENTORY_ITEM_REGISTRY
          );

          quantityAccepted = addResult.quantityAccepted;

          if (addResult.quantityAccepted < berryQuantity) {
            return null;
          }

          return addResult.state;
        });

        if (quantityAccepted < berryQuantity) {
          showingGameplayHudToast('Your inventory is full.');
          return;
        }

        notifyingWorldPlazaInventoryItemAdded(quantityAccepted);
        showingGameplayHudToast(
          formattingWorldPlazaInventoryItemPickupToastMessage({
            itemTypeId,
            quantity: quantityAccepted,
          })
        );

        const pickResult = pickingWorldPlazaLocalShrub(persistenceOwnerId, {
          tileX: entry.tileX,
          tileY: entry.tileY,
          playerX: playerPosition.x,
          playerY: playerPosition.y,
        });

        if (pickResult.outcome !== 'picked') {
          if (pickResult.outcome === 'out-of-range') {
            showingGameplayHudToast('Move closer to pick this shrub.');
          } else if (pickResult.outcome === 'already-picked') {
            showingGameplayHudToast('This shrub is already picked.');
          }

          return;
        }

        queryClient.setQueryData(
          [
            DEFINING_WORLD_PLAZA_PICKED_SHRUBS_QUERY_KEY_ROOT,
            persistenceOwnerId,
          ],
          listingWorldPlazaLocalPickedShrubs(persistenceOwnerId)
        );
        void queryClient.invalidateQueries({
          queryKey: [DEFINING_WORLD_PLAZA_PICKED_SHRUBS_QUERY_KEY_ROOT],
        });
      } finally {
        isCompletionPendingRef.current = false;
      }
    },
    [
      persistenceOwnerId,
      pickedShrubStateByTileKey,
      playerPositionRef,
      queryClient,
      showingGameplayHudToast,
      updatingInventoryState,
    ]
  );

  return {
    validatingShrubPickStart,
    completingShrubPick,
  };
}
