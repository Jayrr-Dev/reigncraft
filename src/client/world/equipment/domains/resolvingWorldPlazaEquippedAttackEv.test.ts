import type { DefiningInventoryState } from '@/components/inventory/domains/definingInventoryItem';
import { resolvingWorldPlazaEquippedAttackEv } from '@/components/world/equipment/domains/resolvingWorldPlazaEquippedAttackEv';
import { DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_SWORD_GOLD } from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemTypeIds';
import { describe, expect, it } from 'vitest';

describe('resolvingWorldPlazaEquippedAttackEv', () => {
  it('returns base attack when no slot is selected', () => {
    const inventory: DefiningInventoryState = {
      capacity: 1,
      slots: [null],
    };
    expect(resolvingWorldPlazaEquippedAttackEv(300, inventory, null)).toBe(300);
  });

  it('applies gold sword multiplicative attack EV', () => {
    const inventory: DefiningInventoryState = {
      capacity: 1,
      slots: [
        {
          id: 'sword-1',
          itemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_SWORD_GOLD,
          quantity: 1,
          slotIndex: 0,
        },
      ],
    };

    expect(resolvingWorldPlazaEquippedAttackEv(300, inventory, 0)).toBe(435);
  });
});
