'use client';

import type { DefiningInventoryState } from '@/components/inventory/domains/definingInventoryItem';
import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import { subscribingWorldPlazaDomOverlayFrame } from '@/components/world/domains/schedulingWorldPlazaDomOverlayFrame';
import { scoutingWorldPlazaRareBiomesWhileLucky } from '@/components/world/domains/scoutingWorldPlazaRareBiomesWhileLucky';
import {
  DEFINING_WORLD_PLAZA_FOUR_LEAF_CLOVER_DECAY_REAL_MS_WHILE_HELD,
  DEFINING_WORLD_PLAZA_FOUR_LEAF_CLOVER_DURABILITY_MAX,
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
  readonly selectedSlotIndex: number | null;
  readonly inventoryState: DefiningInventoryState;
  readonly updatingInventoryState: (
    updater: (
      currentState: DefiningInventoryState
    ) => DefiningInventoryState | null
  ) => void;
  readonly toggleBuffRef: RefObject<((buffId: string) => void) | undefined>;
  readonly playerPositionRef: RefObject<DefiningWorldPlazaWorldPoint | null>;
};

function cloningInventorySlotsWithSlotUpdate(
  slots: DefiningInventoryState['slots'],
  slotIndex: number,
  nextSlot: DefiningInventoryState['slots'][number]
): DefiningInventoryState['slots'] {
  const nextSlots = [...slots];
  nextSlots[slotIndex] = nextSlot;
  return nextSlots;
}

/**
 * Applies lucky-charm buffs and durability decay while the four-leaf clover is held.
 */
export function usingWorldPlazaHeldFourLeafCloverCharm({
  enabled,
  selectedSlotIndex,
  inventoryState,
  updatingInventoryState,
  toggleBuffRef,
  playerPositionRef,
}: UsingWorldPlazaHeldFourLeafCloverCharmParams): void {
  const inventoryStateRef = useRef(inventoryState);
  const selectedSlotIndexRef = useRef(selectedSlotIndex);
  const wasLuckyActiveRef = useRef(false);
  const lastDecayAtMsRef = useRef<number | null>(null);
  const lastScoutAtMsRef = useRef<number | null>(null);

  inventoryStateRef.current = inventoryState;
  selectedSlotIndexRef.current = selectedSlotIndex;

  useLayoutEffect(() => {
    if (!enabled) {
      if (wasLuckyActiveRef.current) {
        toggleBuffRef.current?.(DEFINING_WORLD_PLAZA_LUCKY_BUFF_DEFENDER_ID);
        toggleBuffRef.current?.(DEFINING_WORLD_PLAZA_LUCKY_BUFF_ATTACKER_ID);
        registeringWorldPlazaHeldLuckyBuffBridge(false);
        wasLuckyActiveRef.current = false;
      }

      lastDecayAtMsRef.current = null;
      return;
    }

    const syncingHeldCharm = (frameTimeMs: number): void => {
      const slotIndex = selectedSlotIndexRef.current;
      const state = inventoryStateRef.current;
      const slotItem =
        slotIndex === null || slotIndex < 0 || slotIndex >= state.capacity
          ? null
          : state.slots[slotIndex];
      const durabilitySnapshot =
        slotItem &&
        slotItem.itemTypeId === DEFINING_WORLD_PLAZA_LUCKY_CHARM_ITEM_TYPE_ID
          ? resolvingWorldPlazaInventoryItemDurability(slotItem)
          : null;
      const shouldBeActive = Boolean(
        durabilitySnapshot && durabilitySnapshot.remaining > 0
      );

      if (shouldBeActive && !wasLuckyActiveRef.current) {
        toggleBuffRef.current?.(DEFINING_WORLD_PLAZA_LUCKY_BUFF_DEFENDER_ID);
        toggleBuffRef.current?.(DEFINING_WORLD_PLAZA_LUCKY_BUFF_ATTACKER_ID);
        registeringWorldPlazaHeldLuckyBuffBridge(true);
        wasLuckyActiveRef.current = true;
        lastDecayAtMsRef.current = frameTimeMs;
      } else if (!shouldBeActive && wasLuckyActiveRef.current) {
        toggleBuffRef.current?.(DEFINING_WORLD_PLAZA_LUCKY_BUFF_DEFENDER_ID);
        toggleBuffRef.current?.(DEFINING_WORLD_PLAZA_LUCKY_BUFF_ATTACKER_ID);
        registeringWorldPlazaHeldLuckyBuffBridge(false);
        wasLuckyActiveRef.current = false;
        lastDecayAtMsRef.current = null;
      }

      if (
        !shouldBeActive ||
        slotIndex === null ||
        !slotItem ||
        !durabilitySnapshot
      ) {
        return;
      }

      const previousDecayAtMs = lastDecayAtMsRef.current ?? frameTimeMs;
      const elapsedMs = Math.max(0, frameTimeMs - previousDecayAtMs);
      lastDecayAtMsRef.current = frameTimeMs;

      if (elapsedMs <= 0) {
        return;
      }

      const wearAmount =
        (elapsedMs /
          DEFINING_WORLD_PLAZA_FOUR_LEAF_CLOVER_DECAY_REAL_MS_WHILE_HELD) *
        DEFINING_WORLD_PLAZA_FOUR_LEAF_CLOVER_DURABILITY_MAX;
      const nextRemaining = Math.max(
        0,
        durabilitySnapshot.remaining - wearAmount
      );

      if (nextRemaining === durabilitySnapshot.remaining) {
        const playerPosition = playerPositionRef.current;
        const lastScoutAtMs = lastScoutAtMsRef.current ?? 0;

        if (
          playerPosition &&
          frameTimeMs - lastScoutAtMs >= SCOUT_INTERVAL_MS
        ) {
          scoutingWorldPlazaRareBiomesWhileLucky(playerPosition);
          lastScoutAtMsRef.current = frameTimeMs;
        }

        return;
      }

      updatingInventoryState((currentState) => {
        const currentSlot = currentState.slots[slotIndex];

        if (!currentSlot || currentSlot.id !== slotItem.id) {
          return null;
        }

        if (nextRemaining <= 0) {
          return {
            capacity: currentState.capacity,
            slots: cloningInventorySlotsWithSlotUpdate(
              currentState.slots,
              slotIndex,
              null
            ),
          };
        }

        return {
          capacity: currentState.capacity,
          slots: cloningInventorySlotsWithSlotUpdate(
            currentState.slots,
            slotIndex,
            {
              ...currentSlot,
              metadata: {
                ...currentSlot.metadata,
                [DEFINING_WORLD_PLAZA_INVENTORY_DURABILITY_METADATA_KEY]:
                  nextRemaining,
              },
            }
          ),
        };
      });

      const playerPosition = playerPositionRef.current;

      if (playerPosition) {
        scoutingWorldPlazaRareBiomesWhileLucky(playerPosition);
        lastScoutAtMsRef.current = frameTimeMs;
      }
    };

    const unsubscribe = subscribingWorldPlazaDomOverlayFrame(syncingHeldCharm);

    return () => {
      unsubscribe();

      if (wasLuckyActiveRef.current) {
        toggleBuffRef.current?.(DEFINING_WORLD_PLAZA_LUCKY_BUFF_DEFENDER_ID);
        toggleBuffRef.current?.(DEFINING_WORLD_PLAZA_LUCKY_BUFF_ATTACKER_ID);
        registeringWorldPlazaHeldLuckyBuffBridge(false);
        wasLuckyActiveRef.current = false;
      }

      lastDecayAtMsRef.current = null;
    };
  }, [enabled, playerPositionRef, toggleBuffRef, updatingInventoryState]);
}
