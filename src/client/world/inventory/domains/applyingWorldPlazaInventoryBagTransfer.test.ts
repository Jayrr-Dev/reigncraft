import {
  addingInventoryItem,
  creatingEmptyInventoryState,
} from '@/components/inventory/domains/reducingInventoryState';
import {
  applyingWorldPlazaInventoryBagTransfer,
  resolvingWorldPlazaInventoryDragLocationForItemId,
} from '@/components/world/inventory/domains/applyingWorldPlazaInventoryBagTransfer';
import { checkingWorldPlazaInventoryBagHasContents } from '@/components/world/inventory/domains/resolvingWorldPlazaInventoryBagContents';
import {
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_POUCH,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_WOOD,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_REGISTRY,
} from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemTypes';
import { DEFINING_WORLD_PLAZA_INVENTORY_CAPACITY } from '@/components/world/inventory/domains/definingWorldPlazaInventoryConstants';
import { describe, expect, it } from 'vitest';

function creatingTestHotbarWithPouchAndWood(): ReturnType<
  typeof creatingEmptyInventoryState
> {
  let state = creatingEmptyInventoryState(
    DEFINING_WORLD_PLAZA_INVENTORY_CAPACITY
  );
  state = addingInventoryItem(state, {
    id: 'bag-1',
    itemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_POUCH,
    quantity: 1,
  });
  state = addingInventoryItem(state, {
    id: 'wood-1',
    itemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_WOOD,
    quantity: 10,
  });
  return state;
}

describe('applyingWorldPlazaInventoryBagTransfer', () => {
  it('moves wood from hotbar into an empty bag slot', () => {
    const state = creatingTestHotbarWithPouchAndWood();
    const woodLocation = resolvingWorldPlazaInventoryDragLocationForItemId(
      state,
      'wood-1',
      DEFINING_WORLD_PLAZA_INVENTORY_ITEM_REGISTRY
    );

    expect(woodLocation).toEqual({ kind: 'hotbar', slotIndex: 1 });

    const nextState = applyingWorldPlazaInventoryBagTransfer(
      state,
      { kind: 'hotbar', slotIndex: 1 },
      { kind: 'bag', bagItemInstanceId: 'bag-1', bagSlotIndex: 0 },
      DEFINING_WORLD_PLAZA_INVENTORY_ITEM_REGISTRY
    );

    expect(nextState.slots[1]).toBeNull();
    const bagItem = nextState.slots[0];
    expect(bagItem?.itemTypeId).toBe(
      DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_POUCH
    );
    expect(
      checkingWorldPlazaInventoryBagHasContents(
        bagItem!,
        DEFINING_WORLD_PLAZA_INVENTORY_ITEM_REGISTRY
      )
    ).toBe(true);
  });

  it('rejects nesting a bag inside another bag', () => {
    let state = creatingEmptyInventoryState(
      DEFINING_WORLD_PLAZA_INVENTORY_CAPACITY
    );
    state = addingInventoryItem(state, {
      id: 'bag-1',
      itemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_POUCH,
      quantity: 1,
    });
    state = addingInventoryItem(state, {
      id: 'bag-2',
      itemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_POUCH,
      quantity: 1,
    });

    const nextState = applyingWorldPlazaInventoryBagTransfer(
      state,
      { kind: 'hotbar', slotIndex: 1 },
      { kind: 'bag', bagItemInstanceId: 'bag-1', bagSlotIndex: 0 },
      DEFINING_WORLD_PLAZA_INVENTORY_ITEM_REGISTRY
    );

    expect(nextState).toEqual(state);
  });

  it('moves wood from bag back to hotbar', () => {
    let state = creatingTestHotbarWithPouchAndWood();
    state = applyingWorldPlazaInventoryBagTransfer(
      state,
      { kind: 'hotbar', slotIndex: 1 },
      { kind: 'bag', bagItemInstanceId: 'bag-1', bagSlotIndex: 0 },
      DEFINING_WORLD_PLAZA_INVENTORY_ITEM_REGISTRY
    );

    const nextState = applyingWorldPlazaInventoryBagTransfer(
      state,
      { kind: 'bag', bagItemInstanceId: 'bag-1', bagSlotIndex: 0 },
      { kind: 'hotbar', slotIndex: 2 },
      DEFINING_WORLD_PLAZA_INVENTORY_ITEM_REGISTRY
    );

    expect(nextState.slots[2]?.itemTypeId).toBe(
      DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_WOOD
    );
    expect(
      checkingWorldPlazaInventoryBagHasContents(
        nextState.slots[0]!,
        DEFINING_WORLD_PLAZA_INVENTORY_ITEM_REGISTRY
      )
    ).toBe(false);
  });
});
