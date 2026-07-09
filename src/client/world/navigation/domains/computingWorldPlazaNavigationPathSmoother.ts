/**
 * Line-of-sight path smoothing for plaza navigation.
 *
 * @module components/world/navigation/domains/computingWorldPlazaNavigationPathSmoother
 */

import { DEFINING_WORLD_PLAZA_NAVIGATION_PATH_SMOOTHER_SAMPLE_STEP_GRID } from '@/components/world/navigation/domains/definingWorldPlazaNavigationConstants';
import type { DefiningNavigationGridNode } from '@/lib/navigation/definingNavigationGridTypes';
import type { DefiningNavigationMoveCostResolver } from '@/lib/navigation/definingNavigationGridTypes';

export type ComputingWorldPlazaNavigationPathSmootherParams = {
  readonly path: readonly DefiningNavigationGridNode[];
  readonly resolveMoveCost: DefiningNavigationMoveCostResolver;
};

function checkingWorldPlazaNavigationGridLineWalkable(
  from: DefiningNavigationGridNode,
  to: DefiningNavigationGridNode,
  resolveMoveCost: DefiningNavigationMoveCostResolver
): boolean {
  const deltaX = to.x - from.x;
  const deltaY = to.y - from.y;
  const distance = Math.hypot(deltaX, deltaY);

  if (distance <= 0.0001) {
    return true;
  }

  const stepCount = Math.max(
    1,
    Math.ceil(distance / DEFINING_WORLD_PLAZA_NAVIGATION_PATH_SMOOTHER_SAMPLE_STEP_GRID)
  );

  for (let stepIndex = 1; stepIndex <= stepCount; stepIndex += 1) {
    const fraction = stepIndex / stepCount;
    const sampleNode = {
      x: Math.round(from.x + deltaX * fraction),
      y: Math.round(from.y + deltaY * fraction),
      layer: from.layer ?? to.layer,
    };
    const previousSampleNode =
      stepIndex === 1
        ? from
        : {
            x: Math.round(from.x + deltaX * ((stepIndex - 1) / stepCount)),
            y: Math.round(from.y + deltaY * ((stepIndex - 1) / stepCount)),
            layer: from.layer ?? to.layer,
          };

    if (
      sampleNode.x === previousSampleNode.x &&
      sampleNode.y === previousSampleNode.y &&
      (sampleNode.layer ?? 0) === (previousSampleNode.layer ?? 0)
    ) {
      continue;
    }

    if (resolveMoveCost(previousSampleNode, sampleNode) === null) {
      return false;
    }
  }

  return true;
}

/**
 * Collapses redundant grid nodes when a straight segment stays walkable.
 */
export function computingWorldPlazaNavigationPathSmoother({
  path,
  resolveMoveCost,
}: ComputingWorldPlazaNavigationPathSmootherParams): DefiningNavigationGridNode[] {
  if (path.length <= 2) {
    return [...path];
  }

  const smoothedPath: DefiningNavigationGridNode[] = [path[0]];
  let anchorIndex = 0;

  while (anchorIndex < path.length - 1) {
    let farthestVisibleIndex = anchorIndex + 1;

    for (
      let candidateIndex = anchorIndex + 2;
      candidateIndex < path.length;
      candidateIndex += 1
    ) {
      if (
        checkingWorldPlazaNavigationGridLineWalkable(
          path[anchorIndex],
          path[candidateIndex],
          resolveMoveCost
        )
      ) {
        farthestVisibleIndex = candidateIndex;
      }
    }

    smoothedPath.push(path[farthestVisibleIndex]);
    anchorIndex = farthestVisibleIndex;
  }

  return smoothedPath;
}
