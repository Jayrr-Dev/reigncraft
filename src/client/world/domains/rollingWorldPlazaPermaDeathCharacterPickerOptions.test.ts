import { DEFINING_WORLD_PLAZA_PERMA_DEATH_CHARACTER_PICKER_OPTION_COUNT } from '@/components/world/domains/definingWorldPlazaPermaDeathLoadConstants';
import { rollingWorldPlazaPermaDeathCharacterPickerOptions } from '@/components/world/domains/rollingWorldPlazaPermaDeathCharacterPickerOptions';
import { describe, expect, it } from 'vitest';

const POOL = [
  { skinId: 'girl-sample', label: 'Girl' },
  { skinId: 'alpaca', label: 'Alpaca' },
  { skinId: 'antelope', label: 'Antelope' },
  { skinId: 'arabian-horse', label: 'Arabian Horse' },
  { skinId: 'bison', label: 'Bison' },
  { skinId: 'boar', label: 'Boar' },
  { skinId: 'deer', label: 'Deer' },
] as const;

describe('rollingWorldPlazaPermaDeathCharacterPickerOptions', () => {
  it('returns an empty list for an empty pool', () => {
    expect(rollingWorldPlazaPermaDeathCharacterPickerOptions([])).toEqual([]);
  });

  it('returns the full pool when it is smaller than the option count', () => {
    const smallPool = POOL.slice(0, 3);
    const rolled = rollingWorldPlazaPermaDeathCharacterPickerOptions(
      smallPool,
      DEFINING_WORLD_PLAZA_PERMA_DEATH_CHARACTER_PICKER_OPTION_COUNT,
      () => 0
    );

    expect(rolled).toHaveLength(3);
    expect(rolled.map((option) => option.skinId)).toEqual([
      'girl-sample',
      'alpaca',
      'antelope',
    ]);
  });

  it('samples a deterministic set of five unique options', () => {
    const rolled = rollingWorldPlazaPermaDeathCharacterPickerOptions(
      POOL,
      DEFINING_WORLD_PLAZA_PERMA_DEATH_CHARACTER_PICKER_OPTION_COUNT,
      () => 0
    );

    expect(rolled).toHaveLength(
      DEFINING_WORLD_PLAZA_PERMA_DEATH_CHARACTER_PICKER_OPTION_COUNT
    );
    expect(new Set(rolled.map((option) => option.skinId)).size).toBe(
      DEFINING_WORLD_PLAZA_PERMA_DEATH_CHARACTER_PICKER_OPTION_COUNT
    );
    expect(rolled.map((option) => option.skinId)).toEqual([
      'girl-sample',
      'alpaca',
      'antelope',
      'arabian-horse',
      'bison',
    ]);
  });

  it('can select later pool entries when the RNG is non-zero', () => {
    const rolled = rollingWorldPlazaPermaDeathCharacterPickerOptions(
      POOL,
      DEFINING_WORLD_PLAZA_PERMA_DEATH_CHARACTER_PICKER_OPTION_COUNT,
      () => 0.99
    );

    expect(rolled.map((option) => option.skinId)).toEqual([
      'deer',
      'girl-sample',
      'alpaca',
      'antelope',
      'arabian-horse',
    ]);
  });
});
