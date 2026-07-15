import { creatingEmptyWorldPlazaArmorLoadoutState } from '@/components/world/equipment/domains/definingWorldPlazaArmorLoadoutTypes';
import {
  countingWorldPlazaCraftablePlateArmorPiecesWorn,
  resolvingWorldPlazaCraftablePlateArmorSetCombatModifiers,
} from '@/components/world/equipment/domains/resolvingWorldPlazaCraftablePlateArmorSetCombatModifiers';
import { syncingWorldPlazaArmorWornCombatModifiers } from '@/components/world/equipment/domains/syncingWorldPlazaArmorWornCombatModifiers';
import { creatingWorldPlazaEntityHealthInitialState } from '@/components/world/health/domains/managingWorldPlazaEntityHealthState';
import { describe, expect, it } from 'vitest';

describe('craftable plate armor set combat modifiers', () => {
  it('applies iron-plate piece crumbs and 2-piece set bonus', () => {
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

    expect(countingWorldPlazaCraftablePlateArmorPiecesWorn(loadout)).toBe(2);

    const modifiers = resolvingWorldPlazaCraftablePlateArmorSetCombatModifiers(
      loadout,
      1000
    );

    expect(modifiers.some((modifier) => modifier.kind === 'expected')).toBe(
      true
    );
    expect(
      modifiers.filter((modifier) => modifier.kind === 'stability')
    ).toHaveLength(2);
  });

  it('does not mix set bonuses across tiers', () => {
    const loadout = {
      ...creatingEmptyWorldPlazaArmorLoadoutState(),
      helm: {
        id: 'a',
        itemTypeId: 'world-plaza-copper-plate-casque',
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

    const modifiers = resolvingWorldPlazaCraftablePlateArmorSetCombatModifiers(
      loadout,
      1000
    );

    expect(modifiers.some((modifier) => modifier.id.includes(':set-2-'))).toBe(
      false
    );
  });

  it('syncs steel full-set expected crumb at 4 pieces', () => {
    const loadout = {
      ...creatingEmptyWorldPlazaArmorLoadoutState(),
      helm: {
        id: 'a',
        itemTypeId: 'world-plaza-steel-plate-casque',
        quantity: 1,
        slotIndex: -1,
      },
      arm: {
        id: 'b',
        itemTypeId: 'world-plaza-steel-plate-gauntlets',
        quantity: 1,
        slotIndex: -1,
      },
      body: {
        id: 'c',
        itemTypeId: 'world-plaza-steel-plate-breastplate',
        quantity: 1,
        slotIndex: -1,
      },
      foot: {
        id: 'd',
        itemTypeId: 'world-plaza-steel-plate-sabatons',
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
          modifier.id.includes('steel-plate:set-4') &&
          modifier.kind === 'expected' &&
          modifier.value === 0.9
      )
    ).toBe(true);
  });
});
