import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';

/**
 * Chebyshev (king-move) distance between two grid points.
 */
export function computingWorldPlazaGridChebyshevDistance(
  fromX: number,
  fromY: number,
  toX: number,
  toY: number
): number {
  return Math.max(Math.abs(fromX - toX), Math.abs(fromY - toY));
}

/**
 * Chebyshev distance between two plaza world/grid points.
 */
export function computingWorldPlazaGridChebyshevDistanceBetweenPoints(
  fromPoint: DefiningWorldPlazaWorldPoint,
  toPoint: DefiningWorldPlazaWorldPoint
): number {
  return computingWorldPlazaGridChebyshevDistance(
    fromPoint.x,
    fromPoint.y,
    toPoint.x,
    toPoint.y
  );
}
