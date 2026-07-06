import type { DefiningInventoryState } from '@/components/inventory/domains/definingInventoryItem';
import {
  DEFINING_WORLD_PLAZA_INVENTORY_ENCHANTMENT_STATE_METADATA_KEY,
} from '@/components/world/inventory/domains/definingWorldPlazaInventoryEnchantmentConstants';
import {
  readingWorldPlazaInventoryItemEnchantmentStateMap,
  listingWorldPlazaInventoryItemEnchantmentIds,
} from '@/components/world/inventory/domains/definingWorldPlazaInventoryEnchantmentState';
import { resolvingWorldPlazaInventoryEnchantmentDefinition } from '@/components/world/inventory/domains/definingWorldPlazaInventoryEnchantmentRegistry';
import { resolvingWorldPlazaInventoryItemTypeDefinition } from '@/components/world/inventory/domains/resolvingWorldPlazaInventoryItemTypeDefinition';

export type ApplyingWorldPlazaInventorySlotActiveEnchantmentUseResult =
  | {
      readonly type: 'armed';
      readonly nextState: DefiningInventoryState;
      readonly toastMessage: string;
    }
  | {
      readonly type: 'cooldown';
      readonly nextState: DefiningInventoryState;
      readonly toastMessage: string;
    }
  | {
      readonly type: 'invalid';
      readonly nextState: DefiningInventoryState;
      readonly toastMessage: string;
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
 * Arms an active enchantment on the item in a hotbar slot.
 */
export function applyingWorldPlazaInventorySlotActiveEnchantmentUse(
  state: DefiningInventoryState,
  slotIndex: number,
  enchantmentId: string,
  nowMs: number = Date.now()
): ApplyingWorldPlazaInventorySlotActiveEnchantmentUseResult {
  if (slotIndex < 0 || slotIndex >= state.capacity) {
    return {
      type: 'invalid',
      nextState: state,
      toastMessage: 'No item in that slot.',
    };
  }

  const slotItem = state.slots[slotIndex];

  if (!slotItem) {
    return {
      type: 'invalid',
      nextState: state,
      toastMessage: 'No item in that slot.',
    };
  }

  const definition = resolvingWorldPlazaInventoryEnchantmentDefinition(
    enchantmentId
  );

  if (!definition || definition.kind !== 'active') {
    return {
      type: 'invalid',
      nextState: state,
      toastMessage: 'That enchantment cannot be used.',
    };
  }

  const itemDefinition = resolvingWorldPlazaInventoryItemTypeDefinition(
    slotItem.itemTypeId
  );
  const enchantmentIds = listingWorldPlazaInventoryItemEnchantmentIds(
    slotItem,
    itemDefinition?.defaultEnchantments ?? []
  );

  if (!enchantmentIds.includes(enchantmentId)) {
    return {
      type: 'invalid',
      nextState: state,
      toastMessage: 'This item does not have that enchantment.',
    };
  }

  const enchantmentState = readingWorldPlazaInventoryItemEnchantmentStateMap(
    slotItem.metadata
  );
  const runtimeState = enchantmentState[enchantmentId];

  if (runtimeState?.armed) {
    return {
      type: 'invalid',
      nextState: state,
      toastMessage: `${definition.name} is already armed.`,
    };
  }

  const cooldownRemainingMs =
    runtimeState?.cooldownEndsAtMs !== undefined
      ? runtimeState.cooldownEndsAtMs - nowMs
      : 0;

  if (cooldownRemainingMs > 0) {
    return {
      type: 'cooldown',
      nextState: state,
      toastMessage:
        definition.cooldownToastMessage ?? `${definition.name} is recharging.`,
    };
  }

  const nextCooldownEndsAtMs =
    definition.cooldownMs !== undefined
      ? nowMs + definition.cooldownMs
      : undefined;

  const nextSlotItem = {
    ...slotItem,
    metadata: {
      ...slotItem.metadata,
      [DEFINING_WORLD_PLAZA_INVENTORY_ENCHANTMENT_STATE_METADATA_KEY]: {
        ...enchantmentState,
        [enchantmentId]: {
          armed: true,
          ...(nextCooldownEndsAtMs === undefined
            ? {}
            : { cooldownEndsAtMs: nextCooldownEndsAtMs }),
        },
      },
    },
  };

  return {
    type: 'armed',
    nextState: {
      capacity: state.capacity,
      slots: cloningInventorySlotsWithSlotUpdate(
        state.slots,
        slotIndex,
        nextSlotItem
      ),
    },
    toastMessage:
      definition.armedToastMessage ?? `${definition.name} is ready.`,
  };
}
