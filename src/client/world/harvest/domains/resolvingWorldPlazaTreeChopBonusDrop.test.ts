import { DEFINING_WORLD_PLAZA_TREE_CHOP_BONUS_DROP_BY_VARIANT } from '@/components/world/harvest/domains/definingWorldPlazaTreeChopBonusDropConstants';
import { resolvingWorldPlazaTreeChopBonusDrop } from '@/components/world/harvest/domains/resolvingWorldPlazaTreeChopBonusDrop';
import { DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_COCONUT } from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemTypeIds';
import { describe, expect, it } from 'vitest';

describe('resolvingWorldPlazaTreeChopBonusDrop', () => {
  it('registers a 30% coconut drop for palm', () => {
    expect(DEFINING_WORLD_PLAZA_TREE_CHOP_BONUS_DROP_BY_VARIANT.palm).toEqual({
      itemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_COCONUT,
      chance: 0.3,
      quantity: 1,
    });
  });

  it('drops coconut when the chance roll succeeds', () => {
    expect(resolvingWorldPlazaTreeChopBonusDrop('palm', () => 0.29)).toEqual({
      itemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_COCONUT,
      quantity: 1,
    });
  });

  it('skips coconut when the chance roll fails', () => {
    expect(resolvingWorldPlazaTreeChopBonusDrop('palm', () => 0.3)).toBeNull();
  });

  it('skips bonus drops for non-palm trees', () => {
    expect(resolvingWorldPlazaTreeChopBonusDrop('oak', () => 0)).toBeNull();
  });
});
