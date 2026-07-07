/**
 * Whether a world point lies inside a species territory anchor bubble.
 *
 * @module components/world/wildlife/domains/checkingWildlifePointIsInsideTerritoryAnchor
 */

import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import type { DefiningWildlifeSpeciesTerritoryConfig } from '@/components/world/wildlife/domains/definingWildlifeSpeciesRegistry';

/** True when the point is inside the spawn-anchor territory bubble. */
export function checkingWildlifePointIsInsideTerritoryAnchor(
  point: DefiningWorldPlazaWorldPoint,
  spawnAnchor: DefiningWorldPlazaWorldPoint,
  territory: DefiningWildlifeSpeciesTerritoryConfig
): boolean {
  return (
    Math.hypot(point.x - spawnAnchor.x, point.y - spawnAnchor.y) <=
    territory.anchorRadiusGrid
  );
}
