import { DEFINING_WORLD_PLAZA_BIOME_DECORATION_TILE_REMAINDER } from '@/components/world/domains/definingWorldPlazaBiomeConstants';
import { resolvingWorldPlazaBiomeAtTileIndex } from '@/components/world/domains/resolvingWorldPlazaBiomeAtTileIndex';
import { checkingWorldPlazaLakeShoreBlockAtTileIndex } from '@/components/world/domains/resolvingWorldPlazaLakeShoreDepthAtTileIndex';
import { checkingWorldPlazaOceanShoreBlockAtTileIndex } from '@/components/world/domains/resolvingWorldPlazaOceanShoreDepthAtTileIndex';
import { checkingWorldPlazaPondShoreBlockAtTileIndex } from '@/components/world/domains/resolvingWorldPlazaPondShoreFillColorAtTileIndex';
import { resolvingWorldPlazaWaterAtTileIndex } from '@/components/world/domains/resolvingWorldPlazaWaterAtTileIndex';
import {
  WORLD_FLOWER_PLACEMENT_HASH_X,
  WORLD_FLOWER_PLACEMENT_HASH_Y,
} from '../../../shared/worldFlowerRarity';

/**
 * True when a tile would draw a biome flower dot (same gate as floor decorations).
 */
export function checkingWorldPlazaFlowerDecorationAtTileIndex(
  tileX: number,
  tileY: number
): boolean {
  if (resolvingWorldPlazaWaterAtTileIndex(tileX, tileY)) {
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

  if (biome.flowerTileModulus === null || biome.flowerColors === null) {
    return false;
  }

  return (
    Math.abs(
      tileX * WORLD_FLOWER_PLACEMENT_HASH_X +
        tileY * WORLD_FLOWER_PLACEMENT_HASH_Y
    ) %
      biome.flowerTileModulus ===
    DEFINING_WORLD_PLAZA_BIOME_DECORATION_TILE_REMAINDER
  );
}
