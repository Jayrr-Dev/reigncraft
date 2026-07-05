'use client';

import type { DefiningInventoryState } from '@/components/inventory/domains/definingInventoryItem';
import { addingInventoryItemWithStacking } from '@/components/inventory/domains/reducingInventoryState';
import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import { waitingWorldPlazaDurationMs } from '@/components/world/domains/waitingWorldPlazaDurationMs';
import type { CheckingWorldPlazaEquippedSlotHasToolKindResult } from '@/components/world/equipment/domains/checkingWorldPlazaEquippedSlotHasToolKind';
import { computingWorldPlazaTreeChopDurationMs } from '@/components/world/harvest/domains/computingWorldPlazaTreeChopDurationMs';
import { DEFINING_WORLD_PLAZA_TREE_CHOP_WOOD_PER_LAYER } from '@/components/world/harvest/domains/definingWorldPlazaTreeChopConstants';
import { choppingWorldPlazaLocalTreeLayer } from '@/components/world/harvest/domains/managingWorldPlazaLocalChoppedTrees';
import { DEFINING_WORLD_PLAZA_CHOPPED_TREES_QUERY_KEY_ROOT } from '@/components/world/harvest/hooks/usingWorldPlazaChoppedTrees';
import type { ResolvingWorldPlazaInteractableTreeFromPointerGridPointResult } from '@/components/world/interaction/domains/resolvingWorldPlazaInteractableTreeFromPointerGridPoint';
import {
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_REGISTRY,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_WOOD,
} from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemTypes';
import { showToast } from '@devvit/web/client';
import { useQueryClient } from '@tanstack/react-query';
import { useCallback, useRef, type RefObject } from 'react';

export type UsingWorldPlazaTreeChopAttemptParams = {
  readonly persistenceOwnerId: string | null;
  readonly playerPositionRef: RefObject<DefiningWorldPlazaWorldPoint>;
  readonly inventoryState: DefiningInventoryState;
  readonly setInventoryState: (nextState: DefiningInventoryState) => void;
  readonly checkingEquippedToolKind: (
    toolKind: 'axe'
  ) => CheckingWorldPlazaEquippedSlotHasToolKindResult;
};

/**
 * Returns a handler that channels a tree chop on click (one layer per swing).
 */
export function usingWorldPlazaTreeChopAttempt({
  persistenceOwnerId,
  playerPositionRef,
  inventoryState,
  setInventoryState,
  checkingEquippedToolKind,
}: UsingWorldPlazaTreeChopAttemptParams) {
  const queryClient = useQueryClient();
  const isChopPendingRef = useRef(false);

  return useCallback(
    (
      match: ResolvingWorldPlazaInteractableTreeFromPointerGridPointResult
    ): void => {
      if (isChopPendingRef.current) {
        return;
      }

      const equipment = checkingEquippedToolKind('axe');

      if (!equipment.hasToolKind) {
        showToast('Equip an axe from your hotbar to chop trees.');
        return;
      }

      const inventoryProbe = addingInventoryItemWithStacking(
        inventoryState,
        {
          id: 'inventory-capacity-probe',
          itemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_WOOD,
          quantity: 1,
        },
        DEFINING_WORLD_PLAZA_INVENTORY_ITEM_REGISTRY
      );

      if (inventoryProbe.quantityAccepted <= 0) {
        showToast('Inventory full — make room for wood.');
        return;
      }

      if (!persistenceOwnerId) {
        showToast('Tree chopping is unavailable in this session.');
        return;
      }

      const playerPosition = playerPositionRef.current;

      if (!playerPosition) {
        return;
      }

      const standingSurfaceLayer = match.tree.standingSurfaceLayer ?? 1;
      const currentVisualLayer =
        match.tree.visualSurfaceLayer ?? standingSurfaceLayer;

      isChopPendingRef.current = true;

      const chopDurationMs = computingWorldPlazaTreeChopDurationMs(
        match.remainingChoppableLayers,
        equipment.harvestSpeedMultiplier
      );

      void waitingWorldPlazaDurationMs(chopDurationMs)
        .then(() => {
          const chopResult = choppingWorldPlazaLocalTreeLayer(
            persistenceOwnerId,
            {
              tileX: match.tilePosition.tileX,
              tileY: match.tilePosition.tileY,
              playerX: playerPosition.x,
              playerY: playerPosition.y,
              currentVisualLayer,
              standingSurfaceLayer,
            }
          );

          if (chopResult.outcome === 'out-of-range') {
            showToast('Move closer to chop this tree.');
            return;
          }

          if (chopResult.outcome === 'already-felled') {
            showToast('This tree is already felled.');
            return;
          }

          const addResult = addingInventoryItemWithStacking(
            inventoryState,
            {
              id: crypto.randomUUID(),
              itemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_WOOD,
              quantity: DEFINING_WORLD_PLAZA_TREE_CHOP_WOOD_PER_LAYER,
            },
            DEFINING_WORLD_PLAZA_INVENTORY_ITEM_REGISTRY
          );

          if (addResult.quantityAccepted <= 0) {
            showToast('Inventory full — make room for wood.');
            return;
          }

          setInventoryState(addResult.nextState);

          void queryClient.invalidateQueries({
            queryKey: [DEFINING_WORLD_PLAZA_CHOPPED_TREES_QUERY_KEY_ROOT],
          });

          if (chopResult.isFullyFelled) {
            showToast(
              `Tree felled! +${DEFINING_WORLD_PLAZA_TREE_CHOP_WOOD_PER_LAYER} wood`
            );
            return;
          }

          showToast(
            `Chopped! +${DEFINING_WORLD_PLAZA_TREE_CHOP_WOOD_PER_LAYER} wood`
          );
        })
        .finally(() => {
          isChopPendingRef.current = false;
        });
    },
    [
      checkingEquippedToolKind,
      inventoryState,
      persistenceOwnerId,
      playerPositionRef,
      queryClient,
      setInventoryState,
    ]
  );
}
