"use client";

/**
 * Client mirror of the authoritative Colyseus ground item map.
 *
 * Ground items live in shared room state keyed by an immutable server-assigned
 * id, so pickups resolve on the server and propagate to every client without
 * duplication. This hook reflects that state and forwards pickup requests.
 *
 * @module components/world/inventory/hooks/usingWorldPlazaColyseusGroundItems
 */

import {
  DEFINING_WORLD_PLAZA_COLYSEUS_GROUND_PICKUP_GRANT_MESSAGE,
  DEFINING_WORLD_PLAZA_COLYSEUS_GROUND_PICKUP_MESSAGE,
  type DefiningWorldPlazaColyseusGroundPickupGrantPayload,
  type DefiningWorldPlazaColyseusGroundPickupSendPayload,
} from "@/components/world/colyseus/domains/definingWorldPlazaColyseusConstants";
import {
  usingWorldPlazaColyseusRoomContext,
  usingWorldPlazaColyseusRoomMessageContext,
} from "@/components/world/colyseus/domains/creatingWorldPlazaColyseusRoomContext";
import type { DefiningWorldPlazaColyseusGroundItem } from "@/components/world/colyseus/domains/definingWorldPlazaColyseusState";
import type { DefiningWorldPlazaGroundItem } from "@/components/world/inventory/domains/definingWorldPlazaGroundItem";
import { checkingWorldPlazaGroundItemIsLegacyDemoSeed } from "@/components/world/inventory/domains/checkingWorldPlazaGroundItemIsLegacyDemoSeed";
import { Callbacks } from "@colyseus/sdk";
import { useCallback, useEffect, useRef, useState } from "react";

/** Params for {@link usingWorldPlazaColyseusGroundItems}. */
export interface UsingWorldPlazaColyseusGroundItemsParams {
  /** Invoked when the server grants a pickup to this client only. */
  readonly onPickupGranted: (
    grant: DefiningWorldPlazaColyseusGroundPickupGrantPayload,
  ) => void;
}

/** Return shape for {@link usingWorldPlazaColyseusGroundItems}. */
export interface UsingWorldPlazaColyseusGroundItemsResult {
  /** Live shared ground items mirrored from room state. */
  readonly items: readonly DefiningWorldPlazaGroundItem[];
  /** True once connected to a room. */
  readonly isReady: boolean;
  /** Requests an authoritative pickup of one ground item. */
  readonly sendingGroundPickup: (
    groundItemId: string,
    requestedQuantity: number,
  ) => void;
}

/**
 * Maps a synchronized schema ground item into the plain client domain type.
 *
 * @param schemaItem - Colyseus ground item schema instance
 */
function mappingColyseusGroundItem(
  schemaItem: DefiningWorldPlazaColyseusGroundItem,
): DefiningWorldPlazaGroundItem {
  return {
    id: schemaItem.id,
    itemTypeId: schemaItem.itemTypeId,
    quantity: schemaItem.quantity,
    gridX: schemaItem.gridX,
    gridY: schemaItem.gridY,
    layer: schemaItem.layer,
    spawnedAt: schemaItem.spawnedAtMs,
  };
}

/**
 * Subscribes to the shared Colyseus ground item map and exposes pickup sends.
 *
 * Must render inside the plaza Colyseus room provider.
 *
 * @param params - Pickup grant callback
 */
export function usingWorldPlazaColyseusGroundItems(
  params: UsingWorldPlazaColyseusGroundItemsParams,
): UsingWorldPlazaColyseusGroundItemsResult {
  const { room } = usingWorldPlazaColyseusRoomContext();
  const [items, setItems] = useState<readonly DefiningWorldPlazaGroundItem[]>(
    [],
  );
  const itemsByIdRef = useRef<Map<string, DefiningWorldPlazaGroundItem>>(
    new Map(),
  );

  const onPickupGrantedRef = useRef(params.onPickupGranted);
  onPickupGrantedRef.current = params.onPickupGranted;

  const publishingGroundItems = useCallback((): void => {
    setItems(
      Array.from(itemsByIdRef.current.values()).filter(
        (groundItem) => !checkingWorldPlazaGroundItemIsLegacyDemoSeed(groundItem),
      ),
    );
  }, []);

  usingWorldPlazaColyseusRoomMessageContext(
    DEFINING_WORLD_PLAZA_COLYSEUS_GROUND_PICKUP_GRANT_MESSAGE,
    (payload: DefiningWorldPlazaColyseusGroundPickupGrantPayload) => {
      onPickupGrantedRef.current(payload);
    },
  );

  useEffect(() => {
    itemsByIdRef.current.clear();
    setItems([]);

    if (!room) {
      return;
    }

    const callbacks = Callbacks.get(room);

    const attachingGroundItemChangeListener = (
      schemaItem: DefiningWorldPlazaColyseusGroundItem,
      groundItemId: string,
    ): void => {
      callbacks.onChange(schemaItem, () => {
        itemsByIdRef.current.set(
          groundItemId,
          mappingColyseusGroundItem(schemaItem),
        );
        publishingGroundItems();
      });
    };

    const detachAdd = callbacks.onAdd(
      "groundItems",
      (schemaItem, groundItemId) => {
        itemsByIdRef.current.set(
          groundItemId,
          mappingColyseusGroundItem(schemaItem),
        );
        publishingGroundItems();
        attachingGroundItemChangeListener(schemaItem, groundItemId);
      },
    );

    const detachRemove = callbacks.onRemove("groundItems", (_item, groundItemId) => {
      itemsByIdRef.current.delete(groundItemId);
      publishingGroundItems();
    });

    const hydratingExistingGroundItems = (): void => {
      const groundItems = room.state?.groundItems;

      if (!groundItems) {
        return;
      }

      for (const [groundItemId, schemaItem] of groundItems.entries()) {
        if (itemsByIdRef.current.has(groundItemId)) {
          continue;
        }

        itemsByIdRef.current.set(
          groundItemId,
          mappingColyseusGroundItem(schemaItem),
        );
        attachingGroundItemChangeListener(schemaItem, groundItemId);
      }

      publishingGroundItems();
    };

    hydratingExistingGroundItems();

    room.onStateChange(hydratingExistingGroundItems);

    return () => {
      room.onStateChange.remove(hydratingExistingGroundItems);
      detachAdd?.();
      detachRemove?.();
      itemsByIdRef.current.clear();
      setItems([]);
    };
  }, [room, publishingGroundItems]);

  const sendingGroundPickup = useCallback(
    (groundItemId: string, requestedQuantity: number): void => {
      if (!room) {
        return;
      }

      const payload: DefiningWorldPlazaColyseusGroundPickupSendPayload = {
        groundItemId,
        requestedQuantity,
      };

      room.send(DEFINING_WORLD_PLAZA_COLYSEUS_GROUND_PICKUP_MESSAGE, payload);
    },
    [room],
  );

  return {
    items,
    isReady: Boolean(room),
    sendingGroundPickup,
  };
}
