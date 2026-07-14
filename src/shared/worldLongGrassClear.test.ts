import { describe, expect, it } from 'vitest';
import {
  checkingWorldLongGrassSearchEligibility,
  computingWorldLongGrassEatMutation,
  computingWorldLongGrassSearchMutation,
  parsingWorldLongGrassTileState,
} from './worldLongGrassClear';

describe('worldLongGrassClear', () => {
  it('rejects search when the player is out of range', () => {
    expect(
      checkingWorldLongGrassSearchEligibility({
        tileX: 10,
        tileY: 10,
        playerX: 0,
        playerY: 0,
      })
    ).toEqual({ outcome: 'out-of-range' });
  });

  it('rejects repeat search without removing the grass clump', () => {
    expect(
      checkingWorldLongGrassSearchEligibility({
        tileX: 4,
        tileY: 4,
        playerX: 4.5,
        playerY: 4.5,
        existingTileState: { isSearched: true },
      })
    ).toEqual({ outcome: 'already-searched' });
  });

  it('marks a tile searched while keeping eat state separate', () => {
    expect(
      computingWorldLongGrassSearchMutation({
        tileX: 4,
        tileY: 4,
        playerX: 4.5,
        playerY: 4.5,
      })
    ).toEqual({
      outcome: 'searched',
      nextTileState: { isSearched: true },
    });
  });

  it('marks a tile eaten for wildlife removal', () => {
    expect(
      computingWorldLongGrassEatMutation({
        tileX: 4,
        tileY: 4,
        existingTileState: { isSearched: true },
      })
    ).toEqual({
      outcome: 'eaten',
      nextTileState: { isSearched: true, isEaten: true },
    });
  });

  it('migrates legacy cleared saves to searched state', () => {
    expect(
      parsingWorldLongGrassTileState(JSON.stringify({ isCleared: true }))
    ).toEqual({ isSearched: true });
  });
});
