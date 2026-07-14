'use client';

import type { DefiningInventoryState } from '@/components/inventory/domains/definingInventoryItem';
import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import { subscribingWorldPlazaDomOverlayFrame } from '@/components/world/domains/schedulingWorldPlazaDomOverlayFrame';
import { scoutingWorldPlazaRareBiomesWhileLucky } from '@/components/world/domains/scoutingWorldPlazaRareBiomesWhileLucky';
import {
  DEFINING_WORLD_PLAZA_FOUR_LEAF_CLOVER_DECAY_REAL_MS_AFTER_PICKUP,
  DEFINING_WORLD_PLAZA_FOUR_LEAF_CLOVER_DURABILITY_MAX,
  DEFINING_WORLD_PLAZA_FOUR_LEAF_CLOVER_PICKED_AT_MS_METADATA_KEY,
  DEFINING_WORLD_PLAZA_LUCKY_BUFF_ATTACKER_ID,
  DEFINING_WORLD_PLAZA_LUCKY_BUFF_DEFENDER_ID,
  DEFINING_WORLD_PLAZA_LUCKY_CHARM_ITEM_TYPE_ID,
} from '@/components/world/inventory/domains/definingWorldPlazaInventoryCloverConstants';
import { DEFINING_WORLD_PLAZA_INVENTORY_DURABILITY_METADATA_KEY } from '@/components/world/inventory/domains/definingWorldPlazaInventoryDurabilityConstants';
import { registeringWorldPlazaHeldLuckyBuffBridge } from '@/components/world/inventory/domains/managingWorldPlazaHeldLuckyBuffBridge';
import { resolvingWorldPlazaInventoryItemDurability } from '@/components/world/inventory/domains/resolvingWorldPlazaInventoryItemDurability';
import { useLayoutEffect, useRef, type RefObject } from 'react';

const SCOUT_INTERVAL_MS = 2_000;

export type UsingWorldPlazaHeldFourLeafCloverCharmParams = {
  readonly enabled: boolean;
  readonly inventoryState: DefiningInventoryState;
  readonly updatingInventoryState: (
    updater: (
      currentState: DefiningInventoryState
    ) => DefiningInventoryState | null
  ) => void;
  readonly toggleBuffRef: RefObject<((buffId: string) => void) | undefined>;
  readonly playerPositionRef: RefObject<DefiningWorldPlazaWorldPoint | null>;
};

function parsingWorldPlazaFourLeafCloverPickedAtMs(
  rawPickedAtMs: unknown,
  nowEpochMs: number
): { readonly pickedAtMs: number; readonly didStampPickupTime: boolean } {
  const numericPickedAtMs =
    typeof rawPickedAtMs === 'number'
      ? rawPickedAtMs
      : typeof rawPickedAtMs === 'string'
        ? Number(rawPickedAtMs)
        : Number.NaN;

  if (
    Number.isFinite(numericPickedAtMs) &&
    numericPickedAtMs > 0 &&
    numericPickedAtMs <= nowEpochMs
  ) {
    return { pickedAtMs: numericPickedAtMs, didStampPickupTime: false };
  }

  return { pickedAtMs: nowEpochMs, didStampPickupTime: true };
}

function agingWorldPlazaFourLeafCloversFromPickupTime(
  state: DefiningInventoryState,
  nowEpochMs: number
): DefiningInventoryState | null {
  let didChange = false;
  const nextSlots = state.slots.map((slot) => {
    if (
      !slot ||
      slot.itemTypeId !== DEFINING_WORLD_PLAZA_LUCKY_CHARM_ITEM_TYPE_ID
    ) {
      return slot;
    }

    const { pickedAtMs, didStampPickupTime } =
      parsingWorldPlazaFourLeafCloverPickedAtMs(
        slot.metadata?.[
          DEFINING_WORLD_PLAZA_FOUR_LEAF_CLOVER_PICKED_AT_MS_METADATA_KEY
        ],
        nowEpochMs
      );
    const elapsedSincePickupMs = Math.max(0, nowEpochMs - pickedAtMs);
    const nextRemaining = Math.max(
      0,
      Math.ceil(
        DEFINING_WORLD_PLAZA_FOUR_LEAF_CLOVER_DURABILITY_MAX *
          (1 -
            elapsedSincePickupMs /
              DEFINING_WORLD_PLAZA_FOUR_LEAF_CLOVER_DECAY_REAL_MS_AFTER_PICKUP)
      )
    );
    const durabilitySnapshot = resolvingWorldPlazaInventoryItemDurability(slot);

    if (nextRemaining <= 0) {
      didChange = true;
      return null;
    }

    if (
      !didStampPickupTime &&
      durabilitySnapshot?.remaining === nextRemaining
    ) {
      return slot;
    }

    didChange = true;
    return {
      ...slot,
      metadata: {
        ...slot.metadata,
        [DEFINING_WORLD_PLAZA_FOUR_LEAF_CLOVER_PICKED_AT_MS_METADATA_KEY]:
          pickedAtMs,
        [DEFINING_WORLD_PLAZA_INVENTORY_DURABILITY_METADATA_KEY]: nextRemaining,
      },
    };
  });

  return didChange
    ? {
        capacity: state.capacity,
        slots: nextSlots,
      }
    : null;
}

function clearingWorldPlazaLuckyBuffPresentation(
  toggleBuff: ((buffId: string) => void) | undefined
): void {
  registeringWorldPlazaHeldLuckyBuffBridge(false);
  toggleBuff?.(DEFINING_WORLD_PLAZA_LUCKY_BUFF_DEFENDER_ID);
  toggleBuff?.(DEFINING_WORLD_PLAZA_LUCKY_BUFF_ATTACKER_ID);
}

/**
 * Ages every four-leaf clover from pickup and applies luck while one is
 * carried anywhere in the inventory.
 */
export function usingWorldPlazaHeldFourLeafCloverCharm({
  enabled,
  inventoryState,
  updatingInventoryState,
  toggleBuffRef,
  playerPositionRef,
}: UsingWorldPlazaHeldFourLeafCloverCharmParams): void {
  const inventoryStateRef = useRef(inventoryState);
  const updatingInventoryStateRef = useRef(updatingInventoryState);
  const wasLuckyActiveRef = useRef(false);
  const lastScoutAtMsRef = useRef<number | null>(null);

  inventoryStateRef.current = inventoryState;
  updatingInventoryStateRef.current = updatingInventoryState;

  useLayoutEffect(() => {
    if (!enabled) {
      if (wasLuckyActiveRef.current) {
        clearingWorldPlazaLuckyBuffPresentation(toggleBuffRef.current);
        wasLuckyActiveRef.current = false;
      }

      return;
    }

    const syncingHeldCharm = (_deltaMs: number, frameTimeMs: number): void => {
      const nowEpochMs = Date.now();
      const currentState = inventoryStateRef.current;
      const agedState = agingWorldPlazaFourLeafCloversFromPickupTime(
        currentState,
        nowEpochMs
      );

      if (agedState) {
        updatingInventoryStateRef.current((latestState) =>
          agingWorldPlazaFourLeafCloversFromPickupTime(latestState, nowEpochMs)
        );
      }

      const activeState = agedState ?? currentState;
      const shouldBeActive = activeState.slots.some((slot) => {
        if (
          !slot ||
          slot.itemTypeId !== DEFINING_WORLD_PLAZA_LUCKY_CHARM_ITEM_TYPE_ID
        ) {
          return false;
        }

        const durabilitySnapshot =
          resolvingWorldPlazaInventoryItemDurability(slot);

        return Boolean(durabilitySnapshot && durabilitySnapshot.remaining > 0);
      });

      if (shouldBeActive && !wasLuckyActiveRef.current) {
        registeringWorldPlazaHeldLuckyBuffBridge(true);
        toggleBuffRef.current?.(DEFINING_WORLD_PLAZA_LUCKY_BUFF_DEFENDER_ID);
        toggleBuffRef.current?.(DEFINING_WORLD_PLAZA_LUCKY_BUFF_ATTACKER_ID);
        wasLuckyActiveRef.current = true;
      } else if (!shouldBeActive && wasLuckyActiveRef.current) {
        clearingWorldPlazaLuckyBuffPresentation(toggleBuffRef.current);
        wasLuckyActiveRef.current = false;
      }

      if (!shouldBeActive) {
        return;
      }

      const playerPosition = playerPositionRef.current;
      const lastScoutAtMs = lastScoutAtMsRef.current ?? 0;

      if (playerPosition && frameTimeMs - lastScoutAtMs >= SCOUT_INTERVAL_MS) {
        scoutingWorldPlazaRareBiomesWhileLucky(playerPosition);
        lastScoutAtMsRef.current = frameTimeMs;
      }
    };

    const unsubscribe = subscribingWorldPlazaDomOverlayFrame(syncingHeldCharm);

    return () => {
      unsubscribe();

      if (wasLuckyActiveRef.current) {
        clearingWorldPlazaLuckyBuffPresentation(toggleBuffRef.current);
        wasLuckyActiveRef.current = false;
      }
    };
  }, [enabled, playerPositionRef, toggleBuffRef]);
}
