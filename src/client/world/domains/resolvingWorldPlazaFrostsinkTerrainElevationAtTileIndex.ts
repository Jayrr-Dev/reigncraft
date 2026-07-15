import {
  DEFINING_WORLD_PLAZA_FROSTSINK_CREVASSE_EDGE_NOISE_SEED,
  DEFINING_WORLD_PLAZA_FROSTSINK_CREVASSE_FLOOR_SURFACE_LAYER,
  DEFINING_WORLD_PLAZA_FROSTSINK_CREVASSE_HALF_WIDTH_TILES,
  DEFINING_WORLD_PLAZA_FROSTSINK_CREVASSE_MAX_RADIUS_TILES,
  DEFINING_WORLD_PLAZA_FROSTSINK_CREVASSE_MIN_RADIUS_TILES,
  DEFINING_WORLD_PLAZA_FROSTSINK_CREVASSE_SOLID_SECTOR_FRACTION,
  DEFINING_WORLD_PLAZA_FROSTSINK_CREVASSE_SPOKE_COUNT,
  DEFINING_WORLD_PLAZA_FROSTSINK_CRYOCORE_FOOTPRINT_HALF_SPAN_TILES,
  DEFINING_WORLD_PLAZA_FROSTSINK_DISC_RADIUS_TILES,
  DEFINING_WORLD_PLAZA_FROSTSINK_FOOTHILL_SURFACE_LAYER,
  DEFINING_WORLD_PLAZA_FROSTSINK_PEAK_SURFACE_LAYER,
} from '@/components/world/domains/definingWorldPlazaFrostsinkBiomeConstants';
import { DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_PLAY_TIER_SURFACE_LAYERS } from '@/components/world/domains/definingWorldPlazaTerrainElevationConstants';
import { samplingWorldPlazaFractalNoise } from '@/components/world/domains/generatingWorldPlazaValueNoise';
import { resolvingWorldPlazaFrostsinkAtTileIndex } from '@/components/world/domains/resolvingWorldPlazaFrostsinkAtTileIndex';

/**
 * Frostsink mountain elevation + lethal open crevasses with outer escapes.
 *
 * Peak hits the 32H game cap at the Cryocore. Height lerps outward then snaps
 * to play tiers so chained jumps stay passable. Crevasse floors sit at L1:
 * falling from mid/high shelves is ≥12 layers (lethal EV); walking the spoke
 * out to the foothills is the exit.
 *
 * @module components/world/domains/resolvingWorldPlazaFrostsinkTerrainElevationAtTileIndex
 */

const DEFINING_WORLD_PLAZA_TWO_PI = Math.PI * 2;

function quantizingWorldPlazaFrostsinkSurfaceLayerToPlayTier(
  rawSurfaceLayer: number
): number {
  let nearestTier: (typeof DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_PLAY_TIER_SURFACE_LAYERS)[number] =
    DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_PLAY_TIER_SURFACE_LAYERS[0];
  let nearestDistance = Math.abs(rawSurfaceLayer - nearestTier);

  for (const tier of DEFINING_WORLD_PLAZA_TERRAIN_ELEVATION_PLAY_TIER_SURFACE_LAYERS) {
    const distance = Math.abs(rawSurfaceLayer - tier);

    if (distance < nearestDistance) {
      nearestTier = tier;
      nearestDistance = distance;
    }
  }

  return nearestTier;
}

/**
 * Returns true when a tile sits in an open radial crevasse spoke.
 *
 * Spokes are long trenches from mid-slope toward the rim. Each sector keeps a
 * solid ground wedge so the layout never seals a closed pit.
 *
 * @param deltaX - Tile offset from Cryocore center X.
 * @param deltaY - Tile offset from Cryocore center Y.
 * @param radiusTiles - Euclidean radius from Cryocore.
 * @param centerTileX - Cryocore tile X (noise seed).
 * @param centerTileY - Cryocore tile Y (noise seed).
 */
export function checkingWorldPlazaFrostsinkCrevasseAtOffset(
  deltaX: number,
  deltaY: number,
  radiusTiles: number,
  centerTileX: number,
  centerTileY: number
): boolean {
  if (
    radiusTiles < DEFINING_WORLD_PLAZA_FROSTSINK_CREVASSE_MIN_RADIUS_TILES ||
    radiusTiles > DEFINING_WORLD_PLAZA_FROSTSINK_CREVASSE_MAX_RADIUS_TILES
  ) {
    return false;
  }

  const angle = Math.atan2(deltaY, deltaX);
  const spokeCount = DEFINING_WORLD_PLAZA_FROSTSINK_CREVASSE_SPOKE_COUNT;
  const sectorWidth = DEFINING_WORLD_PLAZA_TWO_PI / spokeCount;
  const normalizedAngle =
    ((angle % DEFINING_WORLD_PLAZA_TWO_PI) + DEFINING_WORLD_PLAZA_TWO_PI) %
    DEFINING_WORLD_PLAZA_TWO_PI;
  const spokeIndex = Math.floor(normalizedAngle / sectorWidth);
  const spokeCenterAngle = (spokeIndex + 0.5) * sectorWidth;
  let deltaAngle = Math.abs(normalizedAngle - spokeCenterAngle);

  if (deltaAngle > Math.PI) {
    deltaAngle = DEFINING_WORLD_PLAZA_TWO_PI - deltaAngle;
  }

  const solidHalfSector =
    (sectorWidth *
      DEFINING_WORLD_PLAZA_FROSTSINK_CREVASSE_SOLID_SECTOR_FRACTION) /
    2;
  const crevasseHalfSector = sectorWidth / 2 - solidHalfSector;

  if (deltaAngle > crevasseHalfSector) {
    return false;
  }

  const crossTrackDistance = radiusTiles * Math.sin(deltaAngle);
  const edgeWobble =
    (samplingWorldPlazaFractalNoise(
      centerTileX + Math.round(deltaX),
      centerTileY + Math.round(deltaY),
      DEFINING_WORLD_PLAZA_FROSTSINK_CREVASSE_EDGE_NOISE_SEED,
      { frequency: 1 / 18, octaves: 1 }
    ) -
      0.5) *
    0.7;

  return (
    crossTrackDistance <=
    DEFINING_WORLD_PLAZA_FROSTSINK_CREVASSE_HALF_WIDTH_TILES + edgeWobble
  );
}

/**
 * Lerps mountain height from peak to foothills by radius, then snaps to play tiers.
 *
 * @param radiusTiles - Euclidean radius from Cryocore.
 */
export function resolvingWorldPlazaFrostsinkMountainSurfaceLayerFromRadiusTiles(
  radiusTiles: number
): number {
  const discRadius = DEFINING_WORLD_PLAZA_FROSTSINK_DISC_RADIUS_TILES;
  const t = Math.min(1, Math.max(0, radiusTiles / discRadius));
  const peak = DEFINING_WORLD_PLAZA_FROSTSINK_PEAK_SURFACE_LAYER;
  const foothill = DEFINING_WORLD_PLAZA_FROSTSINK_FOOTHILL_SURFACE_LAYER;
  const rawSurfaceLayer = peak + (foothill - peak) * t;

  return quantizingWorldPlazaFrostsinkSurfaceLayerToPlayTier(rawSurfaceLayer);
}

/**
 * Resolves Frostsink play-tier surface layer, or null outside an active disc.
 *
 * @param tileX - Tile column index.
 * @param tileY - Tile row index.
 */
export function resolvingWorldPlazaFrostsinkTerrainElevationSurfaceLayerAtTileIndex(
  tileX: number,
  tileY: number
): number | null {
  const frostsink = resolvingWorldPlazaFrostsinkAtTileIndex(tileX, tileY);

  if (!frostsink) {
    return null;
  }

  const deltaX = tileX - frostsink.centerTileX;
  const deltaY = tileY - frostsink.centerTileY;

  // Cryocore ice pedestal: force peak height so the sprite is not walkable under.
  if (
    Math.abs(deltaX) <=
      DEFINING_WORLD_PLAZA_FROSTSINK_CRYOCORE_FOOTPRINT_HALF_SPAN_TILES &&
    Math.abs(deltaY) <=
      DEFINING_WORLD_PLAZA_FROSTSINK_CRYOCORE_FOOTPRINT_HALF_SPAN_TILES
  ) {
    return DEFINING_WORLD_PLAZA_FROSTSINK_PEAK_SURFACE_LAYER;
  }

  if (
    checkingWorldPlazaFrostsinkCrevasseAtOffset(
      deltaX,
      deltaY,
      frostsink.radiusTiles,
      frostsink.centerTileX,
      frostsink.centerTileY
    )
  ) {
    return DEFINING_WORLD_PLAZA_FROSTSINK_CREVASSE_FLOOR_SURFACE_LAYER;
  }

  return resolvingWorldPlazaFrostsinkMountainSurfaceLayerFromRadiusTiles(
    frostsink.radiusTiles
  );
}
