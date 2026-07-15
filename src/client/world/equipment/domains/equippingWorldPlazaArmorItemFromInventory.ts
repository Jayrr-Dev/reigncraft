import type { DefiningInventoryItem } from '@/components/inventory/domains/definingInventoryItem';
import type { DefiningInventoryState } from '@/components/inventory/domains/definingInventoryItem';
import { consumingWorldPlazaInventoryItemFromSlot } from '@/components/world/inventory/domains/consumingWorldPlazaInventoryItemFromSlot';
import { resolvingWorldPlazaInventoryItemTypeDefinition } from '@/components/world/inventory/domains/resolvingWorldPlazaInventoryItemTypeDefinition';
import type { DefiningWorldPlazaArmorSlotId } from '@/components/world/equipment/domains/definingWorldPlazaArmorSlotRegistry';
import { resolvingWorldPlazaArmorSlotForItemOnBodyPlan } from '@/components/world/equipment/domains/resolvingWorldPlazaArmorSlotForItemOnBodyPlan';
import type { DefiningWorldPlazaArmorBodyPlanId } from '@/components/world/equipment/domains/definingWorldPlazaArmorSlotRegistry';
import { addingWorldPlazaInventoryItem } from '@/components/world/inventory/domains/addingWorldPlazaInventoryItemWithStacking';
import type { DefiningWorldPlazaArmorLoadoutState } from '@/components/world/equipment/domains/definingWorldPlazaArmorLoadoutTypes';

export type EquippingWorldPlazaArmorItemResult = {
  readonly inventoryState: DefiningInventoryState;
  readonly loadoutState: DefiningWorldPlazaArmorLoadoutState;
  readonly errorMessage: string | null;
};

/**
 * Equips one inventory item into its armor slot, returning prior slot item to bag.
 */
export function equippingWorldPlazaArmorItemFromInventory(input: {
  inventoryState: DefiningInventoryState;
  loadoutState: DefiningWorldPlazaArmorLoadoutState;
  item: DefiningInventoryItem;
  bodyPlanId: DefiningWorldPlazaArmorBodyPlanId;
}): EquippingWorldPlazaArmorItemResult {
  const definition = resolvingWorldPlazaInventoryItemTypeDefinition(
    input.item.itemTypeId
  );

  if (!definition?.armor) {
    return {
      inventoryState: input.inventoryState,
      loadoutState: input.loadoutState,
      errorMessage: 'That item is not wearable armor.',
    };
  }

  const resolvedSlotId = resolvingWorldPlazaArmorSlotForItemOnBodyPlan({
    itemSlotId: definition.armor.slotId,
    bodyPlanId: input.bodyPlanId,
  });

  if (resolvedSlotId === null) {
    return {
      inventoryState: input.inventoryState,
      loadoutState: input.loadoutState,
      errorMessage: 'This form cannot wear that piece.',
    };
  }

  const consumeResult = consumingWorldPlazaInventoryItemFromSlot(
    input.inventoryState,
    input.item.slotIndex,
    1
  );

  if (!consumeResult.consumed) {
    return {
      inventoryState: input.inventoryState,
      loadoutState: input.loadoutState,
      errorMessage: 'Could not move that item from your bag.',
    };
  }

  let nextInventory = consumeResult.nextState;

  const previousEquipped = input.loadoutState[resolvedSlotId];

  if (previousEquipped) {
    nextInventory = addingWorldPlazaInventoryItem(nextInventory, {
      id: previousEquipped.id,
      itemTypeId: previousEquipped.itemTypeId,
      quantity: previousEquipped.quantity,
      metadata: previousEquipped.metadata,
    });
  }

  const equippedItem: DefiningInventoryItem = {
    ...input.item,
    quantity: 1,
    slotIndex: -1,
  };

  return {
    inventoryState: nextInventory,
    loadoutState: {
      ...input.loadoutState,
      [resolvedSlotId]: equippedItem,
    },
    errorMessage: null,
  };
}

export type UnequippingWorldPlazaArmorSlotResult = {
  readonly inventoryState: DefiningInventoryState;
  readonly loadoutState: DefiningWorldPlazaArmorLoadoutState;
  readonly errorMessage: string | null;
};

/**
 * Unequips one armor slot back into inventory when space allows.
 */
export function unequippingWorldPlazaArmorSlotToInventory(input: {
  inventoryState: DefiningInventoryState;
  loadoutState: DefiningWorldPlazaArmorLoadoutState;
  slotId: DefiningWorldPlazaArmorSlotId;
}): UnequippingWorldPlazaArmorSlotResult {
  const equipped = input.loadoutState[input.slotId];

  if (!equipped) {
    return {
      inventoryState: input.inventoryState,
      loadoutState: input.loadoutState,
      errorMessage: null,
    };
  }

  const nextInventory = addingWorldPlazaInventoryItem(input.inventoryState, {
    id: equipped.id,
    itemTypeId: equipped.itemTypeId,
    quantity: equipped.quantity,
    metadata: equipped.metadata,
  });

  if (nextInventory === input.inventoryState) {
    return {
      inventoryState: input.inventoryState,
      loadoutState: input.loadoutState,
      errorMessage: 'No room in your bag for that piece.',
    };
  }

  return {
    inventoryState: nextInventory,
    loadoutState: {
      ...input.loadoutState,
      [input.slotId]: null,
    },
    errorMessage: null,
  };
}
