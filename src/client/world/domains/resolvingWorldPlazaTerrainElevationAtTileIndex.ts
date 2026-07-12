import { applyingWorldPlazaBiomeAltitudeFactorToTerrainElevationNormalizedHeight } from '@/components/world/domains/applyingWorldPlazaBiomeAltitudeFactorToTerrainElevation';
import { DEFINING_WORLD_PLAZA_GENERATION_FEATURE } from '@/components/world/domains/definingWorldPlazaGenerationFeatureRegistry';
import {
  DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_ALPINE_SURFACE_LAYER_MIN,
  DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_CONTINENTAL_BLEND_WEIGHT,
  DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_CONTINENTAL_FLAT_MAX,
  DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_CONTINENTAL_NOISE_FREQUENCY,
  DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_CONTINENTAL_NOISE_OCTAVES,
  DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_CONTINENTAL_NOISE_SEED,
  DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_DETAIL_BLEND_WEIGHT,
  DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_DETAIL_NOISE_FREQUENCY,
  DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_DETAIL_NOISE_OCTAVES,
  DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_DETAIL_NOISE_SEED,
  DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_HEIGHT_CURVE_EXPONENT,
  DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_HILL_SURFACE_LAYER_MIN,
  DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_MAX_LAYER,
  DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_MIN_LAYER,
  DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_MOUNTAIN_SURFACE_LAYER_MIN,
  DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_PEAK_BOOST_BLEND_WEIGHT,
  DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_PEAK_BOOST_CONTINENTAL_MIN,
  DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_PEAK_BOOST_NOISE_FREQUENCY,
  DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_PEAK_BOOST_NOISE_OCTAVES,
  DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_PEAK_BOOST_NOISE_SEED,
  DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_PROCEDURAL_ENABLED,
  DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_REGIONAL_BLEND_WEIGHT,
  DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_REGIONAL_NOISE_FREQUENCY,
  DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_REGIONAL_NOISE_OCTAVES,
  DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_REGIONAL_NOISE_SEED,
  DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_RIDGE_BLEND_WEIGHT,
  DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_RIDGE_NOISE_FREQUENCY,
  DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_RIDGE_NOISE_OCTAVES,
  DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_RIDGE_NOISE_SEED,
  DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_SPAWN_CLEARING_RADIUS_SQUARED,
  DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_SUMMIT_SURFACE_LAYER_MIN,
} from '@/components/world/domains/definingWorldPlazaTerrainElevationConstants';
import {
  DEFINING_WORLD_PLAZA_WATER_KIND_RIVER,
  DEFINING_WORLD_PLAZA_WATER_KIND_STREAM,
} from '@/components/world/domains/definingWorldPlazaWaterKind';
import { samplingWorldPlazaFractalNoise } from '@/components/world/domains/generatingWorldPlazaValueNoise';
import { checkingWorldPlazaGenerationFeatureEnabled } from '@/components/world/domains/managingWorldPlazaGenerationFeatureStore';
import { resolvingWorldPlazaBiomeAltitudeFactorAtTileIndex } from '@/components/world/domains/resolvingWorldPlazaBiomeAltitudeFactorAtTileIndex';
import { resolvingWorldPlazaWaterAtTileIndex } from '@/components/world/domains/resolvingWorldPlazaWaterAtTileIndex';
import { sculptingWorldPlazaTerrainElevationSurfaceLayerForPlayAtTileIndex } from '@/components/world/domains/sculptingWorldPlazaTerrainElevationSurfaceLayerForPlayAtTileIndex';

/**
 * Resolves procedural terrain surface layer from multi-scale noise.
 *
 * @module components/world/domains/resolvingWorldPlazaTerrainElevationAtTileIndex
 */

/** Elevation tier used for biome overrides and block palette. */
export type DefiningWorldPlazaTerrainElevationTierKind =
  | 'flat'
  | 'hill'
  | 'mountain'
  | 'alpine'
  | 'summit';

/** Resolved elevation for one tile. */
export interface DefiningWorldPlazaTerrainElevationTile {
  /** Surface world layer (1 = ground). */
  surfaceLayer: number;
  /** Coarse elevation category. */
  tier: DefiningWorldPlazaTerrainElevationTierKind;
}

/** Hard cap on memoized tile columns before the whole cache is reset. */
const RESOLVING_WORLD_PLAZA_TERRAIN_ELEVATION_AT_TILE_INDEX_CACHE_MAX_COLUMNS = 4000;

/**
 * Memoized elevation in a nested column→row map. Procedural elevation is
 * deterministic, so caching turns repeated viewport scans into cheap lookups.
 */
const resolvingWorldPlazaTerrainElevationAtTileIndexCacheByColumn = new Map<
  number,
  Map<number, DefiningWorldPlazaTerrainElevationTile>
>();

/**
 * Cardinal riverbank tiles flattened with flowing-water beds.
 *
 * A raised cap is projected north of its grid diamond. When a river cuts
 * directly through raised terrain, those caps protrude over staircase bends
 * and look like isolated holes in the water. One flat bank ring keeps the
 * terrain geometry from intersecting the river surface.
 */
const RESOLVING_WORLD_PLAZA_TERRAIN_ELEVATION_FLOWING_WATER_BANK_OFFSETS = [
  { deltaX: 0, deltaY: -1 },
  { deltaX: 1, deltaY: 0 },
  { deltaX: 0, deltaY: 1 },
  { deltaX: -1, deltaY: 0 },
] as const;

/**
 * Clears the elevation memoization cache after terrain rule changes.
 */
export function invalidatingWorldPlazaTerrainElevationAtTileIndexCache(): void {
  resolvingWorldPlazaTerrainElevationAtTileIndexCacheByColumn.clear();
}

/**
 * Maps a normalized height sample to a clamped surface layer.
 *
 * @param normalizedHeight - Blended noise in [0, 1].
 */
function resolvingWorldPlazaTerrainElevationSurfaceLayerFromNormalizedHeight(
  normalizedHeight: number
): number {
  const layerSpan =
    DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_MAX_LAYER -
    DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_MIN_LAYER;
  const rawLayer =
    DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_MIN_LAYER +
    Math.round(normalizedHeight * layerSpan);

  return Math.min(
    DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_MAX_LAYER,
    Math.max(DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_MIN_LAYER, rawLayer)
  );
}

/**
 * Returns the elevation tier for a surface layer.
 *
 * @param surfaceLayer - Resolved surface world layer.
 */
export function resolvingWorldPlazaTerrainElevationTierFromSurfaceLayer(
  surfaceLayer: number
): DefiningWorldPlazaTerrainElevationTierKind {
  if (
    surfaceLayer >=
    DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_SUMMIT_SURFACE_LAYER_MIN
  ) {
    return 'summit';
  }

  if (
    surfaceLayer >=
    DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_ALPINE_SURFACE_LAYER_MIN
  ) {
    return 'alpine';
  }

  if (
    surfaceLayer >=
    DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_MOUNTAIN_SURFACE_LAYER_MIN
  ) {
    return 'mountain';
  }

  if (
    surfaceLayer >=
    DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_HILL_SURFACE_LAYER_MIN
  ) {
    return 'hill';
  }

  return 'flat';
}

/**
 * Samples blended elevation noise at a tile.
 *
 * @param tileX - Tile column index.
 * @param tileY - Tile row index.
 */
function samplingWorldPlazaTerrainElevationNormalizedHeightAtTile(
  tileX: number,
  tileY: number
): number {
  const continental = samplingWorldPlazaFractalNoise(
    tileX,
    tileY,
    DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_CONTINENTAL_NOISE_SEED,
    {
      frequency:
        DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_CONTINENTAL_NOISE_FREQUENCY,
      octaves: DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_CONTINENTAL_NOISE_OCTAVES,
    }
  );

  if (
    continental < DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_CONTINENTAL_FLAT_MAX
  ) {
    return 0;
  }

  const regional = samplingWorldPlazaFractalNoise(
    tileX,
    tileY,
    DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_REGIONAL_NOISE_SEED,
    {
      frequency:
        DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_REGIONAL_NOISE_FREQUENCY,
      octaves: DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_REGIONAL_NOISE_OCTAVES,
    }
  );
  const detail = samplingWorldPlazaFractalNoise(
    tileX,
    tileY,
    DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_DETAIL_NOISE_SEED,
    {
      frequency: DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_DETAIL_NOISE_FREQUENCY,
      octaves: DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_DETAIL_NOISE_OCTAVES,
    }
  );
  const ridgeSample = samplingWorldPlazaFractalNoise(
    tileX,
    tileY,
    DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_RIDGE_NOISE_SEED,
    {
      frequency: DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_RIDGE_NOISE_FREQUENCY,
      octaves: DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_RIDGE_NOISE_OCTAVES,
    }
  );
  const ridge = Math.abs(ridgeSample - 0.5) * 2;
  const continentalBias =
    (continental -
      DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_CONTINENTAL_FLAT_MAX) /
    (1 - DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_CONTINENTAL_FLAT_MAX);

  // Local relief (rolling hills, ridges, bumps) layered on top of the broad
  // continental rise. Kept separate so it can ramp in with the continent below.
  const localRelief =
    regional * DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_REGIONAL_BLEND_WEIGHT +
    detail * DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_DETAIL_BLEND_WEIGHT +
    ridge * DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_RIDGE_BLEND_WEIGHT;

  // Gate the entire height by the continental ramp so elevation grows out of
  // layer 1 at a region's edge and builds upward toward its interior. Without
  // this the local relief would jump straight to several layers the moment the
  // continental threshold is crossed, leaving plateaus that start mid-air.
  const blendedHeight =
    continentalBias *
    (DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_CONTINENTAL_BLEND_WEIGHT +
      localRelief);

  let normalizedHeight = Math.min(1, Math.max(0, blendedHeight));

  if (
    continental >=
    DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_PEAK_BOOST_CONTINENTAL_MIN
  ) {
    const peakBoost = samplingWorldPlazaFractalNoise(
      tileX,
      tileY,
      DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_PEAK_BOOST_NOISE_SEED,
      {
        frequency:
          DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_PEAK_BOOST_NOISE_FREQUENCY,
        octaves:
          DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_PEAK_BOOST_NOISE_OCTAVES,
      }
    );
    const continentalPeakGate =
      (continental -
        DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_PEAK_BOOST_CONTINENTAL_MIN) /
      (1 - DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_PEAK_BOOST_CONTINENTAL_MIN);

    normalizedHeight = Math.min(
      1,
      normalizedHeight +
        peakBoost *
          continentalPeakGate *
          continentalBias *
          DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_PEAK_BOOST_BLEND_WEIGHT
    );
  }

  normalizedHeight = Math.pow(
    normalizedHeight,
    DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_HEIGHT_CURVE_EXPONENT
  );

  return normalizedHeight;
}

/**
 * Returns true when a tile should stay flat (spawn, water, or flowing bank).
 *
 * @param tileX - Tile column index.
 * @param tileY - Tile row index.
 */
export function checkingWorldPlazaTerrainElevationIsForcedFlatAtTileIndex(
  tileX: number,
  tileY: number
): boolean {
  if (
    tileX * tileX + tileY * tileY <
    DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_SPAWN_CLEARING_RADIUS_SQUARED
  ) {
    return true;
  }

  if (resolvingWorldPlazaWaterAtTileIndex(tileX, tileY)) {
    return true;
  }

  return RESOLVING_WORLD_PLAZA_TERRAIN_ELEVATION_FLOWING_WATER_BANK_OFFSETS.some(
    ({ deltaX, deltaY }) => {
      const neighboringWaterTile = resolvingWorldPlazaWaterAtTileIndex(
        tileX + deltaX,
        tileY + deltaY
      );

      return (
        neighboringWaterTile?.kind === DEFINING_WORLD_PLAZA_WATER_KIND_RIVER ||
        neighboringWaterTile?.kind === DEFINING_WORLD_PLAZA_WATER_KIND_STREAM
      );
    }
  );
}

/**
 * Resolves procedural terrain elevation for a tile.
 *
 * @param tileX - Tile column index.
 * @param tileY - Tile row index.
 */
export function resolvingWorldPlazaTerrainElevationAtTileIndex(
  tileX: number,
  tileY: number
): DefiningWorldPlazaTerrainElevationTile {
  let columnCache =
    resolvingWorldPlazaTerrainElevationAtTileIndexCacheByColumn.get(tileX);

  if (columnCache) {
    const cachedElevation = columnCache.get(tileY);

    if (cachedElevation !== undefined) {
      return cachedElevation;
    }
  } else {
    if (
      resolvingWorldPlazaTerrainElevationAtTileIndexCacheByColumn.size >=
      RESOLVING_WORLD_PLAZA_TERRAIN_ELEVATION_AT_TILE_INDEX_CACHE_MAX_COLUMNS
    ) {
      resolvingWorldPlazaTerrainElevationAtTileIndexCacheByColumn.clear();
    }

    columnCache = new Map();
    resolvingWorldPlazaTerrainElevationAtTileIndexCacheByColumn.set(
      tileX,
      columnCache
    );
  }

  const computedElevation = computingWorldPlazaTerrainElevationAtTileIndex(
    tileX,
    tileY
  );
  columnCache.set(tileY, computedElevation);

  return computedElevation;
}

/**
 * Computes procedural terrain elevation for a tile without memoization.
 *
 * @param tileX - Tile column index.
 * @param tileY - Tile row index.
 */
function computingWorldPlazaTerrainElevationAtTileIndex(
  tileX: number,
  tileY: number
): DefiningWorldPlazaTerrainElevationTile {
  if (
    !DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_PROCEDURAL_ENABLED ||
    !checkingWorldPlazaGenerationFeatureEnabled(
      DEFINING_WORLD_PLAZA_GENERATION_FEATURE.ELEVATION
    )
  ) {
    return {
      surfaceLayer: DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_MIN_LAYER,
      tier: 'flat',
    };
  }

  if (checkingWorldPlazaTerrainElevationIsForcedFlatAtTileIndex(tileX, tileY)) {
    return {
      surfaceLayer: DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_MIN_LAYER,
      tier: 'flat',
    };
  }

  const normalizedHeight =
    samplingWorldPlazaTerrainElevationNormalizedHeightAtTile(tileX, tileY);
  const altitudeFactor = resolvingWorldPlazaBiomeAltitudeFactorAtTileIndex(
    tileX,
    tileY
  );
  const altitudeScaledHeight =
    applyingWorldPlazaBiomeAltitudeFactorToTerrainElevationNormalizedHeight(
      normalizedHeight,
      altitudeFactor
    );
  let surfaceLayer =
    resolvingWorldPlazaTerrainElevationSurfaceLayerFromNormalizedHeight(
      altitudeScaledHeight
    );

  surfaceLayer =
    sculptingWorldPlazaTerrainElevationSurfaceLayerForPlayAtTileIndex(
      tileX,
      tileY,
      surfaceLayer,
      altitudeFactor
    );

  return {
    surfaceLayer,
    tier: resolvingWorldPlazaTerrainElevationTierFromSurfaceLayer(surfaceLayer),
  };
}

/**
 * Returns the procedural terrain surface layer for a tile (convenience helper).
 *
 * @param tileX - Tile column index.
 * @param tileY - Tile row index.
 */
export function resolvingWorldPlazaTerrainElevationSurfaceLayerAtTileIndex(
  tileX: number,
  tileY: number
): number {
  return resolvingWorldPlazaTerrainElevationAtTileIndex(tileX, tileY)
    .surfaceLayer;
}
