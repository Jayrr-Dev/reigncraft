'use client';

/**
 * Tracks inventory click-to-ground drop placement: tile preview, walk-then-drop queue,
 * and authoritative server drop requests.
 *
 * @module components/world/inventory/hooks/trackingWorldPlazaInventoryDropPlacement
 */

import type { DefiningInventoryState } from '@/components/inventory/domains/definingInventoryItem';
import type { DefiningInventoryItemRegistry } from '@/components/inventory/domains/definingInventoryItemRegistry';
import { removingInventoryItemFromSlot } from '@/components/inventory/domains/reducingInventoryState';
import type { DefiningWorldPlazaPlacedBlocksSceneRef } from '@/components/world/domains/buildingWorldPlazaPlacedBlocksSceneRef';
import type { DefiningWorldPlazaCameraOffset } from '@/components/world/domains/definingWorldPlazaCameraOffset';
import { DEFINING_WORLD_PLAZA_UI_SELECTOR } from '@/components/world/domains/definingWorldPlazaClickMovementConstants';
import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import { resolvingWorldPlazaPlayerWorldLayer } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import type { DefiningWorldPlazaPixiViewportSize } from '@/components/world/domains/resolvingWorldPlazaPixiViewportSize';
import { checkingWorldPlazaGroundItemsUseLocalPersistence } from '@/components/world/inventory/domains/checkingWorldPlazaGroundItemsUseLocalPersistence';
import { checkingWorldPlazaInventoryItemIsBag } from '@/components/world/inventory/domains/checkingWorldPlazaInventoryItemIsBag';
import { computingWorldPlazaInventoryDropChebyshevDistanceToTile } from '@/components/world/inventory/domains/computingWorldPlazaInventoryDropChebyshevDistanceToTile';
import { DEFINING_WORLD_PLAZA_INVENTORY_DROP_RADIUS_TILES } from '@/components/world/inventory/domains/definingWorldPlazaInventoryDropConstants';
import type {
  DefiningWorldPlazaInventoryDropPreviewTile,
  DefiningWorldPlazaInventoryPendingDrop,
} from '@/components/world/inventory/domains/definingWorldPlazaInventoryDropPlacement';
import { registeringWorldPlazaGroundItemSelfDrop } from '@/components/world/inventory/domains/managingWorldPlazaGroundItemAutoPickupEligibility';
import { insertingWorldPlazaGroundItemOptimistically } from '@/components/world/inventory/domains/managingWorldPlazaGroundItemOptimisticBridge';
import { droppingWorldPlazaLocalGroundItem } from '@/components/world/inventory/domains/managingWorldPlazaLocalGroundItems';
import { checkingWorldPlazaInventoryBagHasContents } from '@/components/world/inventory/domains/resolvingWorldPlazaInventoryBagContents';
import { resolvingWorldPlazaInventoryDropPreviewTileFromClientPointer } from '@/components/world/inventory/domains/resolvingWorldPlazaInventoryDropPreviewTileFromClientPointer';
import { resolvingWorldPlazaInventoryDropWalkTargetGridPoint } from '@/components/world/inventory/domains/resolvingWorldPlazaInventoryDropWalkTargetGridPoint';
import { droppingWorldInventoryDevvitGroundItem } from '@/components/world/inventory/repositories/callingWorldInventoryDevvitApi';
import { showingReigncraftToast } from '@/components/ui/domains/showingReigncraftToast';
import { useCallback, useMemo, useRef } from 'react';
import { WORLD_INVENTORY_DEVVIT_GROUND_ITEMS_DROP_API_PATH } from '../../../../shared/worldInventoryDevvit';

/** Params for {@link trackingWorldPlazaInventoryDropPlacement}. */
export interface TrackingWorldPlazaInventoryDropPlacementParams {
  readonly viewportFrameRef: React.RefObject<HTMLElement | null>;
  readonly cameraOffsetRef: React.RefObject<DefiningWorldPlazaCameraOffset>;
  readonly viewportSizeRef: React.RefObject<DefiningWorldPlazaPixiViewportSize>;
  readonly cameraWorldZoomRef: React.RefObject<number>;
  readonly playerPositionRef: React.RefObject<DefiningWorldPlazaWorldPoint>;
  readonly walkTargetRef: React.RefObject<DefiningWorldPlazaWorldPoint | null>;
  readonly isWalkingRef: React.RefObject<boolean>;
  readonly placedBlocksRef: React.RefObject<DefiningWorldPlazaPlacedBlocksSceneRef>;
  readonly syncingMovePositionRef?: React.RefObject<(() => void) | null>;
  /** Offline single-player owner id for localStorage-backed ground drops. */
  readonly localPersistenceOwnerId?: string | null;
  /** Signed-in Reddit user id; Devvit API is used when present. */
  readonly redditUserId?: string | null;
  /** Single-player save slot; scopes Devvit ground items per user when set. */
  readonly saveSlotIndex?: number | null;
  readonly updateInventoryState: (
    updater: (
      currentState: DefiningInventoryState
    ) => DefiningInventoryState | null
  ) => void;
  readonly flushingInventoryPersist: () => void;
}

/** Return shape for {@link trackingWorldPlazaInventoryDropPlacement}. */
export interface TrackingWorldPlazaInventoryDropPlacementResult {
  readonly isDropPlacementActiveRef: React.RefObject<boolean>;
  readonly dropMarkerTileRef: React.RefObject<DefiningWorldPlazaInventoryDropPreviewTile | null>;
  /** Item type for the drop preview glyph while placement is active. */
  readonly dropPlacementItemTypeIdRef: React.RefObject<string | null>;
  readonly pendingDropRef: React.RefObject<DefiningWorldPlazaInventoryPendingDrop | null>;
  readonly startingDropPlacementFromSlot: (
    slotIndex: number,
    state: DefiningInventoryState,
    registry: DefiningInventoryItemRegistry
  ) => boolean;
  readonly handlingDropPlacementPointerMove: (
    clientX: number,
    clientY: number
  ) => void;
  readonly handlingDropPlacementWorldClick: (
    clientX: number,
    clientY: number,
    state: DefiningInventoryState
  ) => boolean;
  readonly cancellingDropPlacementMode: () => void;
  readonly executingPendingDropIfInRange: () => void;
  /** Clears a queued walk-to-drop without stopping the current walk target. */
  readonly cancellingPendingInventoryGroundDropQueue: () => void;
}

/**
 * Chebyshev tile distance between an avatar and a drop tile center.
 */
function computingWorldPlazaDropTileChebyshevDistance(
  playerX: number,
  playerY: number,
  tileX: number,
  tileY: number
): number {
  return computingWorldPlazaInventoryDropChebyshevDistanceToTile(
    playerX,
    playerY,
    tileX,
    tileY
  );
}

/**
 * Wires inventory click-to-place ground drops to walk targets and Devvit ground drops.
 */
export function trackingWorldPlazaInventoryDropPlacement({
  viewportFrameRef,
  cameraOffsetRef,
  viewportSizeRef,
  cameraWorldZoomRef,
  playerPositionRef,
  walkTargetRef,
  isWalkingRef,
  placedBlocksRef,
  syncingMovePositionRef,
  localPersistenceOwnerId = null,
  redditUserId = null,
  saveSlotIndex = null,
  updateInventoryState,
  flushingInventoryPersist,
}: TrackingWorldPlazaInventoryDropPlacementParams): TrackingWorldPlazaInventoryDropPlacementResult {
  const useLocalGroundItems = checkingWorldPlazaGroundItemsUseLocalPersistence(
    localPersistenceOwnerId,
    redditUserId
  );
  const isDropPlacementActiveRef = useRef(false);
  const dropPlacementSlotIndexRef = useRef<number | null>(null);
  const dropPlacementItemTypeIdRef = useRef<string | null>(null);
  const dropMarkerTileRef =
    useRef<DefiningWorldPlazaInventoryDropPreviewTile | null>(null);
  const pendingDropRef = useRef<DefiningWorldPlazaInventoryPendingDrop | null>(
    null
  );
  const updateInventoryStateRef = useRef(updateInventoryState);
  updateInventoryStateRef.current = updateInventoryState;
  const flushingInventoryPersistRef = useRef(flushingInventoryPersist);
  flushingInventoryPersistRef.current = flushingInventoryPersist;

  const removingPendingDropFromInventory = useCallback(
    (
      pendingDrop: DefiningWorldPlazaInventoryPendingDrop
    ): DefiningInventoryState | null => {
      let inventoryBeforeDrop: DefiningInventoryState | null = null;

      updateInventoryStateRef.current((currentState) => {
        const slotItem = currentState.slots[pendingDrop.slotIndex];

        if (
          !slotItem ||
          slotItem.id !== pendingDrop.itemId ||
          slotItem.itemTypeId !== pendingDrop.itemTypeId ||
          slotItem.quantity !== pendingDrop.quantity
        ) {
          return null;
        }

        inventoryBeforeDrop = currentState;
        return removingInventoryItemFromSlot(
          currentState,
          pendingDrop.slotIndex
        );
      });

      if (inventoryBeforeDrop) {
        flushingInventoryPersistRef.current();
      }

      return inventoryBeforeDrop;
    },
    []
  );

  const restoringInventoryAfterFailedDrop = useCallback(
    (inventoryBeforeDrop: DefiningInventoryState): void => {
      updateInventoryStateRef.current(() => inventoryBeforeDrop);
      flushingInventoryPersistRef.current();
    },
    []
  );

  const clearingDropMarkerVisual = useCallback((): void => {
    dropMarkerTileRef.current = null;
    dropPlacementItemTypeIdRef.current = null;
  }, []);

  const clearingDropMarker = useCallback((): void => {
    dropMarkerTileRef.current = null;
    dropPlacementItemTypeIdRef.current = null;
    pendingDropRef.current = null;
  }, []);

  const clearingDropPlacementMode = useCallback((): void => {
    isDropPlacementActiveRef.current = false;
    dropPlacementSlotIndexRef.current = null;
    clearingDropMarkerVisual();
  }, [clearingDropMarkerVisual]);

  /** Ends tile picking but keeps the drop marker for walk-to-drop. */
  const endingDropPlacementSelection = useCallback((): void => {
    isDropPlacementActiveRef.current = false;
    dropPlacementSlotIndexRef.current = null;
  }, []);

  const cancellingPendingInventoryGroundDrop = useCallback((): void => {
    clearingDropPlacementMode();
    clearingDropMarker();
    walkTargetRef.current = null;
    isWalkingRef.current = false;
  }, [
    clearingDropMarker,
    clearingDropPlacementMode,
    isWalkingRef,
    walkTargetRef,
  ]);

  const cancellingPendingInventoryGroundDropQueue = useCallback((): void => {
    if (
      !pendingDropRef.current &&
      !dropMarkerTileRef.current &&
      !isDropPlacementActiveRef.current
    ) {
      return;
    }

    clearingDropPlacementMode();
    clearingDropMarker();
    walkTargetRef.current = null;
    isWalkingRef.current = false;
  }, [
    clearingDropMarker,
    clearingDropPlacementMode,
    isWalkingRef,
    walkTargetRef,
  ]);

  const sendingGroundDrop = useCallback(
    async (
      pendingDrop: DefiningWorldPlazaInventoryPendingDrop
    ): Promise<void> => {
      syncingMovePositionRef?.current?.();

      const playerPosition = playerPositionRef.current;

      if (!playerPosition) {
        clearingDropMarker();
        return;
      }

      const inventoryBeforeDrop = removingPendingDropFromInventory(pendingDrop);

      if (!inventoryBeforeDrop) {
        clearingDropMarker();
        showingReigncraftToast('That item is no longer in your hotbar.');
        return;
      }

      try {
        const dropRequest = {
          itemTypeId: pendingDrop.itemTypeId,
          quantity: pendingDrop.quantity,
          gridX: pendingDrop.gridX,
          gridY: pendingDrop.gridY,
          layer: pendingDrop.layer,
          slotIndex: pendingDrop.slotIndex,
          playerX: playerPosition.x,
          playerY: playerPosition.y,
        };

        const ack =
          useLocalGroundItems && localPersistenceOwnerId
            ? droppingWorldPlazaLocalGroundItem(
                localPersistenceOwnerId,
                dropRequest
              )
            : await droppingWorldInventoryDevvitGroundItem(
                WORLD_INVENTORY_DEVVIT_GROUND_ITEMS_DROP_API_PATH,
                {
                  ...dropRequest,
                  saveSlotIndex,
                }
              );

        if (!ack.success || ack.slotIndex === undefined || ack.slotIndex < 0) {
          restoringInventoryAfterFailedDrop(inventoryBeforeDrop);
          clearingDropMarkerVisual();
          showingReigncraftToast('Too far away to drop that item there.');
          return;
        }

        if (ack.groundItemId && ack.groundItemId.length > 0) {
          registeringWorldPlazaGroundItemSelfDrop(ack.groundItemId);
          insertingWorldPlazaGroundItemOptimistically(
            {
              id: ack.groundItemId,
              itemTypeId: pendingDrop.itemTypeId,
              quantity: pendingDrop.quantity,
              gridX: pendingDrop.gridX,
              gridY: pendingDrop.gridY,
              layer: pendingDrop.layer,
              spawnedAt: Date.now(),
            },
            useLocalGroundItems
          );
        }

        clearingDropMarker();
      } catch (error) {
        restoringInventoryAfterFailedDrop(inventoryBeforeDrop);
        clearingDropMarker();
        showingReigncraftToast(
          error instanceof Error ? error.message : 'Failed to drop item.'
        );
      }
    },
    [
      clearingDropMarker,
      clearingDropMarkerVisual,
      localPersistenceOwnerId,
      playerPositionRef,
      removingPendingDropFromInventory,
      restoringInventoryAfterFailedDrop,
      saveSlotIndex,
      syncingMovePositionRef,
      useLocalGroundItems,
    ]
  );

  const queueingWalkToDropTile = useCallback(
    (pendingDrop: DefiningWorldPlazaInventoryPendingDrop): void => {
      const playerPosition = playerPositionRef.current;

      if (!playerPosition) {
        return;
      }

      const walkableTarget =
        resolvingWorldPlazaInventoryDropWalkTargetGridPoint(
          playerPosition,
          pendingDrop.gridX,
          pendingDrop.gridY,
          placedBlocksRef.current.blocks
        );

      walkTargetRef.current = walkableTarget;
      isWalkingRef.current = true;
    },
    [isWalkingRef, placedBlocksRef, playerPositionRef, walkTargetRef]
  );

  const executingPendingDropIfInRange = useCallback((): void => {
    const pendingDrop = pendingDropRef.current;
    const playerPosition = playerPositionRef.current;

    if (!pendingDrop || !playerPosition) {
      return;
    }

    syncingMovePositionRef?.current?.();

    const distance = computingWorldPlazaDropTileChebyshevDistance(
      playerPosition.x,
      playerPosition.y,
      pendingDrop.gridX,
      pendingDrop.gridY
    );

    if (distance > DEFINING_WORLD_PLAZA_INVENTORY_DROP_RADIUS_TILES) {
      if (!isWalkingRef.current) {
        queueingWalkToDropTile(pendingDrop);
      }

      return;
    }

    pendingDropRef.current = null;
    void sendingGroundDrop(pendingDrop);
  }, [
    isWalkingRef,
    playerPositionRef,
    queueingWalkToDropTile,
    sendingGroundDrop,
    syncingMovePositionRef,
  ]);

  const resolvingDropPreviewTileFromClientPointer = useCallback(
    (
      clientX: number,
      clientY: number,
      ignorePlazaUiChrome = false
    ): DefiningWorldPlazaInventoryDropPreviewTile | null => {
      const viewportFrame = viewportFrameRef.current;
      const cameraOffset = cameraOffsetRef.current;

      if (!viewportFrame || !cameraOffset) {
        return null;
      }

      return resolvingWorldPlazaInventoryDropPreviewTileFromClientPointer({
        clientX,
        clientY,
        viewportFrameBounds: viewportFrame.getBoundingClientRect(),
        viewportSize: viewportSizeRef.current,
        cameraOffset,
        cameraWorldZoom: cameraWorldZoomRef.current ?? 1,
        placedBlocks: placedBlocksRef.current.blocks,
        ignorePlazaUiChrome,
      });
    },
    [
      cameraOffsetRef,
      cameraWorldZoomRef,
      placedBlocksRef,
      viewportFrameRef,
      viewportSizeRef,
    ]
  );

  const committingDropAtPreviewTile = useCallback(
    (
      slotIndex: number,
      slotItem: NonNullable<DefiningInventoryState['slots'][number]>,
      previewTile: DefiningWorldPlazaInventoryDropPreviewTile
    ): void => {
      if (!previewTile.isValid) {
        return;
      }

      const playerPosition = playerPositionRef.current;

      if (!playerPosition) {
        cancellingPendingInventoryGroundDrop();
        return;
      }

      const dropTileX = previewTile.tileX;
      const dropTileY = previewTile.tileY;

      const pendingDrop: DefiningWorldPlazaInventoryPendingDrop = {
        slotIndex,
        itemId: slotItem.id,
        itemTypeId: slotItem.itemTypeId,
        quantity: slotItem.quantity,
        gridX: dropTileX,
        gridY: dropTileY,
        layer: resolvingWorldPlazaPlayerWorldLayer(playerPosition),
      };

      dropMarkerTileRef.current = {
        tileX: dropTileX,
        tileY: dropTileY,
        isValid: true,
      };
      dropPlacementItemTypeIdRef.current = slotItem.itemTypeId;
      endingDropPlacementSelection();

      const distance = computingWorldPlazaDropTileChebyshevDistance(
        playerPosition.x,
        playerPosition.y,
        dropTileX,
        dropTileY
      );

      if (distance <= DEFINING_WORLD_PLAZA_INVENTORY_DROP_RADIUS_TILES) {
        void sendingGroundDrop(pendingDrop);
        return;
      }

      pendingDropRef.current = pendingDrop;
      queueingWalkToDropTile(pendingDrop);
    },
    [
      cancellingPendingInventoryGroundDrop,
      endingDropPlacementSelection,
      playerPositionRef,
      queueingWalkToDropTile,
      sendingGroundDrop,
    ]
  );

  const startingDropPlacementFromSlot = useCallback(
    (
      slotIndex: number,
      state: DefiningInventoryState,
      registry: DefiningInventoryItemRegistry
    ): boolean => {
      const slotItem = state.slots[slotIndex];

      if (!slotItem) {
        return false;
      }

      const typeDef = registry.resolvingItemType(slotItem.itemTypeId);
      const isDroppable = typeDef?.isDroppable ?? false;

      if (!isDroppable) {
        return false;
      }

      if (
        checkingWorldPlazaInventoryItemIsBag(slotItem.itemTypeId) &&
        checkingWorldPlazaInventoryBagHasContents(slotItem, registry)
      ) {
        showingReigncraftToast('Empty your bag before dropping it.');
        return false;
      }

      cancellingPendingInventoryGroundDrop();
      isDropPlacementActiveRef.current = true;
      dropPlacementSlotIndexRef.current = slotIndex;
      dropPlacementItemTypeIdRef.current = slotItem.itemTypeId;
      dropMarkerTileRef.current = null;
      return true;
    },
    [cancellingPendingInventoryGroundDrop]
  );

  const handlingDropPlacementPointerMove = useCallback(
    (clientX: number, clientY: number): void => {
      if (!isDropPlacementActiveRef.current) {
        return;
      }

      const elementUnderPointer = document.elementFromPoint(clientX, clientY);

      if (
        elementUnderPointer instanceof Element &&
        elementUnderPointer.closest(DEFINING_WORLD_PLAZA_UI_SELECTOR)
      ) {
        dropMarkerTileRef.current = null;
        return;
      }

      const previewTile = resolvingDropPreviewTileFromClientPointer(
        clientX,
        clientY
      );

      dropMarkerTileRef.current = previewTile;
    },
    [resolvingDropPreviewTileFromClientPointer]
  );

  const handlingDropPlacementWorldClick = useCallback(
    (
      clientX: number,
      clientY: number,
      state: DefiningInventoryState
    ): boolean => {
      if (!isDropPlacementActiveRef.current) {
        return false;
      }

      const slotIndex = dropPlacementSlotIndexRef.current;

      if (slotIndex === null) {
        clearingDropPlacementMode();
        return false;
      }

      const slotItem = state.slots[slotIndex];

      if (!slotItem) {
        cancellingPendingInventoryGroundDrop();
        return true;
      }

      const previewTile = resolvingDropPreviewTileFromClientPointer(
        clientX,
        clientY,
        true
      );

      if (!previewTile) {
        return true;
      }

      committingDropAtPreviewTile(slotIndex, slotItem, previewTile);
      return true;
    },
    [
      cancellingPendingInventoryGroundDrop,
      clearingDropPlacementMode,
      committingDropAtPreviewTile,
      resolvingDropPreviewTileFromClientPointer,
    ]
  );

  const cancellingDropPlacementMode = useCallback((): void => {
    clearingDropPlacementMode();
  }, [clearingDropPlacementMode]);

  return useMemo(
    () => ({
      isDropPlacementActiveRef,
      dropMarkerTileRef,
      dropPlacementItemTypeIdRef,
      pendingDropRef,
      startingDropPlacementFromSlot,
      handlingDropPlacementPointerMove,
      handlingDropPlacementWorldClick,
      cancellingDropPlacementMode,
      executingPendingDropIfInRange,
      cancellingPendingInventoryGroundDropQueue,
    }),
    [
      cancellingDropPlacementMode,
      cancellingPendingInventoryGroundDropQueue,
      executingPendingDropIfInRange,
      handlingDropPlacementPointerMove,
      handlingDropPlacementWorldClick,
      startingDropPlacementFromSlot,
    ]
  );
}
