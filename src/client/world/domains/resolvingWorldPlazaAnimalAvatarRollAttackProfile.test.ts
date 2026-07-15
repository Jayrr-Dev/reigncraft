import { computingWorldPlazaAnimalAvatarRollAttackDamage } from '@/components/world/domains/computingWorldPlazaAnimalAvatarRollAttackDamage';
import { resolvingWorldPlazaAnimalAvatarRollAttackProfile } from '@/components/world/domains/resolvingWorldPlazaAnimalAvatarRollAttackProfile';
import { describe, expect, it } from 'vitest';

describe('resolvingWorldPlazaAnimalAvatarRollAttackProfile', () => {
  it('returns null for GirlSample', () => {
    expect(resolvingWorldPlazaAnimalAvatarRollAttackProfile('girl-sample')).toBe(
      null
    );
  });

  it('gives cats a long fast pounce', () => {
    const profile = resolvingWorldPlazaAnimalAvatarRollAttackProfile('cat-orange');

    expect(profile).not.toBeNull();
    expect(profile?.archetypeId).toBe('pouncer');
    expect(profile?.dealsContactDamage).toBe(true);
    expect(profile?.forwardGridDistance).toBeGreaterThan(3);
    expect(profile?.durationScale).toBeLessThan(1);
    expect(profile?.damageMultiplier).toBe(1.5);
  });

  it('maps elite-wolf folder to omega canine leap', () => {
    const profile =
      resolvingWorldPlazaAnimalAvatarRollAttackProfile('elite-wolf');

    expect(profile?.archetypeId).toBe('canine');
    expect(profile?.damageMultiplier).toBe(1.65);
  });

  it('keeps Cyroborn roll projectile-only', () => {
    const profile = resolvingWorldPlazaAnimalAvatarRollAttackProfile('cyroborn');

    expect(profile?.archetypeId).toBe('frostCaster');
    expect(profile?.dealsContactDamage).toBe(false);
  });

  it('gives prey animals kick extras', () => {
    const profile = resolvingWorldPlazaAnimalAvatarRollAttackProfile('deer');

    expect(profile?.extraOnHitEffects.length).toBeGreaterThan(0);
    expect(profile?.extraOnHitEffects[0]?.kind).toBe('buff');
  });
});

describe('computingWorldPlazaAnimalAvatarRollAttackDamage', () => {
  it('rounds attackPower × multiplier for contact rolls', () => {
    const profile = resolvingWorldPlazaAnimalAvatarRollAttackProfile('husky');

    expect(profile).not.toBeNull();

    if (!profile) {
      return;
    }

    expect(
      computingWorldPlazaAnimalAvatarRollAttackDamage(100, profile)
    ).toBe(150);
  });

  it('returns 0 when contact damage is disabled', () => {
    const profile = resolvingWorldPlazaAnimalAvatarRollAttackProfile('cyroborn');

    expect(profile).not.toBeNull();

    if (!profile) {
      return;
    }

    expect(
      computingWorldPlazaAnimalAvatarRollAttackDamage(100, profile)
    ).toBe(0);
  });
});
