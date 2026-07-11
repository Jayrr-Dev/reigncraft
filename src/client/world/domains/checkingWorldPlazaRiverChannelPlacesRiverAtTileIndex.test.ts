import { checkingWorldPlazaRiverChannelPlacesRiverAtTileIndex } from '@/components/world/domains/checkingWorldPlazaRiverChannelPlacesRiverAtTileIndex';
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
});
