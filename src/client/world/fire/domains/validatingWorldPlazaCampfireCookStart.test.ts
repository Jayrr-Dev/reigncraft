import type { DefiningInventoryState } from '@/components/inventory/domains/definingInventoryItem';
import { validatingWorldPlazaCampfireCookStart } from '@/components/world/fire/domains/validatingWorldPlazaCampfireCookStart';
import { describe, expect, it } from 'vitest';

function creatingInventoryWithRawMeat(
  rawItemTypeId: string
): DefiningInventoryState {
  return {
    capacity: 8,
    slots: [
      {
        id: 'raw-meat-slot',
        itemTypeId: rawItemTypeId,
        quantity: 1,
        slotIndex: 0,
      },
      null,
      null,
      null,
      null,
      null,
      null,
      null,
    ],
  };
}

describe('validatingWorldPlazaCampfireCookStart', () => {
  it('rejects cooking on an unlit campfire', () => {
    const result = validatingWorldPlazaCampfireCookStart({
      isLit: false,
      inventoryState: creatingInventoryWithRawMeat(
        'world-plaza-raw-chicken-meat'
      ),
    });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.message).toContain('Light the campfire');
    }
  });

  it('returns recipe cook duration for the first raw meat stack', () => {
    const result = validatingWorldPlazaCampfireCookStart({
      isLit: true,
      inventoryState: creatingInventoryWithRawMeat('world-plaza-raw-bear-meat'),
    });

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.recipe.cookDurationMs).toBe(10_000);
      expect(result.recipe.cookedDisplayName).toBe('Cooked Bear Meat');
    }
  });
});
