import { computingWorldPlazaTileCenterScreenAnchorFromGridPoint } from '@/components/world/domains/computingWorldPlazaTileCenterScreenAnchorFromGridPoint';
import type { DefiningWorldPlazaCameraOffset } from '@/components/world/domains/definingWorldPlazaCameraOffset';
import { DEFINING_WORLD_BUILDING_WORLD_LAYER_GROUND } from '@/components/world/building/domains/definingWorldBuildingWorldLayerConstants';
import { projectingWorldPlazaIsometricWorldLocalToViewportScreenPoint } from '@/components/world/domains/projectingWorldPlazaIsometricScreenPointThroughCamera';
import type { DefiningWorldPlazaStoneDecoration } from '@/components/world/domains/resolvingWorldPlazaStoneDecorationAtTileIndex';

/** Lift above the pebble for the interaction popover anchor (world-local px). */
export const RESOLVING_WORLD_PLAZA_PEBBLE_INTERACTION_LABEL_OFFSET_ABOVE_PX = 18;

/**
 * Maps a floor pebble to viewport coordinates for its pick popover.
 */
export function resolvingWorldPlazaPebbleInteractionLabelScreenPoint(
  tileX: number,
  tileY: number,
  decoration: DefiningWorldPlazaStoneDecoration,
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
        x: tileAnchor.centerXPx + decoration.offsetX,
        y: tileAnchor.centerYPx + decoration.offsetY,
      },
      cameraOffset,
      cameraWorldZoom
    );

  return {
    x: viewportPoint.x,
    y:
      viewportPoint.y -
      RESOLVING_WORLD_PLAZA_PEBBLE_INTERACTION_LABEL_OFFSET_ABOVE_PX *
        cameraWorldZoom,
  };
}
