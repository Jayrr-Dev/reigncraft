import { formattingWorldPlazaCraftModeInGameRemainingLabel } from '@/components/world/crafting/domains/formattingWorldPlazaCraftModeInGameRemainingLabel';
import { COMPUTING_WORLD_PLAZA_IN_GAME_SECOND_MS } from '@/components/world/domains/computingWorldPlazaInGameDurationMs';
import { describe, expect, it } from 'vitest';

describe('formattingWorldPlazaCraftModeInGameRemainingLabel', () => {
  it('formats sub-hour remainders as in-game seconds', () => {
    expect(
      formattingWorldPlazaCraftModeInGameRemainingLabel(
        COMPUTING_WORLD_PLAZA_IN_GAME_SECOND_MS * 42
      )
    ).toBe('42s');
  });

  it('formats longer remainders as in-game hours and seconds', () => {
    expect(
      formattingWorldPlazaCraftModeInGameRemainingLabel(
        COMPUTING_WORLD_PLAZA_IN_GAME_SECOND_MS * (3600 + 612)
      )
    ).toBe('1h 612s');
  });

  it('never goes negative', () => {
    expect(formattingWorldPlazaCraftModeInGameRemainingLabel(-500)).toBe('0s');
  });
});
