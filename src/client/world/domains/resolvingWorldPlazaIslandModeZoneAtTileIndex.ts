import {
  DEFINING_WORLD_PLAZA_ISLAND_MODE_LAND_RADIUS_TILES,
  type DefiningWorldPlazaIslandModeZone,
} from "@/components/world/domains/definingWorldPlazaIslandModeConstants";
import { checkingWorldPlazaIslandModeFeatureEnabled } from "@/components/world/domains/managingWorldPlazaIslandModeFeatureStore";

/**
 * Resolves island world zones from Chebyshev distance to the plaza origin.
 *
 * @module components/world/domains/resolvingWorldPlazaIslandModeZoneAtTileIndex
 */

/**
 * Returns Chebyshev tile distance from the plaza origin.
 *
 * @param tileX - Tile column index.
 * @param tileY - Tile row index.
 */
export function computingWorldPlazaIslandModeChebyshevDistanceFromOriginAtTileIndex(
  tileX: number,
  tileY: number,
): number {
  return Math.max(Math.abs(tileX), Math.abs(tileY));
}

/**
 * Resolves the island zone for one tile when island mode is enabled.
 *
 * - Core land: distance <= 1000
 * - Outer connected ocean: distance > 1000
 *
 * @param tileX - Tile column index.
 * @param tileY - Tile row index.
 */
export function resolvingWorldPlazaIslandModeZoneAtTileIndex(
  tileX: number,
  tileY: number,
): DefiningWorldPlazaIslandModeZone | null {
  if (!checkingWorldPlazaIslandModeFeatureEnabled()) {
    return null;
  }

  const distanceFromOrigin =
    computingWorldPlazaIslandModeChebyshevDistanceFromOriginAtTileIndex(
      tileX,
      tileY,
    );

  if (distanceFromOrigin > DEFINING_WORLD_PLAZA_ISLAND_MODE_LAND_RADIUS_TILES) {
    return "outer_ocean";
  }

  return "core_land";
}

/**
 * Returns true when island mode forces open ocean on the tile.
 *
 * @param tileX - Tile column index.
 * @param tileY - Tile row index.
 */
export function checkingWorldPlazaIslandModeForcesOceanAtTileIndex(
  tileX: number,
  tileY: number,
): boolean {
  return (
    resolvingWorldPlazaIslandModeZoneAtTileIndex(tileX, tileY) === "outer_ocean"
  );
}

/**
 * Returns true when island mode forces the sandy coastal ring on the tile.
 *
 * @deprecated The coastal ring is core land now; this always returns false.
 *
 * @param tileX - Tile column index.
 * @param tileY - Tile row index.
 */
export function checkingWorldPlazaIslandModeForcesCoastalLandAtTileIndex(
  _tileX: number,
  _tileY: number,
): boolean {
  return false;
}
