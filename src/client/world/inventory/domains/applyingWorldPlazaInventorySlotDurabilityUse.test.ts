import { creatingEmptyInventoryState } from '@/components/inventory/domains/reducingInventoryState';
import { applyingWorldPlazaInventorySlotDurabilityUse } from '@/components/world/inventory/domains/applyingWorldPlazaInventorySlotDurabilityUse';
import {
  DEFINING_WORLD_PLAZA_INVENTORY_AXE_MAX_DURABILITY,
  DEFINING_WORLD_PLAZA_INVENTORY_DURABILITY_METADATA_KEY,
} from '@/components/world/inventory/domains/definingWorldPlazaInventoryDurabilityConstants';
import { DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_AXE } from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemTypeIds';
import { describe, expect, it } from 'vitest';

function creatingAxeInventoryState(remainingDurability: number) {
  return {
    capacity: 1,
    slots: [
      {
        id: 'axe-1',
        itemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_AXE,
        quantity: 1,
        slotIndex: 0,
        metadata: {
          [DEFINING_WORLD_PLAZA_INVENTORY_DURABILITY_METADATA_KEY]:
            remainingDurability,
        },
      },
    ],
  } as const;
}

describe('applyingWorldPlazaInventorySlotDurabilityUse', () => {
  it('wears durability down until zero without breaking', () => {
    const state = creatingAxeInventoryState(1);

    const result = applyingWorldPlazaInventorySlotDurabilityUse(
      state,
      0,
      () => 0.99
    );

    expect(result.applied).toBe(true);
    expect(result.broken).toBe(false);
    expect(result.remainingDurability).toBe(0);
    expect(
      result.nextState.slots[0]?.metadata?.[
        DEFINING_WORLD_PLAZA_INVENTORY_DURABILITY_METADATA_KEY
      ]
    ).toBe(0);
  });

  it('can still use at zero durability until the break roll succeeds', () => {
    const state = creatingAxeInventoryState(0);

    const survived = applyingWorldPlazaInventorySlotDurabilityUse(
      state,
      0,
      () => 0.5
    );

    expect(survived.applied).toBe(true);
    expect(survived.broken).toBe(false);
    expect(survived.remainingDurability).toBe(0);
    expect(survived.nextState.slots[0]).not.toBeNull();

    const broken = applyingWorldPlazaInventorySlotDurabilityUse(
      survived.nextState,
      0,
      () => 0
    );

    expect(broken.applied).toBe(true);
    expect(broken.broken).toBe(true);
    expect(broken.nextState.slots[0]).toBeNull();
  });

  it('treats missing metadata as full durability for a durable item type', () => {
    const state = {
      capacity: 1,
      slots: [
        {
          id: 'axe-2',
          itemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_AXE,
          quantity: 1,
          slotIndex: 0,
        },
      ],
    };

    // random() → 0 maps to wear amount 1 in the default 1–3 roll.
    const result = applyingWorldPlazaInventorySlotDurabilityUse(
      state,
      0,
      () => 0
    );

    expect(result.applied).toBe(true);
    expect(result.remainingDurability).toBe(
      DEFINING_WORLD_PLAZA_INVENTORY_AXE_MAX_DURABILITY - 1
    );
  });

  it('rolls default wear between 1 and 3 when wearPerUse is unset', () => {
    const state = creatingAxeInventoryState(10);

    const wearOne = applyingWorldPlazaInventorySlotDurabilityUse(
      state,
      0,
      () => 0
    );
    const wearThree = applyingWorldPlazaInventorySlotDurabilityUse(
      state,
      0,
      () => 0.99
    );

    expect(wearOne.remainingDurability).toBe(9);
    expect(wearThree.remainingDurability).toBe(7);
  });

  it('ignores empty slots', () => {
    const state = creatingEmptyInventoryState(1);

    const result = applyingWorldPlazaInventorySlotDurabilityUse(state, 0);

    expect(result.applied).toBe(false);
    expect(result.broken).toBe(false);
    expect(result.nextState).toBe(state);
  });
});
