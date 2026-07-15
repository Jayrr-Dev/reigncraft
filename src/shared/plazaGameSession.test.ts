import { describe, expect, it } from 'vitest';
import {
  checkingPlazaSinglePlayerPermaDeathLoadSession,
  checkingPlazaSinglePlayerRandomAnimalLoadSession,
  PLAZA_SINGLE_PLAYER_PERMA_DEATH_SAVE_SLOT_INDEX,
} from './plazaGameSession';

describe('checkingPlazaSinglePlayerPermaDeathLoadSession', () => {
  it('returns true for slot 3 perma-death sessions', () => {
    expect(
      checkingPlazaSinglePlayerPermaDeathLoadSession({
        mode: 'single-player',
        saveSlotIndex: PLAZA_SINGLE_PLAYER_PERMA_DEATH_SAVE_SLOT_INDEX,
        loadProfile: 'perma-death',
      })
    ).toBe(true);
  });

  it('returns false for standard and random-animal sessions', () => {
    expect(
      checkingPlazaSinglePlayerPermaDeathLoadSession({
        mode: 'single-player',
        saveSlotIndex: 1,
      })
    ).toBe(false);
    expect(
      checkingPlazaSinglePlayerRandomAnimalLoadSession({
        mode: 'single-player',
        saveSlotIndex: 2,
        loadProfile: 'random-animal',
      })
    ).toBe(true);
    expect(
      checkingPlazaSinglePlayerPermaDeathLoadSession({
        mode: 'multiplayer',
        roomId: 'room-1',
      })
    ).toBe(false);
    expect(checkingPlazaSinglePlayerPermaDeathLoadSession(null)).toBe(false);
  });
});
