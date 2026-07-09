/**
 * Unit tests for reserved weapon/tool hotbar slot rules.
 */

import { creatingEmptyInventoryState } from '@/components/inventory/domains/reducingInventoryState';
import { checkingWorldPlazaInventoryHotbarSlotAcceptsItemTypeId } from '@/components/world/inventory/domains/checkingWorldPlazaInventoryHotbarSlotAcceptsItemTypeId';
import { checkingWorldPlazaInventoryItemIsWeaponOrTool } from '@/components/world/inventory/domains/checkingWorldPlazaInventoryItemIsWeaponOrTool';
import { checkingWorldPlazaInventoryMoveRespectsWeaponToolSlot } from '@/components/world/inventory/domains/checkingWorldPlazaInventoryMoveRespectsWeaponToolSlot';
import {
  DEFINING_WORLD_PLAZA_INVENTORY_CAPACITY,
  DEFINING_WORLD_PLAZA_INVENTORY_WEAPON_TOOL_SLOT_INDEX,
} from '@/components/world/inventory/domains/definingWorldPlazaInventoryConstants';
import {
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_AXE,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_WOOD,
} from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemTypeIds';
import { findingWorldPlazaInventoryFirstEmptySlotForItemTypeId } from '@/components/world/inventory/domains/findingWorldPlazaInventoryFirstEmptySlotForItemTypeId';
import { normalizingWorldPlazaInventoryWeaponToolSlot } from '@/components/world/inventory/domains/normalizingWorldPlazaInventoryWeaponToolSlot';
import { describe, expect, it } from 'vitest';

describe('weapon/tool reserved hotbar slot', () => {
  it('treats axe as weapon/tool and wood as not', () => {
    expect(
      checkingWorldPlazaInventoryItemIsWeaponOrTool(
        DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_AXE
      )
    ).toBe(true);
    expect(
      checkingWorldPlazaInventoryItemIsWeaponOrTool(
        DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_WOOD
      )
    ).toBe(false);
  });

  it('rejects non-tools in slot 0 and accepts them elsewhere', () => {
    expect(
      checkingWorldPlazaInventoryHotbarSlotAcceptsItemTypeId(
        DEFINING_WORLD_PLAZA_INVENTORY_WEAPON_TOOL_SLOT_INDEX,
        DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_WOOD
      )
    ).toBe(false);
    expect(
      checkingWorldPlazaInventoryHotbarSlotAcceptsItemTypeId(
        1,
        DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_WOOD
      )
    ).toBe(true);
    expect(
      checkingWorldPlazaInventoryHotbarSlotAcceptsItemTypeId(
        DEFINING_WORLD_PLAZA_INVENTORY_WEAPON_TOOL_SLOT_INDEX,
        DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_AXE
      )
    ).toBe(true);
  });

  it('skips slot 0 when finding empty slot for non-tools', () => {
    const state = creatingEmptyInventoryState(
      DEFINING_WORLD_PLAZA_INVENTORY_CAPACITY
    );

    expect(
      findingWorldPlazaInventoryFirstEmptySlotForItemTypeId(
        state,
        DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_WOOD
      )
    ).toBe(1);
    expect(
      findingWorldPlazaInventoryFirstEmptySlotForItemTypeId(
        state,
        DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_AXE
      )
    ).toBe(0);
  });

  it('blocks dragging wood onto empty reserved slot', () => {
    let state = creatingEmptyInventoryState(
      DEFINING_WORLD_PLAZA_INVENTORY_CAPACITY
    );
    state = {
      ...state,
      slots: [
        null,
        {
          id: 'wood-1',
          itemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_WOOD,
          quantity: 1,
          slotIndex: 1,
        },
        null,
        null,
        null,
      ],
    };

    expect(
      checkingWorldPlazaInventoryMoveRespectsWeaponToolSlot(state, 1, 0)
    ).toBe(false);
  });

  it('moves non-tool out of reserved slot and grants starter axe when normalizing', () => {
    const state = {
      capacity: DEFINING_WORLD_PLAZA_INVENTORY_CAPACITY,
      slots: [
        {
          id: 'wood-1',
          itemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_WOOD,
          quantity: 1,
          slotIndex: 0,
        },
        null,
        null,
        null,
        null,
      ],
    };

    const normalized = normalizingWorldPlazaInventoryWeaponToolSlot(state);

    expect(normalized.slots[0]?.itemTypeId).toBe(
      DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_AXE
    );
    expect(normalized.slots[1]?.itemTypeId).toBe(
      DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_WOOD
    );
  });

  it('grants starter axe into empty reserved slot when normalizing', () => {
    const state = creatingEmptyInventoryState(
      DEFINING_WORLD_PLAZA_INVENTORY_CAPACITY
    );

    const normalized = normalizingWorldPlazaInventoryWeaponToolSlot(state);

    expect(normalized.slots[0]?.itemTypeId).toBe(
      DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_AXE
    );
  });
});
