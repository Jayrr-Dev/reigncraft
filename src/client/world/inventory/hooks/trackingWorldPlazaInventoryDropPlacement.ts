'use client';

/**
 * Tracks inventory drag-to-ground placement: tile preview, walk-then-drop queue,
 * and authoritative server drop requests.
 *
 * @module components/world/inventory/hooks/trackingWorldPlazaInventoryDropPlacement
 */

import {
  parsingInventoryItemDraggableId,
  parsingInventorySlotDroppableId,
} from '@/components/inventory/domains/definingInventoryDndIds';
import type { DefiningInventoryState } from '@/components/inventory/domains/definingInventoryItem';
import type { DefiningInventoryItemRegistry } from '@/components/inventory/domains/definingInventoryItemRegistry';
import { resolvingInventoryItemSlotIndex } from '@/components/inventory/domains/reducingInventoryState';
import type { DefiningWorldPlazaPlacedBlocksSceneRef } from '@/components/world/domains/buildingWorldPlazaPlacedBlocksSceneRef';
import type { DefiningWorldPlazaCameraOffset } from '@/components/world/domains/definingWorldPlazaCameraOffset';
import { DEFINING_WORLD_PLAZA_UI_SELECTOR } from '@/components/world/domains/definingWorldPlazaClickMovementConstants';
import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import { resolvingWorldPlazaPlayerWorldLayer } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import type { DefiningWorldPlazaPixiViewportSize } from '@/components/world/domains/resolvingWorldPlazaPixiViewportSize';
import { checkingWorldPlazaGroundItemsUseLocalPersistence } from '@/components/world/inventory/domains/checkingWorldPlazaGroundItemsUseLocalPersistence';
import { checkingWorldPlazaInventoryItemIsBag } from '@/components/world/inventory/domains/checkingWorldPlazaInventoryItemIsBag';
import { computingWorldPlazaInventoryDropChebyshevDistanceToTile } from '@/components/world/inventory/domains/computingWorldPlazaInventoryDropChebyshevDistanceToTile';
import { parsingWorldPlazaInventoryBagSlotDroppableId } from '@/components/world/inventory/domains/definingWorldPlazaInventoryBagDndIds';
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
import { showToast } from '@devvit/web/client';
import type { DragEndEvent, DragMoveEvent } from '@dnd-kit/core';
import { useCallback, useRef } from 'react';
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
  readonly removeItem: (slotIndex: number) => void;
  readonly moveItem: (fromSlotIndex: number, toSlotIndex: number) => void;
}

/** Return shape for {@link trackingWorldPlazaInventoryDropPlacement}. */
export interface TrackingWorldPlazaInventoryDropPlacementResult {
  readonly isDragActiveRef: React.RefObject<boolean>;
  readonly previewTileRef: React.RefObject<DefiningWorldPlazaInventoryDropPreviewTile | null>;
  readonly dropMarkerTileRef: React.RefObject<DefiningWorldPlazaInventoryDropPreviewTile | null>;
  readonly pendingDropRef: React.RefObject<DefiningWorldPlazaInventoryPendingDrop | null>;
  readonly handlingDragStart: () => void;
  readonly handlingDragMove: (event: DragMoveEvent) => void;
  readonly handlingDragPointerMove: (clientX: number, clientY: number) => void;
  readonly handlingDragEnd: (
    event: DragEndEvent,
    state: DefiningInventoryState,
    registry: DefiningInventoryItemRegistry
  ) => void;
  readonly handlingDragCancel: () => void;
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
 * Returns true when the last drag pointer position is over plaza HUD chrome.
 *
 * @param lastPointer - Last pointer client coordinates during the drag.
 */
function checkingWorldPlazaInventoryDragPointerIsOverPlazaUi(
  lastPointer: { readonly x: number; readonly y: number } | null
): boolean {
  if (!lastPointer || typeof document === 'undefined') {
    return false;
  }

  const elementUnderPointer = document.elementFromPoint(
    lastPointer.x,
    lastPointer.y
  );

  return (
    elementUnderPointer instanceof Element &&
    elementUnderPointer.closest(DEFINING_WORLD_PLAZA_UI_SELECTOR) !== null
  );
}

/**
 * Wires inventory drag-out placement to walk targets and Devvit ground drops.
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
  removeItem,
  moveItem,
}: TrackingWorldPlazaInventoryDropPlacementParams): TrackingWorldPlazaInventoryDropPlacementResult {
  const useLocalGroundItems = checkingWorldPlazaGroundItemsUseLocalPersistence(
    localPersistenceOwnerId,
    redditUserId
  );
  const isDragActiveRef = useRef(false);
  const previewTileRef =
    useRef<DefiningWorldPlazaInventoryDropPreviewTile | null>(null);
  const dropMarkerTileRef =
    useRef<DefiningWorldPlazaInventoryDropPreviewTile | null>(null);
  const isPointerOverInventorySlotRef = useRef(false);
  const pendingDropRef = useRef<DefiningWorldPlazaInventoryPendingDrop | null>(
    null
  );
  const lastDragPointerClientRef = useRef<{
    readonly x: number;
    readonly y: number;
  } | null>(null);
  const removeItemRef = useRef(removeItem);
  removeItemRef.current = removeItem;

  const clearingDragPreview = useCallback((): void => {
    previewTileRef.current = null;
    isDragActiveRef.current = false;
    isPointerOverInventorySlotRef.current = false;
  }, []);

  const clearingDropMarkerVisual = useCallback((): void => {
    dropMarkerTileRef.current = null;
  }, []);

  const clearingDropMarker = useCallback((): void => {
    dropMarkerTileRef.current = null;
    pendingDropRef.current = null;
  }, []);

  const cancellingPendingInventoryGroundDrop = useCallback((): void => {
    clearingDropMarker();
    walkTargetRef.current = null;
    isWalkingRef.current = false;
  }, [clearingDropMarker, isWalkingRef, walkTargetRef]);

  const cancellingPendingInventoryGroundDropQueue = useCallback((): void => {
    if (!pendingDropRef.current && !dropMarkerTileRef.current) {
      return;
    }

    clearingDropMarker();
    walkTargetRef.current = null;
    isWalkingRef.current = false;
  }, [clearingDropMarker, isWalkingRef, walkTargetRef]);

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

        if (!ack.success || ack.slotIndex < 0) {
          clearingDropMarkerVisual();
          showToast('Too far away to drop that item there.');
          return;
        }

        if (ack.groundItemId.length > 0) {
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

        removeItemRef.current(ack.slotIndex);
        clearingDropMarker();
      } catch (error) {
        clearingDropMarker();
        showToast(
          error instanceof Error ? error.message : 'Failed to drop item.'
        );
      }
    },
    [
      clearingDropMarker,
      clearingDropMarkerVisual,
      localPersistenceOwnerId,
      playerPositionRef,
      redditUserId,
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
    sendingGroundDrop(pendingDrop);
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

  const handlingDragStart = useCallback((): void => {
    cancellingPendingInventoryGroundDrop();
    isDragActiveRef.current = true;
    previewTileRef.current = null;
    dropMarkerTileRef.current = null;
    lastDragPointerClientRef.current = null;
  }, [cancellingPendingInventoryGroundDrop]);

  const handlingDragMove = useCallback(
    (event: DragMoveEvent): void => {
      const overId = event.over ? String(event.over.id) : null;
      const isOverInventorySlot =
        overId !== null &&
        (parsingInventorySlotDroppableId(overId) !== null ||
          parsingWorldPlazaInventoryBagSlotDroppableId(overId) !== null);

      isPointerOverInventorySlotRef.current = isOverInventorySlot;

      if (isOverInventorySlot) {
        previewTileRef.current = null;
        dropMarkerTileRef.current = null;
        cancellingPendingInventoryGroundDropQueue();
        return;
      }

      const lastPointer = lastDragPointerClientRef.current;

      if (!lastPointer) {
        return;
      }

      const previewTile = resolvingDropPreviewTileFromClientPointer(
        lastPointer.x,
        lastPointer.y
      );

      if (!previewTile) {
        previewTileRef.current = null;
        dropMarkerTileRef.current = null;
        return;
      }

      previewTileRef.current = previewTile;
      dropMarkerTileRef.current = previewTile;
    },
    [
      cancellingPendingInventoryGroundDropQueue,
      resolvingDropPreviewTileFromClientPointer,
    ]
  );

  const handlingDragPointerMove = useCallback(
    (clientX: number, clientY: number): void => {
      lastDragPointerClientRef.current = { x: clientX, y: clientY };

      if (!isDragActiveRef.current || isPointerOverInventorySlotRef.current) {
        previewTileRef.current = null;
        dropMarkerTileRef.current = null;
        return;
      }

      const elementUnderPointer = document.elementFromPoint(clientX, clientY);

      if (
        elementUnderPointer instanceof Element &&
        elementUnderPointer.closest(DEFINING_WORLD_PLAZA_UI_SELECTOR)
      ) {
        previewTileRef.current = null;
        dropMarkerTileRef.current = null;
        return;
      }

      const viewportFrame = viewportFrameRef.current;

      if (!viewportFrame) {
        previewTileRef.current = null;
        dropMarkerTileRef.current = null;
        return;
      }

      const previewTile = resolvingDropPreviewTileFromClientPointer(
        clientX,
        clientY
      );

      if (!previewTile) {
        previewTileRef.current = null;
        dropMarkerTileRef.current = null;
        return;
      }

      previewTileRef.current = previewTile;
      dropMarkerTileRef.current = previewTile;
    },
    [resolvingDropPreviewTileFromClientPointer, viewportFrameRef]
  );

  const handlingDragEnd = useCallback(
    (
      event: DragEndEvent,
      state: DefiningInventoryState,
      registry: DefiningInventoryItemRegistry
    ): void => {
      clearingDragPreview();

      const activeId = String(event.active.id);
      const fromItemId = parsingInventoryItemDraggableId(activeId);
      const fromSlotIndex =
        fromItemId !== null
          ? resolvingInventoryItemSlotIndex(state, fromItemId)
          : null;

      if (fromSlotIndex === null) {
        cancellingPendingInventoryGroundDrop();
        return;
      }

      const slotItem = state.slots[fromSlotIndex];

      if (!slotItem) {
        cancellingPendingInventoryGroundDrop();
        return;
      }

      const typeDef = registry.resolvingItemType(slotItem.itemTypeId);
      const isDroppable = typeDef?.isDroppable ?? false;
      const overId = event.over ? String(event.over.id) : null;
      const toSlotIndex =
        overId !== null ? parsingInventorySlotDroppableId(overId) : null;
      const toBagSlot =
        overId !== null
          ? parsingWorldPlazaInventoryBagSlotDroppableId(overId)
          : null;

      if (toBagSlot !== null) {
        cancellingPendingInventoryGroundDrop();
        return;
      }

      if (!isDroppable) {
        cancellingPendingInventoryGroundDrop();
        return;
      }

      if (
        checkingWorldPlazaInventoryItemIsBag(slotItem.itemTypeId) &&
        checkingWorldPlazaInventoryBagHasContents(slotItem, registry)
      ) {
        cancellingPendingInventoryGroundDrop();
        showToast('Empty your bag before dropping it.');
        return;
      }

      if (toSlotIndex !== null) {
        cancellingPendingInventoryGroundDrop();
        moveItem(fromSlotIndex, toSlotIndex);
        return;
      }

      if (lastDragPointerClientRef.current) {
        const releasePointerTile = resolvingDropPreviewTileFromClientPointer(
          lastDragPointerClientRef.current.x,
          lastDragPointerClientRef.current.y,
          true
        );

        if (releasePointerTile) {
          previewTileRef.current = releasePointerTile;
          dropMarkerTileRef.current = releasePointerTile;
        }
      }

      const releasePreviewTile =
        previewTileRef.current ?? dropMarkerTileRef.current;

      if (releasePreviewTile) {
        const playerPosition = playerPositionRef.current;
        const dropTileX = releasePreviewTile.tileX;
        const dropTileY = releasePreviewTile.tileY;

        if (!releasePreviewTile.isValid) {
          cancellingPendingInventoryGroundDrop();
          return;
        }

        if (!playerPosition) {
          cancellingPendingInventoryGroundDrop();
          return;
        }

        const pendingDrop: DefiningWorldPlazaInventoryPendingDrop = {
          slotIndex: fromSlotIndex,
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

        const distance = computingWorldPlazaDropTileChebyshevDistance(
          playerPosition.x,
          playerPosition.y,
          dropTileX,
          dropTileY
        );

        if (distance <= DEFINING_WORLD_PLAZA_INVENTORY_DROP_RADIUS_TILES) {
          sendingGroundDrop(pendingDrop);
          return;
        }

        pendingDropRef.current = pendingDrop;
        queueingWalkToDropTile(pendingDrop);
        return;
      }

      if (
        checkingWorldPlazaInventoryDragPointerIsOverPlazaUi(
          lastDragPointerClientRef.current
        )
      ) {
        cancellingPendingInventoryGroundDrop();
        return;
      }

      if (!releasePreviewTile) {
        cancellingPendingInventoryGroundDrop();
        return;
      }

      cancellingPendingInventoryGroundDrop();
    },
    [
      cancellingPendingInventoryGroundDrop,
      clearingDragPreview,
      moveItem,
      playerPositionRef,
      queueingWalkToDropTile,
      resolvingDropPreviewTileFromClientPointer,
      sendingGroundDrop,
    ]
  );

  const handlingDragCancel = useCallback((): void => {
    clearingDragPreview();
    cancellingPendingInventoryGroundDrop();
  }, [clearingDragPreview, cancellingPendingInventoryGroundDrop]);

  return {
    isDragActiveRef,
    previewTileRef,
    dropMarkerTileRef,
    pendingDropRef,
    handlingDragStart,
    handlingDragMove,
    handlingDragPointerMove,
    handlingDragEnd,
    handlingDragCancel,
    executingPendingDropIfInRange,
    cancellingPendingInventoryGroundDropQueue,
  };
}
