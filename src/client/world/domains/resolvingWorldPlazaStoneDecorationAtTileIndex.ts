import { checkingWorldPlazaTerrainRockColumnSpacingAnchorAtTileIndex } from '@/components/world/domains/checkingWorldPlazaTerrainRockColumnSpacingAnchorAtTileIndex';
import { checkingWorldPlazaTileIsFirelandsBiomeAtTileIndex } from '@/components/world/domains/checkingWorldPlazaTileIsFirelandsBiomeAtTileIndex';
import { checkingWorldPlazaTileIsRockyBiomeAtTileIndex } from '@/components/world/domains/checkingWorldPlazaTileIsRockyBiomeAtTileIndex';
import { checkingWorldPlazaTileIsWithinColumnRockFootprintAtTileIndex } from '@/components/world/domains/checkingWorldPlazaTileIsWithinColumnRockFootprintAtTileIndex';
import { checkingWorldPlazaTreeBlocksGridTile } from '@/components/world/domains/checkingWorldPlazaTreeBlocksGridTile';
import {
  DEFINING_WORLD_PLAZA_STONE_JITTER_X_PX,
  DEFINING_WORLD_PLAZA_STONE_JITTER_Y_PX,
  DEFINING_WORLD_PLAZA_STONE_SEED_SALT_JITTER_X,
  DEFINING_WORLD_PLAZA_STONE_SEED_SALT_JITTER_Y,
  DEFINING_WORLD_PLAZA_STONE_SEED_SALT_PALETTE,
  DEFINING_WORLD_PLAZA_STONE_SEED_SALT_SIZE,
  DEFINING_WORLD_PLAZA_STONE_SIZE_TIERS,
} from '@/components/world/domains/definingWorldPlazaStoneDecorationConstants';
import { DEFINING_WORLD_PLAZA_TERRAIN_ROCK_COLUMN_MIN_SIZE_TIER_INDEX } from '@/components/world/domains/definingWorldPlazaTerrainRockConstants';
import { checkingWorldPlazaProceduralTreesAndRocksFeatureEnabled } from '@/components/world/domains/managingWorldPlazaProceduralTreesAndRocksFeatureStore';
import { DEFINING_WORLD_PLAZA_GENERATION_FEATURE } from '@/components/world/domains/definingWorldPlazaGenerationFeatureRegistry';
import { checkingWorldPlazaGenerationFeatureEnabled } from '@/components/world/domains/managingWorldPlazaGenerationFeatureStore';
import { resolvingWorldPlazaColumnRockMetadataAtAnchorTileIndex } from '@/components/world/domains/resolvingWorldPlazaColumnRockMetadataAtAnchorTileIndex';
import { checkingWorldPlazaLakeShoreBlockAtTileIndex } from '@/components/world/domains/resolvingWorldPlazaLakeShoreDepthAtTileIndex';
import { checkingWorldPlazaOceanShoreBlockAtTileIndex } from '@/components/world/domains/resolvingWorldPlazaOceanShoreDepthAtTileIndex';
import { checkingWorldPlazaPondShoreBlockAtTileIndex } from '@/components/world/domains/resolvingWorldPlazaPondShoreFillColorAtTileIndex';
import {
  resolvingWorldPlazaRockyBiomePebbleStoneNoiseMinAtTile,
  resolvingWorldPlazaRockyBiomeStonePaletteAtTileIndex,
  resolvingWorldPlazaRockyBiomeStoneSizeTierIndex,
} from '@/components/world/domains/resolvingWorldPlazaRockyBiomeTerrainRockPlacement';
import { resolvingWorldPlazaWaterAtTileIndex } from '@/components/world/domains/resolvingWorldPlazaWaterAtTileIndex';
import { samplingWorldPlazaVegetationStoneNoiseAtTile } from '@/components/world/domains/samplingWorldPlazaVegetationDensityAtTile';
import {
  mappingWorldPlazaGrassSeededUnitToFloatRange,
  seedingWorldPlazaGrassTileDecorationFromTileIndex,
} from '@/components/world/domains/seedingWorldPlazaGrassTileDecorationFromTileIndex';
import { applyingWorldPlazaRockMineStateToColumnRockMetadata } from '@/components/world/harvest/domains/applyingWorldPlazaRockMineStateToColumnRockMetadata';
import { readingWorldPlazaRuntimeMinedRockState } from '@/components/world/harvest/domains/registeringWorldPlazaMinedRocksVisualLayerLookup';
import { checkingWorldPlazaRuntimePebbleIsPicked } from '@/components/world/harvest/domains/registeringWorldPlazaPickedPebblesLookup';

/**
 * Deterministic stone placement resolver for the plaza floor.
 *
 * @module components/world/domains/resolvingWorldPlazaStoneDecorationAtTileIndex
 */

/** Resolved stone instance for a single tile, relative to the tile center. */
export interface DefiningWorldPlazaStoneDecoration {
  /** Horizontal offset from the tile center in pixels. */
  offsetX: number;
  /** Vertical offset from the tile center in pixels. */
  offsetY: number;
  /** Size tier index used for movement rules and visuals. */
  sizeTierIndex: number;
  /** Stone body ellipse half-width in pixels. */
  bodyHalfWidthPx: number;
  /** Stone body ellipse half-height in pixels. */
  bodyHalfHeightPx: number;
  /** Stone body fill color. */
  bodyColor: number;
  /** Stone top-face highlight fill color. */
  highlightColor: number;
  /** Absolute world layer cap for column rocks; null for pebbles. */
  surfaceWorldLayer: number | null;
  /** Shape variant index for column rock visuals. */
  shapeVariantIndex: number;
  /** Footprint width in tiles from the anchor; null for pebbles. */
  columnRockFootprintTileWidth: number | null;
  /** Footprint height in tiles from the anchor; null for pebbles. */
  columnRockFootprintTileHeight: number | null;
  /** Anchor tile X when this tile renders a column rock; null for pebbles. */
  columnRockAnchorTileX: number | null;
  /** Anchor tile Y when this tile renders a column rock; null for pebbles. */
  columnRockAnchorTileY: number | null;
}

/** Hard cap on memoized tile columns before the whole cache is reset. */
const RESOLVING_WORLD_PLAZA_STONE_DECORATION_CACHE_MAX_COLUMNS = 4000;

/**
 * Memoized stone results in a nested column→row map. Placement is deterministic
 * (fractal noise plus cached anchor metadata), so caching turns the per-anchor
 * rock-column scans (run every frame while the rock layer syncs) into
 * allocation-free numeric lookups instead of repeated noise sampling.
 */
const resolvingWorldPlazaStoneDecorationCacheByColumn = new Map<
  number,
  Map<number, DefiningWorldPlazaStoneDecoration | null>
>();

/**
 * Clears the stone decoration cache after terrain rule changes.
 */
export function invalidatingWorldPlazaStoneDecorationCache(): void {
  resolvingWorldPlazaStoneDecorationCacheByColumn.clear();
}

/**
 * Returns a stone instance for the tile, or null when the tile has no stone.
 *
 * Stones use fractal noise so they appear in sparse natural clusters instead
 * of a regular grid. Extruded column rocks only spawn on spacing-cell anchors
 * and can cover up to a 6x6 tile footprint with heights up to layer 16.
 * Results are memoized per tile.
 *
 * @param tileX - Tile column index.
 * @param tileY - Tile row index.
 */
export function resolvingWorldPlazaStoneDecorationAtTileIndex(
  tileX: number,
  tileY: number
): DefiningWorldPlazaStoneDecoration | null {
  let columnCache = resolvingWorldPlazaStoneDecorationCacheByColumn.get(tileX);

  if (columnCache) {
    const cachedStone = columnCache.get(tileY);

    if (cachedStone !== undefined) {
      return applyingWorldPlazaStoneDecorationHarvestState(
        cachedStone,
        tileX,
        tileY
      );
    }
  } else {
    if (
      resolvingWorldPlazaStoneDecorationCacheByColumn.size >=
      RESOLVING_WORLD_PLAZA_STONE_DECORATION_CACHE_MAX_COLUMNS
    ) {
      resolvingWorldPlazaStoneDecorationCacheByColumn.clear();
    }

    columnCache = new Map();
    resolvingWorldPlazaStoneDecorationCacheByColumn.set(tileX, columnCache);
  }

  const computedStone = computingWorldPlazaStoneDecorationAtTileIndex(
    tileX,
    tileY
  );
  columnCache.set(tileY, computedStone);

  return applyingWorldPlazaStoneDecorationHarvestState(
    computedStone,
    tileX,
    tileY
  );
}

/**
 * Overlays runtime harvest state on a cached seed stone decoration.
 * Seed cache stays unpicked/unmined; picked pebbles and depleted rocks return
 * null without mutating cache.
 */
function applyingWorldPlazaStoneDecorationHarvestState(
  stone: DefiningWorldPlazaStoneDecoration | null,
  tileX: number,
  tileY: number
): DefiningWorldPlazaStoneDecoration | null {
  if (!stone) {
    return null;
  }

  if (
    stone.surfaceWorldLayer === null &&
    checkingWorldPlazaRuntimePebbleIsPicked(tileX, tileY)
  ) {
    return null;
  }

  return applyingWorldPlazaStoneDecorationMineState(stone);
}

/**
 * Overlays runtime mine state on a cached seed column-rock decoration.
 * Seed cache stays unmined; depleted rocks return null without mutating cache.
 */
function applyingWorldPlazaStoneDecorationMineState(
  stone: DefiningWorldPlazaStoneDecoration
): DefiningWorldPlazaStoneDecoration | null {
  if (
    stone.columnRockAnchorTileX === null ||
    stone.columnRockAnchorTileY === null ||
    stone.surfaceWorldLayer === null
  ) {
    return stone;
  }

  const seedMetadata = resolvingWorldPlazaColumnRockMetadataAtAnchorTileIndex(
    stone.columnRockAnchorTileX,
    stone.columnRockAnchorTileY
  );

  if (!seedMetadata) {
    return stone;
  }

  const appliedMetadata = applyingWorldPlazaRockMineStateToColumnRockMetadata(
    seedMetadata,
    readingWorldPlazaRuntimeMinedRockState(
      stone.columnRockAnchorTileX,
      stone.columnRockAnchorTileY
    )
  );

  if (!appliedMetadata) {
    return null;
  }

  if (appliedMetadata.surfaceWorldLayer === stone.surfaceWorldLayer) {
    return stone;
  }

  return {
    ...stone,
    surfaceWorldLayer: appliedMetadata.surfaceWorldLayer,
  };
}

/**
 * Computes a stone instance for the tile without memoization.
 *
 * @param tileX - Tile column index.
 * @param tileY - Tile row index.
 */
function computingWorldPlazaStoneDecorationAtTileIndex(
  tileX: number,
  tileY: number
): DefiningWorldPlazaStoneDecoration | null {
  if (
    !checkingWorldPlazaProceduralTreesAndRocksFeatureEnabled() ||
    !checkingWorldPlazaGenerationFeatureEnabled(
      DEFINING_WORLD_PLAZA_GENERATION_FEATURE.STONE_DECORATIONS
    )
  ) {
    return null;
  }

  if (checkingWorldPlazaTileIsFirelandsBiomeAtTileIndex(tileX, tileY)) {
    return null;
  }

  if (
    checkingWorldPlazaTileIsWithinColumnRockFootprintAtTileIndex(
      tileX,
      tileY
    ) &&
    !checkingWorldPlazaTerrainRockColumnSpacingAnchorAtTileIndex(tileX, tileY)
  ) {
    return null;
  }

  if (
    checkingWorldPlazaTerrainRockColumnSpacingAnchorAtTileIndex(tileX, tileY)
  ) {
    const columnRockMetadata =
      resolvingWorldPlazaColumnRockMetadataAtAnchorTileIndex(tileX, tileY);

    if (columnRockMetadata) {
      return {
        offsetX: 0,
        offsetY: 0,
        sizeTierIndex: columnRockMetadata.sizeTierIndex,
        bodyHalfWidthPx: columnRockMetadata.bodyHalfWidthPx,
        bodyHalfHeightPx: columnRockMetadata.bodyHalfHeightPx,
        bodyColor: columnRockMetadata.bodyColor,
        highlightColor: columnRockMetadata.highlightColor,
        surfaceWorldLayer: columnRockMetadata.surfaceWorldLayer,
        shapeVariantIndex: columnRockMetadata.shapeVariantIndex,
        columnRockFootprintTileWidth: columnRockMetadata.footprintTileWidth,
        columnRockFootprintTileHeight: columnRockMetadata.footprintTileHeight,
        columnRockAnchorTileX: columnRockMetadata.anchorTileX,
        columnRockAnchorTileY: columnRockMetadata.anchorTileY,
      };
    }
  }

  if (checkingWorldPlazaTreeBlocksGridTile(tileX, tileY)) {
    return null;
  }

  if (resolvingWorldPlazaWaterAtTileIndex(tileX, tileY)) {
    return null;
  }

  if (checkingWorldPlazaLakeShoreBlockAtTileIndex(tileX, tileY)) {
    return null;
  }

  if (checkingWorldPlazaOceanShoreBlockAtTileIndex(tileX, tileY)) {
    return null;
  }

  if (checkingWorldPlazaPondShoreBlockAtTileIndex(tileX, tileY)) {
    return null;
  }

  const isRockyBiome = checkingWorldPlazaTileIsRockyBiomeAtTileIndex(
    tileX,
    tileY
  );
  const stoneNoise = samplingWorldPlazaVegetationStoneNoiseAtTile(tileX, tileY);
  const stoneNoiseMin =
    resolvingWorldPlazaRockyBiomePebbleStoneNoiseMinAtTile(isRockyBiome);

  if (stoneNoise < stoneNoiseMin) {
    return null;
  }

  const sizeUnit = seedingWorldPlazaGrassTileDecorationFromTileIndex(
    tileX,
    tileY,
    DEFINING_WORLD_PLAZA_STONE_SEED_SALT_SIZE
  );
  let tierIndex = resolvingWorldPlazaRockyBiomeStoneSizeTierIndex(
    sizeUnit,
    isRockyBiome
  );

  if (
    tierIndex >= DEFINING_WORLD_PLAZA_TERRAIN_ROCK_COLUMN_MIN_SIZE_TIER_INDEX &&
    !checkingWorldPlazaTerrainRockColumnSpacingAnchorAtTileIndex(tileX, tileY)
  ) {
    tierIndex =
      DEFINING_WORLD_PLAZA_TERRAIN_ROCK_COLUMN_MIN_SIZE_TIER_INDEX - 1;
  }

  const sizeTier =
    DEFINING_WORLD_PLAZA_STONE_SIZE_TIERS[tierIndex] ??
    DEFINING_WORLD_PLAZA_STONE_SIZE_TIERS[0];

  const paletteUnit = seedingWorldPlazaGrassTileDecorationFromTileIndex(
    tileX,
    tileY,
    DEFINING_WORLD_PLAZA_STONE_SEED_SALT_PALETTE
  );
  const palette = resolvingWorldPlazaRockyBiomeStonePaletteAtTileIndex(
    paletteUnit,
    isRockyBiome
  );

  const offsetX = mappingWorldPlazaGrassSeededUnitToFloatRange(
    seedingWorldPlazaGrassTileDecorationFromTileIndex(
      tileX,
      tileY,
      DEFINING_WORLD_PLAZA_STONE_SEED_SALT_JITTER_X
    ),
    -DEFINING_WORLD_PLAZA_STONE_JITTER_X_PX,
    DEFINING_WORLD_PLAZA_STONE_JITTER_X_PX
  );
  const offsetY = mappingWorldPlazaGrassSeededUnitToFloatRange(
    seedingWorldPlazaGrassTileDecorationFromTileIndex(
      tileX,
      tileY,
      DEFINING_WORLD_PLAZA_STONE_SEED_SALT_JITTER_Y
    ),
    -DEFINING_WORLD_PLAZA_STONE_JITTER_Y_PX,
    DEFINING_WORLD_PLAZA_STONE_JITTER_Y_PX
  );

  return {
    offsetX,
    offsetY,
    sizeTierIndex: tierIndex,
    bodyHalfWidthPx: sizeTier.bodyHalfWidthPx,
    bodyHalfHeightPx: sizeTier.bodyHalfHeightPx,
    bodyColor: palette.bodyColor,
    highlightColor: palette.highlightColor,
    surfaceWorldLayer: null,
    shapeVariantIndex: 0,
    columnRockFootprintTileWidth: null,
    columnRockFootprintTileHeight: null,
    columnRockAnchorTileX: null,
    columnRockAnchorTileY: null,
  };
}
