import { DEFINING_WORLD_PLAZA_PERMA_DEATH_CHARACTER_PICKER_OPTION_COUNT } from '@/components/world/domains/definingWorldPlazaPermaDeathLoadConstants';
import {
  clearingWorldPlazaPermaDeathCharacterPickerOffer,
  resettingWorldPlazaPermaDeathCharacterPickerOfferStoreForTests,
} from '@/components/world/domains/managingWorldPlazaPermaDeathCharacterPickerOfferStore';
import { resolvingWorldPlazaPermaDeathCharacterPickerOptions } from '@/components/world/domains/resolvingWorldPlazaPermaDeathCharacterPickerOptions';
import { beforeEach, describe, expect, it } from 'vitest';

const POOL = [
  { skinId: 'girl-sample', label: 'Girl' },
  { skinId: 'alpaca', label: 'Alpaca' },
  { skinId: 'antelope', label: 'Antelope' },
  { skinId: 'arabian-horse', label: 'Arabian Horse' },
  { skinId: 'bison', label: 'Bison' },
  { skinId: 'boar', label: 'Boar' },
  { skinId: 'deer', label: 'Deer' },
] as const;

describe('resolvingWorldPlazaPermaDeathCharacterPickerOptions', () => {
  beforeEach(() => {
    resettingWorldPlazaPermaDeathCharacterPickerOfferStoreForTests();
  });

  it('rolls once and reuses the same offer on later resolves', () => {
    const first = resolvingWorldPlazaPermaDeathCharacterPickerOptions(
      POOL,
      DEFINING_WORLD_PLAZA_PERMA_DEATH_CHARACTER_PICKER_OPTION_COUNT,
      () => 0
    );
    const second = resolvingWorldPlazaPermaDeathCharacterPickerOptions(
      POOL,
      DEFINING_WORLD_PLAZA_PERMA_DEATH_CHARACTER_PICKER_OPTION_COUNT,
      () => 0.99
    );

    expect(first.map((option) => option.skinId)).toEqual([
      'girl-sample',
      'alpaca',
      'antelope',
      'arabian-horse',
      'bison',
    ]);
    expect(second.map((option) => option.skinId)).toEqual(
      first.map((option) => option.skinId)
    );
  });

  it('rolls a new offer after the locked offer is cleared', () => {
    const first = resolvingWorldPlazaPermaDeathCharacterPickerOptions(
      POOL,
      DEFINING_WORLD_PLAZA_PERMA_DEATH_CHARACTER_PICKER_OPTION_COUNT,
      () => 0
    );

    clearingWorldPlazaPermaDeathCharacterPickerOffer();

    const second = resolvingWorldPlazaPermaDeathCharacterPickerOptions(
      POOL,
      DEFINING_WORLD_PLAZA_PERMA_DEATH_CHARACTER_PICKER_OPTION_COUNT,
      () => 0.99
    );

    expect(first.map((option) => option.skinId)).toEqual([
      'girl-sample',
      'alpaca',
      'antelope',
      'arabian-horse',
      'bison',
    ]);
    expect(second.map((option) => option.skinId)).toEqual([
      'deer',
      'girl-sample',
      'alpaca',
      'antelope',
      'arabian-horse',
    ]);
  });
});
