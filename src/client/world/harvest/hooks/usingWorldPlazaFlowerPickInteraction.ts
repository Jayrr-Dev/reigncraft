'use client';

import type { DefiningInventoryState } from '@/components/inventory/domains/definingInventoryItem';
import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import { recordingWorldPlazaHerbariumFlowerStudied } from '@/components/world/domains/managingWorldPlazaHerbariumDiscoveryStore';
import type { DefiningWorldPlazaPickedFlowerTileState } from '@/components/world/harvest/domains/managingWorldPlazaLocalPickedFlowers';
import {
  checkingWorldPlazaFlowerPickEligibility,
  formattingWorldPlazaPickedFlowerTileKey,
  pickingWorldPlazaLocalFlower,
} from '@/components/world/harvest/domains/managingWorldPlazaLocalPickedFlowers';
import type { ListingWorldPlazaFlowersInInteractionRangeEntry } from '@/components/world/harvest/hooks/usingWorldPlazaFlowerPickProgress';
import {
  checkingWorldPlazaPickedFlowersUseLocalPersistence,
  DEFINING_WORLD_PLAZA_PICKED_FLOWERS_QUERY_KEY_ROOT,
} from '@/components/world/harvest/hooks/usingWorldPlazaPickedFlowers';
import { pickingWorldHarvestDevvitFlower } from '@/components/world/harvest/repositories/callingWorldHarvestDevvitApi';
import { addingWorldPlazaInventoryItemWithStacking } from '@/components/world/inventory/domains/addingWorldPlazaInventoryItemWithStacking';
import { resolvingWorldPlazaFlowerItemTypeIdFromSpeciesId } from '@/components/world/inventory/domains/definingWorldPlazaInventoryFlowerSpriteSheetConstants';
import { DEFINING_WORLD_PLAZA_INVENTORY_ITEM_REGISTRY } from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemTypes';
import { notifyingWorldPlazaInventoryItemAdded } from '@/components/world/inventory/domains/notifyingWorldPlazaInventoryItemAdded';
import { useQueryClient } from '@tanstack/react-query';
import { useCallback, useRef, type RefObject } from 'react';
import type { PlazaSaveSlotIndex } from '../../../../shared/plazaGameSession';
import { WORLD_FLOWER_PICK_QUANTITY } from '../../../../shared/worldFlowerPick';
import { resolvingWorldFlowerSpeciesAtTileIndex } from '../../../../shared/worldFlowerRarity';
import { WORLD_HARVEST_DEVVIT_PICK_FLOWER_API_PATH } from '../../../../shared/worldHarvestDevvit';

export type UsingWorldPlazaFlowerPickInteractionParams = {
  readonly localPersistenceOwnerId: string | null;
  readonly redditUserId: string | null;
  readonly saveSlotIndex: PlazaSaveSlotIndex | null;
  readonly pickedFlowerStateByTileKey: ReadonlyMap<
    string,
    DefiningWorldPlazaPickedFlowerTileState
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

export type UsingWorldPlazaFlowerPickInteractionResult = {
  readonly validatingFlowerPickStart: (
    entry: ListingWorldPlazaFlowersInInteractionRangeEntry
  ) => boolean;
  readonly completingFlowerPick: (
    entry: ListingWorldPlazaFlowersInInteractionRangeEntry
  ) => Promise<void>;
};

function probingWorldPlazaFlowerPickInventoryCapacity(
  inventoryState: DefiningInventoryState,
  itemTypeId: string,
  flowerQuantity: number
): boolean {
  if (flowerQuantity <= 0) {
    return false;
  }

  const capacityProbe = addingWorldPlazaInventoryItemWithStacking(
    inventoryState,
    {
      id: 'flower-pick-capacity-probe',
      itemTypeId,
      quantity: flowerQuantity,
    },
    DEFINING_WORLD_PLAZA_INVENTORY_ITEM_REGISTRY
  );

  return capacityProbe.quantityAccepted >= flowerQuantity;
}

/**
 * Validates and completes flower picks after the progress indicator finishes.
 */
export function usingWorldPlazaFlowerPickInteraction({
  localPersistenceOwnerId,
  redditUserId,
  saveSlotIndex,
  pickedFlowerStateByTileKey,
  playerPositionRef,
  inventoryState,
  updatingInventoryState,
  showingGameplayHudToast,
}: UsingWorldPlazaFlowerPickInteractionParams): UsingWorldPlazaFlowerPickInteractionResult {
  const queryClient = useQueryClient();
  const isCompletionPendingRef = useRef(false);
  const inventoryStateRef = useRef(inventoryState);
  inventoryStateRef.current = inventoryState;
  const useLocalPersistence =
    checkingWorldPlazaPickedFlowersUseLocalPersistence(
      localPersistenceOwnerId,
      redditUserId
    );
  const persistenceOwnerId = useLocalPersistence
    ? localPersistenceOwnerId
    : redditUserId;

  const validatingFlowerPickStart = useCallback(
    (entry: ListingWorldPlazaFlowersInInteractionRangeEntry): boolean => {
      if (!persistenceOwnerId) {
        showingGameplayHudToast(
          'Flower picking is unavailable in this session.'
        );
        return false;
      }

      const playerPosition = playerPositionRef.current;

      if (!playerPosition) {
        return false;
      }

      const tileKey = formattingWorldPlazaPickedFlowerTileKey(
        entry.tileX,
        entry.tileY
      );
      const speciesId = resolvingWorldFlowerSpeciesAtTileIndex(
        entry.tileX,
        entry.tileY
      );
      const itemTypeId =
        resolvingWorldPlazaFlowerItemTypeIdFromSpeciesId(speciesId);

      const rangeCheck = checkingWorldPlazaFlowerPickEligibility({
        persistenceOwnerId,
        tileX: entry.tileX,
        tileY: entry.tileY,
        playerX: playerPosition.x,
        playerY: playerPosition.y,
        existingTileState: pickedFlowerStateByTileKey.get(tileKey),
      });

      if (rangeCheck.outcome === 'out-of-range') {
        showingGameplayHudToast('Move closer to pick this flower.');
        return false;
      }

      if (rangeCheck.outcome === 'already-picked') {
        showingGameplayHudToast('This flower is already picked.');
        return false;
      }

      if (
        !probingWorldPlazaFlowerPickInventoryCapacity(
          inventoryStateRef.current,
          itemTypeId,
          WORLD_FLOWER_PICK_QUANTITY
        )
      ) {
        showingGameplayHudToast('Your inventory is full.');
        return false;
      }

      return true;
    },
    [
      pickedFlowerStateByTileKey,
      persistenceOwnerId,
      playerPositionRef,
      showingGameplayHudToast,
    ]
  );

  const completingFlowerPick = useCallback(
    async (
      entry: ListingWorldPlazaFlowersInInteractionRangeEntry
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
        const speciesId = resolvingWorldFlowerSpeciesAtTileIndex(
          entry.tileX,
          entry.tileY
        );
        const itemTypeId =
          resolvingWorldPlazaFlowerItemTypeIdFromSpeciesId(speciesId);
        const flowerQuantity = WORLD_FLOWER_PICK_QUANTITY;

        if (
          !probingWorldPlazaFlowerPickInventoryCapacity(
            inventoryStateRef.current,
            itemTypeId,
            flowerQuantity
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
              quantity: flowerQuantity,
            },
            DEFINING_WORLD_PLAZA_INVENTORY_ITEM_REGISTRY
          );

          quantityAccepted = addResult.quantityAccepted;

          if (addResult.quantityAccepted < flowerQuantity) {
            return null;
          }

          return addResult.state;
        });

        if (quantityAccepted < flowerQuantity) {
          showingGameplayHudToast('Your inventory is full.');
          return;
        }

        notifyingWorldPlazaInventoryItemAdded(quantityAccepted);

        const pickRequest = {
          tileX: entry.tileX,
          tileY: entry.tileY,
          playerX: playerPosition.x,
          playerY: playerPosition.y,
        };

        const pickResult =
          useLocalPersistence && localPersistenceOwnerId
            ? pickingWorldPlazaLocalFlower(localPersistenceOwnerId, pickRequest)
            : await pickingWorldHarvestDevvitFlower(
                WORLD_HARVEST_DEVVIT_PICK_FLOWER_API_PATH,
                {
                  ...pickRequest,
                  saveSlotIndex,
                }
              );

        if (pickResult.outcome !== 'picked') {
          if (pickResult.outcome === 'out-of-range') {
            showingGameplayHudToast('Move closer to pick this flower.');
          } else if (pickResult.outcome === 'already-picked') {
            showingGameplayHudToast('This flower is already picked.');
          }

          return;
        }

        recordingWorldPlazaHerbariumFlowerStudied(speciesId);

        void queryClient.invalidateQueries({
          queryKey: [DEFINING_WORLD_PLAZA_PICKED_FLOWERS_QUERY_KEY_ROOT],
        });
      } finally {
        isCompletionPendingRef.current = false;
      }
    },
    [
      localPersistenceOwnerId,
      persistenceOwnerId,
      playerPositionRef,
      queryClient,
      saveSlotIndex,
      showingGameplayHudToast,
      updatingInventoryState,
      useLocalPersistence,
    ]
  );

  return {
    validatingFlowerPickStart,
    completingFlowerPick,
  };
}
