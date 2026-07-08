import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';

/**
 * True when a grid point lies within a circular radius of a center point.
 */
export function checkingWildlifePointWithinRadiusGrid(
  point: DefiningWorldPlazaWorldPoint,
  center: DefiningWorldPlazaWorldPoint,
  radiusGrid: number
): boolean {
  const deltaX = point.x - center.x;
  const deltaY = point.y - center.y;
  const radiusSquared = radiusGrid * radiusGrid;

  return deltaX * deltaX + deltaY * deltaY <= radiusSquared;
}
