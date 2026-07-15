import {
  checkingWorldPlazaPermaDeathLoadEnabled,
  disablingWorldPlazaPermaDeathLoad,
  enablingWorldPlazaPermaDeathLoad,
  gettingWorldPlazaPermaDeathPendingStartingAvatarSkinId,
  resettingWorldPlazaPermaDeathLoadStoreForTests,
} from '@/components/world/domains/managingWorldPlazaPermaDeathLoadStore';
import { afterEach, describe, expect, it } from 'vitest';

describe('managingWorldPlazaPermaDeathLoadStore', () => {
  afterEach(() => {
    resettingWorldPlazaPermaDeathLoadStoreForTests();
  });

  it('tracks pending starting skin until cleared', () => {
    enablingWorldPlazaPermaDeathLoad('grizzly');

    expect(checkingWorldPlazaPermaDeathLoadEnabled()).toBe(true);
    expect(gettingWorldPlazaPermaDeathPendingStartingAvatarSkinId()).toBe(
      'grizzly'
    );

    disablingWorldPlazaPermaDeathLoad();

    expect(checkingWorldPlazaPermaDeathLoadEnabled()).toBe(false);
    expect(gettingWorldPlazaPermaDeathPendingStartingAvatarSkinId()).toBe(null);
  });
});
