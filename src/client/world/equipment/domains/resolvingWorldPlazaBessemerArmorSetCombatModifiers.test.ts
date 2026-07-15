import { creatingEmptyWorldPlazaArmorLoadoutState } from '@/components/world/equipment/domains/definingWorldPlazaArmorLoadoutTypes';
import {
  countingWorldPlazaBessemerArmorPiecesWorn,
  resolvingWorldPlazaBessemerArmorSetCombatModifiers,
} from '@/components/world/equipment/domains/resolvingWorldPlazaBessemerArmorSetCombatModifiers';
import { syncingWorldPlazaArmorWornCombatModifiers } from '@/components/world/equipment/domains/syncingWorldPlazaArmorWornCombatModifiers';
import { creatingWorldPlazaEntityHealthInitialState } from '@/components/world/health/domains/managingWorldPlazaEntityHealthState';
import { describe, expect, it } from 'vitest';

describe('Bessemer Plate set combat modifiers', () => {
  it('applies stability and 2-piece set bonus when two pieces worn', () => {
    const loadout = {
      ...creatingEmptyWorldPlazaArmorLoadoutState(),
      helm: {
        id: 'a',
        itemTypeId: 'world-plaza-bessemer-casque',
        quantity: 1,
        slotIndex: -1,
      },
      arm: {
        id: 'b',
        itemTypeId: 'world-plaza-bessemer-gauntlets',
        quantity: 1,
        slotIndex: -1,
      },
    };

    expect(countingWorldPlazaBessemerArmorPiecesWorn(loadout)).toBe(2);

    const modifiers = resolvingWorldPlazaBessemerArmorSetCombatModifiers(
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

  it('grants full-set marker, block bias, and shield floor at 4 pieces', () => {
    const loadout = {
      ...creatingEmptyWorldPlazaArmorLoadoutState(),
      helm: {
        id: 'a',
        itemTypeId: 'world-plaza-bessemer-casque',
        quantity: 1,
        slotIndex: -1,
      },
      arm: {
        id: 'b',
        itemTypeId: 'world-plaza-bessemer-gauntlets',
        quantity: 1,
        slotIndex: -1,
      },
      body: {
        id: 'c',
        itemTypeId: 'world-plaza-bessemer-breastplate',
        quantity: 1,
        slotIndex: -1,
      },
      foot: {
        id: 'd',
        itemTypeId: 'world-plaza-bessemer-sabatons',
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
      synced.damageRollModifiers.some((modifier) =>
        modifier.id.includes('bessemer:full-marker')
      )
    ).toBe(true);
    expect(
      synced.damageRollModifiers.some(
        (modifier) => modifier.kind === 'block_bias' && modifier.value === 1
      )
    ).toBe(true);
    expect(synced.shieldPoints).toBeGreaterThanOrEqual(80);
  });
});
