import { computingWorldPlazaTileCenterScreenAnchorFromGridPoint } from '@/components/world/domains/computingWorldPlazaTileCenterScreenAnchorFromGridPoint';
import type { DefiningWorldPlazaCameraOffset } from '@/components/world/domains/definingWorldPlazaCameraOffset';
import { projectingWorldPlazaIsometricWorldLocalToViewportScreenPoint } from '@/components/world/domains/projectingWorldPlazaIsometricScreenPointThroughCamera';

/** Lift above tile center for ground interaction popovers (world-local px). */
export const RESOLVING_WORLD_PLAZA_GROUND_TILE_INTERACTION_LABEL_OFFSET_ABOVE_TILE_PX = 22;

/**
 * Maps a ground tile to viewport coordinates for timed interaction labels.
 */
export function resolvingWorldPlazaGroundTileInteractionLabelScreenPoint(
  tileX: number,
  tileY: number,
  cameraOffset: DefiningWorldPlazaCameraOffset,
  cameraWorldZoom: number
): {
  readonly x: number;
  readonly y: number;
} {
  const tileAnchor = computingWorldPlazaTileCenterScreenAnchorFromGridPoint({
    x: tileX,
    y: tileY,
    layer: 1,
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
      RESOLVING_WORLD_PLAZA_GROUND_TILE_INTERACTION_LABEL_OFFSET_ABOVE_TILE_PX *
        cameraWorldZoom,
  };
}
