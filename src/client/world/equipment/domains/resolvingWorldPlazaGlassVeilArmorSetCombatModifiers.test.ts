import { creatingEmptyWorldPlazaArmorLoadoutState } from '@/components/world/equipment/domains/definingWorldPlazaArmorLoadoutTypes';
import {
  countingWorldPlazaGlassVeilArmorPiecesWorn,
  resolvingWorldPlazaGlassVeilArmorSetCombatModifiers,
  resolvingWorldPlazaGlassVeilFullSetOnHitEphemeralModifiers,
} from '@/components/world/equipment/domains/resolvingWorldPlazaGlassVeilArmorSetCombatModifiers';
import { describe, expect, it } from 'vitest';

describe('Glass Veil set combat modifiers', () => {
  it('stacks dodge bias crumbs and 2-piece luck when two pieces worn', () => {
    const loadout = {
      ...creatingEmptyWorldPlazaArmorLoadoutState(),
      helm: {
        id: 'a',
        itemTypeId: 'world-plaza-glass-veil-diadem',
        quantity: 1,
        slotIndex: -1,
      },
      arm: {
        id: 'b',
        itemTypeId: 'world-plaza-glass-veil-bracers',
        quantity: 1,
        slotIndex: -1,
      },
    };

    expect(countingWorldPlazaGlassVeilArmorPiecesWorn(loadout)).toBe(2);

    const modifiers = resolvingWorldPlazaGlassVeilArmorSetCombatModifiers(
      loadout,
      1000
    );

    expect(modifiers.some((modifier) => modifier.kind === 'dodge_bias')).toBe(
      true
    );
    expect(modifiers.some((modifier) => modifier.kind === 'luck')).toBe(true);
    expect(modifiers.some((modifier) => modifier.kind === 'expected')).toBe(
      true
    );
  });

  it('procs instinct dodged when full set ready, then respects cooldown', () => {
    const ready = resolvingWorldPlazaGlassVeilFullSetOnHitEphemeralModifiers({
      hasFullSetMarker: true,
      damageKind: 'physical',
      nowMs: 50_000,
      lastInstinctProcAtMs: 0,
    });

    expect(ready.didProc).toBe(true);
    expect(ready.modifiers[0]?.kind).toBe('forced_tier');

    const cooling = resolvingWorldPlazaGlassVeilFullSetOnHitEphemeralModifiers({
      hasFullSetMarker: true,
      damageKind: 'physical',
      nowMs: 55_000,
      lastInstinctProcAtMs: 50_000,
    });

    expect(cooling.didProc).toBe(false);
    expect(cooling.modifiers).toHaveLength(0);
  });
});
