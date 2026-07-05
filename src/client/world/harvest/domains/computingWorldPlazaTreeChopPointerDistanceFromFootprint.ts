import type { DefiningWorldPlazaCameraOffset } from '@/components/world/domains/definingWorldPlazaCameraOffset';
import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import {
  resolvingWorldPlazaTreeCanopyFootprintRadiusGrid,
  resolvingWorldPlazaTreeTrunkScreenHitBounds,
} from '@/components/world/domains/drawingWorldPlazaTreeOnGraphics';
import { projectingWorldPlazaViewportScreenPointToIsometricWorldLocal } from '@/components/world/domains/projectingWorldPlazaIsometricScreenPointThroughCamera';
import type { DefiningWorldPlazaTreeInstance } from '@/components/world/domains/resolvingWorldPlazaTreeAtTileIndex';
import {
  DEFINING_WORLD_PLAZA_TREE_CHOP_CANOPY_POINTER_HIT_RADIUS_MULTIPLIER,
  DEFINING_WORLD_PLAZA_TREE_CHOP_POINTER_HIT_RADIUS_TILES,
} from '@/components/world/harvest/domains/definingWorldPlazaTreeChopConstants';

export type DefiningWorldPlazaTreeChopPointerHitContext = {
  readonly gridPoint: DefiningWorldPlazaWorldPoint;
  readonly viewportScreenPoint: { readonly x: number; readonly y: number };
  readonly cameraOffset: DefiningWorldPlazaCameraOffset;
  readonly cameraWorldZoom: number;
};

/**
 * Grid-space hit radius for a tree chop click, covering the painted canopy.
 */
export function computingWorldPlazaTreeChopPointerHitRadiusGrid(
  tree: DefiningWorldPlazaTreeInstance
): number {
  return Math.max(
    DEFINING_WORLD_PLAZA_TREE_CHOP_POINTER_HIT_RADIUS_TILES,
    resolvingWorldPlazaTreeCanopyFootprintRadiusGrid(tree) *
      DEFINING_WORLD_PLAZA_TREE_CHOP_CANOPY_POINTER_HIT_RADIUS_MULTIPLIER
  );
}

/**
 * Euclidean distance from a pointer to a tree trunk foot when inside the canopy
 * footprint; otherwise `null`.
 */
export function computingWorldPlazaTreeChopPointerDistanceFromFootprint(
  pointerGridPoint: DefiningWorldPlazaWorldPoint,
  tree: DefiningWorldPlazaTreeInstance
): number | null {
  const deltaX = pointerGridPoint.x - tree.tileX;
  const deltaY = pointerGridPoint.y - tree.tileY;
  const distance = Math.hypot(deltaX, deltaY);
  const hitRadius = computingWorldPlazaTreeChopPointerHitRadiusGrid(tree);

  if (distance > hitRadius) {
    return null;
  }

  return distance;
}

function checkingWorldPlazaPointerOverTreeTrunkScreenBounds(
  context: DefiningWorldPlazaTreeChopPointerHitContext,
  tree: DefiningWorldPlazaTreeInstance
): boolean {
  const worldLocalPointer =
    projectingWorldPlazaViewportScreenPointToIsometricWorldLocal(
      context.viewportScreenPoint,
      context.cameraOffset,
      context.cameraWorldZoom
    );
  const bounds = resolvingWorldPlazaTreeTrunkScreenHitBounds(tree);

  return (
    worldLocalPointer.x >= bounds.leftXPx &&
    worldLocalPointer.x <= bounds.rightXPx &&
    worldLocalPointer.y >= bounds.topYPx &&
    worldLocalPointer.y <= bounds.bottomYPx
  );
}

/**
 * Distance from a pointer to a tree when the click lands on the canopy footprint
 * or the drawn trunk silhouette.
 */
export function computingWorldPlazaTreeChopPointerHitDistance(
  context: DefiningWorldPlazaTreeChopPointerHitContext,
  tree: DefiningWorldPlazaTreeInstance
): number | null {
  const canopyDistance =
    computingWorldPlazaTreeChopPointerDistanceFromFootprint(
      context.gridPoint,
      tree
    );

  if (canopyDistance !== null) {
    return canopyDistance;
  }

  if (!checkingWorldPlazaPointerOverTreeTrunkScreenBounds(context, tree)) {
    return null;
  }

  return Math.hypot(
    context.gridPoint.x - tree.tileX,
    context.gridPoint.y - tree.tileY
  );
}
