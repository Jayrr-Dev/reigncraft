import {
  DEFINING_WORLD_PLAZA_ROCKY_BIOME_STONE_CLUSTER_CELL_TILES,
  DEFINING_WORLD_PLAZA_ROCKY_BIOME_STONE_CLUSTER_ROCK_COUNT_MAX,
  DEFINING_WORLD_PLAZA_ROCKY_BIOME_STONE_CLUSTER_ROCK_COUNT_MIN,
} from '@/components/world/domains/definingWorldPlazaRockyBiomeConstants';
import { resolvingWorldPlazaRockyBiomeStoneClusterAtTileIndex } from '@/components/world/domains/resolvingWorldPlazaRockyBiomeStoneClusterAtTileIndex';
import { describe, expect, it } from 'vitest';

describe('resolvingWorldPlazaRockyBiomeStoneClusterAtTileIndex', () => {
  it('keeps rock budgets in the 1-3 range when a cluster is active', () => {
    let foundActiveCluster = false;
    const step = DEFINING_WORLD_PLAZA_ROCKY_BIOME_STONE_CLUSTER_CELL_TILES;

    for (let tileX = 0; tileX < 2000; tileX += step) {
      for (let tileY = 0; tileY < 2000; tileY += step) {
        const cluster = resolvingWorldPlazaRockyBiomeStoneClusterAtTileIndex(
          tileX,
          tileY
        );

        if (!cluster.isActive) {
          continue;
        }

        foundActiveCluster = true;
        expect(cluster.rockCount).toBeGreaterThanOrEqual(
          DEFINING_WORLD_PLAZA_ROCKY_BIOME_STONE_CLUSTER_ROCK_COUNT_MIN
        );
        expect(cluster.rockCount).toBeLessThanOrEqual(
          DEFINING_WORLD_PLAZA_ROCKY_BIOME_STONE_CLUSTER_ROCK_COUNT_MAX
        );
      }
    }

    expect(foundActiveCluster).toBe(true);
  });

  it('keeps most cluster cells inactive so groups stay rare', () => {
    const step = DEFINING_WORLD_PLAZA_ROCKY_BIOME_STONE_CLUSTER_CELL_TILES;
    let activeCount = 0;
    let totalCount = 0;

    for (let tileX = 0; tileX < 2000; tileX += step) {
      for (let tileY = 0; tileY < 2000; tileY += step) {
        totalCount += 1;
        if (
          resolvingWorldPlazaRockyBiomeStoneClusterAtTileIndex(tileX, tileY)
            .isActive
        ) {
          activeCount += 1;
        }
      }
    }

    expect(totalCount).toBeGreaterThan(0);
    expect(activeCount / totalCount).toBeLessThan(0.2);
    expect(activeCount / totalCount).toBeGreaterThan(0);
  });
});
