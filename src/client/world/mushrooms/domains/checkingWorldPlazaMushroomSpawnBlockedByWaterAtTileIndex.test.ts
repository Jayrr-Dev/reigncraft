import { checkingWorldPlazaMushroomSpawnBlockedByWaterAtTileIndex } from '@/components/world/mushrooms/domains/checkingWorldPlazaMushroomSpawnBlockedByWaterAtTileIndex';
import { describe, expect, it } from 'vitest';

describe('checkingWorldPlazaMushroomSpawnBlockedByWaterAtTileIndex', () => {
  it('blocks the water tile itself', () => {
    expect(
      checkingWorldPlazaMushroomSpawnBlockedByWaterAtTileIndex({
        tileX: 0,
        tileY: 0,
        checkingWaterAtTile: (x, y) => x === 0 && y === 0,
      })
    ).toBe(true);
  });

  it('blocks tiles one Chebyshev step from water', () => {
    expect(
      checkingWorldPlazaMushroomSpawnBlockedByWaterAtTileIndex({
        tileX: 1,
        tileY: 1,
        checkingWaterAtTile: (x, y) => x === 0 && y === 0,
      })
    ).toBe(true);
  });

  it('allows tiles two steps away from water', () => {
    expect(
      checkingWorldPlazaMushroomSpawnBlockedByWaterAtTileIndex({
        tileX: 2,
        tileY: 0,
        checkingWaterAtTile: (x, y) => x === 0 && y === 0,
      })
    ).toBe(false);
  });
});
