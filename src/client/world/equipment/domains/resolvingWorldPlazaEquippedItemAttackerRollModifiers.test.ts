import { resolvingWorldPlazaEquippedItemAttackerRollModifiers } from '@/components/world/equipment/domains/resolvingWorldPlazaEquippedItemAttackerRollModifiers';
import {
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_AXE_GOLD,
  DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_SWORD_STEEL,
} from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemTypeIds';
import { describe, expect, it } from 'vitest';

describe('resolvingWorldPlazaEquippedItemAttackerRollModifiers', () => {
  it('returns empty for non-gold tiers', () => {
    expect(
      resolvingWorldPlazaEquippedItemAttackerRollModifiers(
        DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_SWORD_STEEL
      )
    ).toEqual([]);
  });

  it('applies gold variance crumb', () => {
    const modifiers = resolvingWorldPlazaEquippedItemAttackerRollModifiers(
      DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_AXE_GOLD
    );

    expect(modifiers).toHaveLength(1);
    expect(modifiers[0]?.kind).toBe('variance');
    expect(modifiers[0]?.value).toBe(1.35);
  });
});
