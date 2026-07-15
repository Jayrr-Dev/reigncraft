import { creatingEmptyWorldPlazaArmorLoadoutState } from '@/components/world/equipment/domains/definingWorldPlazaArmorLoadoutTypes';
import {
  countingWorldPlazaIronPlateArmorPiecesWorn,
  resolvingWorldPlazaIronPlateArmorSetCombatModifiers,
} from '@/components/world/equipment/domains/resolvingWorldPlazaIronPlateArmorSetCombatModifiers';
import { syncingWorldPlazaArmorWornCombatModifiers } from '@/components/world/equipment/domains/syncingWorldPlazaArmorWornCombatModifiers';
import { creatingWorldPlazaEntityHealthInitialState } from '@/components/world/health/domains/managingWorldPlazaEntityHealthState';
import { describe, expect, it } from 'vitest';

describe('Iron Plate set combat modifiers', () => {
  it('applies piece crumbs and 2-piece set bonus when two pieces worn', () => {
    const loadout = {
      ...creatingEmptyWorldPlazaArmorLoadoutState(),
      helm: {
        id: 'a',
        itemTypeId: 'world-plaza-iron-plate-casque',
        quantity: 1,
        slotIndex: -1,
      },
      arm: {
        id: 'b',
        itemTypeId: 'world-plaza-iron-plate-gauntlets',
        quantity: 1,
        slotIndex: -1,
      },
    };

    expect(countingWorldPlazaIronPlateArmorPiecesWorn(loadout)).toBe(2);

    const modifiers = resolvingWorldPlazaIronPlateArmorSetCombatModifiers(
      loadout,
      1000
    );

    expect(modifiers.some((modifier) => modifier.kind === 'expected')).toBe(
      true
    );
    expect(modifiers.some((modifier) => modifier.kind === 'stability')).toBe(
      true
    );
    expect(
      modifiers.filter((modifier) => modifier.kind === 'stability')
    ).toHaveLength(2);
  });

  it('syncs full-set expected crumb at 4 pieces', () => {
    const loadout = {
      ...creatingEmptyWorldPlazaArmorLoadoutState(),
      helm: {
        id: 'a',
        itemTypeId: 'world-plaza-iron-plate-casque',
        quantity: 1,
        slotIndex: -1,
      },
      arm: {
        id: 'b',
        itemTypeId: 'world-plaza-iron-plate-gauntlets',
        quantity: 1,
        slotIndex: -1,
      },
      body: {
        id: 'c',
        itemTypeId: 'world-plaza-iron-plate-breastplate',
        quantity: 1,
        slotIndex: -1,
      },
      foot: {
        id: 'd',
        itemTypeId: 'world-plaza-iron-plate-sabatons',
        quantity: 1,
        slotIndex: -1,
      },
    };

    const synced = syncingWorldPlazaArmorWornCombatModifiers(
      creatingWorldPlazaEntityHealthInitialState(),
      loadout,
      1000
    );

    expect(
      synced.damageRollModifiers.some(
        (modifier) =>
          modifier.id.includes('iron-plate:set-4') &&
          modifier.kind === 'expected' &&
          modifier.value === 0.93
      )
    ).toBe(true);
  });
});
