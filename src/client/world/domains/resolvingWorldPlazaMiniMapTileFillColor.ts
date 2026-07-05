import { checkingWorldPlazaLavaAtTileIndex } from '@/components/world/domains/checkingWorldPlazaLavaAtTileIndex';
import { checkingWorldPlazaTreeBlocksGridTile } from '@/components/world/domains/checkingWorldPlazaTreeBlocksGridTile';
import { checkingWorldPlazaWaterIsFrozenAtTileIndex } from '@/components/world/domains/checkingWorldPlazaWaterIsFrozenAtTileIndex';
import {
  DEFINING_WORLD_PLAZA_MINI_MAP_FIRELANDS_LAVA_TILE_COLOR,
  DEFINING_WORLD_PLAZA_MINI_MAP_FIRELANDS_PROP_TILE_COLOR,
} from '@/components/world/domains/definingWorldPlazaFirelandsBiomeConstants';
import {
  DEFINING_WORLD_PLAZA_MINI_MAP_PEBBLE_ROCK_TILE_COLOR,
  DEFINING_WORLD_PLAZA_MINI_MAP_TREE_TILE_COLOR,
} from '@/components/world/domains/definingWorldPlazaMiniMapConstants';
import { DEFINING_WORLD_PLAZA_TERRAIN_MEDIUM_ROCK_SIZE_TIER_INDEX } from '@/components/world/domains/definingWorldPlazaTerrainObstacleConstants';
import { DEFINING_WORLD_PLAZA_WATER_FROZEN_FILL_COLOR } from '@/components/world/domains/definingWorldPlazaWaterConstants';
import {
  DEFINING_WORLD_PLAZA_WATER_KIND_LAKE,
  type DefiningWorldPlazaWaterKind,
} from '@/components/world/domains/definingWorldPlazaWaterKind';
import { formattingWorldPlazaPixiColorToCssHex } from '@/components/world/domains/formattingWorldPlazaPixiColorToCssHex';
import { resolvingWorldPlazaBiomeWaterBedFillColorAtTileIndex } from '@/components/world/domains/resolvingWorldPlazaBiomeWaterPaletteAtTileIndex';
import { resolvingWorldPlazaColumnRockMetadataAtTileIndex } from '@/components/world/domains/resolvingWorldPlazaColumnRockMetadataAtTileIndex';
import { resolvingWorldPlazaFirelandsPropAtTileIndex } from '@/components/world/domains/resolvingWorldPlazaFirelandsPropAtTileIndex';
import { resolvingWorldPlazaInfiniteTileFillColor } from '@/components/world/domains/resolvingWorldPlazaInfiniteTileFillColor';
import { resolvingWorldPlazaLakeShoreBlockFillColorAtTileIndex } from '@/components/world/domains/resolvingWorldPlazaLakeShoreBlockFillColorAtTileIndex';
import { resolvingWorldPlazaLakeBedFillColorAtTileIndex } from '@/components/world/domains/resolvingWorldPlazaLakeWaterDepthAtTileIndex';
import { resolvingWorldPlazaMiniMapBoulderFillColorFromSurfaceWorldLayer } from '@/components/world/domains/resolvingWorldPlazaMiniMapBoulderFillColorFromSurfaceWorldLayer';
import { resolvingWorldPlazaOceanShoreBlockFillColorAtTileIndex } from '@/components/world/domains/resolvingWorldPlazaOceanShoreBlockFillColorAtTileIndex';
import { resolvingWorldPlazaPondShoreFillColorAtTileIndex } from '@/components/world/domains/resolvingWorldPlazaPondShoreFillColorAtTileIndex';
import { resolvingWorldPlazaStoneDecorationAtTileIndex } from '@/components/world/domains/resolvingWorldPlazaStoneDecorationAtTileIndex';
import { resolvingWorldPlazaWaterAtTileIndex } from '@/components/world/domains/resolvingWorldPlazaWaterAtTileIndex';

/**
 * Minimap tile fill colors for procedural plaza terrain features.
 *
 * @module components/world/domains/resolvingWorldPlazaMiniMapTileFillColor
 */

/** Hard cap on memoized tile columns before the whole cache is reset. */
const RESOLVING_WORLD_PLAZA_MINI_MAP_TILE_FILL_COLOR_CACHE_MAX_COLUMNS = 4000;

/**
 * Memoized fill colors in a nested column→row map. Minimap colors are
 * deterministic per tile, so caching turns repeated canvas scans into cheap
 * lookups.
 */
const resolvingWorldPlazaMiniMapTileFillColorCacheByColumn = new Map<
  number,
  Map<number, string>
>();

/**
 * Clears the minimap fill color memoization cache after terrain rule changes.
 */
export function invalidatingWorldPlazaMiniMapTileFillColorCache(): void {
  resolvingWorldPlazaMiniMapTileFillColorCacheByColumn.clear();
}

/**
 * Maps a water kind to its minimap fill color for one tile.
 *
 * @param tileX - Tile column index.
 * @param tileY - Tile row index.
 * @param waterKind - Lake, river, stream, pond, or swamp pond variant.
 */
function resolvingWorldPlazaMiniMapWaterFillColorFromKind(
  tileX: number,
  tileY: number,
  waterKind: DefiningWorldPlazaWaterKind
): string {
  if (waterKind === DEFINING_WORLD_PLAZA_WATER_KIND_LAKE) {
    return formattingWorldPlazaPixiColorToCssHex(
      resolvingWorldPlazaLakeBedFillColorAtTileIndex(tileX, tileY)
    );
  }

  const biomeWaterBedFillColor =
    resolvingWorldPlazaBiomeWaterBedFillColorAtTileIndex(
      tileX,
      tileY,
      waterKind
    );

  if (biomeWaterBedFillColor !== null) {
    return formattingWorldPlazaPixiColorToCssHex(biomeWaterBedFillColor);
  }

  return formattingWorldPlazaPixiColorToCssHex(0x0e3d5c);
}

/**
 * Resolves the CSS fill color for one minimap terrain tile.
 *
 * Trees and water override ground. Column rocks and pebble boulders render as
 * stone greys, with taller mega-boulders reading darker than short ones.
 *
 * @param tileX - Tile column index.
 * @param tileY - Tile row index.
 */
export function resolvingWorldPlazaMiniMapTileFillColor(
  tileX: number,
  tileY: number
): string {
  let columnCache =
    resolvingWorldPlazaMiniMapTileFillColorCacheByColumn.get(tileX);

  if (columnCache) {
    const cachedFillColor = columnCache.get(tileY);

    if (cachedFillColor !== undefined) {
      return cachedFillColor;
    }
  } else {
    if (
      resolvingWorldPlazaMiniMapTileFillColorCacheByColumn.size >=
      RESOLVING_WORLD_PLAZA_MINI_MAP_TILE_FILL_COLOR_CACHE_MAX_COLUMNS
    ) {
      resolvingWorldPlazaMiniMapTileFillColorCacheByColumn.clear();
    }

    columnCache = new Map();
    resolvingWorldPlazaMiniMapTileFillColorCacheByColumn.set(
      tileX,
      columnCache
    );
  }

  const computedFillColor = computingWorldPlazaMiniMapTileFillColor(
    tileX,
    tileY
  );
  columnCache.set(tileY, computedFillColor);

  return computedFillColor;
}

/**
 * Computes the CSS fill color for one minimap terrain tile without memoization.
 *
 * @param tileX - Tile column index.
 * @param tileY - Tile row index.
 */
function computingWorldPlazaMiniMapTileFillColor(
  tileX: number,
  tileY: number
): string {
  if (checkingWorldPlazaTreeBlocksGridTile(tileX, tileY)) {
    return DEFINING_WORLD_PLAZA_MINI_MAP_TREE_TILE_COLOR;
  }

  if (checkingWorldPlazaLavaAtTileIndex(tileX, tileY)) {
    return DEFINING_WORLD_PLAZA_MINI_MAP_FIRELANDS_LAVA_TILE_COLOR;
  }

  const firelandsProp = resolvingWorldPlazaFirelandsPropAtTileIndex(
    tileX,
    tileY
  );

  if (
    firelandsProp &&
    firelandsProp.anchorTileX === tileX &&
    firelandsProp.anchorTileY === tileY
  ) {
    return DEFINING_WORLD_PLAZA_MINI_MAP_FIRELANDS_PROP_TILE_COLOR;
  }

  const lakeShoreFillColor =
    resolvingWorldPlazaLakeShoreBlockFillColorAtTileIndex(tileX, tileY);

  if (lakeShoreFillColor !== null) {
    return formattingWorldPlazaPixiColorToCssHex(lakeShoreFillColor);
  }

  const oceanShoreFillColor =
    resolvingWorldPlazaOceanShoreBlockFillColorAtTileIndex(tileX, tileY);

  if (oceanShoreFillColor !== null) {
    return formattingWorldPlazaPixiColorToCssHex(oceanShoreFillColor);
  }

  const pondShoreFillColor = resolvingWorldPlazaPondShoreFillColorAtTileIndex(
    tileX,
    tileY
  );

  if (pondShoreFillColor !== null) {
    return formattingWorldPlazaPixiColorToCssHex(pondShoreFillColor);
  }

  const waterTile = resolvingWorldPlazaWaterAtTileIndex(tileX, tileY);

  if (waterTile) {
    if (checkingWorldPlazaWaterIsFrozenAtTileIndex(tileX, tileY)) {
      return formattingWorldPlazaPixiColorToCssHex(
        DEFINING_WORLD_PLAZA_WATER_FROZEN_FILL_COLOR
      );
    }

    return resolvingWorldPlazaMiniMapWaterFillColorFromKind(
      tileX,
      tileY,
      waterTile.kind
    );
  }

  const columnRockMetadata = resolvingWorldPlazaColumnRockMetadataAtTileIndex(
    tileX,
    tileY
  );

  if (columnRockMetadata) {
    return resolvingWorldPlazaMiniMapBoulderFillColorFromSurfaceWorldLayer(
      columnRockMetadata.surfaceWorldLayer
    );
  }

  const stoneDecoration = resolvingWorldPlazaStoneDecorationAtTileIndex(
    tileX,
    tileY
  );

  if (
    stoneDecoration &&
    stoneDecoration.surfaceWorldLayer === null &&
    stoneDecoration.sizeTierIndex >=
      DEFINING_WORLD_PLAZA_TERRAIN_MEDIUM_ROCK_SIZE_TIER_INDEX
  ) {
    return DEFINING_WORLD_PLAZA_MINI_MAP_PEBBLE_ROCK_TILE_COLOR;
  }

  return formattingWorldPlazaPixiColorToCssHex(
    resolvingWorldPlazaInfiniteTileFillColor(tileX, tileY)
  );
}
