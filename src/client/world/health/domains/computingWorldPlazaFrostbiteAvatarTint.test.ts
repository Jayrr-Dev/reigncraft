import { describe, expect, it } from 'vitest';
import {
  COMPUTING_WORLD_PLAZA_FROSTBITE_AVATAR_TINT_NONE,
  computingWorldPlazaFrostbiteAvatarTint,
  computingWorldPlazaFrostbiteAvatarTintIntensity,
} from '@/components/world/health/domains/computingWorldPlazaFrostbiteAvatarTint';
import { DEFINING_WORLD_PLAZA_ENTITY_FROSTBITE_ICY_AVATAR_TINT } from '@/components/world/health/domains/definingWorldPlazaEntityFrostbiteConstants';

describe('computingWorldPlazaFrostbiteAvatarTint', () => {
  it('stays white below Freezing', () => {
    expect(computingWorldPlazaFrostbiteAvatarTintIntensity(0)).toBe(0);
    expect(computingWorldPlazaFrostbiteAvatarTintIntensity(199)).toBe(0);
    expect(computingWorldPlazaFrostbiteAvatarTint(199)).toBe(
      COMPUTING_WORLD_PLAZA_FROSTBITE_AVATAR_TINT_NONE
    );
  });

  it('ramps from Freezing toward full icy at max stacks', () => {
    expect(computingWorldPlazaFrostbiteAvatarTintIntensity(200)).toBeCloseTo(
      0.2
    );
    expect(computingWorldPlazaFrostbiteAvatarTintIntensity(500)).toBeCloseTo(
      0.5
    );
    expect(computingWorldPlazaFrostbiteAvatarTintIntensity(1000)).toBe(1);
    expect(computingWorldPlazaFrostbiteAvatarTint(1000)).toBe(
      DEFINING_WORLD_PLAZA_ENTITY_FROSTBITE_ICY_AVATAR_TINT
    );

    const freezingTint = computingWorldPlazaFrostbiteAvatarTint(200);
    const hypothermiaTint = computingWorldPlazaFrostbiteAvatarTint(500);
    expect(freezingTint).not.toBe(COMPUTING_WORLD_PLAZA_FROSTBITE_AVATAR_TINT_NONE);
    expect(hypothermiaTint).not.toBe(freezingTint);
    expect(hypothermiaTint).not.toBe(
      DEFINING_WORLD_PLAZA_ENTITY_FROSTBITE_ICY_AVATAR_TINT
    );
  });
});
