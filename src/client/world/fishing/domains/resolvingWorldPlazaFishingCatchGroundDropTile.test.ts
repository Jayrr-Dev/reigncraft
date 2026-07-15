import { resolvingWorldPlazaFishingCatchGroundDropTile } from '@/components/world/fishing/domains/resolvingWorldPlazaFishingCatchGroundDropTile';
import { describe, expect, it } from 'vitest';

describe('resolvingWorldPlazaFishingCatchGroundDropTile', () => {
  it('picks a random non-water neighbor one tile from the player', () => {
    const waterTiles = new Set(['11:10', '10:11']);
    const drop = resolvingWorldPlazaFishingCatchGroundDropTile({
      playerPosition: { x: 10.4, y: 10.6, layer: 1 },
      rollUnit: () => 0,
      checkingWaterAtTile: (tileX, tileY) =>
        waterTiles.has(`${tileX}:${tileY}`),
    });

    expect(drop).toEqual({ tileX: 10, tileY: 9 });
  });

  it('skips water neighbors when rolling a later index', () => {
    const waterTiles = new Set(['10:9', '11:10']);
    const drop = resolvingWorldPlazaFishingCatchGroundDropTile({
      playerPosition: { x: 10.2, y: 10.2, layer: 1 },
      rollUnit: () => 0,
      checkingWaterAtTile: (tileX, tileY) =>
        waterTiles.has(`${tileX}:${tileY}`),
    });

    // Offsets order: N water, E water, S (10,11) first land candidate.
    expect(drop).toEqual({ tileX: 10, tileY: 11 });
  });

  it('falls back to the player tile when every neighbor is water', () => {
    const drop = resolvingWorldPlazaFishingCatchGroundDropTile({
      playerPosition: { x: 5.1, y: 7.9, layer: 1 },
      rollUnit: () => 0.99,
      checkingWaterAtTile: () => true,
    });

    expect(drop).toEqual({ tileX: 5, tileY: 7 });
  });
});
