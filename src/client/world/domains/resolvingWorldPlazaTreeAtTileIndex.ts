import { checkingWorldPlazaLavaAtTileIndex } from '@/components/world/domains/checkingWorldPlazaLavaAtTileIndex';
import { computingWorldPlazaTreeSeedFromTileIndex } from '@/components/world/domains/computingWorldPlazaTreeSeedFromTileIndex';
import type { DefiningWorldPlazaTreeVariantKind } from '@/components/world/domains/definingWorldPlazaTreeConstants';
import {
  DEFINING_WORLD_PLAZA_TREE_BIOME_CONFIG,
  DEFINING_WORLD_PLAZA_TREE_OFFSET_X_RANGE_PX,
  DEFINING_WORLD_PLAZA_TREE_OFFSET_X_SALT,
  DEFINING_WORLD_PLAZA_TREE_OFFSET_Y_RANGE_PX,
  DEFINING_WORLD_PLAZA_TREE_OFFSET_Y_SALT,
  DEFINING_WORLD_PLAZA_TREE_SCALE_SALT,
  DEFINING_WORLD_PLAZA_TREE_SPAWN_CLEARING_RADIUS_SQUARED,
  DEFINING_WORLD_PLAZA_TREE_SPECIES_SALT,
} from '@/components/world/domains/definingWorldPlazaTreeConstants';
import { checkingWorldPlazaProceduralTreesAndRocksFeatureEnabled } from '@/components/world/domains/managingWorldPlazaProceduralTreesAndRocksFeatureStore';
import { DEFINING_WORLD_PLAZA_GENERATION_FEATURE } from '@/components/world/domains/definingWorldPlazaGenerationFeatureRegistry';
import { checkingWorldPlazaGenerationFeatureEnabled } from '@/components/world/domains/managingWorldPlazaGenerationFeatureStore';
import { pickingWorldPlazaTreeSpeciesByWeight } from '@/components/world/domains/pickingWorldPlazaTreeSpeciesByWeight';
import { resolvingWorldPlazaBiomeAtTileIndex } from '@/components/world/domains/resolvingWorldPlazaBiomeAtTileIndex';
import { checkingWorldPlazaLakeShoreBlockAtTileIndex } from '@/components/world/domains/resolvingWorldPlazaLakeShoreDepthAtTileIndex';
import { checkingWorldPlazaPondShoreBlockAtTileIndex } from '@/components/world/domains/resolvingWorldPlazaPondShoreFillColorAtTileIndex';
import { resolvingWorldPlazaTreeCollisionRadiusGridFromInstance } from '@/components/world/domains/resolvingWorldPlazaTreeCollisionRadiusGridFromInstance';
import { resolvingWorldPlazaWaterAtTileIndex } from '@/components/world/domains/resolvingWorldPlazaWaterAtTileIndex';
import {
  checkingWorldPlazaVegetationTreeSpacingAnchorAtTile,
  DEFINING_WORLD_PLAZA_VEGETATION_TREE_DETAIL_NOISE_MIN,
  samplingWorldPlazaVegetationDetailNoiseAtTile,
  samplingWorldPlazaVegetationPatchNoiseAtTile,
} from '@/components/world/domains/samplingWorldPlazaVegetationDensityAtTile';
import {
  mappingWorldPlazaGrassSeededUnitToFloatRange,
  seedingWorldPlazaGrassTileDecorationFromTileIndex,
} from '@/components/world/domains/seedingWorldPlazaGrassTileDecorationFromTileIndex';

/**
 * Deterministic per-tile tree placement and collision data.
 *
 * @module components/world/domains/resolvingWorldPlazaTreeAtTileIndex
 */

/** Hard cap on memoized tile columns before the whole cache is reset. */
const RESOLVING_WORLD_PLAZA_TREE_AT_TILE_INDEX_CACHE_MAX_COLUMNS = 4000;

/**
 * Memoized tree results in a nested column→row map. Placement is deterministic
 * and never changes, so caching turns the repeated viewport scans (which sample
 * fractal noise for thousands of tiles each tile crossing) into allocation-free
 * numeric lookups. A nested map avoids building a string key per lookup, which
 * matters because movement rescans tens of thousands of tiles per frame.
 */
const resolvingWorldPlazaTreeAtTileIndexCacheByColumn = new Map<
  number,
  Map<number, DefiningWorldPlazaTreeInstance | null>
>();

/**
 * Clears the procedural tree placement cache after feature or rule changes.
 */
export function invalidatingWorldPlazaTreeAtTileIndexCache(): void {
  resolvingWorldPlazaTreeAtTileIndexCacheByColumn.clear();
}

/** A single placed tree, derived purely from its tile coordinates. */
export interface DefiningWorldPlazaTreeInstance {
  /** Tile column index (also the grid-space collision center X). */
  tileX: number;
  /** Tile row index (also the grid-space collision center Y). */
  tileY: number;
  /** Silhouette to draw. */
  variant: DefiningWorldPlazaTreeVariantKind;
  /** Trunk fill color. */
  trunkColor: number;
  /** Layered canopy colors: [base, shade, accent]. */
  canopyColors: readonly [number, number, number];
  /** Visual size multiplier. */
  scale: number;
  /** Trunk block radius in grid tiles. */
  collisionRadiusGrid: number;
  /** Cosmetic horizontal jitter of the base (screen px). */
  offsetXPx: number;
  /** Cosmetic vertical jitter of the base (screen px). */
  offsetYPx: number;
  /** Stable seed driving per-tree silhouette and color variation. */
  seed: number;
  /** Unified walkable surface layer at the tree foot; anchors trunk base height. */
  standingSurfaceLayer?: number;
  /** Bell-curve visual layer driving trunk height and foliage density. */
  visualSurfaceLayer?: number;
  /** Growth stage (0 = sapling, 4 = tall); set for placed and procedural trees. */
  growthStage?: number;
  /** When set, this tree comes from a placed block rather than procedural noise. */
  placedBlockId?: string;
  /** Short felled trunk left after the canopy is removed. */
  isStump?: boolean;
}

/**
 * Resolves the tree (if any) standing on a tile, memoized per tile.
 *
 * @param tileX - Tile column index.
 * @param tileY - Tile row index.
 */
export function resolvingWorldPlazaTreeAtTileIndex(
  tileX: number,
  tileY: number
): DefiningWorldPlazaTreeInstance | null {
  let columnCache = resolvingWorldPlazaTreeAtTileIndexCacheByColumn.get(tileX);

  if (columnCache) {
    const cachedTree = columnCache.get(tileY);

    if (cachedTree !== undefined) {
      return cachedTree;
    }
  } else {
    if (
      resolvingWorldPlazaTreeAtTileIndexCacheByColumn.size >=
      RESOLVING_WORLD_PLAZA_TREE_AT_TILE_INDEX_CACHE_MAX_COLUMNS
    ) {
      resolvingWorldPlazaTreeAtTileIndexCacheByColumn.clear();
    }

    columnCache = new Map();
    resolvingWorldPlazaTreeAtTileIndexCacheByColumn.set(tileX, columnCache);
  }

  const computedTree = computingWorldPlazaTreeAtTileIndex(tileX, tileY);
  columnCache.set(tileY, computedTree);

  return computedTree;
}

/**
 * Computes deterministic tree placement and collision data for one tile.
 *
 * Placement uses fractal-noise woodland patches plus a spacing grid so forests
 * read as natural groves instead of noisy per-tile scatter.
 *
 * @param tileX - Tile column index.
 * @param tileY - Tile row index.
 */
function computingWorldPlazaTreeAtTileIndex(
  tileX: number,
  tileY: number
): DefiningWorldPlazaTreeInstance | null {
  if (
    !checkingWorldPlazaProceduralTreesAndRocksFeatureEnabled() ||
    !checkingWorldPlazaGenerationFeatureEnabled(
      DEFINING_WORLD_PLAZA_GENERATION_FEATURE.TREES
    )
  ) {
    return null;
  }

  if (
    tileX * tileX + tileY * tileY <
    DEFINING_WORLD_PLAZA_TREE_SPAWN_CLEARING_RADIUS_SQUARED
  ) {
    return null;
  }

  if (!checkingWorldPlazaVegetationTreeSpacingAnchorAtTile(tileX, tileY)) {
    return null;
  }

  if (resolvingWorldPlazaWaterAtTileIndex(tileX, tileY)) {
    return null;
  }

  if (checkingWorldPlazaLavaAtTileIndex(tileX, tileY)) {
    return null;
  }

  if (checkingWorldPlazaLakeShoreBlockAtTileIndex(tileX, tileY)) {
    return null;
  }

  if (checkingWorldPlazaPondShoreBlockAtTileIndex(tileX, tileY)) {
    return null;
  }

  const patchNoise = samplingWorldPlazaVegetationPatchNoiseAtTile(tileX, tileY);
  const detailNoise = samplingWorldPlazaVegetationDetailNoiseAtTile(
    tileX,
    tileY
  );

  if (detailNoise < DEFINING_WORLD_PLAZA_VEGETATION_TREE_DETAIL_NOISE_MIN) {
    return null;
  }

  const biome = resolvingWorldPlazaBiomeAtTileIndex(tileX, tileY);
  const config = DEFINING_WORLD_PLAZA_TREE_BIOME_CONFIG[biome.kind];

  if (!config || patchNoise < config.woodlandThreshold) {
    return null;
  }

  const species = pickingWorldPlazaTreeSpeciesByWeight(
    config.species,
    seedingWorldPlazaGrassTileDecorationFromTileIndex(
      tileX,
      tileY,
      DEFINING_WORLD_PLAZA_TREE_SPECIES_SALT
    )
  );

  const scale = mappingWorldPlazaGrassSeededUnitToFloatRange(
    seedingWorldPlazaGrassTileDecorationFromTileIndex(
      tileX,
      tileY,
      DEFINING_WORLD_PLAZA_TREE_SCALE_SALT
    ),
    species.minScale,
    species.maxScale
  );
  const offsetXPx = mappingWorldPlazaGrassSeededUnitToFloatRange(
    seedingWorldPlazaGrassTileDecorationFromTileIndex(
      tileX,
      tileY,
      DEFINING_WORLD_PLAZA_TREE_OFFSET_X_SALT
    ),
    -DEFINING_WORLD_PLAZA_TREE_OFFSET_X_RANGE_PX,
    DEFINING_WORLD_PLAZA_TREE_OFFSET_X_RANGE_PX
  );
  const offsetYPx = mappingWorldPlazaGrassSeededUnitToFloatRange(
    seedingWorldPlazaGrassTileDecorationFromTileIndex(
      tileX,
      tileY,
      DEFINING_WORLD_PLAZA_TREE_OFFSET_Y_SALT
    ),
    -DEFINING_WORLD_PLAZA_TREE_OFFSET_Y_RANGE_PX,
    DEFINING_WORLD_PLAZA_TREE_OFFSET_Y_RANGE_PX
  );

  const tree: DefiningWorldPlazaTreeInstance = {
    tileX,
    tileY,
    variant: species.variant,
    trunkColor: species.trunkColor,
    canopyColors: species.canopyColors,
    scale,
    collisionRadiusGrid: species.collisionRadiusGrid,
    offsetXPx,
    offsetYPx,
    seed: computingWorldPlazaTreeSeedFromTileIndex(tileX, tileY),
  };

  return {
    ...tree,
    collisionRadiusGrid:
      resolvingWorldPlazaTreeCollisionRadiusGridFromInstance(tree),
  };
}
