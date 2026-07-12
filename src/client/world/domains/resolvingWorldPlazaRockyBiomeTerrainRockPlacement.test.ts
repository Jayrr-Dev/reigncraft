import {
  DEFINING_WORLD_PLAZA_ROCKY_BIOME_STONE_NOISE_MIN_CLUSTER,
  DEFINING_WORLD_PLAZA_ROCKY_BIOME_STONE_NOISE_MIN_SOLITARY,
} from '@/components/world/domains/definingWorldPlazaRockyBiomeConstants';
import { resolvingWorldPlazaRockyBiomeStoneNoiseMinAtTile } from '@/components/world/domains/resolvingWorldPlazaRockyBiomeTerrainRockPlacement';
import { DEFINING_WORLD_PLAZA_VEGETATION_STONE_NOISE_MIN } from '@/components/world/domains/samplingWorldPlazaVegetationDensityAtTile';
import { describe, expect, it } from 'vitest';

describe('resolvingWorldPlazaRockyBiomeStoneNoiseMinAtTile', () => {
  it('keeps the off-rocky vegetation bar unchanged', () => {
    expect(resolvingWorldPlazaRockyBiomeStoneNoiseMinAtTile(false, 0, 0)).toBe(
      DEFINING_WORLD_PLAZA_VEGETATION_STONE_NOISE_MIN
    );
  });

  it('uses solitary or cluster rocky bars only', () => {
    const samples = [
      resolvingWorldPlazaRockyBiomeStoneNoiseMinAtTile(true, 12, 34),
      resolvingWorldPlazaRockyBiomeStoneNoiseMinAtTile(true, 120, 340),
      resolvingWorldPlazaRockyBiomeStoneNoiseMinAtTile(true, -80, 15),
      resolvingWorldPlazaRockyBiomeStoneNoiseMinAtTile(true, 900, -40),
    ];

    for (const stoneNoiseMin of samples) {
      expect([
        DEFINING_WORLD_PLAZA_ROCKY_BIOME_STONE_NOISE_MIN_CLUSTER,
        DEFINING_WORLD_PLAZA_ROCKY_BIOME_STONE_NOISE_MIN_SOLITARY,
      ]).toContain(stoneNoiseMin);
    }
  });
});
