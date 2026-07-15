import { computingWorldPlazaFrostsinkSiteCenterTileIndex } from '@/components/world/domains/computingWorldPlazaFrostsinkSiteCenterTileIndex';
import {
  DEFINING_WORLD_PLAZA_FROSTSINK_CENTER_TEMPERATURE_CELSIUS,
  DEFINING_WORLD_PLAZA_FROSTSINK_CRYOCORE_FOOTPRINT_HALF_SPAN_TILES,
  DEFINING_WORLD_PLAZA_FROSTSINK_DISC_RADIUS_SQUARED,
  DEFINING_WORLD_PLAZA_FROSTSINK_DISC_RADIUS_TILES,
  DEFINING_WORLD_PLAZA_FROSTSINK_DISCOVERY_MAX_RADIUS_SQUARED,
  DEFINING_WORLD_PLAZA_FROSTSINK_EDGE_NOISE_FREQUENCY,
  DEFINING_WORLD_PLAZA_FROSTSINK_EDGE_NOISE_SEED,
  DEFINING_WORLD_PLAZA_FROSTSINK_EDGE_SOFT_JITTER_TILES,
  DEFINING_WORLD_PLAZA_FROSTSINK_RING_IDS,
  DEFINING_WORLD_PLAZA_FROSTSINK_RING_OUTER_RADII_TILES,
  DEFINING_WORLD_PLAZA_FROSTSINK_RING_OUTER_TEMPERATURE_CELSIUS,
  DEFINING_WORLD_PLAZA_FROSTSINK_SPAWN_CLEARING_RADIUS_SQUARED,
  DEFINING_WORLD_PLAZA_FROSTSINK_WILDLIFE_MIN_RADIUS_TILES,
  type DefiningWorldPlazaFrostsinkRingId,
} from '@/components/world/domains/definingWorldPlazaFrostsinkBiomeConstants';
import { samplingWorldPlazaFractalNoise } from '@/components/world/domains/generatingWorldPlazaValueNoise';

/**
 * Pure Frostsink disc / ring / ambient resolvers (no biome-cache recursion).
 *
 * @module components/world/domains/resolvingWorldPlazaFrostsinkAtTileIndex
 */

export type ResolvingWorldPlazaFrostsinkSiteAtTileIndexResult = {
  readonly centerTileX: number;
  readonly centerTileY: number;
  readonly radiusTiles: number;
  readonly ringId: DefiningWorldPlazaFrostsinkRingId;
  readonly ambientTemperatureCelsius: number;
};

/**
 * Returns true when a spacing-cell center hosts an active Frostsink site.
 * Active only inside the discovery ring (~3k–10k tiles from origin).
 *
 * @param centerTileX - Site center column.
 * @param centerTileY - Site center row.
 */
export function checkingWorldPlazaFrostsinkSiteActiveAtCenterTileIndex(
  centerTileX: number,
  centerTileY: number
): boolean {
  const distanceSquared = centerTileX * centerTileX + centerTileY * centerTileY;

  return (
    distanceSquared >=
      DEFINING_WORLD_PLAZA_FROSTSINK_SPAWN_CLEARING_RADIUS_SQUARED &&
    distanceSquared <=
      DEFINING_WORLD_PLAZA_FROSTSINK_DISCOVERY_MAX_RADIUS_SQUARED
  );
}

/**
 * Softens the outer radius by a tiny seeded jitter (± soft tiles).
 *
 * @param tileX - Tile column.
 * @param tileY - Tile row.
 */
function resolvingWorldPlazaFrostsinkEffectiveOuterRadiusTiles(
  tileX: number,
  tileY: number
): number {
  const edgeUnit = samplingWorldPlazaFractalNoise(
    tileX,
    tileY,
    DEFINING_WORLD_PLAZA_FROSTSINK_EDGE_NOISE_SEED,
    {
      frequency: DEFINING_WORLD_PLAZA_FROSTSINK_EDGE_NOISE_FREQUENCY,
      octaves: 1,
    }
  );
  const jitter =
    (edgeUnit * 2 - 1) * DEFINING_WORLD_PLAZA_FROSTSINK_EDGE_SOFT_JITTER_TILES;

  return DEFINING_WORLD_PLAZA_FROSTSINK_DISC_RADIUS_TILES + jitter;
}

/**
 * Resolves Frostsink membership and ring state for a tile, or null if outside.
 *
 * @param tileX - Tile column index.
 * @param tileY - Tile row index.
 */
export function resolvingWorldPlazaFrostsinkAtTileIndex(
  tileX: number,
  tileY: number
): ResolvingWorldPlazaFrostsinkSiteAtTileIndexResult | null {
  const center = computingWorldPlazaFrostsinkSiteCenterTileIndex(tileX, tileY);

  if (
    !checkingWorldPlazaFrostsinkSiteActiveAtCenterTileIndex(
      center.tileX,
      center.tileY
    )
  ) {
    return null;
  }

  const deltaX = tileX - center.tileX;
  const deltaY = tileY - center.tileY;
  const radiusSquared = deltaX * deltaX + deltaY * deltaY;

  if (radiusSquared > DEFINING_WORLD_PLAZA_FROSTSINK_DISC_RADIUS_SQUARED + 64) {
    return null;
  }

  const radiusTiles = Math.sqrt(radiusSquared);
  const effectiveOuter = resolvingWorldPlazaFrostsinkEffectiveOuterRadiusTiles(
    tileX,
    tileY
  );

  if (radiusTiles > effectiveOuter) {
    return null;
  }

  const ringId = resolvingWorldPlazaFrostsinkRingIdFromRadiusTiles(radiusTiles);
  const ambientTemperatureCelsius =
    resolvingWorldPlazaFrostsinkAmbientTemperatureCelsiusFromRadiusTiles(
      radiusTiles
    );

  return {
    centerTileX: center.tileX,
    centerTileY: center.tileY,
    radiusTiles,
    ringId,
    ambientTemperatureCelsius,
  };
}

/**
 * Returns true when a tile lies inside an active Frostsink disc.
 *
 * @param tileX - Tile column index.
 * @param tileY - Tile row index.
 */
export function checkingWorldPlazaFrostsinkDiscContainsTileAtTileIndex(
  tileX: number,
  tileY: number
): boolean {
  return resolvingWorldPlazaFrostsinkAtTileIndex(tileX, tileY) !== null;
}

/**
 * Picks the ring id for a distance from the Cryocore center.
 *
 * @param radiusTiles - Euclidean radius in tiles.
 */
export function resolvingWorldPlazaFrostsinkRingIdFromRadiusTiles(
  radiusTiles: number
): DefiningWorldPlazaFrostsinkRingId {
  for (
    let ringIndex = 0;
    ringIndex < DEFINING_WORLD_PLAZA_FROSTSINK_RING_OUTER_RADII_TILES.length;
    ringIndex += 1
  ) {
    if (
      radiusTiles <=
      DEFINING_WORLD_PLAZA_FROSTSINK_RING_OUTER_RADII_TILES[ringIndex]
    ) {
      return DEFINING_WORLD_PLAZA_FROSTSINK_RING_IDS[ringIndex];
    }
  }

  return 'snow_forest_outer';
}

/**
 * Lerps ambient °C from Cryocore center outward through ring edges.
 *
 * @param radiusTiles - Euclidean radius in tiles.
 */
export function resolvingWorldPlazaFrostsinkAmbientTemperatureCelsiusFromRadiusTiles(
  radiusTiles: number
): number {
  if (radiusTiles <= 0) {
    return DEFINING_WORLD_PLAZA_FROSTSINK_CENTER_TEMPERATURE_CELSIUS;
  }

  let previousRadius = 0;
  let previousCelsius =
    DEFINING_WORLD_PLAZA_FROSTSINK_CENTER_TEMPERATURE_CELSIUS;

  for (
    let ringIndex = 0;
    ringIndex < DEFINING_WORLD_PLAZA_FROSTSINK_RING_OUTER_RADII_TILES.length;
    ringIndex += 1
  ) {
    const outerRadius =
      DEFINING_WORLD_PLAZA_FROSTSINK_RING_OUTER_RADII_TILES[ringIndex];
    const outerCelsius =
      DEFINING_WORLD_PLAZA_FROSTSINK_RING_OUTER_TEMPERATURE_CELSIUS[ringIndex];

    if (radiusTiles <= outerRadius) {
      const span = outerRadius - previousRadius;

      if (span <= 0) {
        return outerCelsius;
      }

      const t = (radiusTiles - previousRadius) / span;

      return previousCelsius + (outerCelsius - previousCelsius) * t;
    }

    previousRadius = outerRadius;
    previousCelsius = outerCelsius;
  }

  return DEFINING_WORLD_PLAZA_FROSTSINK_RING_OUTER_TEMPERATURE_CELSIUS[
    DEFINING_WORLD_PLAZA_FROSTSINK_RING_OUTER_TEMPERATURE_CELSIUS.length - 1
  ];
}

/**
 * Returns true when wildlife may spawn at this Frostsink radius.
 *
 * @param radiusTiles - Euclidean radius in tiles.
 */
export function checkingWorldPlazaFrostsinkWildlifeAllowedAtRadiusTiles(
  radiusTiles: number
): boolean {
  return radiusTiles > DEFINING_WORLD_PLAZA_FROSTSINK_WILDLIFE_MIN_RADIUS_TILES;
}

/**
 * Returns true when a tile lies inside the Cryocore 6×6 footprint.
 *
 * @param tileX - Tile column.
 * @param tileY - Tile row.
 * @param centerTileX - Cryocore center column.
 * @param centerTileY - Cryocore center row.
 */
export function checkingWorldPlazaFrostsinkCryocoreFootprintOccupiesTile(
  tileX: number,
  tileY: number,
  centerTileX: number,
  centerTileY: number
): boolean {
  const halfSpan =
    DEFINING_WORLD_PLAZA_FROSTSINK_CRYOCORE_FOOTPRINT_HALF_SPAN_TILES;

  return (
    Math.abs(tileX - centerTileX) <= halfSpan &&
    Math.abs(tileY - centerTileY) <= halfSpan
  );
}
