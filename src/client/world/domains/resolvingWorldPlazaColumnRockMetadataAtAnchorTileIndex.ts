import { checkingWorldPlazaColumnRockFootprintOverlapsTreeAtAnchorTileIndex } from '@/components/world/domains/checkingWorldPlazaColumnRockFootprintOverlapsTreeAtAnchorTileIndex';
import { checkingWorldPlazaTerrainRockColumnSpacingAnchorAtTileIndex } from '@/components/world/domains/checkingWorldPlazaTerrainRockColumnSpacingAnchorAtTileIndex';
import { checkingWorldPlazaTileIsFirelandsBiomeAtTileIndex } from '@/components/world/domains/checkingWorldPlazaTileIsFirelandsBiomeAtTileIndex';
import { checkingWorldPlazaTileIsRockyBiomeAtTileIndex } from '@/components/world/domains/checkingWorldPlazaTileIsRockyBiomeAtTileIndex';
import { checkingWorldPlazaTreeBlocksGridTile } from '@/components/world/domains/checkingWorldPlazaTreeBlocksGridTile';
import {
  DEFINING_WORLD_PLAZA_STONE_SEED_SALT_PALETTE,
  DEFINING_WORLD_PLAZA_STONE_SEED_SALT_SIZE,
  DEFINING_WORLD_PLAZA_STONE_SIZE_TIERS,
} from '@/components/world/domains/definingWorldPlazaStoneDecorationConstants';
import {
  DEFINING_WORLD_PLAZA_TERRAIN_ROCK_COLUMN_MIN_FOOTPRINT_TILE_SPAN,
  DEFINING_WORLD_PLAZA_TERRAIN_ROCK_COLUMN_MIN_SIZE_TIER_INDEX,
  DEFINING_WORLD_PLAZA_TERRAIN_ROCK_SEED_SALT_FOOTPRINT_HEIGHT,
  DEFINING_WORLD_PLAZA_TERRAIN_ROCK_SEED_SALT_FOOTPRINT_WIDTH,
  DEFINING_WORLD_PLAZA_TERRAIN_ROCK_SEED_SALT_HEIGHT,
  DEFINING_WORLD_PLAZA_TERRAIN_ROCK_SEED_SALT_SHAPE,
  DEFINING_WORLD_PLAZA_TERRAIN_ROCK_SHAPE_VARIANT_COUNT,
  resolvingWorldPlazaTerrainRockColumnSurfaceWorldLayerFromSeeds,
} from '@/components/world/domains/definingWorldPlazaTerrainRockConstants';
import { checkingWorldPlazaProceduralTreesAndRocksFeatureEnabled } from '@/components/world/domains/managingWorldPlazaProceduralTreesAndRocksFeatureStore';
import { resolvingWorldPlazaRockyBiomeCentralityAtTileIndex } from '@/components/world/domains/resolvingWorldPlazaRockyBiomeCentralityAtTileIndex';
import {
  resolvingWorldPlazaRockyBiomeColumnHeightUnit,
  resolvingWorldPlazaRockyBiomeFootprintTileSpanFromSeed,
  resolvingWorldPlazaRockyBiomeStoneNoiseMinAtTile,
  resolvingWorldPlazaRockyBiomeStonePaletteAtTileIndex,
  resolvingWorldPlazaRockyBiomeStoneSizeTierIndex,
} from '@/components/world/domains/resolvingWorldPlazaRockyBiomeTerrainRockPlacement';
import { resolvingWorldPlazaWaterAtTileIndex } from '@/components/world/domains/resolvingWorldPlazaWaterAtTileIndex';
import { samplingWorldPlazaVegetationStoneNoiseAtTile } from '@/components/world/domains/samplingWorldPlazaVegetationDensityAtTile';
import { seedingWorldPlazaGrassTileDecorationFromTileIndex } from '@/components/world/domains/seedingWorldPlazaGrassTileDecorationFromTileIndex';

/**
 * Deterministic column-rock metadata for spacing-cell anchor tiles.
 *
 * @module components/world/domains/resolvingWorldPlazaColumnRockMetadataAtAnchorTileIndex
 */

/** Resolved mega-boulder metadata anchored on one spacing cell. */
export interface DefiningWorldPlazaColumnRockMetadata {
  readonly anchorTileX: number;
  readonly anchorTileY: number;
  readonly footprintTileWidth: number;
  readonly footprintTileHeight: number;
  readonly surfaceWorldLayer: number;
  readonly sizeTierIndex: number;
  readonly shapeVariantIndex: number;
  readonly bodyHalfWidthPx: number;
  readonly bodyHalfHeightPx: number;
  readonly bodyColor: number;
  readonly highlightColor: number;
}

/** Hard cap on memoized anchor columns before the whole cache is reset. */
const RESOLVING_WORLD_PLAZA_COLUMN_ROCK_METADATA_CACHE_MAX_COLUMNS = 4000;

/**
 * Memoized anchor metadata in a nested column→row map. Boulder placement is
 * deterministic (static noise plus cached procedural trees), so caching turns
 * the repeated viewport scans into allocation-free numeric lookups. This
 * resolver sits under every floor-tile draw, elevation footprint check, and
 * rock-column sync, so each tile crossing otherwise recomputes noise and an
 * up-to-6x6 tree-overlap scan thousands of times per frame.
 */
const resolvingWorldPlazaColumnRockMetadataCacheByColumn = new Map<
  number,
  Map<number, DefiningWorldPlazaColumnRockMetadata | null>
>();

/**
 * Clears the column-rock anchor metadata cache after terrain rule changes.
 */
export function invalidatingWorldPlazaColumnRockMetadataCache(): void {
  resolvingWorldPlazaColumnRockMetadataCacheByColumn.clear();
}

/**
 * Returns column-rock metadata for a spacing anchor tile, or null when no
 * boulder spawns. Results are memoized per anchor tile.
 *
 * @param anchorTileX - Spacing anchor column index.
 * @param anchorTileY - Spacing anchor row index.
 */
export function resolvingWorldPlazaColumnRockMetadataAtAnchorTileIndex(
  anchorTileX: number,
  anchorTileY: number
): DefiningWorldPlazaColumnRockMetadata | null {
  let columnCache =
    resolvingWorldPlazaColumnRockMetadataCacheByColumn.get(anchorTileX);

  if (columnCache) {
    const cachedMetadata = columnCache.get(anchorTileY);

    if (cachedMetadata !== undefined) {
      return cachedMetadata;
    }
  } else {
    if (
      resolvingWorldPlazaColumnRockMetadataCacheByColumn.size >=
      RESOLVING_WORLD_PLAZA_COLUMN_ROCK_METADATA_CACHE_MAX_COLUMNS
    ) {
      resolvingWorldPlazaColumnRockMetadataCacheByColumn.clear();
    }

    columnCache = new Map();
    resolvingWorldPlazaColumnRockMetadataCacheByColumn.set(
      anchorTileX,
      columnCache
    );
  }

  const computedMetadata =
    computingWorldPlazaColumnRockMetadataAtAnchorTileIndex(
      anchorTileX,
      anchorTileY
    );
  columnCache.set(anchorTileY, computedMetadata);

  return computedMetadata;
}

/**
 * Computes column-rock metadata for a spacing anchor tile without memoization.
 *
 * @param anchorTileX - Spacing anchor column index.
 * @param anchorTileY - Spacing anchor row index.
 */
function computingWorldPlazaColumnRockMetadataAtAnchorTileIndex(
  anchorTileX: number,
  anchorTileY: number
): DefiningWorldPlazaColumnRockMetadata | null {
  if (!checkingWorldPlazaProceduralTreesAndRocksFeatureEnabled()) {
    return null;
  }

  if (
    !checkingWorldPlazaTerrainRockColumnSpacingAnchorAtTileIndex(
      anchorTileX,
      anchorTileY
    )
  ) {
    return null;
  }

  if (
    checkingWorldPlazaTileIsFirelandsBiomeAtTileIndex(anchorTileX, anchorTileY)
  ) {
    return null;
  }

  const isRockyBiome = checkingWorldPlazaTileIsRockyBiomeAtTileIndex(
    anchorTileX,
    anchorTileY
  );

  if (checkingWorldPlazaTreeBlocksGridTile(anchorTileX, anchorTileY)) {
    return null;
  }

  if (resolvingWorldPlazaWaterAtTileIndex(anchorTileX, anchorTileY)) {
    return null;
  }

  const stoneNoise = samplingWorldPlazaVegetationStoneNoiseAtTile(
    anchorTileX,
    anchorTileY
  );
  const stoneNoiseMin =
    resolvingWorldPlazaRockyBiomeStoneNoiseMinAtTile(isRockyBiome);

  if (stoneNoise < stoneNoiseMin) {
    return null;
  }

  const centrality = isRockyBiome
    ? resolvingWorldPlazaRockyBiomeCentralityAtTileIndex(
        anchorTileX,
        anchorTileY
      )
    : 0;

  const sizeUnit = seedingWorldPlazaGrassTileDecorationFromTileIndex(
    anchorTileX,
    anchorTileY,
    DEFINING_WORLD_PLAZA_STONE_SEED_SALT_SIZE
  );
  const tierIndex = resolvingWorldPlazaRockyBiomeStoneSizeTierIndex(
    sizeUnit,
    isRockyBiome,
    centrality
  );

  if (
    !isRockyBiome &&
    tierIndex < DEFINING_WORLD_PLAZA_TERRAIN_ROCK_COLUMN_MIN_SIZE_TIER_INDEX
  ) {
    return null;
  }

  const sizeTier =
    DEFINING_WORLD_PLAZA_STONE_SIZE_TIERS[tierIndex] ??
    DEFINING_WORLD_PLAZA_STONE_SIZE_TIERS[0];

  const paletteUnit = seedingWorldPlazaGrassTileDecorationFromTileIndex(
    anchorTileX,
    anchorTileY,
    DEFINING_WORLD_PLAZA_STONE_SEED_SALT_PALETTE
  );
  const palette = resolvingWorldPlazaRockyBiomeStonePaletteAtTileIndex(
    paletteUnit,
    isRockyBiome
  );

  const heightUnit = resolvingWorldPlazaRockyBiomeColumnHeightUnit(
    seedingWorldPlazaGrassTileDecorationFromTileIndex(
      anchorTileX,
      anchorTileY,
      DEFINING_WORLD_PLAZA_TERRAIN_ROCK_SEED_SALT_HEIGHT
    ),
    isRockyBiome,
    centrality
  );
  const footprintWidthUnit = seedingWorldPlazaGrassTileDecorationFromTileIndex(
    anchorTileX,
    anchorTileY,
    DEFINING_WORLD_PLAZA_TERRAIN_ROCK_SEED_SALT_FOOTPRINT_WIDTH
  );
  const footprintHeightUnit = seedingWorldPlazaGrassTileDecorationFromTileIndex(
    anchorTileX,
    anchorTileY,
    DEFINING_WORLD_PLAZA_TERRAIN_ROCK_SEED_SALT_FOOTPRINT_HEIGHT
  );
  const surfaceWorldLayer =
    resolvingWorldPlazaTerrainRockColumnSurfaceWorldLayerFromSeeds(
      tierIndex,
      heightUnit
    );

  if (surfaceWorldLayer === null) {
    return null;
  }

  const shapeVariantIndex = Math.floor(
    seedingWorldPlazaGrassTileDecorationFromTileIndex(
      anchorTileX,
      anchorTileY,
      DEFINING_WORLD_PLAZA_TERRAIN_ROCK_SEED_SALT_SHAPE
    ) * DEFINING_WORLD_PLAZA_TERRAIN_ROCK_SHAPE_VARIANT_COUNT
  );

  let footprintTileWidth =
    resolvingWorldPlazaRockyBiomeFootprintTileSpanFromSeed(
      footprintWidthUnit,
      isRockyBiome,
      centrality
    );
  let footprintTileHeight =
    resolvingWorldPlazaRockyBiomeFootprintTileSpanFromSeed(
      footprintHeightUnit,
      isRockyBiome,
      centrality
    );

  if (
    (footprintTileWidth >
      DEFINING_WORLD_PLAZA_TERRAIN_ROCK_COLUMN_MIN_FOOTPRINT_TILE_SPAN ||
      footprintTileHeight >
        DEFINING_WORLD_PLAZA_TERRAIN_ROCK_COLUMN_MIN_FOOTPRINT_TILE_SPAN) &&
    checkingWorldPlazaColumnRockFootprintOverlapsTreeAtAnchorTileIndex(
      anchorTileX,
      anchorTileY,
      footprintTileWidth,
      footprintTileHeight
    )
  ) {
    footprintTileWidth =
      DEFINING_WORLD_PLAZA_TERRAIN_ROCK_COLUMN_MIN_FOOTPRINT_TILE_SPAN;
    footprintTileHeight =
      DEFINING_WORLD_PLAZA_TERRAIN_ROCK_COLUMN_MIN_FOOTPRINT_TILE_SPAN;
  }

  return {
    anchorTileX,
    anchorTileY,
    footprintTileWidth,
    footprintTileHeight,
    surfaceWorldLayer,
    sizeTierIndex: tierIndex,
    shapeVariantIndex,
    bodyHalfWidthPx: sizeTier.bodyHalfWidthPx,
    bodyHalfHeightPx: sizeTier.bodyHalfHeightPx,
    bodyColor: palette.bodyColor,
    highlightColor: palette.highlightColor,
  };
}
