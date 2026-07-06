/**
 * Converts a ground item tile anchor to a wildlife movement target point.
 *
 * @module components/world/wildlife/domains/resolvingWildlifeGroundFoodWorldPoint
 */

import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import type { DefiningWorldPlazaGroundItem } from '@/components/world/inventory/domains/definingWorldPlazaGroundItem';

/** Resolves the grid center point wildlife should walk toward to eat. */
export function resolvingWildlifeGroundFoodWorldPoint(
  groundItem: DefiningWorldPlazaGroundItem
): DefiningWorldPlazaWorldPoint {
  return {
    x: groundItem.gridX + 0.5,
    y: groundItem.gridY + 0.5,
    layer: groundItem.layer ?? 1,
  };
}
