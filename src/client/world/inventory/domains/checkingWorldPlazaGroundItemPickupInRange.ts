import { DEFINING_WORLD_PLAZA_GROUND_ITEM_PICKUP_RADIUS_TILES } from "@/components/world/inventory/domains/definingWorldPlazaGroundItemConstants";
import type { DefiningWorldPlazaGroundItem } from "@/components/world/inventory/domains/definingWorldPlazaGroundItem";
import type { DefiningWorldPlazaWorldPoint } from "@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint";

/**
 * Chebyshev tile distance between two grid points.
 *
 * @param fromX - Source tile X
 * @param fromY - Source tile Y
 * @param toX - Target tile X
 * @param toY - Target tile Y
 */
function computingWorldPlazaGridChebyshevDistance(
  fromX: number,
  fromY: number,
  toX: number,
  toY: number,
): number {
  return Math.max(Math.abs(fromX - toX), Math.abs(fromY - toY));
}

/**
 * Returns true when the player is close enough to pick up a ground item.
 *
 * @param playerPosition - Live player grid position
 * @param groundItem - Ground item to pick up
 */
export function checkingWorldPlazaGroundItemPickupInRange(
  playerPosition: DefiningWorldPlazaWorldPoint,
  groundItem: DefiningWorldPlazaGroundItem,
): boolean {
  return (
    computingWorldPlazaGridChebyshevDistance(
      playerPosition.x,
      playerPosition.y,
      groundItem.gridX,
      groundItem.gridY,
    ) <= DEFINING_WORLD_PLAZA_GROUND_ITEM_PICKUP_RADIUS_TILES
  );
}
