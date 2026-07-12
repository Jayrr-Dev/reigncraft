import {
  DEFINING_WORLD_PLAZA_ROCKY_BIOME_STONE_CLUSTER_CELL_TILES,
  DEFINING_WORLD_PLAZA_ROCKY_BIOME_STONE_CLUSTER_COUNT_SEED_SALT,
  DEFINING_WORLD_PLAZA_ROCKY_BIOME_STONE_CLUSTER_NOISE_FREQUENCY,
  DEFINING_WORLD_PLAZA_ROCKY_BIOME_STONE_CLUSTER_NOISE_MIN,
  DEFINING_WORLD_PLAZA_ROCKY_BIOME_STONE_CLUSTER_NOISE_OCTAVES,
  DEFINING_WORLD_PLAZA_ROCKY_BIOME_STONE_CLUSTER_NOISE_SEED,
  DEFINING_WORLD_PLAZA_ROCKY_BIOME_STONE_CLUSTER_ROCK_COUNT_MAX,
  DEFINING_WORLD_PLAZA_ROCKY_BIOME_STONE_CLUSTER_ROCK_COUNT_MIN,
  DEFINING_WORLD_PLAZA_ROCKY_BIOME_STONE_CLUSTER_SLOT_SEED_SALT,
  DEFINING_WORLD_PLAZA_ROCKY_BIOME_STONE_CLUSTER_SPACING_TILES,
} from '@/components/world/domains/definingWorldPlazaRockyBiomeConstants';
import { samplingWorldPlazaFractalNoise } from '@/components/world/domains/generatingWorldPlazaValueNoise';
import { seedingWorldPlazaGrassTileDecorationFromTileIndex } from '@/components/world/domains/seedingWorldPlazaGrassTileDecorationFromTileIndex';

/**
 * Rare 1-3 stone cluster placement for the rocky biome.
 *
 * @module components/world/domains/resolvingWorldPlazaRockyBiomeStoneClusterAtTileIndex
 */

/** Resolved cluster membership for one rocky tile. */
export type ResolvingWorldPlazaRockyBiomeStoneClusterAtTile = {
  readonly isActive: boolean;
  readonly rockCount: number;
  readonly isClusterSpacingAnchor: boolean;
  readonly isClusterMemberSlot: boolean;
};

/**
 * Returns the cluster-cell origin for a tile.
 *
 * @param tileIndex - Tile column or row.
 * @param cellSizeTiles - Cluster cell span.
 */
function resolvingWorldPlazaRockyBiomeStoneClusterCellOrigin(
  tileIndex: number,
  cellSizeTiles: number
): number {
  const cellSize = Math.max(1, Math.floor(cellSizeTiles));

  return Math.floor(tileIndex / cellSize) * cellSize;
}

/**
 * Returns true when the tile is a spacing anchor inside its cluster cell.
 *
 * @param tileX - Tile column index.
 * @param tileY - Tile row index.
 */
export function checkingWorldPlazaRockyBiomeStoneClusterSpacingAnchorAtTileIndex(
  tileX: number,
  tileY: number
): boolean {
  const spacing = DEFINING_WORLD_PLAZA_ROCKY_BIOME_STONE_CLUSTER_SPACING_TILES;
  const cellOriginX = resolvingWorldPlazaRockyBiomeStoneClusterCellOrigin(
    tileX,
    DEFINING_WORLD_PLAZA_ROCKY_BIOME_STONE_CLUSTER_CELL_TILES
  );
  const cellOriginY = resolvingWorldPlazaRockyBiomeStoneClusterCellOrigin(
    tileY,
    DEFINING_WORLD_PLAZA_ROCKY_BIOME_STONE_CLUSTER_CELL_TILES
  );
  const localX = tileX - cellOriginX;
  const localY = tileY - cellOriginY;

  return localX % spacing === 0 && localY % spacing === 0;
}

/**
 * Resolves whether a rocky tile sits in a rare 1-3 stone cluster group.
 *
 * @param tileX - Tile column index.
 * @param tileY - Tile row index.
 */
export function resolvingWorldPlazaRockyBiomeStoneClusterAtTileIndex(
  tileX: number,
  tileY: number
): ResolvingWorldPlazaRockyBiomeStoneClusterAtTile {
  const cellOriginX = resolvingWorldPlazaRockyBiomeStoneClusterCellOrigin(
    tileX,
    DEFINING_WORLD_PLAZA_ROCKY_BIOME_STONE_CLUSTER_CELL_TILES
  );
  const cellOriginY = resolvingWorldPlazaRockyBiomeStoneClusterCellOrigin(
    tileY,
    DEFINING_WORLD_PLAZA_ROCKY_BIOME_STONE_CLUSTER_CELL_TILES
  );
  const clusterNoise = samplingWorldPlazaFractalNoise(
    cellOriginX,
    cellOriginY,
    DEFINING_WORLD_PLAZA_ROCKY_BIOME_STONE_CLUSTER_NOISE_SEED,
    {
      frequency: DEFINING_WORLD_PLAZA_ROCKY_BIOME_STONE_CLUSTER_NOISE_FREQUENCY,
      octaves: DEFINING_WORLD_PLAZA_ROCKY_BIOME_STONE_CLUSTER_NOISE_OCTAVES,
    }
  );
  const isActive =
    clusterNoise >= DEFINING_WORLD_PLAZA_ROCKY_BIOME_STONE_CLUSTER_NOISE_MIN;
  const countSpan =
    DEFINING_WORLD_PLAZA_ROCKY_BIOME_STONE_CLUSTER_ROCK_COUNT_MAX -
    DEFINING_WORLD_PLAZA_ROCKY_BIOME_STONE_CLUSTER_ROCK_COUNT_MIN +
    1;
  const rockCount = isActive
    ? DEFINING_WORLD_PLAZA_ROCKY_BIOME_STONE_CLUSTER_ROCK_COUNT_MIN +
      Math.floor(
        seedingWorldPlazaGrassTileDecorationFromTileIndex(
          cellOriginX,
          cellOriginY,
          DEFINING_WORLD_PLAZA_ROCKY_BIOME_STONE_CLUSTER_COUNT_SEED_SALT
        ) * countSpan
      )
    : 0;
  const isClusterSpacingAnchor =
    checkingWorldPlazaRockyBiomeStoneClusterSpacingAnchorAtTileIndex(
      tileX,
      tileY
    );
  const spacing = DEFINING_WORLD_PLAZA_ROCKY_BIOME_STONE_CLUSTER_SPACING_TILES;
  const anchorsPerAxis = Math.max(
    1,
    Math.floor(
      DEFINING_WORLD_PLAZA_ROCKY_BIOME_STONE_CLUSTER_CELL_TILES / spacing
    )
  );
  const expectedAnchorCount = anchorsPerAxis * anchorsPerAxis;
  const slotUnit = seedingWorldPlazaGrassTileDecorationFromTileIndex(
    tileX,
    tileY,
    DEFINING_WORLD_PLAZA_ROCKY_BIOME_STONE_CLUSTER_SLOT_SEED_SALT
  );
  const isClusterMemberSlot =
    isActive &&
    isClusterSpacingAnchor &&
    slotUnit * expectedAnchorCount < rockCount;

  return {
    isActive,
    rockCount,
    isClusterSpacingAnchor,
    isClusterMemberSlot,
  };
}
