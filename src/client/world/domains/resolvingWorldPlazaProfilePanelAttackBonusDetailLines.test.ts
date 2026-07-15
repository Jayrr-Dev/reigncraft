import type { DefiningInventoryState } from '@/components/inventory/domains/definingInventoryItem';
import { resolvingWorldPlazaProfilePanelAttackBonusDetailLines } from '@/components/world/domains/resolvingWorldPlazaProfilePanelAttackBonusDetailLines';
import { DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_SWORD_WOOD } from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemTypeIds';
import { describe, expect, it } from 'vitest';

describe('resolvingWorldPlazaProfilePanelAttackBonusDetailLines', () => {
  it('returns empty when no weapon equipped', () => {
    const inventory: DefiningInventoryState = {
      capacity: 1,
      slots: [null],
    };

    expect(
      resolvingWorldPlazaProfilePanelAttackBonusDetailLines(100, inventory, 0)
    ).toEqual([]);
  });

  it('lists wood sword name, modifier, and flat damage', () => {
    const inventory: DefiningInventoryState = {
      capacity: 1,
      slots: [
        {
          id: 'sword-1',
          itemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_SWORD_WOOD,
          quantity: 1,
          slotIndex: 0,
        },
      ],
    };

    expect(
      resolvingWorldPlazaProfilePanelAttackBonusDetailLines(100, inventory, 0)
    ).toEqual(['Wood Sword', '1x multiplicative', '+10 flat damage']);
  });
});
