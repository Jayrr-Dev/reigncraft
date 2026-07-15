import { describe, expect, it } from 'vitest';
import {
  checkingWorldMushroomPickEligibility,
  computingWorldMushroomPickMutation,
  formattingWorldMushroomPickTileKey,
} from './worldMushroomPick';

describe('worldMushroomPick', () => {
  it('formats tile keys', () => {
    expect(formattingWorldMushroomPickTileKey(3, 7)).toBe('3,7');
  });

  it('rejects out-of-range picks', () => {
    expect(
      checkingWorldMushroomPickEligibility({
        tileX: 10,
        tileY: 10,
        playerX: 0,
        playerY: 0,
      }).outcome
    ).toBe('out-of-range');
  });

  it('rejects already-picked tiles', () => {
    expect(
      checkingWorldMushroomPickEligibility({
        tileX: 5,
        tileY: 5,
        playerX: 5.5,
        playerY: 5.5,
        existingTileState: { isPicked: true },
      }).outcome
    ).toBe('already-picked');
  });

  it('mutates eligible picks to one mushroom', () => {
    const result = computingWorldMushroomPickMutation({
      tileX: 5,
      tileY: 5,
      playerX: 5.5,
      playerY: 5.5,
      speciesId: 'golden-chanter',
    });

    expect(result).toEqual({
      outcome: 'picked',
      nextTileState: { isPicked: true },
      speciesId: 'golden-chanter',
      mushroomQuantity: 1,
    });
  });
});
