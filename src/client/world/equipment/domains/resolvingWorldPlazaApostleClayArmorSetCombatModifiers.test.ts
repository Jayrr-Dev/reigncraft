import { creatingEmptyWorldPlazaArmorLoadoutState } from '@/components/world/equipment/domains/definingWorldPlazaArmorLoadoutTypes';
import {
  countingWorldPlazaApostleClayArmorPiecesWorn,
  resolvingWorldPlazaApostleClayArmorFullSetOnHitEphemeralModifiers,
  resolvingWorldPlazaApostleClayArmorSetCombatModifiers,
} from '@/components/world/equipment/domains/resolvingWorldPlazaApostleClayArmorSetCombatModifiers';
import { syncingWorldPlazaArmorWornCombatModifiers } from '@/components/world/equipment/domains/syncingWorldPlazaArmorWornCombatModifiers';
import { creatingWorldPlazaEntityHealthInitialState } from '@/components/world/health/domains/managingWorldPlazaEntityHealthState';
import { describe, expect, it } from 'vitest';

describe('Apostle Clay set combat modifiers', () => {
  it('applies tank expected cut at 3 pieces', () => {
    const loadout = {
      ...creatingEmptyWorldPlazaArmorLoadoutState(),
      helm: {
        id: 'a',
        itemTypeId: 'world-plaza-apostle-clay-mask',
        quantity: 1,
        slotIndex: -1,
      },
      arm: {
        id: 'b',
        itemTypeId: 'world-plaza-apostle-clay-gauntlets',
        quantity: 1,
        slotIndex: -1,
      },
      body: {
        id: 'c',
        itemTypeId: 'world-plaza-apostle-clay-harness',
        quantity: 1,
        slotIndex: -1,
      },
    };

    expect(countingWorldPlazaApostleClayArmorPiecesWorn(loadout)).toBe(3);

    const modifiers = resolvingWorldPlazaApostleClayArmorSetCombatModifiers(
      loadout,
      1000
    );

    expect(
      modifiers.some(
        (modifier) => modifier.kind === 'expected' && modifier.value === 0.7
      )
    ).toBe(true);
    expect(modifiers.some((modifier) => modifier.kind === 'variance')).toBe(
      true
    );
  });

  it('grants full-set marker and 8% Exposed crack on hit', () => {
    const loadout = {
      ...creatingEmptyWorldPlazaArmorLoadoutState(),
      helm: {
        id: 'a',
        itemTypeId: 'world-plaza-apostle-clay-mask',
        quantity: 1,
        slotIndex: -1,
      },
      arm: {
        id: 'b',
        itemTypeId: 'world-plaza-apostle-clay-gauntlets',
        quantity: 1,
        slotIndex: -1,
      },
      body: {
        id: 'c',
        itemTypeId: 'world-plaza-apostle-clay-harness',
        quantity: 1,
        slotIndex: -1,
      },
      foot: {
        id: 'd',
        itemTypeId: 'world-plaza-apostle-clay-sabatons',
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
        modifier.id.includes('apostle-clay:full-marker')
      )
    ).toBe(true);

    const cracked =
      resolvingWorldPlazaApostleClayArmorFullSetOnHitEphemeralModifiers({
        hasFullSetMarker: true,
        damageKind: 'physical',
        random: () => 0.01,
      });
    expect(cracked).toHaveLength(1);
    expect(cracked[0]?.kind).toBe('forced_tier');

    const missed =
      resolvingWorldPlazaApostleClayArmorFullSetOnHitEphemeralModifiers({
        hasFullSetMarker: true,
        damageKind: 'physical',
        random: () => 0.5,
      });
    expect(missed).toHaveLength(0);
  });
});
