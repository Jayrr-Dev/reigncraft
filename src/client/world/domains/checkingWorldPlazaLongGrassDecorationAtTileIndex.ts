import { checkingWorldPlazaLandNearCliffEdgeAtTileIndex } from '@/components/world/domains/checkingWorldPlazaLandNearCliffEdgeAtTileIndex';
import { checkingWorldPlazaLandNearLavaAtTileIndex } from '@/components/world/domains/checkingWorldPlazaLandNearLavaAtTileIndex';
import { checkingWorldPlazaRareShrubTallGrassCompanionAtTileIndex } from '@/components/world/domains/checkingWorldPlazaRareShrubTallGrassCompanionAtTileIndex';
import { DEFINING_WORLD_PLAZA_GENERATION_FEATURE } from '@/components/world/domains/definingWorldPlazaGenerationFeatureRegistry';
import {
  DEFINING_WORLD_PLAZA_LONG_GRASS_CLIFF_EDGE_CLEARANCE_RADIUS_TILES,
  DEFINING_WORLD_PLAZA_LONG_GRASS_LAVA_CLEARANCE_RADIUS_TILES,
} from '@/components/world/domains/definingWorldPlazaLongGrassConstants';
import { checkingWorldPlazaGenerationFeatureEnabled } from '@/components/world/domains/managingWorldPlazaGenerationFeatureStore';
import { resolvingWorldPlazaBiomeAtTileIndex } from '@/components/world/domains/resolvingWorldPlazaBiomeAtTileIndex';
import { checkingWorldPlazaLakeShoreBlockAtTileIndex } from '@/components/world/domains/resolvingWorldPlazaLakeShoreDepthAtTileIndex';
import { checkingWorldPlazaOceanShoreBlockAtTileIndex } from '@/components/world/domains/resolvingWorldPlazaOceanShoreDepthAtTileIndex';
import { checkingWorldPlazaPondShoreBlockAtTileIndex } from '@/components/world/domains/resolvingWorldPlazaPondShoreFillColorAtTileIndex';
import { resolvingWorldPlazaWaterAtTileIndex } from '@/components/world/domains/resolvingWorldPlazaWaterAtTileIndex';
import { checkingWorldLongGrassPlacementAtTileIndex } from '../../../shared/worldLongGrassPlacement';

/**
 * True when a tile would draw a long-grass sprite clump.
 *
 * Tiles within the cliff-edge clearance stay bare so clumps do not hang over
 * extruded slope faces.
 */
export function checkingWorldPlazaLongGrassDecorationAtTileIndex(
  tileX: number,
  tileY: number
): boolean {
  if (
    !checkingWorldPlazaGenerationFeatureEnabled(
      DEFINING_WORLD_PLAZA_GENERATION_FEATURE.LONG_GRASS
    )
  ) {
    return false;
  }

  if (resolvingWorldPlazaWaterAtTileIndex(tileX, tileY)) {
    return false;
  }

  if (
    checkingWorldPlazaLandNearCliffEdgeAtTileIndex(
      tileX,
      tileY,
      DEFINING_WORLD_PLAZA_LONG_GRASS_CLIFF_EDGE_CLEARANCE_RADIUS_TILES
    )
  ) {
    return false;
  }

  if (
    checkingWorldPlazaLandNearLavaAtTileIndex(
      tileX,
      tileY,
      DEFINING_WORLD_PLAZA_LONG_GRASS_LAVA_CLEARANCE_RADIUS_TILES
    )
  ) {
    return false;
  }

  if (
    checkingWorldPlazaLakeShoreBlockAtTileIndex(tileX, tileY) ||
    checkingWorldPlazaOceanShoreBlockAtTileIndex(tileX, tileY) ||
    checkingWorldPlazaPondShoreBlockAtTileIndex(tileX, tileY)
  ) {
    return false;
  }

  const biome = resolvingWorldPlazaBiomeAtTileIndex(tileX, tileY);

  if (biome.longGrassTileModulus === null) {
    return false;
  }

  return (
    checkingWorldPlazaRareShrubTallGrassCompanionAtTileIndex(tileX, tileY) ||
    checkingWorldLongGrassPlacementAtTileIndex(
      tileX,
      tileY,
      biome.longGrassTileModulus
    )
  );
}
