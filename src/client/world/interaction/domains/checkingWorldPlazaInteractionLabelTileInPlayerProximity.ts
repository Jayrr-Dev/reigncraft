import { computingWorldPlazaGridChebyshevDistance } from '@/components/world/domains/computingWorldPlazaGridChebyshevDistance';
import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import { DEFINING_WORLD_PLAZA_INTERACTION_LABEL_PROXIMITY_RADIUS_TILES } from '@/components/world/interaction/domains/definingWorldPlazaInteractionLabelProximityConstants';

/**
 * Tile-index Chebyshev distance from the player's floor tile to a target tile.
 *
 * Uses floored player coords so standing anywhere on an adjacent tile counts as
 * 1, including the far edge / “above” side that continuous-center checks miss.
 */
export function computingWorldPlazaInteractionLabelProximityTileDistance(
  playerPosition: DefiningWorldPlazaWorldPoint,
  tileX: number,
  tileY: number
): number {
  return computingWorldPlazaGridChebyshevDistance(
    Math.floor(playerPosition.x),
    Math.floor(playerPosition.y),
    tileX,
    tileY
  );
}

/**
 * True when a target tile is within the interaction-label proximity ring.
 */
export function checkingWorldPlazaInteractionLabelTileInPlayerProximity(
  playerPosition: DefiningWorldPlazaWorldPoint,
  tileX: number,
  tileY: number,
  proximityRadiusTiles: number = DEFINING_WORLD_PLAZA_INTERACTION_LABEL_PROXIMITY_RADIUS_TILES
): boolean {
  return (
    computingWorldPlazaInteractionLabelProximityTileDistance(
      playerPosition,
      tileX,
      tileY
    ) <= proximityRadiusTiles
  );
}
