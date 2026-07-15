import { checkingWorldPlazaSpecialLoadSlotAvatarSkinShouldPersist } from '@/components/world/domains/checkingWorldPlazaSpecialLoadSlotAvatarSkinShouldPersist';
import {
  initializingWorldPlazaAvatarSkinSelectionStore,
  resettingWorldPlazaAvatarSkinSelectionStoreForTests,
} from '@/components/world/domains/managingWorldPlazaAvatarSkinSelectionStore';
import { afterEach, describe, expect, it } from 'vitest';
import {
  PLAZA_SINGLE_PLAYER_PERMA_DEATH_SAVE_SLOT_INDEX,
  PLAZA_SINGLE_PLAYER_RANDOM_ANIMAL_SAVE_SLOT_INDEX,
  resolvingPlazaSinglePlayerSessionOwnerId,
} from '../../../shared/plazaGameSession';

describe('checkingWorldPlazaSpecialLoadSlotAvatarSkinShouldPersist', () => {
  afterEach(() => {
    resettingWorldPlazaAvatarSkinSelectionStoreForTests();
  });

  it('is false before hydration', () => {
    expect(checkingWorldPlazaSpecialLoadSlotAvatarSkinShouldPersist()).toBe(
      false
    );
  });

  it('is true for the Random Animal slot owner', () => {
    initializingWorldPlazaAvatarSkinSelectionStore(
      resolvingPlazaSinglePlayerSessionOwnerId(
        PLAZA_SINGLE_PLAYER_RANDOM_ANIMAL_SAVE_SLOT_INDEX
      )
    );

    expect(checkingWorldPlazaSpecialLoadSlotAvatarSkinShouldPersist()).toBe(
      true
    );
  });

  it('is true for the Perma Death slot owner', () => {
    initializingWorldPlazaAvatarSkinSelectionStore(
      resolvingPlazaSinglePlayerSessionOwnerId(
        PLAZA_SINGLE_PLAYER_PERMA_DEATH_SAVE_SLOT_INDEX
      )
    );

    expect(checkingWorldPlazaSpecialLoadSlotAvatarSkinShouldPersist()).toBe(
      true
    );
  });

  it('is false for a standard save slot owner', () => {
    initializingWorldPlazaAvatarSkinSelectionStore(
      resolvingPlazaSinglePlayerSessionOwnerId(1)
    );

    expect(checkingWorldPlazaSpecialLoadSlotAvatarSkinShouldPersist()).toBe(
      false
    );
  });
});
