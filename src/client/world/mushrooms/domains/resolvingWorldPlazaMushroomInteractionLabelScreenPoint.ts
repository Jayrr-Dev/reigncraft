/**
 * Maps a mushroom tile to viewport coordinates for its Pick popover.
 *
 * @module components/world/mushrooms/domains/resolvingWorldPlazaMushroomInteractionLabelScreenPoint
 */

import { convertingWorldPlazaGridPointToIsometricScreenPoint } from '@/components/world/domains/convertingWorldPlazaGridPointToIsometricScreenPoint';
import { computingWorldPlazaTerrainElevationScreenOffsetPxAtTileIndex } from '@/components/world/domains/computingWorldPlazaTerrainElevationScreenOffsetPxAtTileIndex';

const DEFINING_WORLD_PLAZA_MUSHROOM_INTERACTION_LABEL_LIFT_PX = 18;

export function resolvingWorldPlazaMushroomInteractionLabelScreenPoint(
  tileX: number,
  tileY: number
): { readonly x: number; readonly y: number } {
  const screenPoint = convertingWorldPlazaGridPointToIsometricScreenPoint({
    x: tileX,
    y: tileY,
  });
  const surfaceLiftY =
    computingWorldPlazaTerrainElevationScreenOffsetPxAtTileIndex(tileX, tileY);

  return {
    x: screenPoint.x,
    y:
      screenPoint.y +
      surfaceLiftY -
      DEFINING_WORLD_PLAZA_MUSHROOM_INTERACTION_LABEL_LIFT_PX,
  };
}
