/**
 * Declarative heuristic registry for grid A*.
 *
 * @module lib/navigation/definingNavigationHeuristicRegistry
 */

import { computingNavigationManhattanHeuristicCost } from '@/lib/navigation/computingNavigationManhattanHeuristicCost';
import { computingNavigationOctileHeuristicCost } from '@/lib/navigation/computingNavigationOctileHeuristicCost';
import type {
  DefiningNavigationGridNode,
  DefiningNavigationHeuristicId,
} from '@/lib/navigation/definingNavigationGridTypes';

export type DefiningNavigationHeuristicDefinition = {
  readonly id: DefiningNavigationHeuristicId;
  readonly computeCost: (
    from: DefiningNavigationGridNode,
    to: DefiningNavigationGridNode
  ) => number;
};

/** Heuristic registry keyed by declarative id. */
export const DEFINING_NAVIGATION_HEURISTIC_REGISTRY: Record<
  DefiningNavigationHeuristicId,
  DefiningNavigationHeuristicDefinition
> = {
  manhattan: {
    id: 'manhattan',
    computeCost: computingNavigationManhattanHeuristicCost,
  },
  octile: {
    id: 'octile',
    computeCost: computingNavigationOctileHeuristicCost,
  },
};

/**
 * Resolves a heuristic cost from the registry.
 */
export function resolvingNavigationHeuristicCost(
  heuristicId: DefiningNavigationHeuristicId,
  from: DefiningNavigationGridNode,
  to: DefiningNavigationGridNode
): number {
  return DEFINING_NAVIGATION_HEURISTIC_REGISTRY[heuristicId].computeCost(
    from,
    to
  );
}
