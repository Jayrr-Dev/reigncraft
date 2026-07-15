import {
  checkingWorldPlazaRandomAnimalPlayableAvatarSkinId,
  listingWorldPlazaRandomAnimalPlayableAvatarSkinIds,
  rollingWorldPlazaRandomAnimalPlayableAvatarSkin,
} from '@/components/world/domains/rollingWorldPlazaRandomAnimalPlayableAvatarSkin';
import { describe, expect, it } from 'vitest';

describe('rollingWorldPlazaRandomAnimalPlayableAvatarSkin', () => {
  it('lists only eligible playable skins', () => {
    const skinIds = listingWorldPlazaRandomAnimalPlayableAvatarSkinIds();

    expect(skinIds.length).toBeGreaterThan(0);
    expect(skinIds).not.toContain('fairy');
    expect(skinIds).not.toContain('cyroborn');
    expect(skinIds).not.toContain('sunhead');
    expect(skinIds).not.toContain('elite-wolf');
  });

  it('rolls a deterministic skin from the pool', () => {
    const skinIds = listingWorldPlazaRandomAnimalPlayableAvatarSkinIds();
    const rolled = rollingWorldPlazaRandomAnimalPlayableAvatarSkin(() => 0);

    expect(rolled).toBe(skinIds[0]);
    expect(checkingWorldPlazaRandomAnimalPlayableAvatarSkinId(rolled)).toBe(
      true
    );
  });
});
