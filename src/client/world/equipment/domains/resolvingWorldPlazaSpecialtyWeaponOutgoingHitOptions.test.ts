import { resolvingWorldPlazaSpecialtyWeaponOutgoingHitOptions } from '@/components/world/equipment/domains/resolvingWorldPlazaSpecialtyWeaponOutgoingHitOptions';
import { describe, expect, it } from 'vitest';

describe('resolvingWorldPlazaSpecialtyWeaponOutgoingHitOptions', () => {
  it('returns empty for unknown weapons', () => {
    const result = resolvingWorldPlazaSpecialtyWeaponOutgoingHitOptions({
      itemTypeId: 'world-plaza-sword-wood',
    });
    expect(result.attackerDamageRollModifiers).toEqual([]);
    expect(result.potentialDamageProc).toBeNull();
    expect(result.bleedProc).toBeNull();
  });

  it('always bleeds with Splinter Stick', () => {
    const result = resolvingWorldPlazaSpecialtyWeaponOutgoingHitOptions({
      itemTypeId: 'world-plaza-weapon-splinter-stick',
      random: () => 0.5,
    });
    expect(result.bleedProc?.severity).toBe('bleeding');
  });

  it('applies Chaos Die passive chaotic/variance crumbs', () => {
    const result = resolvingWorldPlazaSpecialtyWeaponOutgoingHitOptions({
      itemTypeId: 'world-plaza-weapon-chaos-die',
      random: () => 0.99,
    });
    expect(
      result.attackerDamageRollModifiers.some(
        (modifier) => modifier.kind === 'chaotic'
      )
    ).toBe(true);
    expect(
      result.attackerDamageRollModifiers.some(
        (modifier) => modifier.kind === 'variance'
      )
    ).toBe(true);
  });

  it('can lock Quiet Hand swings to true strike', () => {
    const result = resolvingWorldPlazaSpecialtyWeaponOutgoingHitOptions({
      itemTypeId: 'world-plaza-weapon-quiet-hand',
      random: () => 0.01,
    });
    expect(result.forcedRollMode).toBe('lock_in');
  });

  it('always plants Fated Ledger potential damage', () => {
    const result = resolvingWorldPlazaSpecialtyWeaponOutgoingHitOptions({
      itemTypeId: 'world-plaza-weapon-fated-ledger',
      random: () => 0.5,
    });
    expect(result.potentialDamageProc?.pendingEvRatio).toBe(0.5);
  });
});
