import { creatingEmptyInventoryState } from '@/components/inventory/domains/reducingInventoryState';
import { creatingEmptyWorldPlazaArmorLoadoutState } from '@/components/world/equipment/domains/definingWorldPlazaArmorLoadoutTypes';
import {
  equippingWorldPlazaArmorItemFromInventory,
  unequippingWorldPlazaArmorSlotToInventory,
} from '@/components/world/equipment/domains/equippingWorldPlazaArmorItemFromInventory';
import { resolvingWorldPlazaArmorSlotForItemOnBodyPlan } from '@/components/world/equipment/domains/resolvingWorldPlazaArmorSlotForItemOnBodyPlan';
import { describe, expect, it } from 'vitest';

const HIDE_VEST = {
  id: 'vest-1',
  itemTypeId: 'world-plaza-survival-hide-trail-vest',
  quantity: 1,
  slotIndex: 0,
} as const;

const WOOL_WRAP = {
  id: 'wrap-1',
  itemTypeId: 'world-plaza-survival-wool-neck-wrap',
  quantity: 1,
  slotIndex: 1,
} as const;

const LEG_WRAPS = {
  id: 'legs-1',
  itemTypeId: 'world-plaza-survival-cloth-leg-wraps',
  quantity: 1,
  slotIndex: 2,
} as const;

describe('resolvingWorldPlazaArmorSlotForItemOnBodyPlan', () => {
  it('maps body to torso and foot to paw-hooves on animal forms', () => {
    expect(
      resolvingWorldPlazaArmorSlotForItemOnBodyPlan({
        itemSlotId: 'body',
        bodyPlanId: 'animal',
      })
    ).toBe('torso');

    expect(
      resolvingWorldPlazaArmorSlotForItemOnBodyPlan({
        itemSlotId: 'foot',
        bodyPlanId: 'animal',
      })
    ).toBe('paw-hooves');

    expect(
      resolvingWorldPlazaArmorSlotForItemOnBodyPlan({
        itemSlotId: 'leg',
        bodyPlanId: 'animal',
      })
    ).toBeNull();
  });
});

describe('equippingWorldPlazaArmorItemFromInventory', () => {
  it('equips armor into the matching slot and removes it from inventory', () => {
    const inventoryState = {
      ...creatingEmptyInventoryState(3),
      slots: [HIDE_VEST, null, null],
    };

    const result = equippingWorldPlazaArmorItemFromInventory({
      inventoryState,
      loadoutState: creatingEmptyWorldPlazaArmorLoadoutState(),
      item: HIDE_VEST,
      bodyPlanId: 'humanoid',
    });

    expect(result.errorMessage).toBeNull();
    expect(result.loadoutState.body?.itemTypeId).toBe(HIDE_VEST.itemTypeId);
    expect(result.inventoryState.slots[0]).toBeNull();
  });

  it('returns the previous piece to inventory when swapping slots', () => {
    const inventoryState = {
      ...creatingEmptyInventoryState(3),
      slots: [WOOL_WRAP, null, null],
    };
    const loadoutState = {
      ...creatingEmptyWorldPlazaArmorLoadoutState(),
      helm: {
        id: 'hat-1',
        itemTypeId: 'world-plaza-survival-straw-sun-hat',
        quantity: 1,
        slotIndex: -1,
      },
    };

    const result = equippingWorldPlazaArmorItemFromInventory({
      inventoryState,
      loadoutState,
      item: WOOL_WRAP,
      bodyPlanId: 'humanoid',
    });

    expect(result.errorMessage).toBeNull();
    expect(result.loadoutState.helm?.itemTypeId).toBe(WOOL_WRAP.itemTypeId);
    expect(
      result.inventoryState.slots.some(
        (slot) => slot?.itemTypeId === 'world-plaza-survival-straw-sun-hat'
      )
    ).toBe(true);
  });

  it('rejects leg armor on animal body plans', () => {
    const inventoryState = {
      ...creatingEmptyInventoryState(3),
      slots: [LEG_WRAPS, null, null],
    };

    const result = equippingWorldPlazaArmorItemFromInventory({
      inventoryState,
      loadoutState: creatingEmptyWorldPlazaArmorLoadoutState(),
      item: LEG_WRAPS,
      bodyPlanId: 'animal',
    });

    expect(result.errorMessage).toBe('This form cannot wear that piece.');
    expect(result.inventoryState.slots[0]?.itemTypeId).toBe(LEG_WRAPS.itemTypeId);
  });
});

describe('unequippingWorldPlazaArmorSlotToInventory', () => {
  it('moves equipped armor back into inventory', () => {
    const inventoryState = creatingEmptyInventoryState(3);
    const loadoutState = {
      ...creatingEmptyWorldPlazaArmorLoadoutState(),
      body: HIDE_VEST,
    };

    const result = unequippingWorldPlazaArmorSlotToInventory({
      inventoryState,
      loadoutState,
      slotId: 'body',
    });

    expect(result.errorMessage).toBeNull();
    expect(result.loadoutState.body).toBeNull();
    expect(result.inventoryState.slots[0]?.itemTypeId).toBe(HIDE_VEST.itemTypeId);
  });
});
