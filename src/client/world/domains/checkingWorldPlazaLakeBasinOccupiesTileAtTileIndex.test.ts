import {
  checkingWorldPlazaLakeBasinOccupiesTileAtTileIndex,
  findingWorldPlazaNearestLakeBasinOccupyingTileNearTileIndex,
  invalidatingWorldPlazaLakeBasinOccupyCache,
} from '@/components/world/domains/checkingWorldPlazaLakeBasinOccupiesTileAtTileIndex';
import { describe, expect, it } from 'vitest';

describe('checkingWorldPlazaLakeBasinOccupiesTileAtTileIndex', () => {
  it('returns null when no lake basin occupies tiles within the search radius', () => {
    expect(
      findingWorldPlazaNearestLakeBasinOccupyingTileNearTileIndex(9999, 9999, 2)
    ).toBeNull();
  });

  it('keeps occupy results stable after cache invalidation', () => {
    const sampleTiles: Array<{ tileX: number; tileY: number }> = [];

    for (let tileY = -40; tileY <= 40; tileY += 4) {
      for (let tileX = -40; tileX <= 40; tileX += 4) {
        sampleTiles.push({ tileX, tileY });
      }
    }

    const beforeInvalidation = sampleTiles.map(({ tileX, tileY }) =>
      checkingWorldPlazaLakeBasinOccupiesTileAtTileIndex(tileX, tileY)
    );

    invalidatingWorldPlazaLakeBasinOccupyCache();

    const afterInvalidation = sampleTiles.map(({ tileX, tileY }) =>
      checkingWorldPlazaLakeBasinOccupiesTileAtTileIndex(tileX, tileY)
    );

    expect(afterInvalidation).toEqual(beforeInvalidation);
  });
});
