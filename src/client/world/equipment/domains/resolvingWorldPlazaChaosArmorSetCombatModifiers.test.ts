import { creatingEmptyWorldPlazaArmorLoadoutState } from '@/components/world/equipment/domains/definingWorldPlazaArmorLoadoutTypes';
import {
  countingWorldPlazaChaosArmorPiecesWorn,
  resolvingWorldPlazaChaosArmorFullSetOnHitEphemeralModifiers,
  resolvingWorldPlazaChaosArmorSetCombatModifiers,
} from '@/components/world/equipment/domains/resolvingWorldPlazaChaosArmorSetCombatModifiers';
import { syncingWorldPlazaArmorWornCombatModifiers } from '@/components/world/equipment/domains/syncingWorldPlazaArmorWornCombatModifiers';
import { creatingWorldPlazaEntityHealthInitialState } from '@/components/world/health/domains/managingWorldPlazaEntityHealthState';
import { describe, expect, it } from 'vitest';

describe('Chaos Armour set combat modifiers', () => {
  it('applies piece variance and 2-piece set variance when two pieces worn', () => {
    const loadout = {
      ...creatingEmptyWorldPlazaArmorLoadoutState(),
      helm: {
        id: 'a',
        itemTypeId: 'world-plaza-chaos-visor',
        quantity: 1,
        slotIndex: -1,
      },
      arm: {
        id: 'b',
        itemTypeId: 'world-plaza-chaos-fate-gauntlets',
        quantity: 1,
        slotIndex: -1,
      },
    };

    expect(countingWorldPlazaChaosArmorPiecesWorn(loadout)).toBe(2);

    const modifiers = resolvingWorldPlazaChaosArmorSetCombatModifiers(
      loadout,
      1000
    );
    const kinds = modifiers.map((modifier) => modifier.kind);

    expect(kinds).toContain('variance');
    expect(kinds).toContain('luck');
    expect(
      modifiers.filter((modifier) => modifier.kind === 'variance')
    ).toHaveLength(2);
  });

  it('grants full-set marker at 4 pieces and rolls on-hit procs', () => {
    const loadout = {
      ...creatingEmptyWorldPlazaArmorLoadoutState(),
      helm: {
        id: 'a',
        itemTypeId: 'world-plaza-chaos-visor',
        quantity: 1,
        slotIndex: -1,
      },
      arm: {
        id: 'b',
        itemTypeId: 'world-plaza-chaos-fate-gauntlets',
        quantity: 1,
        slotIndex: -1,
      },
      body: {
        id: 'c',
        itemTypeId: 'world-plaza-chaos-entropy-cuirass',
        quantity: 1,
        slotIndex: -1,
      },
      foot: {
        id: 'd',
        itemTypeId: 'world-plaza-chaos-coinflip-treads',
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
        modifier.id.includes('full-marker')
      )
    ).toBe(true);

    const forced = resolvingWorldPlazaChaosArmorFullSetOnHitEphemeralModifiers({
      hasFullSetMarker: true,
      damageKind: 'physical',
      random: () => 0.05,
    });

    expect(forced).toHaveLength(1);
    expect(forced[0]?.kind).toBe('forced_tier');
  });
});
