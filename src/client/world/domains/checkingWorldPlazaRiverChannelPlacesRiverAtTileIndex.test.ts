import {
  checkingWorldPlazaRiverChannelPassesNoiseAtTileIndex,
  checkingWorldPlazaRiverChannelPlacesRiverAtTileIndex,
  invalidatingWorldPlazaRiverChannelPassesNoiseCache,
} from '@/components/world/domains/checkingWorldPlazaRiverChannelPlacesRiverAtTileIndex';
import { describe, expect, it } from 'vitest';

describe('checkingWorldPlazaRiverChannelPlacesRiverAtTileIndex', () => {
  it('places connected river channel tiles near the origin', () => {
    let riverChannelTiles = 0;

    for (let tileY = -120; tileY <= 120; tileY += 1) {
      for (let tileX = -120; tileX <= 120; tileX += 1) {
        if (
          checkingWorldPlazaRiverChannelPlacesRiverAtTileIndex(tileX, tileY)
        ) {
          riverChannelTiles += 1;
        }
      }
    }

    expect(riverChannelTiles).toBeGreaterThan(40);
  });

  it('keeps channel noise results stable after cache invalidation', () => {
    const sampleTiles: Array<{ tileX: number; tileY: number }> = [];

    for (let tileY = -40; tileY <= 40; tileY += 4) {
      for (let tileX = -40; tileX <= 40; tileX += 4) {
        sampleTiles.push({ tileX, tileY });
      }
    }

    const beforeInvalidation = sampleTiles.map(({ tileX, tileY }) => ({
      passesNoise: checkingWorldPlazaRiverChannelPassesNoiseAtTileIndex(
        tileX,
        tileY
      ),
      placesRiver: checkingWorldPlazaRiverChannelPlacesRiverAtTileIndex(
        tileX,
        tileY
      ),
    }));

    invalidatingWorldPlazaRiverChannelPassesNoiseCache();

    const afterInvalidation = sampleTiles.map(({ tileX, tileY }) => ({
      passesNoise: checkingWorldPlazaRiverChannelPassesNoiseAtTileIndex(
        tileX,
        tileY
      ),
      placesRiver: checkingWorldPlazaRiverChannelPlacesRiverAtTileIndex(
        tileX,
        tileY
      ),
    }));

    expect(afterInvalidation).toEqual(beforeInvalidation);
  });
});
