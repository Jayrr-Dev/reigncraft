import {
  DEFINING_WORLD_PLAZA_ROCKY_BIOME_FOOTPRINT_BASE_BIAS,
  DEFINING_WORLD_PLAZA_ROCKY_BIOME_FOOTPRINT_CENTRALITY_BIAS,
  DEFINING_WORLD_PLAZA_ROCKY_BIOME_HEIGHT_CENTRALITY_BIAS,
  DEFINING_WORLD_PLAZA_ROCKY_BIOME_MEDIUM_FIELD_BOULDER_FOOTPRINT_TILE_SPAN,
  DEFINING_WORLD_PLAZA_ROCKY_BIOME_MEDIUM_FIELD_BOULDER_SURFACE_WORLD_LAYER_MAX,
  DEFINING_WORLD_PLAZA_ROCKY_BIOME_MEDIUM_FIELD_BOULDER_SURFACE_WORLD_LAYER_MIN,
  DEFINING_WORLD_PLAZA_ROCKY_BIOME_MEDIUM_FIELD_LARGE_TIER_OVERRIDE_UNIT_MAX,
  DEFINING_WORLD_PLAZA_ROCKY_BIOME_PEBBLE_STONE_NOISE_MIN_CLUSTER,
  DEFINING_WORLD_PLAZA_ROCKY_BIOME_PEBBLE_STONE_NOISE_MIN_SOLITARY,
  DEFINING_WORLD_PLAZA_ROCKY_BIOME_SIZE_TIER_BASE_BIAS,
  DEFINING_WORLD_PLAZA_ROCKY_BIOME_SIZE_TIER_CENTRALITY_BIAS,
  DEFINING_WORLD_PLAZA_ROCKY_BIOME_STONE_NOISE_MIN_CLUSTER,
  DEFINING_WORLD_PLAZA_ROCKY_BIOME_STONE_NOISE_MIN_SOLITARY,
  DEFINING_WORLD_PLAZA_ROCKY_BIOME_STONE_PALETTES,
} from '@/components/world/domains/definingWorldPlazaRockyBiomeConstants';
import type { DefiningWorldPlazaStonePalette } from '@/components/world/domains/definingWorldPlazaStoneDecorationConstants';
import {
  DEFINING_WORLD_PLAZA_STONE_PALETTES,
  DEFINING_WORLD_PLAZA_STONE_SIZE_TIER_THRESHOLDS,
} from '@/components/world/domains/definingWorldPlazaStoneDecorationConstants';
import {
  DEFINING_WORLD_PLAZA_TERRAIN_LARGE_ROCK_SIZE_TIER_INDEX,
  DEFINING_WORLD_PLAZA_TERRAIN_MEDIUM_ROCK_SIZE_TIER_INDEX,
} from '@/components/world/domains/definingWorldPlazaTerrainObstacleConstants';
import { resolvingWorldPlazaTerrainRockColumnFootprintTileSpanFromSeed } from '@/components/world/domains/definingWorldPlazaTerrainRockConstants';
import { resolvingWorldPlazaRockyBiomeStoneClusterAtTileIndex } from '@/components/world/domains/resolvingWorldPlazaRockyBiomeStoneClusterAtTileIndex';
import {
  DEFINING_WORLD_PLAZA_VEGETATION_PEBBLE_STONE_NOISE_MIN,
  DEFINING_WORLD_PLAZA_VEGETATION_STONE_NOISE_MIN,
} from '@/components/world/domains/samplingWorldPlazaVegetationDensityAtTile';

/** Compact medium boulder placement for rocky pebble fields. */
export type ResolvingWorldPlazaRockyBiomeMediumFieldBoulderPlacement = {
  readonly sizeTierIndex: number;
  readonly footprintTileWidth: number;
  readonly footprintTileHeight: number;
  readonly surfaceWorldLayer: number;
};

/**
 * Rocky-biome overrides for procedural stone and boulder placement.
 *
 * @module components/world/domains/resolvingWorldPlazaRockyBiomeTerrainRockPlacement
 */

/**
 * Maps a seeded unit float to a stone size tier index.
 *
 * @param sizeUnit - Seeded value in [0, 1).
 */
function mappingWorldPlazaStoneSizeTierIndexFromUnit(sizeUnit: number): number {
  let tierIndex = 0;

  for (const threshold of DEFINING_WORLD_PLAZA_STONE_SIZE_TIER_THRESHOLDS) {
    if (sizeUnit >= threshold) {
      tierIndex += 1;
    }
  }

  return tierIndex;
}

/**
 * Returns the minimum stone scatter noise required for column rocks.
 *
 * Rocky tiles use a low boulder-garden bar on open flats, with the same (or
 * slightly lower) bar inside rare 1-3 denser clumps.
 *
 * @param isRockyBiome - Whether the tile sits in the rocky biome.
 * @param tileX - Tile column index.
 * @param tileY - Tile row index.
 */
export function resolvingWorldPlazaRockyBiomeStoneNoiseMinAtTile(
  isRockyBiome: boolean,
  tileX: number,
  tileY: number
): number {
  if (!isRockyBiome) {
    return DEFINING_WORLD_PLAZA_VEGETATION_STONE_NOISE_MIN;
  }

  const cluster = resolvingWorldPlazaRockyBiomeStoneClusterAtTileIndex(
    tileX,
    tileY
  );

  return cluster.isActive
    ? DEFINING_WORLD_PLAZA_ROCKY_BIOME_STONE_NOISE_MIN_CLUSTER
    : DEFINING_WORLD_PLAZA_ROCKY_BIOME_STONE_NOISE_MIN_SOLITARY;
}

/**
 * Returns the minimum stone scatter noise required for floor pebbles.
 *
 * @param isRockyBiome - Whether the tile sits in the rocky biome.
 * @param tileX - Tile column index.
 * @param tileY - Tile row index.
 */
export function resolvingWorldPlazaRockyBiomePebbleStoneNoiseMinAtTile(
  isRockyBiome: boolean,
  tileX: number,
  tileY: number
): number {
  if (!isRockyBiome) {
    return DEFINING_WORLD_PLAZA_VEGETATION_PEBBLE_STONE_NOISE_MIN;
  }

  const cluster = resolvingWorldPlazaRockyBiomeStoneClusterAtTileIndex(
    tileX,
    tileY
  );

  return cluster.isActive
    ? DEFINING_WORLD_PLAZA_ROCKY_BIOME_PEBBLE_STONE_NOISE_MIN_CLUSTER
    : DEFINING_WORLD_PLAZA_ROCKY_BIOME_PEBBLE_STONE_NOISE_MIN_SOLITARY;
}

/**
 * Returns a size tier index biased upward by rocky-biome centrality.
 *
 * @param sizeUnit - Seeded value in [0, 1).
 * @param isRockyBiome - Whether the anchor sits in the rocky biome.
 * @param centrality - Rocky-band centrality in [0, 1] (ignored off-biome).
 */
export function resolvingWorldPlazaRockyBiomeStoneSizeTierIndex(
  sizeUnit: number,
  isRockyBiome: boolean,
  centrality: number = 0
): number {
  const resolvedSizeUnit = isRockyBiome
    ? Math.min(
        1,
        sizeUnit +
          DEFINING_WORLD_PLAZA_ROCKY_BIOME_SIZE_TIER_BASE_BIAS +
          DEFINING_WORLD_PLAZA_ROCKY_BIOME_SIZE_TIER_CENTRALITY_BIAS *
            centrality
      )
    : sizeUnit;

  return mappingWorldPlazaStoneSizeTierIndexFromUnit(resolvedSizeUnit);
}

/**
 * Returns a footprint tile span biased wider by rocky-biome centrality.
 *
 * @param footprintUnit - Seeded value in [0, 1).
 * @param isRockyBiome - Whether the anchor sits in the rocky biome.
 * @param centrality - Rocky-band centrality in [0, 1] (ignored off-biome).
 */
export function resolvingWorldPlazaRockyBiomeFootprintTileSpanFromSeed(
  footprintUnit: number,
  isRockyBiome: boolean,
  centrality: number = 0
): number {
  const resolvedFootprintUnit = isRockyBiome
    ? Math.min(
        1,
        footprintUnit +
          DEFINING_WORLD_PLAZA_ROCKY_BIOME_FOOTPRINT_BASE_BIAS +
          DEFINING_WORLD_PLAZA_ROCKY_BIOME_FOOTPRINT_CENTRALITY_BIAS *
            centrality
      )
    : footprintUnit;

  return resolvingWorldPlazaTerrainRockColumnFootprintTileSpanFromSeed(
    resolvedFootprintUnit
  );
}

/**
 * Returns a column-height seed unit biased taller by rocky-biome centrality.
 *
 * @param heightUnit - Seeded value in [0, 1).
 * @param isRockyBiome - Whether the anchor sits in the rocky biome.
 * @param centrality - Rocky-band centrality in [0, 1] (ignored off-biome).
 */
export function resolvingWorldPlazaRockyBiomeColumnHeightUnit(
  heightUnit: number,
  isRockyBiome: boolean,
  centrality: number = 0
): number {
  if (!isRockyBiome) {
    return heightUnit;
  }

  return Math.min(
    1,
    heightUnit +
      DEFINING_WORLD_PLAZA_ROCKY_BIOME_HEIGHT_CENTRALITY_BIAS * centrality
  );
}

/**
 * Returns a grey stone palette for one tile, using rocky shades when applicable.
 *
 * @param paletteUnit - Seeded palette selector in [0, 1).
 * @param isRockyBiome - Whether the tile sits in the rocky biome.
 */
export function resolvingWorldPlazaRockyBiomeStonePaletteAtTileIndex(
  paletteUnit: number,
  isRockyBiome: boolean
): DefiningWorldPlazaStonePalette {
  const palettes = isRockyBiome
    ? DEFINING_WORLD_PLAZA_ROCKY_BIOME_STONE_PALETTES
    : DEFINING_WORLD_PLAZA_STONE_PALETTES;
  const paletteIndex = Math.floor(paletteUnit * palettes.length);

  return palettes[paletteIndex] ?? palettes[0];
}

/**
 * Returns compact medium boulder placement when a rocky pebble-field anchor
 * should mix a jumpable 1-tile / 3-4-layer rock among floor pebbles.
 *
 * Cluster member slots always promote to compact field boulders. Below-large
 * tiers always promote. Large-tier anchors demote when the override unit stays
 * under the share max.
 *
 * @param isRockyBiome - Whether the anchor sits in the rocky biome.
 * @param sizeTierIndex - Seeded size tier after rocky bias.
 * @param largeTierOverrideUnit - Seeded unit in [0, 1) for large-tier demotion.
 * @param heightUnit - Seeded unit in [0, 1) picking surface layer 3 or 4.
 * @param forceCompactField - True for cluster group members (always 1-tile).
 */
export function resolvingWorldPlazaRockyBiomeMediumFieldBoulderPlacement(
  isRockyBiome: boolean,
  sizeTierIndex: number,
  largeTierOverrideUnit: number = 1,
  heightUnit: number = 0,
  forceCompactField: boolean = false
): ResolvingWorldPlazaRockyBiomeMediumFieldBoulderPlacement | null {
  if (!isRockyBiome) {
    return null;
  }

  const isBelowLarge =
    sizeTierIndex < DEFINING_WORLD_PLAZA_TERRAIN_LARGE_ROCK_SIZE_TIER_INDEX;
  const overridesLargeTier =
    !isBelowLarge &&
    largeTierOverrideUnit <
      DEFINING_WORLD_PLAZA_ROCKY_BIOME_MEDIUM_FIELD_LARGE_TIER_OVERRIDE_UNIT_MAX;

  if (!forceCompactField && !isBelowLarge && !overridesLargeTier) {
    return null;
  }

  const surfaceLayerSpan =
    DEFINING_WORLD_PLAZA_ROCKY_BIOME_MEDIUM_FIELD_BOULDER_SURFACE_WORLD_LAYER_MAX -
    DEFINING_WORLD_PLAZA_ROCKY_BIOME_MEDIUM_FIELD_BOULDER_SURFACE_WORLD_LAYER_MIN +
    1;
  const surfaceWorldLayer =
    DEFINING_WORLD_PLAZA_ROCKY_BIOME_MEDIUM_FIELD_BOULDER_SURFACE_WORLD_LAYER_MIN +
    Math.floor(heightUnit * surfaceLayerSpan);

  return {
    sizeTierIndex: DEFINING_WORLD_PLAZA_TERRAIN_MEDIUM_ROCK_SIZE_TIER_INDEX,
    footprintTileWidth:
      DEFINING_WORLD_PLAZA_ROCKY_BIOME_MEDIUM_FIELD_BOULDER_FOOTPRINT_TILE_SPAN,
    footprintTileHeight:
      DEFINING_WORLD_PLAZA_ROCKY_BIOME_MEDIUM_FIELD_BOULDER_FOOTPRINT_TILE_SPAN,
    surfaceWorldLayer,
  };
}
