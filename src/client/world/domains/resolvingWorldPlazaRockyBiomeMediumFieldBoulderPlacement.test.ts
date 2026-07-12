import {
  DEFINING_WORLD_PLAZA_TERRAIN_LARGE_ROCK_SIZE_TIER_INDEX,
  DEFINING_WORLD_PLAZA_TERRAIN_MEDIUM_ROCK_SIZE_TIER_INDEX,
} from '@/components/world/domains/definingWorldPlazaTerrainObstacleConstants';
import { resolvingWorldPlazaRockyBiomeMediumFieldBoulderPlacement } from '@/components/world/domains/resolvingWorldPlazaRockyBiomeTerrainRockPlacement';
import { describe, expect, it } from 'vitest';

describe('resolvingWorldPlazaRockyBiomeMediumFieldBoulderPlacement', () => {
  it('returns a 1-tile / 3-layer medium boulder for rocky anchors below large tier', () => {
    const placement = resolvingWorldPlazaRockyBiomeMediumFieldBoulderPlacement(
      true,
      0,
      1,
      0
    );

    expect(placement).toEqual({
      sizeTierIndex: DEFINING_WORLD_PLAZA_TERRAIN_MEDIUM_ROCK_SIZE_TIER_INDEX,
      footprintTileWidth: 1,
      footprintTileHeight: 1,
      surfaceWorldLayer: 3,
    });
  });

  it('rolls a 4-layer field boulder from a high height unit', () => {
    const placement = resolvingWorldPlazaRockyBiomeMediumFieldBoulderPlacement(
      true,
      0,
      1,
      0.75
    );

    expect(placement?.surfaceWorldLayer).toBe(4);
  });

  it('demotes many large-tier rocky anchors into 1-tile field boulders', () => {
    const placement = resolvingWorldPlazaRockyBiomeMediumFieldBoulderPlacement(
      true,
      DEFINING_WORLD_PLAZA_TERRAIN_LARGE_ROCK_SIZE_TIER_INDEX,
      0.5,
      0.25
    );

    expect(placement).toEqual({
      sizeTierIndex: DEFINING_WORLD_PLAZA_TERRAIN_MEDIUM_ROCK_SIZE_TIER_INDEX,
      footprintTileWidth: 1,
      footprintTileHeight: 1,
      surfaceWorldLayer: 3,
    });
  });

  it('leaves some large-tier rocky anchors as mega-boulders', () => {
    expect(
      resolvingWorldPlazaRockyBiomeMediumFieldBoulderPlacement(
        true,
        DEFINING_WORLD_PLAZA_TERRAIN_LARGE_ROCK_SIZE_TIER_INDEX,
        0.9,
        0
      )
    ).toBeNull();
  });

  it('does not force compact medium boulders outside the rocky biome', () => {
    expect(
      resolvingWorldPlazaRockyBiomeMediumFieldBoulderPlacement(
        false,
        DEFINING_WORLD_PLAZA_TERRAIN_MEDIUM_ROCK_SIZE_TIER_INDEX,
        0,
        0
      )
    ).toBeNull();
  });
});
