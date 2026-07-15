import type {
  DefiningInventorySlot,
  DefiningInventoryState,
} from '@/components/inventory/domains/definingInventoryItem';
import {
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_REGISTRY,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_POUCH,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_STONE,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_WOOD,
} from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemTypes';
import {
  applyingWorldPlazaStorageChestTransfer,
  type DefiningWorldPlazaStorageChestDragLocation,
} from '@/components/world/storage-chest/domains/applyingWorldPlazaStorageChestTransfer';
import { creatingWorldPlazaStorageChestEmptyContents } from '@/components/world/storage-chest/domains/resolvingWorldPlazaStorageChestContents';
import { describe, expect, it } from 'vitest';

function creatingHotbarWithStone(): DefiningInventoryState {
  return {
    capacity: 24,
    slots: Array.from({ length: 24 }, (_, slotIndex) =>
      slotIndex === 6
        ? {
            id: 'stone-1',
            itemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_STONE,
            quantity: 3,
            slotIndex: 6,
          }
        : null
    ),
  };
}

function creatingMutableChestContents(
  fillSlot?: (slots: DefiningInventorySlot[]) => void
): DefiningInventoryState {
  const empty = creatingWorldPlazaStorageChestEmptyContents();
  const slots: DefiningInventorySlot[] = [...empty.slots];
  fillSlot?.(slots);
  return { capacity: empty.capacity, slots };
}

describe('applyingWorldPlazaStorageChestTransfer', () => {
  const blockId = 'chest-block-1';

  it('deposits hotbar item into an empty chest slot', () => {
    const inventoryState = creatingHotbarWithStone();
    const chestContents = creatingWorldPlazaStorageChestEmptyContents();
    const from: DefiningWorldPlazaStorageChestDragLocation = {
      kind: 'hotbar',
      slotIndex: 6,
    };
    const to: DefiningWorldPlazaStorageChestDragLocation = {
      kind: 'storage-chest',
      blockId,
      slotIndex: 0,
    };

    const result = applyingWorldPlazaStorageChestTransfer(
      inventoryState,
      chestContents,
      from,
      to,
      DEFINING_WORLD_PLAZA_INVENTORY_ITEM_REGISTRY
    );

    expect(result.inventoryState.slots[6]).toBeNull();
    expect(result.chestContents.slots[0]?.itemTypeId).toBe(
      DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_STONE
    );
    expect(result.chestContents.slots[0]?.quantity).toBe(3);
  });

  it('withdraws chest item into an empty hotbar storage slot', () => {
    const inventoryState: DefiningInventoryState = {
      capacity: 24,
      slots: Array.from({ length: 24 }, () => null),
    };
    const chestContents = creatingMutableChestContents((slots) => {
      slots[2] = {
        id: 'wood-1',
        itemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_WOOD,
        quantity: 2,
        slotIndex: 2,
      };
    });

    const result = applyingWorldPlazaStorageChestTransfer(
      inventoryState,
      chestContents,
      { kind: 'storage-chest', blockId, slotIndex: 2 },
      { kind: 'hotbar', slotIndex: 6 },
      DEFINING_WORLD_PLAZA_INVENTORY_ITEM_REGISTRY
    );

    expect(result.chestContents.slots[2]).toBeNull();
    expect(result.inventoryState.slots[6]?.itemTypeId).toBe(
      DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_WOOD
    );
  });

  it('rejects depositing a bag into the chest', () => {
    const inventoryState: DefiningInventoryState = {
      capacity: 24,
      slots: Array.from({ length: 24 }, (_, slotIndex) =>
        slotIndex === 6
          ? {
              id: 'pouch-1',
              itemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_POUCH,
              quantity: 1,
              slotIndex: 6,
            }
          : null
      ),
    };
    const chestContents = creatingWorldPlazaStorageChestEmptyContents();

    const result = applyingWorldPlazaStorageChestTransfer(
      inventoryState,
      chestContents,
      { kind: 'hotbar', slotIndex: 6 },
      { kind: 'storage-chest', blockId, slotIndex: 0 },
      DEFINING_WORLD_PLAZA_INVENTORY_ITEM_REGISTRY
    );

    expect(result.inventoryState.slots[6]?.itemTypeId).toBe(
      DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_POUCH
    );
    expect(result.chestContents.slots[0]).toBeNull();
  });

  it('stacks matching stone piles in the chest', () => {
    const inventoryState = creatingHotbarWithStone();
    const chestContents = creatingMutableChestContents((slots) => {
      slots[0] = {
        id: 'stone-chest',
        itemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_STONE,
        quantity: 2,
        slotIndex: 0,
      };
    });

    const result = applyingWorldPlazaStorageChestTransfer(
      inventoryState,
      chestContents,
      { kind: 'hotbar', slotIndex: 6 },
      { kind: 'storage-chest', blockId, slotIndex: 0 },
      DEFINING_WORLD_PLAZA_INVENTORY_ITEM_REGISTRY
    );

    expect(result.inventoryState.slots[6]).toBeNull();
    expect(result.chestContents.slots[0]?.quantity).toBe(5);
  });
});
