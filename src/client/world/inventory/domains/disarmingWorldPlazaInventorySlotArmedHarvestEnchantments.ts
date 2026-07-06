import type { DefiningInventoryState } from '@/components/inventory/domains/definingInventoryItem';
import {
  DEFINING_WORLD_PLAZA_INVENTORY_ENCHANTMENT_STATE_METADATA_KEY,
} from '@/components/world/inventory/domains/definingWorldPlazaInventoryEnchantmentConstants';
import {
  listingWorldPlazaInventoryItemEnchantmentIds,
  readingWorldPlazaInventoryItemEnchantmentStateMap,
} from '@/components/world/inventory/domains/definingWorldPlazaInventoryEnchantmentState';
import { resolvingWorldPlazaInventoryEnchantmentDefinition } from '@/components/world/inventory/domains/definingWorldPlazaInventoryEnchantmentRegistry';
import { resolvingWorldPlazaInventoryItemTypeDefinition } from '@/components/world/inventory/domains/resolvingWorldPlazaInventoryItemTypeDefinition';

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
 * Disarms harvest-related enchantments on a hotbar slot after their effect fires.
 */
export function disarmingWorldPlazaInventorySlotArmedHarvestEnchantments(
  state: DefiningInventoryState,
  slotIndex: number
): DefiningInventoryState {
  if (slotIndex < 0 || slotIndex >= state.capacity) {
    return state;
  }

  const slotItem = state.slots[slotIndex];

  if (!slotItem) {
    return state;
  }

  const itemDefinition = resolvingWorldPlazaInventoryItemTypeDefinition(
    slotItem.itemTypeId
  );
  const enchantmentIds = listingWorldPlazaInventoryItemEnchantmentIds(
    slotItem,
    itemDefinition?.defaultEnchantments ?? []
  );
  const enchantmentState = readingWorldPlazaInventoryItemEnchantmentStateMap(
    slotItem.metadata
  );

  let nextEnchantmentState = { ...enchantmentState };
  let didDisarm = false;

  for (const enchantmentId of enchantmentIds) {
    const definition =
      resolvingWorldPlazaInventoryEnchantmentDefinition(enchantmentId);
    const runtimeState = enchantmentState[enchantmentId];

    if (
      !definition?.armedHarvestSpeedMultiplier ||
      runtimeState?.armed !== true
    ) {
      continue;
    }

    nextEnchantmentState = {
      ...nextEnchantmentState,
      [enchantmentId]: {
        ...runtimeState,
        armed: false,
      },
    };
    didDisarm = true;
  }

  if (!didDisarm) {
    return state;
  }

  return {
    capacity: state.capacity,
    slots: cloningInventorySlotsWithSlotUpdate(state.slots, slotIndex, {
      ...slotItem,
      metadata: {
        ...slotItem.metadata,
        [DEFINING_WORLD_PLAZA_INVENTORY_ENCHANTMENT_STATE_METADATA_KEY]:
          nextEnchantmentState,
      },
    }),
  };
}
