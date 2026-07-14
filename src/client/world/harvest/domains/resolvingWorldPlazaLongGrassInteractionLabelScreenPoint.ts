import { DEFINING_WORLD_BUILDING_WORLD_LAYER_GROUND } from '@/components/world/building/domains/definingWorldBuildingWorldLayerConstants';
import { computingWorldPlazaTileCenterScreenAnchorFromGridPoint } from '@/components/world/domains/computingWorldPlazaTileCenterScreenAnchorFromGridPoint';
import type { DefiningWorldPlazaCameraOffset } from '@/components/world/domains/definingWorldPlazaCameraOffset';
import { projectingWorldPlazaIsometricWorldLocalToViewportScreenPoint } from '@/components/world/domains/projectingWorldPlazaIsometricScreenPointThroughCamera';

/**
 * Lift above the long-grass clump foot for the Search popover (world-local px).
 * Tall clumps draw several tile-heights high; flower-sized lift sits inside the bush.
 */
export const RESOLVING_WORLD_PLAZA_LONG_GRASS_INTERACTION_LABEL_OFFSET_ABOVE_PX = 48;

/**
 * Maps a long-grass tile to viewport coordinates for its Search popover.
 */
export function resolvingWorldPlazaLongGrassInteractionLabelScreenPoint(
  tileX: number,
  tileY: number,
  cameraOffset: DefiningWorldPlazaCameraOffset,
  cameraWorldZoom: number
): {
  readonly x: number;
  readonly y: number;
} {
  const tileAnchor = computingWorldPlazaTileCenterScreenAnchorFromGridPoint({
    x: tileX + 0.5,
    y: tileY + 0.5,
    layer: DEFINING_WORLD_BUILDING_WORLD_LAYER_GROUND,
  });
  const viewportPoint =
    projectingWorldPlazaIsometricWorldLocalToViewportScreenPoint(
      {
        x: tileAnchor.centerXPx,
        y: tileAnchor.centerYPx,
      },
      cameraOffset,
      cameraWorldZoom
    );

  return {
    x: viewportPoint.x,
    y:
      viewportPoint.y -
      RESOLVING_WORLD_PLAZA_LONG_GRASS_INTERACTION_LABEL_OFFSET_ABOVE_PX *
        cameraWorldZoom,
  };
}
