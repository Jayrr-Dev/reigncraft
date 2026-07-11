import {
  DEFINING_WORLD_PLAZA_ROCKY_BIOME_FOOTPRINT_BASE_BIAS,
  DEFINING_WORLD_PLAZA_ROCKY_BIOME_FOOTPRINT_CENTRALITY_BIAS,
  DEFINING_WORLD_PLAZA_ROCKY_BIOME_HEIGHT_CENTRALITY_BIAS,
  DEFINING_WORLD_PLAZA_ROCKY_BIOME_MEDIUM_FIELD_BOULDER_FOOTPRINT_TILE_SPAN,
  DEFINING_WORLD_PLAZA_ROCKY_BIOME_MEDIUM_FIELD_BOULDER_SURFACE_WORLD_LAYER,
  DEFINING_WORLD_PLAZA_ROCKY_BIOME_PEBBLE_STONE_NOISE_MIN,
  DEFINING_WORLD_PLAZA_ROCKY_BIOME_SIZE_TIER_BASE_BIAS,
  DEFINING_WORLD_PLAZA_ROCKY_BIOME_SIZE_TIER_CENTRALITY_BIAS,
  DEFINING_WORLD_PLAZA_ROCKY_BIOME_STONE_NOISE_MIN,
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
import { DEFINING_WORLD_PLAZA_VEGETATION_STONE_NOISE_MIN } from '@/components/world/domains/samplingWorldPlazaVegetationDensityAtTile';

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
 * @param isRockyBiome - Whether the tile sits in the rocky biome.
 */
export function resolvingWorldPlazaRockyBiomeStoneNoiseMinAtTile(
  isRockyBiome: boolean
): number {
  return isRockyBiome
    ? DEFINING_WORLD_PLAZA_ROCKY_BIOME_STONE_NOISE_MIN
    : DEFINING_WORLD_PLAZA_VEGETATION_STONE_NOISE_MIN;
}

/**
 * Returns the minimum stone scatter noise required for floor pebbles.
 *
 * Rocky biome uses a higher bar than column rocks so pebbles stay sparse
 * between mega-boulders.
 *
 * @param isRockyBiome - Whether the tile sits in the rocky biome.
 */
export function resolvingWorldPlazaRockyBiomePebbleStoneNoiseMinAtTile(
  isRockyBiome: boolean
): number {
  return isRockyBiome
    ? DEFINING_WORLD_PLAZA_ROCKY_BIOME_PEBBLE_STONE_NOISE_MIN
    : DEFINING_WORLD_PLAZA_VEGETATION_STONE_NOISE_MIN;
}

/**
 * Returns a size tier index biased upward by rocky-biome centrality.
 *
 * A flat base bias keeps the whole field rockier than ordinary scatter, while
 * the centrality term pushes center tiles toward the largest mega-boulder tier
 * and leaves the rim with smaller, varied rocks for a natural size gradient.
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
 * should mix a jumpable 1-tile / 4-layer rock among floor pebbles.
 *
 * Large-tier anchors keep seeded mega footprints and heights. Below large,
 * rocky spacing anchors promote to the fixed medium field boulder.
 *
 * @param isRockyBiome - Whether the anchor sits in the rocky biome.
 * @param sizeTierIndex - Seeded size tier after rocky bias.
 */
export function resolvingWorldPlazaRockyBiomeMediumFieldBoulderPlacement(
  isRockyBiome: boolean,
  sizeTierIndex: number
): ResolvingWorldPlazaRockyBiomeMediumFieldBoulderPlacement | null {
  if (
    !isRockyBiome ||
    sizeTierIndex >= DEFINING_WORLD_PLAZA_TERRAIN_LARGE_ROCK_SIZE_TIER_INDEX
  ) {
    return null;
  }

  return {
    sizeTierIndex: DEFINING_WORLD_PLAZA_TERRAIN_MEDIUM_ROCK_SIZE_TIER_INDEX,
    footprintTileWidth:
      DEFINING_WORLD_PLAZA_ROCKY_BIOME_MEDIUM_FIELD_BOULDER_FOOTPRINT_TILE_SPAN,
    footprintTileHeight:
      DEFINING_WORLD_PLAZA_ROCKY_BIOME_MEDIUM_FIELD_BOULDER_FOOTPRINT_TILE_SPAN,
    surfaceWorldLayer:
      DEFINING_WORLD_PLAZA_ROCKY_BIOME_MEDIUM_FIELD_BOULDER_SURFACE_WORLD_LAYER,
  };
}
