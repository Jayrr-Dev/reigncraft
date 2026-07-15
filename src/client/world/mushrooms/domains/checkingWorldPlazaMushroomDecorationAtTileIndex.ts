/**
 * True when a tile should draw an unpicked mushroom decoration.
 *
 * @module components/world/mushrooms/domains/checkingWorldPlazaMushroomDecorationAtTileIndex
 */

import { DEFINING_WORLD_PLAZA_GENERATION_FEATURE } from '@/components/world/domains/definingWorldPlazaGenerationFeatureRegistry';
import { checkingWorldPlazaGenerationFeatureEnabled } from '@/components/world/domains/managingWorldPlazaGenerationFeatureStore';
import { checkingWorldPlazaRuntimeMushroomIsPicked } from '@/components/world/mushrooms/domains/registeringWorldPlazaPickedMushroomsLookup';
import { resolvingWorldPlazaMushroomAtTileIndex } from '@/components/world/mushrooms/domains/resolvingWorldPlazaMushroomAtTileIndex';

export function checkingWorldPlazaMushroomDecorationAtTileIndex(
  tileX: number,
  tileY: number,
  epochMs = Date.now()
): boolean {
  if (
    !checkingWorldPlazaGenerationFeatureEnabled(
      DEFINING_WORLD_PLAZA_GENERATION_FEATURE.MUSHROOMS
    )
  ) {
    return false;
  }

  if (checkingWorldPlazaRuntimeMushroomIsPicked(tileX, tileY)) {
    return false;
  }

  return resolvingWorldPlazaMushroomAtTileIndex({ tileX, tileY, epochMs }) !== null;
}
