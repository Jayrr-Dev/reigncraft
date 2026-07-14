/**
 * True when a tile has a biome flower decoration whose petal color is pickable.
 *
 * Green and grey/white flower dots still draw, but cannot be harvested.
 *
 * @module components/world/domains/checkingWorldPlazaPickableFlowerDecorationAtTileIndex
 */

import { checkingWorldPlazaFlowerPetalColorIsPickable } from '@/components/world/domains/checkingWorldPlazaFlowerPetalColorIsPickable';
import { resolvingWorldPlazaFlowerPetalColorAtTileIndex } from '@/components/world/domains/resolvingWorldPlazaFlowerPetalColorAtTileIndex';

/**
 * True when the tile has a colorful (non-green, non-grey) flower ready to pick.
 */
export function checkingWorldPlazaPickableFlowerDecorationAtTileIndex(
  tileX: number,
  tileY: number
): boolean {
  const petalColor = resolvingWorldPlazaFlowerPetalColorAtTileIndex(
    tileX,
    tileY
  );

  if (petalColor === null) {
    return false;
  }

  return checkingWorldPlazaFlowerPetalColorIsPickable(petalColor);
}
