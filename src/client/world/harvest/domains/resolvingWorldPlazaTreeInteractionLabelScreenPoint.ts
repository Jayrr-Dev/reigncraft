import { computingWorldPlazaTileCenterScreenAnchorFromGridPoint } from '@/components/world/domains/computingWorldPlazaTileCenterScreenAnchorFromGridPoint';
import type { DefiningWorldPlazaCameraOffset } from '@/components/world/domains/definingWorldPlazaCameraOffset';
import { projectingWorldPlazaIsometricWorldLocalToViewportScreenPoint } from '@/components/world/domains/projectingWorldPlazaIsometricScreenPointThroughCamera';
import type { DefiningWorldPlazaTreeInstance } from '@/components/world/domains/resolvingWorldPlazaTreeAtTileIndex';

/** Lift above the tree trunk foot for the interaction popover anchor (world-local px). */
export const RESOLVING_WORLD_PLAZA_TREE_INTERACTION_LABEL_OFFSET_ABOVE_TRUNK_FOOT_PX = 28;

/**
 * Maps a tree to viewport coordinates for its chop popover.
 */
export function resolvingWorldPlazaTreeInteractionLabelScreenPoint(
  tree: DefiningWorldPlazaTreeInstance,
  cameraOffset: DefiningWorldPlazaCameraOffset,
  cameraWorldZoom: number
): {
  readonly x: number;
  readonly y: number;
} {
  const standingLayer = tree.standingSurfaceLayer ?? 1;
  const tileAnchor = computingWorldPlazaTileCenterScreenAnchorFromGridPoint({
    x: tree.tileX,
    y: tree.tileY,
    layer: standingLayer,
  });
  const viewportPoint =
    projectingWorldPlazaIsometricWorldLocalToViewportScreenPoint(
      {
        x: tileAnchor.centerXPx + tree.offsetXPx,
        y: tileAnchor.centerYPx + tree.offsetYPx,
      },
      cameraOffset,
      cameraWorldZoom
    );

  return {
    x: viewportPoint.x,
    y:
      viewportPoint.y -
      RESOLVING_WORLD_PLAZA_TREE_INTERACTION_LABEL_OFFSET_ABOVE_TRUNK_FOOT_PX *
        cameraWorldZoom,
  };
}
