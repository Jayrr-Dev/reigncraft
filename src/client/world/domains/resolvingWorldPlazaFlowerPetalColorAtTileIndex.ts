/**
 * Resolves the deterministic petal fill color for a biome flower decoration tile.
 *
 * Matches the color pick used when drawing floor flower dots.
 *
 * @module components/world/domains/resolvingWorldPlazaFlowerPetalColorAtTileIndex
 */

import { checkingWorldPlazaFlowerDecorationAtTileIndex } from '@/components/world/domains/checkingWorldPlazaFlowerDecorationAtTileIndex';
import { resolvingWorldPlazaBiomeAtTileIndex } from '@/components/world/domains/resolvingWorldPlazaBiomeAtTileIndex';
import { seedingWorldPlazaGrassTileDecorationFromTileIndex } from '@/components/world/domains/seedingWorldPlazaGrassTileDecorationFromTileIndex';

/** Salt for petal color rolls (must match floor decoration drawing). */
const RESOLVING_WORLD_PLAZA_FLOWER_PETAL_COLOR_SALT = 62;

/**
 * Returns the petal color for a flower decoration tile, or null when none.
 */
export function resolvingWorldPlazaFlowerPetalColorAtTileIndex(
  tileX: number,
  tileY: number
): number | null {
  if (!checkingWorldPlazaFlowerDecorationAtTileIndex(tileX, tileY)) {
    return null;
  }

  const biome = resolvingWorldPlazaBiomeAtTileIndex(tileX, tileY);

  if (biome.flowerColors === null || biome.flowerColors.length === 0) {
    return null;
  }

  const petalColorIndex = Math.floor(
    seedingWorldPlazaGrassTileDecorationFromTileIndex(
      tileX,
      tileY,
      RESOLVING_WORLD_PLAZA_FLOWER_PETAL_COLOR_SALT
    ) * biome.flowerColors.length
  );

  return biome.flowerColors[petalColorIndex] ?? biome.flowerColors[0] ?? null;
}
