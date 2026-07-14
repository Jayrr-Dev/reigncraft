import { DEFINING_WORLD_BUILDING_WORLD_LAYER_GROUND } from '@/components/world/building/domains/definingWorldBuildingWorldLayerConstants';
import { computingWorldPlazaTileCenterScreenAnchorFromGridPoint } from '@/components/world/domains/computingWorldPlazaTileCenterScreenAnchorFromGridPoint';
import type { DefiningWorldPlazaCameraOffset } from '@/components/world/domains/definingWorldPlazaCameraOffset';
import { projectingWorldPlazaIsometricWorldLocalToViewportScreenPoint } from '@/components/world/domains/projectingWorldPlazaIsometricScreenPointThroughCamera';

/**
 * Lift above the berry-shrub foot for the Pick popover (world-local px).
 * Shrubs draw several tile-heights high; flower-sized lift sits inside the bush.
 */
export const RESOLVING_WORLD_PLAZA_SHRUB_INTERACTION_LABEL_OFFSET_ABOVE_PX = 48;

/**
 * Maps a berry-shrub tile to viewport coordinates for its Pick popover.
 */
export function resolvingWorldPlazaShrubInteractionLabelScreenPoint(
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
      RESOLVING_WORLD_PLAZA_SHRUB_INTERACTION_LABEL_OFFSET_ABOVE_PX *
        cameraWorldZoom,
  };
}
