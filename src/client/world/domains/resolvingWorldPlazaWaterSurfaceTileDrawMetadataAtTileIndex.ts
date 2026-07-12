import { checkingWorldPlazaWaterIsFrozenAtTileIndex } from '@/components/world/domains/checkingWorldPlazaWaterIsFrozenAtTileIndex';
import { checkingWorldPlazaWaterTileIsShoreAtTileIndex } from '@/components/world/domains/checkingWorldPlazaWaterTileIsShoreAtTileIndex';
import {
  DEFINING_WORLD_PLAZA_WATER_KIND_LAKE,
  DEFINING_WORLD_PLAZA_WATER_KIND_POND,
  DEFINING_WORLD_PLAZA_WATER_KIND_RIVER,
  DEFINING_WORLD_PLAZA_WATER_KIND_STREAM,
  DEFINING_WORLD_PLAZA_WATER_KIND_SWAMP_POND,
} from '@/components/world/domains/definingWorldPlazaWaterKind';
import { resolvingWorldPlazaBiomeWaterPaletteAtTileIndex } from '@/components/world/domains/resolvingWorldPlazaBiomeWaterPaletteAtTileIndex';
import { resolvingWorldPlazaFlowingWaterLakeTransitionSurfaceAppearanceAtTileIndex } from '@/components/world/domains/resolvingWorldPlazaFlowingWaterLakeTransitionSurfaceAppearanceAtTileIndex';
import { resolvingWorldPlazaFrozenWaterSurfaceAppearanceAtTileIndex } from '@/components/world/domains/resolvingWorldPlazaFrozenWaterSurfaceAppearanceAtTileIndex';
import { resolvingWorldPlazaLakeSurfaceAppearanceAtTileIndex } from '@/components/world/domains/resolvingWorldPlazaLakeWaterDepthAtTileIndex';
import {
  resolvingWorldPlazaWaterAtTileIndex,
  type DefiningWorldPlazaWaterTile,
} from '@/components/world/domains/resolvingWorldPlazaWaterAtTileIndex';

/** Cached draw metadata for one water surface tile. */
export type ResolvingWorldPlazaWaterSurfaceTileDrawMetadata = {
  readonly tileX: number;
  readonly tileY: number;
  readonly surfaceAppearance: {
    readonly batchKey: string;
    readonly color: number;
    readonly alpha: number;
  } | null;
  readonly drawsShoreDetails: boolean;
};

/** Land tiles cache as null so overlapping bounds never resolve them again. */
type ResolvingWorldPlazaWaterSurfaceTileDrawMetadataCacheValue =
  ResolvingWorldPlazaWaterSurfaceTileDrawMetadata | null;

const RESOLVING_WORLD_PLAZA_WATER_SURFACE_TILE_DRAW_METADATA_CACHE_MAX_COLUMNS =
  4000;

/** Day and night use separate entries because frozen state can differ. */
const resolvingWorldPlazaWaterSurfaceTileDrawMetadataCacheByDaytime: readonly [
  Map<
    number,
    Map<number, ResolvingWorldPlazaWaterSurfaceTileDrawMetadataCacheValue>
  >,
  Map<
    number,
    Map<number, ResolvingWorldPlazaWaterSurfaceTileDrawMetadataCacheValue>
  >,
] = [new Map(), new Map()];

/** Clears cached surface metadata after generation or thaw inputs change. */
export function invalidatingWorldPlazaWaterSurfaceTileDrawMetadataCache(): void {
  resolvingWorldPlazaWaterSurfaceTileDrawMetadataCacheByDaytime[0].clear();
  resolvingWorldPlazaWaterSurfaceTileDrawMetadataCacheByDaytime[1].clear();
}

/** Resolves the translucent tint for one unfrozen water tile. */
function resolvingWorldPlazaUnfrozenWaterSurfaceAppearance(
  tileX: number,
  tileY: number,
  waterTile: DefiningWorldPlazaWaterTile
): { color: number; alpha: number } | null {
  if (waterTile.kind === DEFINING_WORLD_PLAZA_WATER_KIND_LAKE) {
    return resolvingWorldPlazaLakeSurfaceAppearanceAtTileIndex(tileX, tileY);
  }

  if (
    waterTile.kind === DEFINING_WORLD_PLAZA_WATER_KIND_POND ||
    waterTile.kind === DEFINING_WORLD_PLAZA_WATER_KIND_SWAMP_POND
  ) {
    const palette = resolvingWorldPlazaBiomeWaterPaletteAtTileIndex(
      tileX,
      tileY,
      waterTile.kind
    );

    return palette
      ? {
          color: palette.surfaceLayerColor,
          alpha: palette.surfaceLayerAlpha,
        }
      : null;
  }

  if (
    waterTile.kind === DEFINING_WORLD_PLAZA_WATER_KIND_RIVER ||
    waterTile.kind === DEFINING_WORLD_PLAZA_WATER_KIND_STREAM
  ) {
    return resolvingWorldPlazaFlowingWaterLakeTransitionSurfaceAppearanceAtTileIndex(
      tileX,
      tileY,
      waterTile.kind
    );
  }

  return null;
}

/** Computes uncached draw metadata for one tile. */
function computingWorldPlazaWaterSurfaceTileDrawMetadataAtTileIndex(
  tileX: number,
  tileY: number,
  isDaytime: boolean
): ResolvingWorldPlazaWaterSurfaceTileDrawMetadataCacheValue {
  const waterTile = resolvingWorldPlazaWaterAtTileIndex(tileX, tileY);

  if (!waterTile) {
    return null;
  }

  const isFrozen = checkingWorldPlazaWaterIsFrozenAtTileIndex(tileX, tileY, {
    isDaytime,
  });
  const appearance = isFrozen
    ? resolvingWorldPlazaFrozenWaterSurfaceAppearanceAtTileIndex(tileX, tileY)
    : resolvingWorldPlazaUnfrozenWaterSurfaceAppearance(
        tileX,
        tileY,
        waterTile
      );

  return {
    tileX,
    tileY,
    surfaceAppearance: appearance
      ? {
          batchKey: `${appearance.color}-${appearance.alpha}`,
          color: appearance.color,
          alpha: appearance.alpha,
        }
      : null,
    drawsShoreDetails:
      !isFrozen &&
      checkingWorldPlazaWaterTileIsShoreAtTileIndex(tileX, tileY),
  };
}

/**
 * Resolves cached appearance and shore metadata for one surface tile.
 */
export function resolvingWorldPlazaWaterSurfaceTileDrawMetadataAtTileIndex(
  tileX: number,
  tileY: number,
  isDaytime: boolean
): ResolvingWorldPlazaWaterSurfaceTileDrawMetadataCacheValue {
  const cacheByColumn =
    resolvingWorldPlazaWaterSurfaceTileDrawMetadataCacheByDaytime[
      isDaytime ? 1 : 0
    ];
  let columnCache = cacheByColumn.get(tileX);

  if (columnCache) {
    const cached = columnCache.get(tileY);

    if (cached !== undefined) {
      return cached;
    }
  } else {
    if (
      cacheByColumn.size >=
      RESOLVING_WORLD_PLAZA_WATER_SURFACE_TILE_DRAW_METADATA_CACHE_MAX_COLUMNS
    ) {
      cacheByColumn.clear();
    }

    columnCache = new Map();
    cacheByColumn.set(tileX, columnCache);
  }

  const metadata =
    computingWorldPlazaWaterSurfaceTileDrawMetadataAtTileIndex(
      tileX,
      tileY,
      isDaytime
    );
  columnCache.set(tileY, metadata);

  return metadata;
}
