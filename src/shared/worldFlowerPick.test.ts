import { describe, expect, it } from 'vitest';
import {
  checkingWorldFlowerPickEligibility,
  computingWorldFlowerPickMutation,
  formattingWorldFlowerPickTileKey,
} from './worldFlowerPick';

describe('worldFlowerPick', () => {
  it('formats tile keys', () => {
    expect(formattingWorldFlowerPickTileKey(3, 7)).toBe('3,7');
  });

  it('rejects out-of-range picks', () => {
    expect(
      checkingWorldFlowerPickEligibility({
        tileX: 10,
        tileY: 10,
        playerX: 0,
        playerY: 0,
      }).outcome
    ).toBe('out-of-range');
  });

  it('rejects already-picked tiles', () => {
    expect(
      checkingWorldFlowerPickEligibility({
        tileX: 5,
        tileY: 5,
        playerX: 5.5,
        playerY: 5.5,
        existingTileState: { isPicked: true },
      }).outcome
    ).toBe('already-picked');
  });

  it('mutates eligible picks to one flower', () => {
    const result = computingWorldFlowerPickMutation({
      tileX: 5,
      tileY: 5,
      playerX: 5.5,
      playerY: 5.5,
      speciesId: 'yarrow',
    });

    expect(result).toEqual({
      outcome: 'picked',
      nextTileState: { isPicked: true },
      speciesId: 'yarrow',
      flowerQuantity: 1,
    });
  });
});
