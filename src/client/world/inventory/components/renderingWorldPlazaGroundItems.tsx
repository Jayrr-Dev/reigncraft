'use client';

/**
 * Floating ground item markers with walk-over auto-pickup and click fallback.
 *
 * @module components/world/inventory/components/renderingWorldPlazaGroundItems
 */

import { computingWorldPlazaViewportHudScaledPx } from '@/components/world/domains/computingWorldPlazaViewportHudScale';
import type { DefiningWorldPlazaCameraOffset } from '@/components/world/domains/definingWorldPlazaCameraOffset';
import { DEFINING_WORLD_PLAZA_UI_DATA_ATTRIBUTE } from '@/components/world/domains/definingWorldPlazaClickMovementConstants';
import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import { RenderingWorldPlazaGroundItemProgressRing } from '@/components/world/inventory/components/renderingWorldPlazaGroundItemProgressRing';
import { RenderingWorldPlazaInventoryItemGlyph } from '@/components/world/inventory/components/renderingWorldPlazaInventoryItemGlyph';
import { addingWorldPlazaInventoryItemWithStacking } from '@/components/world/inventory/domains/addingWorldPlazaInventoryItemWithStacking';
import { checkingWorldPlazaGroundItemMarkerOccludedByBottomHud } from '@/components/world/inventory/domains/checkingWorldPlazaGroundItemMarkerOccludedByBottomHud';
import { checkingWorldPlazaGroundItemPickupInRange } from '@/components/world/inventory/domains/checkingWorldPlazaGroundItemPickupInRange';
import { checkingWorldPlazaGroundItemsUseLocalPersistence } from '@/components/world/inventory/domains/checkingWorldPlazaGroundItemsUseLocalPersistence';
import type { DefiningWorldPlazaGroundItem } from '@/components/world/inventory/domains/definingWorldPlazaGroundItem';
import {
  DEFINING_WORLD_PLAZA_GROUND_ITEM_AUTO_PICKUP_FULL_INVENTORY_COOLDOWN_MS,
  DEFINING_WORLD_PLAZA_GROUND_ITEM_AUTO_PICKUP_RETRY_INTERVAL_MS,
  DEFINING_WORLD_PLAZA_GROUND_ITEM_ICON_BASE_PX,
  DEFINING_WORLD_PLAZA_GROUND_ITEM_PICKUP_HINT_LIFT_BASE_PX,
  STYLING_WORLD_PLAZA_GROUND_ITEM_BUTTON_CLASS_NAME,
  STYLING_WORLD_PLAZA_GROUND_ITEM_FLOAT_CLASS_NAME,
  STYLING_WORLD_PLAZA_GROUND_ITEM_GLYPH_OUTLINE_CLASS_NAME,
  STYLING_WORLD_PLAZA_GROUND_ITEM_PICKUP_HINT_CLASS_NAME,
  STYLING_WORLD_PLAZA_GROUND_ITEM_QUANTITY_CLASS_NAME,
  STYLING_WORLD_PLAZA_GROUND_ITEM_ROOT_CLASS_NAME,
  STYLING_WORLD_PLAZA_GROUND_ITEM_TOO_FAR_HINT_CLASS_NAME,
} from '@/components/world/inventory/domains/definingWorldPlazaGroundItemConstants';
import { DEFINING_WORLD_PLAZA_INVENTORY_ITEM_REGISTRY } from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemTypes';
import {
  checkingWorldPlazaGroundItemAutoPickupEligible,
  syncingWorldPlazaGroundItemAutoPickupEligibility,
} from '@/components/world/inventory/domains/managingWorldPlazaGroundItemAutoPickupEligibility';
import {
  checkingWorldPlazaGroundItemAutoPickupEnabled,
  initializingWorldPlazaGroundItemAutoPickupStoreFromStorage,
} from '@/components/world/inventory/domains/managingWorldPlazaGroundItemAutoPickupPreferenceStore';
import {
  reducingWorldPlazaDevvitGroundItemQuantityOptimistically,
  reducingWorldPlazaLocalGroundItemQuantityOptimistically,
} from '@/components/world/inventory/domains/managingWorldPlazaGroundItemOptimisticBridge';
import { consumingWorldPlazaLocalGroundFoodUnit } from '@/components/world/inventory/domains/managingWorldPlazaLocalGroundItems';
import { resolvingWorldPlazaGroundItemScreenPoint } from '@/components/world/inventory/domains/resolvingWorldPlazaGroundItemScreenPoint';
import { usingWorldPlazaGroundItemPickupProgress } from '@/components/world/inventory/hooks/usingWorldPlazaGroundItemPickupProgress';
import { usingWorldPlazaGroundItems } from '@/components/world/inventory/hooks/usingWorldPlazaGroundItems';
import { usingWorldPlazaInventory } from '@/components/world/inventory/hooks/usingWorldPlazaInventory';
import { consumingWorldInventoryDevvitGroundFoodUnit } from '@/components/world/inventory/repositories/callingWorldInventoryDevvitApi';
import {
  applyingWildlifeMealTheftAggroForGroundItem,
  checkingWildlifeGroundItemIsContestedByEater,
} from '@/components/world/wildlife/domains/applyingWildlifeMealTheftAggroForGroundItem';
import { registeringWildlifeGroundFoodBridge } from '@/components/world/wildlife/domains/managingWildlifeGroundFoodBridge';
import type { ManagingWildlifeInstanceStore } from '@/components/world/wildlife/domains/managingWildlifeInstanceStore';
import { resolvingWildlifeGroundFoodEatProgressByItemId } from '@/components/world/wildlife/domains/resolvingWildlifeGroundFoodEatProgressByItemId';
import { rollingWildlifeContestedGroundFoodPickupDurationMs } from '@/components/world/wildlife/domains/rollingWildlifeContestedGroundFoodPickupDurationMs';
import { cn } from '@/lib/utils';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { PlazaSaveSlotIndex } from '../../../../shared/plazaGameSession';
import { WORLD_INVENTORY_DEVVIT_GROUND_ITEMS_CONSUME_API_PATH } from '../../../../shared/worldInventoryDevvit';

/** Why a pickup attempt was blocked, for the marker hint label. */
type RenderingWorldPlazaGroundItemPickupBlockedReason = 'range' | 'full';

/** How long a blocked-pickup hint stays visible (ms). */
const RENDERING_WORLD_PLAZA_GROUND_ITEM_BLOCKED_HINT_MS = 900 as const;

/** Off-screen default before the first animation frame positions a marker. */
const RENDERING_WORLD_PLAZA_GROUND_ITEM_HIDDEN_TRANSFORM =
  'translate(-9999px, -9999px)' as const;

/** Props for {@link RenderingWorldPlazaGroundItems}. */
export interface RenderingWorldPlazaGroundItemsProps {
  /** Authenticated user id for online persistence (empty in single player). */
  readonly onlineUserId?: string | null;
  /** Offline session owner id for localStorage persistence. */
  readonly localPersistenceOwnerId?: string | null;
  /** Reddit user id for signed-in single-player cloud saves. */
  readonly redditUserId?: string | null;
  /** Single-player save slot; scopes ground items per user when set. */
  readonly saveSlotIndex?: PlazaSaveSlotIndex | null;
  /** Public username; applies the Kingpin founder test load when matched. */
  readonly onlineUsername?: string | null;
  readonly playerPositionRef: React.RefObject<DefiningWorldPlazaWorldPoint>;
  readonly cameraOffsetRef: React.RefObject<DefiningWorldPlazaCameraOffset>;
  readonly cameraWorldZoomRef: React.RefObject<number>;
  readonly viewportHudScale?: number;
  /** Wildlife store used to show bite-cooldown rings on stacks being eaten. */
  readonly wildlifeStoreRef?: React.RefObject<ManagingWildlifeInstanceStore | null>;
  /** Player target id for meal-theft aggro (online user id or local-player). */
  readonly playerTargetId?: string | null;
}

/** Options for a ground item pickup attempt. */
type RenderingWorldPlazaGroundItemPickupAttemptOptions = {
  readonly showBlockedHints: boolean;
};

/**
 * Renders floating ground items with automatic walk-over pickup into inventory.
 */
export function RenderingWorldPlazaGroundItems({
  onlineUserId = null,
  localPersistenceOwnerId = null,
  redditUserId = null,
  saveSlotIndex = null,
  onlineUsername = null,
  playerPositionRef,
  cameraOffsetRef,
  cameraWorldZoomRef,
  viewportHudScale = 1,
  wildlifeStoreRef,
  playerTargetId = null,
}: RenderingWorldPlazaGroundItemsProps): React.JSX.Element | null {
  const isOnlineSession = onlineUserId !== null && onlineUserId.length > 0;
  const resolvedPlayerTargetId =
    playerTargetId ??
    onlineUserId ??
    localPersistenceOwnerId ??
    'local-player';
  const isSinglePlayerSession =
    !isOnlineSession && localPersistenceOwnerId !== null;
  const singlePlayerSaveSlotIndex = isSinglePlayerSession
    ? saveSlotIndex
    : null;
  const useLocalGroundItems = checkingWorldPlazaGroundItemsUseLocalPersistence(
    localPersistenceOwnerId,
    redditUserId
  );
  const { state: inventoryState, addItemWithStacking } =
    usingWorldPlazaInventory({
      onlineUserId: isOnlineSession ? onlineUserId : null,
      localPersistenceOwnerId,
      redditUserId,
      saveSlotIndex: singlePlayerSaveSlotIndex,
      onlineUsername,
      seedDemoItems: false,
    });

  const inventoryStateRef = useRef(inventoryState);
  inventoryStateRef.current = inventoryState;

  const handlingPickupGranted = useCallback(
    (grant: {
      groundItemId: string;
      itemTypeId: string;
      quantity: number;
      metadata?: Readonly<Record<string, unknown>>;
    }): void => {
      if (grant.quantity <= 0) {
        return;
      }

      addItemWithStacking({
        id: crypto.randomUUID(),
        itemTypeId: grant.itemTypeId,
        quantity: grant.quantity,
        ...(grant.metadata ? { metadata: grant.metadata } : {}),
      });
    },
    [addItemWithStacking]
  );

  // Online and signed-in single-player use Devvit; offline single-player uses
  // localStorage scoped to the active save slot owner id.
  const { items, isReady, sendingGroundPickup } = usingWorldPlazaGroundItems({
    enabled: isOnlineSession || isSinglePlayerSession,
    localPersistenceOwnerId,
    redditUserId,
    saveSlotIndex: singlePlayerSaveSlotIndex,
    onPickupGranted: handlingPickupGranted,
  });

  const itemsRef = useRef(items);
  const inFlightPickupIdsRef = useRef(new Set<string>());
  const fullInventoryBlockedUntilByItemIdRef = useRef(
    new Map<string, number>()
  );
  const lastAutoPickupAttemptAtByItemIdRef = useRef(new Map<string, number>());
  const markerElementByIdRef = useRef<Map<string, HTMLDivElement>>(new Map());
  const wildlifeEatProgressRatioByItemIdRef = useRef(
    new Map<string, { current: number }>()
  );
  const idleProgressRatioRef = useRef(0);
  const [wildlifeEatingGroundItemIds, setWildlifeEatingGroundItemIds] =
    useState<ReadonlySet<string>>(() => new Set());
  const [hoveredGroundItemId, setHoveredGroundItemId] = useState<string | null>(
    null
  );
  const [pickupBlocked, setPickupBlocked] = useState<{
    readonly groundItemId: string;
    readonly reason: RenderingWorldPlazaGroundItemPickupBlockedReason;
  } | null>(null);

  itemsRef.current = items;

  const flashingPickupBlocked = useCallback(
    (
      groundItemId: string,
      reason: RenderingWorldPlazaGroundItemPickupBlockedReason
    ): void => {
      setPickupBlocked({ groundItemId, reason });
      window.setTimeout(() => {
        setPickupBlocked((current) =>
          current?.groundItemId === groundItemId ? null : current
        );
      }, RENDERING_WORLD_PLAZA_GROUND_ITEM_BLOCKED_HINT_MS);
    },
    []
  );

  const completingGroundItemPickupChannel = useCallback(
    (context: {
      readonly groundItem: DefiningWorldPlazaGroundItem;
      readonly quantityAccepted: number;
    }): void => {
      const playerPosition = playerPositionRef.current;

      if (!playerPosition) {
        return;
      }

      if (inFlightPickupIdsRef.current.has(context.groundItem.id)) {
        return;
      }

      inFlightPickupIdsRef.current.add(context.groundItem.id);
      sendingGroundPickup(
        context.groundItem.id,
        context.quantityAccepted,
        playerPosition.x,
        playerPosition.y
      )
        .catch(() => {
          flashingPickupBlocked(context.groundItem.id, 'range');
        })
        .finally(() => {
          inFlightPickupIdsRef.current.delete(context.groundItem.id);
        });
    },
    [flashingPickupBlocked, playerPositionRef, sendingGroundPickup]
  );

  const {
    progressRatioRef: pickupProgressRatioRef,
    startingGroundItemPickup,
    isGroundItemPickupActive,
    activePickupGroundItemId,
  } = usingWorldPlazaGroundItemPickupProgress({
    playerPositionRef,
    onPickupComplete: completingGroundItemPickupChannel,
  });

  useEffect(() => {
    if (!isOnlineSession && !isSinglePlayerSession) {
      registeringWildlifeGroundFoodBridge(null);
      return;
    }

    registeringWildlifeGroundFoodBridge({
      listGroundItems: () => itemsRef.current ?? [],
      consumeGroundFoodUnit: (groundItemId, consumerPosition) => {
        // Reduce itemsRef synchronously so same-tick wildlife bites do not
        // POST consume against a stack React state has not flushed yet.
        const currentItems = itemsRef.current ?? [];
        const existingItem = currentItems.find(
          (groundItem) => groundItem.id === groundItemId
        );

        if (!existingItem || existingItem.quantity <= 0) {
          return false;
        }

        itemsRef.current =
          existingItem.quantity <= 1
            ? currentItems.filter(
                (groundItem) => groundItem.id !== groundItemId
              )
            : currentItems.map((groundItem) =>
                groundItem.id === groundItemId
                  ? { ...groundItem, quantity: groundItem.quantity - 1 }
                  : groundItem
              );

        if (useLocalGroundItems && localPersistenceOwnerId) {
          const result = consumingWorldPlazaLocalGroundFoodUnit(
            localPersistenceOwnerId,
            {
              groundItemId,
              consumerX: consumerPosition.x,
              consumerY: consumerPosition.y,
            }
          );

          if (result.success) {
            reducingWorldPlazaLocalGroundItemQuantityOptimistically(
              groundItemId
            );
          } else {
            itemsRef.current = currentItems;
          }

          return result.success;
        }

        reducingWorldPlazaDevvitGroundItemQuantityOptimistically(groundItemId);
        void consumingWorldInventoryDevvitGroundFoodUnit(
          WORLD_INVENTORY_DEVVIT_GROUND_ITEMS_CONSUME_API_PATH,
          {
            groundItemId,
            consumerX: consumerPosition.x,
            consumerY: consumerPosition.y,
            saveSlotIndex: singlePlayerSaveSlotIndex,
          }
        ).catch(() => undefined);

        return true;
      },
    });

    return () => registeringWildlifeGroundFoodBridge(null);
  }, [
    isOnlineSession,
    isSinglePlayerSession,
    localPersistenceOwnerId,
    singlePlayerSaveSlotIndex,
    useLocalGroundItems,
  ]);

  useEffect(() => {
    initializingWorldPlazaGroundItemAutoPickupStoreFromStorage();
  }, []);

  useEffect(() => {
    syncingWorldPlazaGroundItemAutoPickupEligibility(items);
  }, [items]);

  const iconSizePx = useMemo(
    () =>
      computingWorldPlazaViewportHudScaledPx(
        DEFINING_WORLD_PLAZA_GROUND_ITEM_ICON_BASE_PX,
        viewportHudScale
      ),
    [viewportHudScale]
  );

  const iconButtonStyle = useMemo(
    () => ({
      width: iconSizePx,
      height: iconSizePx,
      fontSize: Math.max(12, Math.round(iconSizePx * 0.78)),
    }),
    [iconSizePx]
  );

  const glyphIconStyle = useMemo(
    () => ({
      width: Math.round(iconSizePx * 0.78),
      height: Math.round(iconSizePx * 0.78),
    }),
    [iconSizePx]
  );

  const pickupHintLiftPx = useMemo(
    () =>
      computingWorldPlazaViewportHudScaledPx(
        DEFINING_WORLD_PLAZA_GROUND_ITEM_PICKUP_HINT_LIFT_BASE_PX,
        viewportHudScale
      ),
    [viewportHudScale]
  );

  const pickupHintStyle = useMemo(
    () => ({
      transform: `translateY(-${pickupHintLiftPx}px)`,
    }),
    [pickupHintLiftPx]
  );

  const attemptingGroundItemPickup = useCallback(
    (
      groundItem: DefiningWorldPlazaGroundItem,
      options: RenderingWorldPlazaGroundItemPickupAttemptOptions
    ): void => {
      const playerPosition = playerPositionRef.current;

      if (!playerPosition) {
        return;
      }

      if (inFlightPickupIdsRef.current.has(groundItem.id)) {
        return;
      }

      if (isGroundItemPickupActive()) {
        return;
      }

      if (
        !checkingWorldPlazaGroundItemPickupInRange(playerPosition, groundItem)
      ) {
        if (options.showBlockedHints) {
          flashingPickupBlocked(groundItem.id, 'range');
        }
        return;
      }

      // Probe local inventory capacity without committing, then request only
      // what we can accept so the server never grants items we would drop.
      const capacityProbe = addingWorldPlazaInventoryItemWithStacking(
        inventoryStateRef.current,
        {
          id: 'ground-item-capacity-probe',
          itemTypeId: groundItem.itemTypeId,
          quantity: groundItem.quantity,
        },
        DEFINING_WORLD_PLAZA_INVENTORY_ITEM_REGISTRY
      );

      if (capacityProbe.quantityAccepted <= 0) {
        if (options.showBlockedHints) {
          flashingPickupBlocked(groundItem.id, 'full');
          fullInventoryBlockedUntilByItemIdRef.current.set(
            groundItem.id,
            Date.now() +
              DEFINING_WORLD_PLAZA_GROUND_ITEM_AUTO_PICKUP_FULL_INVENTORY_COOLDOWN_MS
          );
        }
        return;
      }

      const wildlifeStore = wildlifeStoreRef?.current ?? null;
      const nowMs = Date.now();
      const isContested = checkingWildlifeGroundItemIsContestedByEater(
        wildlifeStore,
        groundItem.id,
        nowMs
      );

      const didStart = startingGroundItemPickup({
        groundItem,
        quantityAccepted: capacityProbe.quantityAccepted,
        durationMs: isContested
          ? rollingWildlifeContestedGroundFoodPickupDurationMs()
          : undefined,
        onPickupStarted: () => {
          if (!isContested || !wildlifeStore) {
            return;
          }

          applyingWildlifeMealTheftAggroForGroundItem({
            store: wildlifeStore,
            groundItemId: groundItem.id,
            playerTargetId: resolvedPlayerTargetId,
            nowMs: Date.now(),
          });
        },
      });

      if (!didStart && options.showBlockedHints) {
        flashingPickupBlocked(groundItem.id, 'range');
      }
    },
    [
      flashingPickupBlocked,
      isGroundItemPickupActive,
      playerPositionRef,
      resolvedPlayerTargetId,
      startingGroundItemPickup,
      wildlifeStoreRef,
    ]
  );

  useEffect(() => {
    if (items.length === 0) {
      setWildlifeEatingGroundItemIds((current) =>
        current.size === 0 ? current : new Set()
      );
      return;
    }

    let animationFrameId = 0;

    const updatingGroundItemPositions = (): void => {
      const cameraOffset = cameraOffsetRef.current;
      const cameraWorldZoom = cameraWorldZoomRef.current;
      const playerPosition = playerPositionRef.current;
      const viewportHeightPx = window.innerHeight;
      // Wildlife sim stamps `lastAttackAtMs` with wall clock (`Date.now()`), so
      // the eat-ring progress reader must use the same clock (not performance.now).
      const now = Date.now();
      const nextEatingIds = new Set<string>();
      const wildlifeStore = wildlifeStoreRef?.current ?? null;

      for (const groundItem of itemsRef.current) {
        const markerElement = markerElementByIdRef.current.get(groundItem.id);

        if (markerElement) {
          const screenPoint = resolvingWorldPlazaGroundItemScreenPoint(
            groundItem,
            cameraOffset,
            cameraWorldZoom
          );

          markerElement.style.transform = `translate(${screenPoint.x}px, ${screenPoint.y}px) translate(-50%, -100%)`;
          markerElement.style.visibility =
            checkingWorldPlazaGroundItemMarkerOccludedByBottomHud(
              screenPoint.y,
              viewportHeightPx,
              viewportHudScale
            )
              ? 'hidden'
              : 'visible';
        }

        const eatProgress = resolvingWildlifeGroundFoodEatProgressByItemId(
          wildlifeStore,
          groundItem.id,
          now
        );

        if (eatProgress.isActive) {
          nextEatingIds.add(groundItem.id);
          let progressRatioRef =
            wildlifeEatProgressRatioByItemIdRef.current.get(groundItem.id);

          if (!progressRatioRef) {
            progressRatioRef = { current: eatProgress.progressRatio };
            wildlifeEatProgressRatioByItemIdRef.current.set(
              groundItem.id,
              progressRatioRef
            );
          } else {
            progressRatioRef.current = eatProgress.progressRatio;
          }
        } else {
          wildlifeEatProgressRatioByItemIdRef.current.delete(groundItem.id);
        }

        if (
          !playerPosition ||
          !checkingWorldPlazaGroundItemAutoPickupEnabled()
        ) {
          continue;
        }

        if (isGroundItemPickupActive()) {
          continue;
        }

        if (inFlightPickupIdsRef.current.has(groundItem.id)) {
          continue;
        }

        const lastAutoPickupAttemptAt =
          lastAutoPickupAttemptAtByItemIdRef.current.get(groundItem.id) ?? 0;

        if (
          now - lastAutoPickupAttemptAt <
          DEFINING_WORLD_PLAZA_GROUND_ITEM_AUTO_PICKUP_RETRY_INTERVAL_MS
        ) {
          continue;
        }

        const fullInventoryBlockedUntil =
          fullInventoryBlockedUntilByItemIdRef.current.get(groundItem.id);

        if (
          fullInventoryBlockedUntil !== undefined &&
          now < fullInventoryBlockedUntil
        ) {
          continue;
        }

        if (
          !checkingWorldPlazaGroundItemPickupInRange(playerPosition, groundItem)
        ) {
          continue;
        }

        if (!checkingWorldPlazaGroundItemAutoPickupEligible(groundItem.id)) {
          continue;
        }

        lastAutoPickupAttemptAtByItemIdRef.current.set(groundItem.id, now);
        attemptingGroundItemPickup(groundItem, { showBlockedHints: true });
      }

      setWildlifeEatingGroundItemIds((current) => {
        if (
          current.size === nextEatingIds.size &&
          [...nextEatingIds].every((id) => current.has(id))
        ) {
          return current;
        }

        return nextEatingIds;
      });

      animationFrameId = window.requestAnimationFrame(
        updatingGroundItemPositions
      );
    };

    animationFrameId = window.requestAnimationFrame(
      updatingGroundItemPositions
    );

    return () => {
      window.cancelAnimationFrame(animationFrameId);
    };
  }, [
    attemptingGroundItemPickup,
    cameraOffsetRef,
    cameraWorldZoomRef,
    isGroundItemPickupActive,
    items.length,
    playerPositionRef,
    viewportHudScale,
    wildlifeStoreRef,
  ]);

  const pickingUpGroundItem = useCallback(
    (groundItem: DefiningWorldPlazaGroundItem): void => {
      attemptingGroundItemPickup(groundItem, { showBlockedHints: true });
    },
    [attemptingGroundItemPickup]
  );

  if (!isReady || items.length === 0) {
    return null;
  }

  return (
    <>
      {items.map((groundItem) => {
        const typeDef =
          DEFINING_WORLD_PLAZA_INVENTORY_ITEM_REGISTRY.resolvingItemType(
            groundItem.itemTypeId
          );
        const playerPosition = playerPositionRef.current;
        const isInRange =
          playerPosition !== undefined &&
          playerPosition !== null &&
          checkingWorldPlazaGroundItemPickupInRange(playerPosition, groundItem);
        const isHovered = hoveredGroundItemId === groundItem.id;
        const isPickupBlocked = pickupBlocked?.groundItemId === groundItem.id;
        const isInventoryFullBlock =
          isPickupBlocked && pickupBlocked?.reason === 'full';
        const hintText = !isInRange
          ? 'Too far'
          : isInventoryFullBlock
            ? 'Full'
            : (typeDef?.name ?? groundItem.itemTypeId);

        const isWildlifeEating = wildlifeEatingGroundItemIds.has(groundItem.id);
        const isPlayerPickingUp = activePickupGroundItemId === groundItem.id;
        let wildlifeEatProgressRatioRef =
          wildlifeEatProgressRatioByItemIdRef.current.get(groundItem.id);

        if (isWildlifeEating && !wildlifeEatProgressRatioRef) {
          wildlifeEatProgressRatioRef = { current: 0 };
          wildlifeEatProgressRatioByItemIdRef.current.set(
            groundItem.id,
            wildlifeEatProgressRatioRef
          );
        }

        const ringProgressRatioRef = isPlayerPickingUp
          ? pickupProgressRatioRef
          : isWildlifeEating
            ? (wildlifeEatProgressRatioRef ?? idleProgressRatioRef)
            : idleProgressRatioRef;
        const isRingVisible = isPlayerPickingUp || isWildlifeEating;

        return (
          <div
            key={groundItem.id}
            ref={(element) => {
              if (element) {
                markerElementByIdRef.current.set(groundItem.id, element);
                return;
              }

              markerElementByIdRef.current.delete(groundItem.id);
            }}
            className={STYLING_WORLD_PLAZA_GROUND_ITEM_ROOT_CLASS_NAME}
            style={{
              transform: RENDERING_WORLD_PLAZA_GROUND_ITEM_HIDDEN_TRANSFORM,
            }}
          >
            {isHovered || isPickupBlocked ? (
              <span
                className={
                  isInRange && !isInventoryFullBlock
                    ? STYLING_WORLD_PLAZA_GROUND_ITEM_PICKUP_HINT_CLASS_NAME
                    : STYLING_WORLD_PLAZA_GROUND_ITEM_TOO_FAR_HINT_CLASS_NAME
                }
                style={pickupHintStyle}
              >
                {hintText}
              </span>
            ) : null}
            <button
              type="button"
              {...{ [DEFINING_WORLD_PLAZA_UI_DATA_ATTRIBUTE]: '' }}
              className={cn(
                STYLING_WORLD_PLAZA_GROUND_ITEM_BUTTON_CLASS_NAME,
                STYLING_WORLD_PLAZA_GROUND_ITEM_FLOAT_CLASS_NAME,
                'relative'
              )}
              style={iconButtonStyle}
              aria-label={`Pick up ${typeDef?.name ?? groundItem.itemTypeId}`}
              onPointerEnter={() => {
                setHoveredGroundItemId(groundItem.id);
              }}
              onPointerLeave={() => {
                setHoveredGroundItemId((currentId) =>
                  currentId === groundItem.id ? null : currentId
                );
              }}
              onClick={(event) => {
                event.stopPropagation();
                pickingUpGroundItem(groundItem);
              }}
            >
              <RenderingWorldPlazaGroundItemProgressRing
                isVisible={isRingVisible}
                progressRatioRef={ringProgressRatioRef}
                viewportHudScale={viewportHudScale}
              />
              <RenderingWorldPlazaInventoryItemGlyph
                itemTypeId={groundItem.itemTypeId}
                registry={DEFINING_WORLD_PLAZA_INVENTORY_ITEM_REGISTRY}
                iconClassName={cn(
                  'shrink-0',
                  STYLING_WORLD_PLAZA_GROUND_ITEM_GLYPH_OUTLINE_CLASS_NAME
                )}
                emojiClassName={
                  STYLING_WORLD_PLAZA_GROUND_ITEM_GLYPH_OUTLINE_CLASS_NAME
                }
                iconStyle={glyphIconStyle}
              />
            </button>
            {groundItem.quantity > 1 ? (
              <span
                className={STYLING_WORLD_PLAZA_GROUND_ITEM_QUANTITY_CLASS_NAME}
              >
                {groundItem.quantity}
              </span>
            ) : null}
          </div>
        );
      })}
    </>
  );
}
