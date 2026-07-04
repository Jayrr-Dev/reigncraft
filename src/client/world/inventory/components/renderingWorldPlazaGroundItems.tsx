'use client';

/**
 * Floating ground item markers with walk-over auto-pickup and click fallback.
 *
 * @module components/world/inventory/components/renderingWorldPlazaGroundItems
 */

import { addingInventoryItemWithStacking } from '@/components/inventory/domains/reducingInventoryState';
import { computingWorldPlazaViewportHudScaledPx } from '@/components/world/domains/computingWorldPlazaViewportHudScale';
import type { DefiningWorldPlazaCameraOffset } from '@/components/world/domains/definingWorldPlazaCameraOffset';
import { DEFINING_WORLD_PLAZA_UI_DATA_ATTRIBUTE } from '@/components/world/domains/definingWorldPlazaClickMovementConstants';
import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import { checkingWorldPlazaGroundItemPickupInRange } from '@/components/world/inventory/domains/checkingWorldPlazaGroundItemPickupInRange';
import type { DefiningWorldPlazaGroundItem } from '@/components/world/inventory/domains/definingWorldPlazaGroundItem';
import {
  DEFINING_WORLD_PLAZA_GROUND_ITEM_AUTO_PICKUP_FULL_INVENTORY_COOLDOWN_MS,
  DEFINING_WORLD_PLAZA_GROUND_ITEM_ICON_BASE_PX,
  DEFINING_WORLD_PLAZA_GROUND_ITEM_PICKUP_HINT_LIFT_BASE_PX,
  STYLING_WORLD_PLAZA_GROUND_ITEM_BUTTON_CLASS_NAME,
  STYLING_WORLD_PLAZA_GROUND_ITEM_FLOAT_CLASS_NAME,
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
import { resolvingWorldPlazaGroundItemScreenPoint } from '@/components/world/inventory/domains/resolvingWorldPlazaGroundItemScreenPoint';
import { usingWorldPlazaGroundItems } from '@/components/world/inventory/hooks/usingWorldPlazaGroundItems';
import { usingWorldPlazaInventory } from '@/components/world/inventory/hooks/usingWorldPlazaInventory';
import { cn } from '@/lib/utils';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { PlazaSaveSlotIndex } from '../../../../shared/plazaGameSession';

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
}: RenderingWorldPlazaGroundItemsProps): React.JSX.Element | null {
  const isOnlineSession = onlineUserId !== null && onlineUserId.length > 0;
  const isSinglePlayerSession =
    !isOnlineSession && localPersistenceOwnerId !== null;
  const singlePlayerSaveSlotIndex = isSinglePlayerSession
    ? saveSlotIndex
    : null;
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
    }): void => {
      if (grant.quantity <= 0) {
        return;
      }

      addItemWithStacking({
        id: crypto.randomUUID(),
        itemTypeId: grant.itemTypeId,
        quantity: grant.quantity,
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
  const markerElementByIdRef = useRef<Map<string, HTMLDivElement>>(new Map());
  const [hoveredGroundItemId, setHoveredGroundItemId] = useState<string | null>(
    null
  );
  const [pickupBlocked, setPickupBlocked] = useState<{
    readonly groundItemId: string;
    readonly reason: RenderingWorldPlazaGroundItemPickupBlockedReason;
  } | null>(null);

  itemsRef.current = items;

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
      fontSize: Math.max(12, Math.round(iconSizePx * 0.55)),
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
      const capacityProbe = addingInventoryItemWithStacking(
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

      inFlightPickupIdsRef.current.add(groundItem.id);
      sendingGroundPickup(
        groundItem.id,
        capacityProbe.quantityAccepted,
        playerPosition.x,
        playerPosition.y
      )
        .catch(() => {
          if (options.showBlockedHints) {
            flashingPickupBlocked(groundItem.id, 'range');
          }
        })
        .finally(() => {
          inFlightPickupIdsRef.current.delete(groundItem.id);
        });
    },
    [flashingPickupBlocked, playerPositionRef, sendingGroundPickup]
  );

  useEffect(() => {
    if (items.length === 0) {
      return;
    }

    let animationFrameId = 0;

    const updatingGroundItemPositions = (): void => {
      const cameraOffset = cameraOffsetRef.current;
      const cameraWorldZoom = cameraWorldZoomRef.current;
      const playerPosition = playerPositionRef.current;
      const now = Date.now();

      for (const groundItem of itemsRef.current) {
        const markerElement = markerElementByIdRef.current.get(groundItem.id);

        if (markerElement) {
          const screenPoint = resolvingWorldPlazaGroundItemScreenPoint(
            groundItem,
            cameraOffset,
            cameraWorldZoom
          );

          markerElement.style.transform = `translate(${screenPoint.x}px, ${screenPoint.y}px) translate(-50%, -100%)`;
        }

        if (!playerPosition) {
          continue;
        }

        if (inFlightPickupIdsRef.current.has(groundItem.id)) {
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

        attemptingGroundItemPickup(groundItem, { showBlockedHints: true });
      }

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
    items.length,
    playerPositionRef,
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
        const Icon = typeDef?.Icon;
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
            : 'Pick up';

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
                STYLING_WORLD_PLAZA_GROUND_ITEM_FLOAT_CLASS_NAME
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
              {Icon ? (
                <Icon
                  className="shrink-0"
                  style={{
                    width: Math.round(iconSizePx * 0.55),
                    height: Math.round(iconSizePx * 0.55),
                  }}
                  aria-hidden
                />
              ) : (
                <span aria-hidden>{typeDef?.iconEmoji ?? '?'}</span>
              )}
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
