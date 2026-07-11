import {
  DEFINING_WORLD_PLAZA_TERRAIN_LARGE_ROCK_SIZE_TIER_INDEX,
  DEFINING_WORLD_PLAZA_TERRAIN_MEDIUM_ROCK_SIZE_TIER_INDEX,
} from '@/components/world/domains/definingWorldPlazaTerrainObstacleConstants';
import { resolvingWorldPlazaRockyBiomeMediumFieldBoulderPlacement } from '@/components/world/domains/resolvingWorldPlazaRockyBiomeTerrainRockPlacement';
import { describe, expect, it } from 'vitest';

describe('resolvingWorldPlazaRockyBiomeMediumFieldBoulderPlacement', () => {
  it('returns a 1-tile / 4-layer medium boulder for rocky anchors below large tier', () => {
    const placement = resolvingWorldPlazaRockyBiomeMediumFieldBoulderPlacement(
      true,
      0
    );

    expect(placement).toEqual({
      sizeTierIndex: DEFINING_WORLD_PLAZA_TERRAIN_MEDIUM_ROCK_SIZE_TIER_INDEX,
      footprintTileWidth: 1,
      footprintTileHeight: 1,
      surfaceWorldLayer: 4,
    });
  });

  it('leaves rocky large-tier mega-boulders on seeded footprint and height', () => {
    expect(
      resolvingWorldPlazaRockyBiomeMediumFieldBoulderPlacement(
        true,
        DEFINING_WORLD_PLAZA_TERRAIN_LARGE_ROCK_SIZE_TIER_INDEX
      )
    ).toBeNull();
  });

  it('does not force compact medium boulders outside the rocky biome', () => {
    expect(
      resolvingWorldPlazaRockyBiomeMediumFieldBoulderPlacement(
        false,
        DEFINING_WORLD_PLAZA_TERRAIN_MEDIUM_ROCK_SIZE_TIER_INDEX
      )
    ).toBeNull();
  });
});
