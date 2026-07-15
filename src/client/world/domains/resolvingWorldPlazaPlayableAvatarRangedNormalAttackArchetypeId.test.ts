import {
  resolvingWorldPlazaPlayableAvatarRangedCombatProfile,
  resolvingWorldPlazaPlayableAvatarRangedNormalAttackArchetypeId,
} from '@/components/world/domains/definingWorldPlazaPlayableAvatarRangedCombatRegistry';
import { describe, expect, it } from 'vitest';

describe('resolvingWorldPlazaPlayableAvatarRangedNormalAttackArchetypeId', () => {
  const profile =
    resolvingWorldPlazaPlayableAvatarRangedCombatProfile('cyroborn');

  it('resolves cyroborn ranged profile', () => {
    expect(profile).not.toBeNull();
    expect(profile?.rollCastArchetypeId).toBe('cyroborn-ice-bolt');
    expect(profile?.suppressMelee).toBe(true);
  });

  it('picks ice sphere for low samples (70% band)', () => {
    expect(profile).not.toBeNull();
    expect(
      resolvingWorldPlazaPlayableAvatarRangedNormalAttackArchetypeId(
        profile!,
        0
      )
    ).toBe('cyroborn-ice-sphere');
    expect(
      resolvingWorldPlazaPlayableAvatarRangedNormalAttackArchetypeId(
        profile!,
        0.69
      )
    ).toBe('cyroborn-ice-sphere');
  });

  it('picks shatter orb for high samples (30% band)', () => {
    expect(profile).not.toBeNull();
    expect(
      resolvingWorldPlazaPlayableAvatarRangedNormalAttackArchetypeId(
        profile!,
        0.7
      )
    ).toBe('cyroborn-shatter-orb');
    expect(
      resolvingWorldPlazaPlayableAvatarRangedNormalAttackArchetypeId(
        profile!,
        0.99
      )
    ).toBe('cyroborn-shatter-orb');
  });
});
