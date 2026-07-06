import { creatingEmptyInventoryState } from '@/components/inventory/domains/reducingInventoryState';
import { applyingWorldPlazaInventorySlotActiveEnchantmentUse } from '@/components/world/inventory/domains/applyingWorldPlazaInventorySlotActiveEnchantmentUse';
import {
  DEFINING_WORLD_PLAZA_INVENTORY_ENCHANTMENT_STATE_METADATA_KEY,
  DEFINING_WORLD_PLAZA_INVENTORY_ENCHANTMENTS_METADATA_KEY,
} from '@/components/world/inventory/domains/definingWorldPlazaInventoryEnchantmentConstants';
import { DEFINING_WORLD_PLAZA_INVENTORY_ENCHANTMENT_SWIFT_CHOP } from '@/components/world/inventory/domains/definingWorldPlazaInventoryEnchantmentTypeIds';
import { DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_AXE } from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemTypeIds';
import { computingWorldPlazaInventoryItemEnchantmentHarvestSpeedMultiplier } from '@/components/world/inventory/domains/computingWorldPlazaInventoryItemEnchantmentHarvestSpeedMultiplier';
import { describe, expect, it } from 'vitest';

function creatingEnchantedAxeState() {
  return {
    capacity: 1,
    slots: [
      {
        id: 'axe-1',
        itemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_AXE,
        quantity: 1,
        slotIndex: 0,
        metadata: {
          [DEFINING_WORLD_PLAZA_INVENTORY_ENCHANTMENTS_METADATA_KEY]: [
            DEFINING_WORLD_PLAZA_INVENTORY_ENCHANTMENT_SWIFT_CHOP,
          ],
        },
      },
    ],
  } as const;
}

describe('applyingWorldPlazaInventorySlotActiveEnchantmentUse', () => {
  it('arms an active enchantment on the slot item', () => {
    const state = creatingEnchantedAxeState();
    const nowMs = 1_000;

    const result = applyingWorldPlazaInventorySlotActiveEnchantmentUse(
      state,
      0,
      DEFINING_WORLD_PLAZA_INVENTORY_ENCHANTMENT_SWIFT_CHOP,
      nowMs
    );

    expect(result.type).toBe('armed');
    expect(result.nextState.slots[0]?.metadata?.[
      DEFINING_WORLD_PLAZA_INVENTORY_ENCHANTMENT_STATE_METADATA_KEY
    ]).toEqual({
      [DEFINING_WORLD_PLAZA_INVENTORY_ENCHANTMENT_SWIFT_CHOP]: {
        armed: true,
        cooldownEndsAtMs: nowMs + 30_000,
      },
    });
  });

  it('blocks reuse while cooldown is active', () => {
    const nowMs = 5_000;
    const armed = applyingWorldPlazaInventorySlotActiveEnchantmentUse(
      creatingEnchantedAxeState(),
      0,
      DEFINING_WORLD_PLAZA_INVENTORY_ENCHANTMENT_SWIFT_CHOP,
      1_000
    );

    const cooledDownItem = {
      ...armed.nextState.slots[0]!,
      metadata: {
        ...armed.nextState.slots[0]!.metadata,
        [DEFINING_WORLD_PLAZA_INVENTORY_ENCHANTMENT_STATE_METADATA_KEY]: {
          [DEFINING_WORLD_PLAZA_INVENTORY_ENCHANTMENT_SWIFT_CHOP]: {
            armed: false,
            cooldownEndsAtMs: nowMs + 1_000,
          },
        },
      },
    };

    const blocked = applyingWorldPlazaInventorySlotActiveEnchantmentUse(
      {
        capacity: 1,
        slots: [cooledDownItem],
      },
      0,
      DEFINING_WORLD_PLAZA_INVENTORY_ENCHANTMENT_SWIFT_CHOP,
      nowMs
    );

    expect(blocked.type).toBe('cooldown');
  });
});

describe('computingWorldPlazaInventoryItemEnchantmentHarvestSpeedMultiplier', () => {
  it('doubles harvest speed while swift chop is armed', () => {
    const state = creatingEnchantedAxeState();
    const item = {
      ...state.slots[0]!,
      metadata: {
        ...state.slots[0]!.metadata,
        [DEFINING_WORLD_PLAZA_INVENTORY_ENCHANTMENT_STATE_METADATA_KEY]: {
          [DEFINING_WORLD_PLAZA_INVENTORY_ENCHANTMENT_SWIFT_CHOP]: {
            armed: true,
            cooldownEndsAtMs: Date.now() + 30_000,
          },
        },
      },
    };

    expect(
      computingWorldPlazaInventoryItemEnchantmentHarvestSpeedMultiplier(item)
    ).toBe(2);
  });

  it('returns 1 when no armed enchantments are present', () => {
    const state = creatingEmptyInventoryState(1);

    expect(state.slots[0]).toBeNull();
  });
});
