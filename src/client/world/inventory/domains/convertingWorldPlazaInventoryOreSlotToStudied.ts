/**
 * Converts one unstudied ore unit into a studied ore pile (same material, kept).
 *
 * @module components/world/inventory/domains/convertingWorldPlazaInventoryOreSlotToStudied
 */

import type { DefiningInventoryState } from '@/components/inventory/domains/definingInventoryItem';
import { addingWorldPlazaInventoryItemWithStacking } from '@/components/world/inventory/domains/addingWorldPlazaInventoryItemWithStacking';
import { checkingWorldPlazaInventoryItemHasStudiedOreMetadata } from '@/components/world/inventory/domains/checkingWorldPlazaInventoryItemHasStudiedOreMetadata';
import { consumingWorldPlazaInventoryItemFromSlot } from '@/components/world/inventory/domains/consumingWorldPlazaInventoryItemFromSlot';
import { DEFINING_WORLD_PLAZA_INVENTORY_ITEM_REGISTRY } from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemTypes';
import { checkingWorldPlazaInventoryItemIsOre } from '@/components/world/inventory/domains/definingWorldPlazaInventoryOreSpriteSheetConstants';
import { DEFINING_WORLD_PLAZA_INVENTORY_ORE_STUDIED_METADATA_KEY } from '@/components/world/inventory/domains/definingWorldPlazaInventoryOreStudyMetadataConstants';

export type ConvertingWorldPlazaInventoryOreSlotToStudiedResult =
  | {
      readonly outcome: 'converted';
      readonly nextState: DefiningInventoryState;
    }
  | {
      readonly outcome: 'nothing-to-study';
    }
  | {
      readonly outcome: 'already-studied';
    }
  | {
      readonly outcome: 'inventory-full';
    };

/**
 * Moves one ore from an unstudied stack into a studied stack.
 * Material is kept; stacks stay separate via studied metadata.
 */
export function convertingWorldPlazaInventoryOreSlotToStudied(
  inventoryState: DefiningInventoryState,
  slotIndex: number
): ConvertingWorldPlazaInventoryOreSlotToStudiedResult {
  const slotItem = inventoryState.slots[slotIndex];

  if (
    !slotItem ||
    slotItem.quantity < 1 ||
    !checkingWorldPlazaInventoryItemIsOre(slotItem.itemTypeId)
  ) {
    return { outcome: 'nothing-to-study' };
  }

  if (checkingWorldPlazaInventoryItemHasStudiedOreMetadata(slotItem.metadata)) {
    return { outcome: 'already-studied' };
  }

  const consumeResult = consumingWorldPlazaInventoryItemFromSlot(
    inventoryState,
    slotIndex,
    1
  );

  if (!consumeResult.consumed) {
    return { outcome: 'nothing-to-study' };
  }

  const addResult = addingWorldPlazaInventoryItemWithStacking(
    consumeResult.nextState,
    {
      id: crypto.randomUUID(),
      itemTypeId: slotItem.itemTypeId,
      quantity: 1,
      metadata: {
        ...(slotItem.metadata ?? {}),
        [DEFINING_WORLD_PLAZA_INVENTORY_ORE_STUDIED_METADATA_KEY]: true,
      },
    },
    DEFINING_WORLD_PLAZA_INVENTORY_ITEM_REGISTRY
  );

  if (addResult.quantityAccepted < 1) {
    return { outcome: 'inventory-full' };
  }

  return {
    outcome: 'converted',
    nextState: addResult.state,
  };
}
