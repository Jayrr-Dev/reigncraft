import { creatingEmptyWorldPlazaArmorLoadoutState } from '@/components/world/equipment/domains/definingWorldPlazaArmorLoadoutTypes';
import { formattingWorldPlazaSurvivalArmorTemperatureModifierId } from '@/components/world/equipment/domains/definingWorldPlazaSurvivalWearBuffRegistry';
import { syncingWorldPlazaArmorWornTemperatureModifiers } from '@/components/world/equipment/domains/syncingWorldPlazaArmorWornTemperatureModifiers';
import { creatingWorldPlazaEntityHealthInitialState } from '@/components/world/health/domains/managingWorldPlazaEntityHealthState';
import { describe, expect, it } from 'vitest';

describe('syncingWorldPlazaArmorWornTemperatureModifiers', () => {
  it('applies survival armor temperature modifiers for equipped wear', () => {
    const nowMs = 1_000;
    const loadout = {
      ...creatingEmptyWorldPlazaArmorLoadoutState(),
      body: {
        id: 'vest-1',
        itemTypeId: 'world-plaza-survival-hide-trail-vest',
        quantity: 1,
        slotIndex: -1,
      },
    };

    const nextState = syncingWorldPlazaArmorWornTemperatureModifiers(
      creatingWorldPlazaEntityHealthInitialState(),
      loadout,
      nowMs
    );

    const bodyModifier = nextState.timedTemperatureModifiers.find(
      (modifier) =>
        modifier.id === formattingWorldPlazaSurvivalArmorTemperatureModifierId('body')
    );

    expect(bodyModifier?.coldComfortBonusCelsius).toBe(8);
    expect(bodyModifier?.expiresAtMs).toBeGreaterThan(nowMs);
  });

  it('clears prior survival armor modifiers when loadout empties', () => {
    const equippedLoadout = {
      ...creatingEmptyWorldPlazaArmorLoadoutState(),
      helm: {
        id: 'hat-1',
        itemTypeId: 'world-plaza-survival-straw-sun-hat',
        quantity: 1,
        slotIndex: -1,
      },
    };

    const withModifier = syncingWorldPlazaArmorWornTemperatureModifiers(
      creatingWorldPlazaEntityHealthInitialState(),
      equippedLoadout,
      1_000
    );

    const cleared = syncingWorldPlazaArmorWornTemperatureModifiers(
      withModifier,
      creatingEmptyWorldPlazaArmorLoadoutState(),
      2_000
    );

    expect(
      cleared.timedTemperatureModifiers.some((modifier) =>
        modifier.id.startsWith('survival-armor-')
      )
    ).toBe(false);
  });
});
