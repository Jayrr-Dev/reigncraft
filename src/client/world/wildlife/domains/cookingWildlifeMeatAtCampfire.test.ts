import type { DefiningInventoryState } from '@/components/inventory/domains/definingInventoryItem';
import { cookingWildlifeMeatAtCampfire } from '@/components/world/wildlife/domains/cookingWildlifeMeatAtCampfire';
import { describe, expect, it } from 'vitest';

function creatingInventoryWithRawBoarMeat(): DefiningInventoryState {
  return {
    capacity: 8,
    slots: [
      {
        id: 'raw-boar-slot',
        itemTypeId: 'world-plaza-raw-boar-meat',
        quantity: 2,
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

describe('cookingWildlifeMeatAtCampfire', () => {
  it('transforms one raw meat into one cooked meat', () => {
    const result = cookingWildlifeMeatAtCampfire(creatingInventoryWithRawBoarMeat());

    expect(result.outcome).toBe('cooked');

    if (result.outcome !== 'cooked') {
      return;
    }

    expect(result.cookedDisplayName).toBe('Cooked Boar Meat');

    const rawQuantity = result.nextState.slots.reduce(
      (total, slot) =>
        slot?.itemTypeId === 'world-plaza-raw-boar-meat'
          ? total + slot.quantity
          : total,
      0
    );
    const cookedQuantity = result.nextState.slots.reduce(
      (total, slot) =>
        slot?.itemTypeId === 'world-plaza-cooked-boar-meat'
          ? total + slot.quantity
          : total,
      0
    );

    expect(rawQuantity).toBe(1);
    expect(cookedQuantity).toBe(1);
  });

  it('rejects when no raw meat is present', () => {
    const result = cookingWildlifeMeatAtCampfire({
      capacity: 8,
      slots: [null, null, null, null, null, null, null, null],
    });

    expect(result.outcome).toBe('no-raw-meat');
  });

  it('rejects when inventory cannot fit cooked meat', () => {
    const fullInventory: DefiningInventoryState = {
      capacity: 1,
      slots: [
        {
          id: 'raw-boar-slot',
          itemTypeId: 'world-plaza-raw-boar-meat',
          quantity: 1,
          slotIndex: 0,
        },
      ],
    };

    const result = cookingWildlifeMeatAtCampfire(fullInventory);

    expect(result.outcome).toBe('inventory-full');
  });
});
