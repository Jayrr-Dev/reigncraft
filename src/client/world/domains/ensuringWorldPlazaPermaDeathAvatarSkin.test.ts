import { ensuringWorldPlazaPermaDeathAvatarSkin } from '@/components/world/domains/ensuringWorldPlazaPermaDeathAvatarSkin';
import {
  initializingWorldPlazaAvatarSkinSelectionStore,
  resettingWorldPlazaAvatarSkinSelectionStoreForTests,
} from '@/components/world/domains/managingWorldPlazaAvatarSkinSelectionStore';
import {
  enablingWorldPlazaPermaDeathLoad,
  resettingWorldPlazaPermaDeathLoadStoreForTests,
} from '@/components/world/domains/managingWorldPlazaPermaDeathLoadStore';
import { afterEach, describe, expect, it } from 'vitest';

describe('ensuringWorldPlazaPermaDeathAvatarSkin', () => {
  afterEach(() => {
    resettingWorldPlazaAvatarSkinSelectionStoreForTests();
    resettingWorldPlazaPermaDeathLoadStoreForTests();
  });

  it('applies the pending home-screen skin once', () => {
    initializingWorldPlazaAvatarSkinSelectionStore('single-player:slot-3');
    enablingWorldPlazaPermaDeathLoad('husky');

    expect(ensuringWorldPlazaPermaDeathAvatarSkin()).toBe('husky');
    expect(ensuringWorldPlazaPermaDeathAvatarSkin()).toBe('husky');
  });
});
