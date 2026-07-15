import { ensuringWorldPlazaRandomAnimalAvatarSkin } from '@/components/world/domains/ensuringWorldPlazaRandomAnimalAvatarSkin';
import {
  gettingWorldPlazaSelectedAvatarSkinId,
  initializingWorldPlazaAvatarSkinSelectionStore,
  resettingWorldPlazaAvatarSkinSelectionStoreForTests,
  settingWorldPlazaSelectedAvatarSkin,
} from '@/components/world/domains/managingWorldPlazaAvatarSkinSelectionStore';
import { listingWorldPlazaRandomAnimalPlayableAvatarSkinIds } from '@/components/world/domains/rollingWorldPlazaRandomAnimalPlayableAvatarSkin';
import { afterEach, describe, expect, it } from 'vitest';
import {
  PLAZA_SINGLE_PLAYER_RANDOM_ANIMAL_SAVE_SLOT_INDEX,
  resolvingPlazaSinglePlayerSessionOwnerId,
} from '../../../shared/plazaGameSession';

describe('ensuringWorldPlazaRandomAnimalAvatarSkin', () => {
  const storageOwnerId = resolvingPlazaSinglePlayerSessionOwnerId(
    PLAZA_SINGLE_PLAYER_RANDOM_ANIMAL_SAVE_SLOT_INDEX
  );

  afterEach(() => {
    resettingWorldPlazaAvatarSkinSelectionStoreForTests();
  });

  it('keeps a previously selected animal form', () => {
    const animalSkinId =
      listingWorldPlazaRandomAnimalPlayableAvatarSkinIds()[0];

    expect(animalSkinId).toBeTruthy();

    initializingWorldPlazaAvatarSkinSelectionStore(storageOwnerId);
    settingWorldPlazaSelectedAvatarSkin(animalSkinId!);

    expect(ensuringWorldPlazaRandomAnimalAvatarSkin(() => 0.9)).toBe(
      animalSkinId
    );
    expect(gettingWorldPlazaSelectedAvatarSkinId()).toBe(animalSkinId);
  });

  it('rolls when the stored form is girl-sample', () => {
    initializingWorldPlazaAvatarSkinSelectionStore(storageOwnerId);
    settingWorldPlazaSelectedAvatarSkin('girl-sample');

    const rolled = ensuringWorldPlazaRandomAnimalAvatarSkin(() => 0);

    expect(rolled).not.toBe('girl-sample');
    expect(gettingWorldPlazaSelectedAvatarSkinId()).toBe(rolled);
  });
});
