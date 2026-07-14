import {
  checkingWorldLongGrassClearEligibility,
  computingWorldLongGrassClearMutation,
} from './worldLongGrassClear';
import { describe, expect, it } from 'vitest';

describe('worldLongGrassClear', () => {
  it('rejects search when the player is out of range', () => {
    expect(
      checkingWorldLongGrassClearEligibility({
        tileX: 10,
        tileY: 10,
        playerX: 0,
        playerY: 0,
      })
    ).toEqual({ outcome: 'out-of-range' });
  });

  it('rejects search when the tile is already cleared', () => {
    expect(
      checkingWorldLongGrassClearEligibility({
        tileX: 4,
        tileY: 4,
        playerX: 4.5,
        playerY: 4.5,
        existingTileState: { isCleared: true },
      })
    ).toEqual({ outcome: 'already-cleared' });
  });

  it('marks a tile cleared when search is eligible', () => {
    expect(
      computingWorldLongGrassClearMutation({
        tileX: 4,
        tileY: 4,
        playerX: 4.5,
        playerY: 4.5,
      })
    ).toEqual({
      outcome: 'cleared',
      nextTileState: { isCleared: true },
    });
  });
});
