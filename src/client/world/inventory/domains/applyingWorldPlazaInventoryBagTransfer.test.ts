import { definingInventoryItemDraggableId } from '@/components/inventory/domains/definingInventoryDndIds';
import {
  addingInventoryItem,
  creatingEmptyInventoryState,
} from '@/components/inventory/domains/reducingInventoryState';
import { resolvingInventoryHotbarSlotIndexFromOverId } from '@/components/inventory/domains/resolvingInventoryHotbarSlotIndexFromOverId';
import {
  applyingWorldPlazaInventoryBagTransfer,
  resolvingWorldPlazaInventoryDragLocationForItemId,
} from '@/components/world/inventory/domains/applyingWorldPlazaInventoryBagTransfer';
import { DEFINING_WORLD_PLAZA_INVENTORY_CAPACITY } from '@/components/world/inventory/domains/definingWorldPlazaInventoryConstants';
import {
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_REGISTRY,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_POUCH,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_WOOD,
} from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemTypes';
import {
  checkingWorldPlazaInventoryBagHasContents,
  resolvingWorldPlazaInventoryBagContents,
} from '@/components/world/inventory/domains/resolvingWorldPlazaInventoryBagContents';
import { resolvingWorldPlazaInventoryDropLocationFromOverId } from '@/components/world/inventory/domains/resolvingWorldPlazaInventoryDropLocationFromOverId';
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

  it('stacks wood onto an existing bag stack', () => {
    let state = creatingTestHotbarWithPouchAndWood();
    state = applyingWorldPlazaInventoryBagTransfer(
      state,
      { kind: 'hotbar', slotIndex: 1 },
      { kind: 'bag', bagItemInstanceId: 'bag-1', bagSlotIndex: 0 },
      DEFINING_WORLD_PLAZA_INVENTORY_ITEM_REGISTRY
    );
    state = addingInventoryItem(state, {
      id: 'wood-2',
      itemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_WOOD,
      quantity: 5,
    });

    const nextState = applyingWorldPlazaInventoryBagTransfer(
      state,
      { kind: 'hotbar', slotIndex: 1 },
      { kind: 'bag', bagItemInstanceId: 'bag-1', bagSlotIndex: 0 },
      DEFINING_WORLD_PLAZA_INVENTORY_ITEM_REGISTRY
    );

    expect(nextState.slots[1]).toBeNull();
    const bagContents = resolvingWorldPlazaInventoryBagContents(
      nextState.slots[0]!,
      DEFINING_WORLD_PLAZA_INVENTORY_ITEM_REGISTRY
    );
    expect(bagContents.slots[0]?.quantity).toBe(15);
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

describe('resolvingWorldPlazaInventoryDropLocationFromOverId', () => {
  it('resolves bag slot from item draggable id for stacking', () => {
    let state = creatingTestHotbarWithPouchAndWood();
    state = applyingWorldPlazaInventoryBagTransfer(
      state,
      { kind: 'hotbar', slotIndex: 1 },
      { kind: 'bag', bagItemInstanceId: 'bag-1', bagSlotIndex: 0 },
      DEFINING_WORLD_PLAZA_INVENTORY_ITEM_REGISTRY
    );

    const bagContents = resolvingWorldPlazaInventoryBagContents(
      state.slots[0]!,
      DEFINING_WORLD_PLAZA_INVENTORY_ITEM_REGISTRY
    );
    const bagWoodId = bagContents.slots[0]!.id;

    expect(
      resolvingWorldPlazaInventoryDropLocationFromOverId(
        definingInventoryItemDraggableId(bagWoodId),
        state,
        DEFINING_WORLD_PLAZA_INVENTORY_ITEM_REGISTRY
      )
    ).toEqual({
      kind: 'bag',
      bagItemInstanceId: 'bag-1',
      bagSlotIndex: 0,
    });
  });
});

describe('resolvingInventoryHotbarSlotIndexFromOverId', () => {
  it('resolves hotbar slot from item draggable id', () => {
    const state = creatingTestHotbarWithPouchAndWood();

    expect(
      resolvingInventoryHotbarSlotIndexFromOverId(
        definingInventoryItemDraggableId('wood-1'),
        state
      )
    ).toBe(1);
  });
});
