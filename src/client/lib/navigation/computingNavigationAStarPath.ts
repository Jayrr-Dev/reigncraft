/**
 * Pure grid A* path search with declarative movement and heuristic registries.
 *
 * @module lib/navigation/computingNavigationAStarPath
 */

import { checkingNavigationEightDirectionCornerCutAllowed } from '@/lib/navigation/checkingNavigationEightDirectionCornerCutAllowed';
import {
  DEFINING_NAVIGATION_ASTAR_DEFAULT_HEURISTIC_ID,
  DEFINING_NAVIGATION_ASTAR_DEFAULT_MAX_NODE_EXPANSIONS,
  DEFINING_NAVIGATION_ASTAR_DEFAULT_MOVEMENT_MODE_ID,
} from '@/lib/navigation/definingNavigationAStarConstants';
import type {
  DefiningNavigationAStarRequest,
  DefiningNavigationAStarResult,
  DefiningNavigationGridNode,
} from '@/lib/navigation/definingNavigationGridTypes';
import { DEFINING_NAVIGATION_MOVEMENT_MODE_REGISTRY } from '@/lib/navigation/definingNavigationMovementModeRegistry';
import { resolvingNavigationHeuristicCost } from '@/lib/navigation/definingNavigationHeuristicRegistry';
import {
  resolvingNavigationGridNeighborNode,
  resolvingNavigationGridNodeKey,
} from '@/lib/navigation/resolvingNavigationGridNodeKey';

type NavigationAStarOpenEntry = {
  readonly node: DefiningNavigationGridNode;
  readonly fCost: number;
};

type NavigationAStarSearchState = {
  readonly gCosts: Map<string, number>;
  readonly cameFrom: Map<string, DefiningNavigationGridNode>;
  readonly openEntries: NavigationAStarOpenEntry[];
};

function checkingNavigationGridNodesEqual(
  left: DefiningNavigationGridNode,
  right: DefiningNavigationGridNode
): boolean {
  return (
    left.x === right.x &&
    left.y === right.y &&
    (left.layer ?? 0) === (right.layer ?? 0)
  );
}

function pushingNavigationAStarOpenEntry(
  openEntries: NavigationAStarOpenEntry[],
  entry: NavigationAStarOpenEntry
): void {
  openEntries.push(entry);
}

function poppingNavigationAStarLowestFCostEntry(
  openEntries: NavigationAStarOpenEntry[]
): NavigationAStarOpenEntry | null {
  if (openEntries.length === 0) {
    return null;
  }

  let lowestIndex = 0;

  for (let index = 1; index < openEntries.length; index += 1) {
    if (openEntries[index].fCost < openEntries[lowestIndex].fCost) {
      lowestIndex = index;
    }
  }

  const [entry] = openEntries.splice(lowestIndex, 1);

  return entry ?? null;
}

function rebuildingNavigationAStarPath(
  cameFrom: Map<string, DefiningNavigationGridNode>,
  goal: DefiningNavigationGridNode
): DefiningNavigationGridNode[] {
  const path: DefiningNavigationGridNode[] = [goal];
  let currentKey = resolvingNavigationGridNodeKey(goal);

  while (cameFrom.has(currentKey)) {
    const previousNode = cameFrom.get(currentKey);

    if (!previousNode) {
      break;
    }

    path.push(previousNode);
    currentKey = resolvingNavigationGridNodeKey(previousNode);
  }

  path.reverse();

  return path;
}

function checkingNavigationNeighborMoveAllowed(
  from: DefiningNavigationGridNode,
  offset: { readonly dx: number; readonly dy: number },
  movementModeId: DefiningNavigationAStarRequest['movementModeId'],
  preventCornerCutting: boolean,
  resolveMoveCost: DefiningNavigationAStarRequest['resolveMoveCost']
): boolean {
  if (
    movementModeId === 'eight_direction' &&
    preventCornerCutting &&
    !checkingNavigationEightDirectionCornerCutAllowed(from, offset, resolveMoveCost)
  ) {
    return false;
  }

  return true;
}

/**
 * Runs A* on a grid using injected move-cost rules and declarative registries.
 */
export function computingNavigationAStarPath({
  start,
  goal,
  resolveMoveCost,
  movementModeId = DEFINING_NAVIGATION_ASTAR_DEFAULT_MOVEMENT_MODE_ID,
  heuristicId = DEFINING_NAVIGATION_ASTAR_DEFAULT_HEURISTIC_ID,
  maxNodeExpansions = DEFINING_NAVIGATION_ASTAR_DEFAULT_MAX_NODE_EXPANSIONS,
  preventCornerCutting = true,
}: DefiningNavigationAStarRequest): DefiningNavigationAStarResult {
  if (checkingNavigationGridNodesEqual(start, goal)) {
    return {
      status: 'same_node',
      path: [start],
      totalCost: 0,
      nodesExpanded: 0,
    };
  }

  const movementMode = DEFINING_NAVIGATION_MOVEMENT_MODE_REGISTRY[movementModeId];
  const startKey = resolvingNavigationGridNodeKey(start);
  const goalKey = resolvingNavigationGridNodeKey(goal);
  const searchState: NavigationAStarSearchState = {
    gCosts: new Map([[startKey, 0]]),
    cameFrom: new Map(),
    openEntries: [],
  };

  pushingNavigationAStarOpenEntry(searchState.openEntries, {
    node: start,
    fCost: resolvingNavigationHeuristicCost(heuristicId, start, goal),
  });

  let nodesExpanded = 0;

  while (searchState.openEntries.length > 0) {
    const currentEntry = poppingNavigationAStarLowestFCostEntry(
      searchState.openEntries
    );

    if (!currentEntry) {
      break;
    }

    const currentNode = currentEntry.node;
    const currentKey = resolvingNavigationGridNodeKey(currentNode);
    const currentGCost = searchState.gCosts.get(currentKey);

    if (currentGCost === undefined) {
      continue;
    }

    if (currentKey === goalKey) {
      return {
        status: 'found',
        path: rebuildingNavigationAStarPath(searchState.cameFrom, goal),
        totalCost: currentGCost,
        nodesExpanded,
      };
    }

    nodesExpanded += 1;

    if (nodesExpanded > maxNodeExpansions) {
      return {
        status: 'expansion_limit',
        path: [],
        totalCost: 0,
        nodesExpanded,
      };
    }

    for (const offset of movementMode.neighborOffsets) {
      if (
        !checkingNavigationNeighborMoveAllowed(
          currentNode,
          offset,
          movementModeId,
          preventCornerCutting,
          resolveMoveCost
        )
      ) {
        continue;
      }

      const neighborNode = resolvingNavigationGridNeighborNode(
        currentNode,
        offset
      );
      const edgeCost = resolveMoveCost(currentNode, neighborNode);

      if (edgeCost === null) {
        continue;
      }

      const tentativeGCost = currentGCost + edgeCost;
      const neighborKey = resolvingNavigationGridNodeKey(neighborNode);
      const knownGCost = searchState.gCosts.get(neighborKey);

      if (knownGCost !== undefined && tentativeGCost >= knownGCost) {
        continue;
      }

      searchState.cameFrom.set(neighborKey, currentNode);
      searchState.gCosts.set(neighborKey, tentativeGCost);

      pushingNavigationAStarOpenEntry(searchState.openEntries, {
        node: neighborNode,
        fCost:
          tentativeGCost +
          resolvingNavigationHeuristicCost(
            heuristicId,
            neighborNode,
            goal
          ),
      });
    }
  }

  return {
    status: 'unreachable',
    path: [],
    totalCost: 0,
    nodesExpanded,
  };
}
