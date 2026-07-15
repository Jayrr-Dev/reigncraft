import { describe, expect, it } from 'vitest';
import {
  checkingWorldPlazaMushroomPastureBiomeKind,
  checkingWorldPlazaMushroomPastureHabitatSpeciesId,
  checkingWorldPlazaMushroomStumpHabitatSpeciesId,
} from '@/components/world/mushrooms/domains/checkingWorldPlazaMushroomHabitatSpawn';
import {
  listingWorldPlazaMushroomCandidateTilePositionsInPastureBounds,
  listingWorldPlazaMushroomPastureRingTilePositions,
} from '@/components/world/mushrooms/domains/listingWorldPlazaMushroomCandidateTilePositionsInPastureBounds';
import { listingWorldPlazaMushroomCandidateTilePositionsNearStump } from '@/components/world/mushrooms/domains/listingWorldPlazaMushroomCandidateTilePositionsNearStump';

describe('listingWorldPlazaMushroomCandidateTilePositionsNearStump', () => {
  it('lists Chebyshev annulus tiles and excludes the stump', () => {
    const seats = listingWorldPlazaMushroomCandidateTilePositionsNearStump({
      stumpTileX: 5,
      stumpTileY: 5,
      minRadiusTiles: 1,
      maxRadiusTiles: 1,
    });

    expect(seats).toHaveLength(8);
    expect(seats.some((seat) => seat.tileX === 5 && seat.tileY === 5)).toBe(
      false
    );
    expect(
      seats.every((seat) => seat.chebyshevDistanceTiles === 1)
    ).toBe(true);
  });

  it('rejects inverted radius ranges', () => {
    expect(() =>
      listingWorldPlazaMushroomCandidateTilePositionsNearStump({
        stumpTileX: 0,
        stumpTileY: 0,
        minRadiusTiles: 3,
        maxRadiusTiles: 1,
      })
    ).toThrow(/Invalid stump-near radius range/);
  });
});

describe('listingWorldPlazaMushroomCandidateTilePositionsInPastureBounds', () => {
  it('keeps only pasture biomes from the injected resolver', () => {
    const seats = listingWorldPlazaMushroomCandidateTilePositionsInPastureBounds(
      {
        minTileX: 0,
        maxTileX: 2,
        minTileY: 0,
        maxTileY: 0,
        resolveBiomeKindAtTile: (tileX) =>
          tileX === 1 ? 'plains' : tileX === 2 ? 'savanna' : 'forest',
      }
    );

    expect(seats).toEqual([
      { tileX: 1, tileY: 0, biomeKind: 'plains' },
      { tileX: 2, tileY: 0, biomeKind: 'savanna' },
    ]);
  });

  it('builds a pasture fairy ring of default count 7', () => {
    const seats = listingWorldPlazaMushroomPastureRingTilePositions({
      centerTileX: 10,
      centerTileY: 10,
    });

    expect(seats).toHaveLength(7);
  });
});

describe('checkingWorldPlazaMushroomHabitatSpawn', () => {
  it('classifies stump and pasture species / biomes', () => {
    expect(checkingWorldPlazaMushroomStumpHabitatSpeciesId('cluster-honey')).toBe(
      true
    );
    expect(checkingWorldPlazaMushroomStumpHabitatSpeciesId('golden-chanter')).toBe(
      false
    );
    expect(checkingWorldPlazaMushroomPastureHabitatSpeciesId('field-agaric')).toBe(
      true
    );
    expect(checkingWorldPlazaMushroomPastureHabitatSpeciesId('shelf-oyster')).toBe(
      false
    );
    expect(checkingWorldPlazaMushroomPastureBiomeKind('plains')).toBe(true);
    expect(checkingWorldPlazaMushroomPastureBiomeKind('forest')).toBe(false);
  });
});
