import type { DefiningInventoryState } from '@/components/inventory/domains/definingInventoryItem';
import { resolvingWorldPlazaEquippedAttackEv } from '@/components/world/equipment/domains/resolvingWorldPlazaEquippedAttackEv';
import {
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_AXE_IRON,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_SWORD_GOLD,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_SWORD_STEEL,
} from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemTypeIds';
import { describe, expect, it } from 'vitest';

describe('resolvingWorldPlazaEquippedAttackEv', () => {
  it('returns base attack when no slot is selected', () => {
    const inventory: DefiningInventoryState = {
      capacity: 1,
      slots: [null],
    };
    expect(resolvingWorldPlazaEquippedAttackEv(300, inventory, null)).toBe(300);
  });

  it('applies steel sword multiplicative + flat attack EV', () => {
    const inventory: DefiningInventoryState = {
      capacity: 1,
      slots: [
        {
          id: 'sword-1',
          itemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_SWORD_STEEL,
          quantity: 1,
          slotIndex: 0,
        },
      ],
    };

    // 300 * 1.3 + 50
    expect(resolvingWorldPlazaEquippedAttackEv(300, inventory, 0)).toBe(440);
  });

  it('keeps gold sword EV on par with steel', () => {
    const steelInventory: DefiningInventoryState = {
      capacity: 1,
      slots: [
        {
          id: 'sword-steel',
          itemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_SWORD_STEEL,
          quantity: 1,
          slotIndex: 0,
        },
      ],
    };
    const goldInventory: DefiningInventoryState = {
      capacity: 1,
      slots: [
        {
          id: 'sword-gold',
          itemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_SWORD_GOLD,
          quantity: 1,
          slotIndex: 0,
        },
      ],
    };

    expect(resolvingWorldPlazaEquippedAttackEv(100, steelInventory, 0)).toBe(
      resolvingWorldPlazaEquippedAttackEv(100, goldInventory, 0)
    );
  });

  it('applies iron axe multiplicative + flat attack EV', () => {
    const inventory: DefiningInventoryState = {
      capacity: 1,
      slots: [
        {
          id: 'axe-1',
          itemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_AXE_IRON,
          quantity: 1,
          slotIndex: 0,
        },
      ],
    };

    // 100 * 1.15 + 20
    expect(resolvingWorldPlazaEquippedAttackEv(100, inventory, 0)).toBe(135);
  });
});
