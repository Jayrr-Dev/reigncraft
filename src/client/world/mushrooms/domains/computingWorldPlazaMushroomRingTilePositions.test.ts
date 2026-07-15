import { describe, expect, it } from 'vitest';
import { checkingWorldPlazaMushroomRingSpawnCount } from '@/components/world/mushrooms/domains/checkingWorldPlazaMushroomRingSpawnCount';
import { computingWorldPlazaMushroomRingTilePositions } from '@/components/world/mushrooms/domains/computingWorldPlazaMushroomRingTilePositions';
import { DEFINING_WORLD_PLAZA_MUSHROOM_RING_SPAWN_COUNTS } from '@/components/world/mushrooms/domains/definingWorldPlazaMushroomRingSpawnConstants';

describe('computingWorldPlazaMushroomRingTilePositions', () => {
  it.each([...DEFINING_WORLD_PLAZA_MUSHROOM_RING_SPAWN_COUNTS])(
    'places %i unique tiles around the center',
    (count) => {
      const seats = computingWorldPlazaMushroomRingTilePositions({
        centerTileX: 10,
        centerTileY: 20,
        count,
      });

      expect(seats).toHaveLength(count);

      const keys = new Set(
        seats.map((seat) => `${seat.tileX},${seat.tileY}`)
      );
      expect(keys.size).toBe(count);
      expect(keys.has('10,20')).toBe(false);
    }
  );

  it('rotates when startAngleRadians changes', () => {
    const unrotated = computingWorldPlazaMushroomRingTilePositions({
      centerTileX: 0,
      centerTileY: 0,
      count: 4,
      radiusTiles: 3,
      startAngleRadians: 0,
    });
    const rotated = computingWorldPlazaMushroomRingTilePositions({
      centerTileX: 0,
      centerTileY: 0,
      count: 4,
      radiusTiles: 3,
      startAngleRadians: Math.PI / 4,
    });

    expect(rotated[0]?.tileX).not.toBe(unrotated[0]?.tileX);
  });
});

describe('checkingWorldPlazaMushroomRingSpawnCount', () => {
  it('accepts only 4, 5, 7, and 11', () => {
    expect(checkingWorldPlazaMushroomRingSpawnCount(4)).toBe(true);
    expect(checkingWorldPlazaMushroomRingSpawnCount(5)).toBe(true);
    expect(checkingWorldPlazaMushroomRingSpawnCount(7)).toBe(true);
    expect(checkingWorldPlazaMushroomRingSpawnCount(11)).toBe(true);
    expect(checkingWorldPlazaMushroomRingSpawnCount(6)).toBe(false);
    expect(checkingWorldPlazaMushroomRingSpawnCount(3)).toBe(false);
  });
});
