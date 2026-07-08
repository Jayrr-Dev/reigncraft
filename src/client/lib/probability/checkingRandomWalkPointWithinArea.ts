/**
 * Point-in-area predicates for bounded random walks.
 *
 * @module lib/probability/checkingRandomWalkPointWithinArea
 */

import type { DefiningRandomWalkPoint2d } from '@/lib/probability/definingRandomWalkConstants';
import type {
  DefiningRandomWalkArea,
  DefiningRandomWalkAxisBounds,
} from '@/lib/probability/definingRandomWalkArea';

/** Returns true when value lies on the closed interval [min, max]. */
export function checkingRandomWalkValueWithinAxisBounds(
  value: number,
  bounds: DefiningRandomWalkAxisBounds
): boolean {
  return value >= bounds.min && value <= bounds.max;
}

/** Returns true when a 2D point lies inside the declared roam area. */
export function checkingRandomWalkPointWithinArea(
  point: DefiningRandomWalkPoint2d,
  area: DefiningRandomWalkArea
): boolean {
  if (area.kind === 'rect') {
    return (
      point.x >= area.minX &&
      point.x <= area.maxX &&
      point.y >= area.minY &&
      point.y <= area.maxY
    );
  }

  const deltaX = point.x - area.centerX;
  const deltaY = point.y - area.centerY;

  return (
    deltaX * deltaX + deltaY * deltaY <= area.radiusGrid * area.radiusGrid
  );
}
