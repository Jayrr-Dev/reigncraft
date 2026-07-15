import {
  checkingWorldPlazaMushroomBunchHabitatSpeciesId,
  checkingWorldPlazaMushroomBunchSpawnCount,
} from '@/components/world/mushrooms/domains/checkingWorldPlazaMushroomBunchSpawn';
import {
  computingWorldPlazaMushroomBunchTilePositions,
  listingWorldPlazaMushroomBunchFootprintTilePositions,
} from '@/components/world/mushrooms/domains/computingWorldPlazaMushroomBunchTilePositions';
import { describe, expect, it } from 'vitest';

describe('computingWorldPlazaMushroomBunchTilePositions', () => {
  it('keeps every seat within 1 Chebyshev tile of the anchor', () => {
    const seats = computingWorldPlazaMushroomBunchTilePositions({
      centerTileX: 10,
      centerTileY: 20,
      count: 5,
    });

    expect(seats).toHaveLength(5);
    expect(seats[0]).toMatchObject({
      tileX: 10,
      tileY: 20,
      offsetX: 0,
      offsetY: 0,
    });
    expect(seats.every((seat) => seat.chebyshevDistanceTiles <= 1)).toBe(true);

    const keys = new Set(seats.map((seat) => `${seat.tileX},${seat.tileY}`));
    expect(keys.size).toBe(5);
  });

  it('can skip the center and only use neighbors', () => {
    const seats = computingWorldPlazaMushroomBunchTilePositions({
      centerTileX: 0,
      centerTileY: 0,
      count: 3,
      includeCenterTile: false,
    });

    expect(seats).toHaveLength(3);
    expect(seats.every((seat) => seat.chebyshevDistanceTiles === 1)).toBe(true);
    expect(seats.some((seat) => seat.tileX === 0 && seat.tileY === 0)).toBe(
      false
    );
  });

  it('rotates neighbor fill order without moving the center seat', () => {
    const base = computingWorldPlazaMushroomBunchTilePositions({
      centerTileX: 0,
      centerTileY: 0,
      count: 3,
      neighborRotationSteps: 0,
    });
    const rotated = computingWorldPlazaMushroomBunchTilePositions({
      centerTileX: 0,
      centerTileY: 0,
      count: 3,
      neighborRotationSteps: 1,
    });

    expect(rotated[0]).toEqual(base[0]);
    expect(rotated[1]).not.toEqual(base[1]);
  });

  it('lists the full 3×3 footprint', () => {
    const footprint = listingWorldPlazaMushroomBunchFootprintTilePositions({
      centerTileX: 4,
      centerTileY: 4,
    });

    expect(footprint).toHaveLength(9);
  });

  it('rejects oversized bunches', () => {
    expect(() =>
      computingWorldPlazaMushroomBunchTilePositions({
        centerTileX: 0,
        centerTileY: 0,
        count: 10,
      })
    ).toThrow(/Unsupported mushroom bunch count/);
  });
});

describe('checkingWorldPlazaMushroomBunchSpawn', () => {
  it('validates counts and bunch species hints', () => {
    expect(checkingWorldPlazaMushroomBunchSpawnCount(3)).toBe(true);
    expect(checkingWorldPlazaMushroomBunchSpawnCount(9)).toBe(true);
    expect(checkingWorldPlazaMushroomBunchSpawnCount(9, false)).toBe(false);
    expect(checkingWorldPlazaMushroomBunchSpawnCount(8, false)).toBe(true);
    expect(
      checkingWorldPlazaMushroomBunchHabitatSpeciesId('cluster-honey')
    ).toBe(true);
    expect(
      checkingWorldPlazaMushroomBunchHabitatSpeciesId('golden-chanter')
    ).toBe(false);
  });
});
