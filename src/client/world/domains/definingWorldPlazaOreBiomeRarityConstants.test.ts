import {
  DEFINING_WORLD_PLAZA_ORE_NEAR_WATER_COLUMN_STONE_NOISE_MIN,
  DEFINING_WORLD_PLAZA_ORE_NEAR_WATER_RADIUS_TILES,
  DEFINING_WORLD_PLAZA_ORE_VEIN_CHANCE_NEAR_WATER,
  DEFINING_WORLD_PLAZA_ORE_WEIGHTS_FIRELANDS,
  DEFINING_WORLD_PLAZA_ORE_WEIGHTS_NEAR_WATER,
  DEFINING_WORLD_PLAZA_ORE_WEIGHTS_ROCKY,
  resolvingWorldPlazaOreBiomePoolResolution,
} from '@/components/world/domains/definingWorldPlazaOreBiomeRarityConstants';
import { describe, expect, it } from 'vitest';

describe('definingWorldPlazaOreBiomeRarityConstants', () => {
  it('routes firelands to volcanic pool', () => {
    const pool = resolvingWorldPlazaOreBiomePoolResolution({
      biomeKind: 'firelands',
      isNearSurfaceWater: true,
      isRockyBiome: true,
    });

    expect(pool.poolId).toBe('firelands');
    expect(pool.weights).toBe(DEFINING_WORLD_PLAZA_ORE_WEIGHTS_FIRELANDS);
    expect(pool.weights.map((entry) => entry.speciesId).sort()).toEqual(
      ['gold', 'scarlet', 'silver', 'sulfur'].sort()
    );
  });

  it('prefers clay shore pool over rocky when near water', () => {
    const pool = resolvingWorldPlazaOreBiomePoolResolution({
      biomeKind: 'plains',
      isNearSurfaceWater: true,
      isRockyBiome: true,
    });

    expect(pool.poolId).toBe('near-water');
    expect(pool.weights).toBe(DEFINING_WORLD_PLAZA_ORE_WEIGHTS_NEAR_WATER);
    expect(pool.weights[0]?.speciesId).toBe('clay');
    expect(pool.veinChance).toBe(
      DEFINING_WORLD_PLAZA_ORE_VEIN_CHANCE_NEAR_WATER
    );
  });

  it('keeps riverbank clay denser than world stone default', () => {
    expect(
      DEFINING_WORLD_PLAZA_ORE_NEAR_WATER_RADIUS_TILES
    ).toBeGreaterThanOrEqual(5);
    expect(
      DEFINING_WORLD_PLAZA_ORE_VEIN_CHANCE_NEAR_WATER
    ).toBeGreaterThanOrEqual(0.55);
    expect(
      DEFINING_WORLD_PLAZA_ORE_NEAR_WATER_COLUMN_STONE_NOISE_MIN
    ).toBeLessThan(0.72);
    expect(DEFINING_WORLD_PLAZA_ORE_WEIGHTS_NEAR_WATER[0]).toMatchObject({
      speciesId: 'clay',
      weight: 140,
    });
  });

  it('uses rocky metal pool in rocky biomes away from water', () => {
    const pool = resolvingWorldPlazaOreBiomePoolResolution({
      biomeKind: 'rocky',
      isNearSurfaceWater: false,
      isRockyBiome: true,
    });

    expect(pool.poolId).toBe('rocky');
    expect(pool.weights).toBe(DEFINING_WORLD_PLAZA_ORE_WEIGHTS_ROCKY);
    expect(pool.weights.map((entry) => entry.speciesId)).toEqual(
      expect.arrayContaining(['iron', 'copper', 'lead', 'niter'])
    );
  });
});
