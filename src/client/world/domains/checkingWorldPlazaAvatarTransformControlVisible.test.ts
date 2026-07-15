import { checkingWorldPlazaAvatarTransformControlVisible } from '@/components/world/domains/checkingWorldPlazaAvatarTransformControlVisible';
import { DEFINING_WORLD_PLAZA_AVATAR_SKIN } from '@/components/world/domains/definingWorldPlazaAvatarSkinConstants';
import { describe, expect, it } from 'vitest';

describe('checkingWorldPlazaAvatarTransformControlVisible', () => {
  const girlOnly = [
    {
      skinId: DEFINING_WORLD_PLAZA_AVATAR_SKIN.GIRL_SAMPLE,
      label: 'Girl',
    },
  ] as const;

  const girlAndGrizzly = [
    ...girlOnly,
    {
      skinId: DEFINING_WORLD_PLAZA_AVATAR_SKIN.GRIZZLY,
      label: 'Grizzly',
    },
  ] as const;

  it('hides while girl has no unlocked animal forms', () => {
    expect(
      checkingWorldPlazaAvatarTransformControlVisible(
        girlOnly,
        DEFINING_WORLD_PLAZA_AVATAR_SKIN.GIRL_SAMPLE
      )
    ).toBe(false);
  });

  it('shows after an animal form unlocks', () => {
    expect(
      checkingWorldPlazaAvatarTransformControlVisible(
        girlAndGrizzly,
        DEFINING_WORLD_PLAZA_AVATAR_SKIN.GIRL_SAMPLE
      )
    ).toBe(true);
  });

  it('shows while already transformed so the player can switch back', () => {
    expect(
      checkingWorldPlazaAvatarTransformControlVisible(
        girlOnly,
        DEFINING_WORLD_PLAZA_AVATAR_SKIN.GRIZZLY
      )
    ).toBe(true);
  });
});
