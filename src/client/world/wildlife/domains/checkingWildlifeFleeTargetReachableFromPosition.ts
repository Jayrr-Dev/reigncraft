/**
 * Checks whether wildlife can take one step toward a flee destination.
 *
 * @module components/world/wildlife/domains/checkingWildlifeFleeTargetReachableFromPosition
 */

import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import { checkingWildlifeHazardAtPoint } from '@/components/world/wildlife/domains/checkingWildlifeHazardAtPoint';
import { DEFINING_WILDLIFE_FLEE_REACHABILITY_STEP_GRID } from '@/components/world/wildlife/domains/definingWildlifeFleeConstants';
import type { DefiningWildlifeSpeciesDefinition } from '@/components/world/wildlife/domains/definingWildlifeSpeciesRegistry';
import type { ResolvingWildlifeSteeringHazardSampling } from '@/components/world/wildlife/domains/resolvingWildlifeSteeringStep';

export type CheckingWildlifeFleeTargetReachableFromPositionParams = {
  position: DefiningWorldPlazaWorldPoint;
  fleeTargetPoint: DefiningWorldPlazaWorldPoint;
  species: DefiningWildlifeSpeciesDefinition;
  hazardSampling: ResolvingWildlifeSteeringHazardSampling;
  stepDistanceGrid?: number;
};

/**
 * Returns true when at least one step toward the flee target is walkable.
 */
export function checkingWildlifeFleeTargetReachableFromPosition({
  position,
  fleeTargetPoint,
  species,
  hazardSampling,
  stepDistanceGrid = DEFINING_WILDLIFE_FLEE_REACHABILITY_STEP_GRID,
}: CheckingWildlifeFleeTargetReachableFromPositionParams): boolean {
  const deltaX = fleeTargetPoint.x - position.x;
  const deltaY = fleeTargetPoint.y - position.y;
  const length = Math.hypot(deltaX, deltaY);

  if (length <= 0.0001) {
    return true;
  }

  const directionX = deltaX / length;
  const directionY = deltaY / length;
  const probePoint = {
    x: position.x + directionX * stepDistanceGrid,
    y: position.y + directionY * stepDistanceGrid,
    layer: position.layer,
  };

  return (
    checkingWildlifeHazardAtPoint({
      point: probePoint,
      species,
      placedBlocks: hazardSampling.placedBlocks,
      placedBlocksByTile: hazardSampling.placedBlocksByTile,
      isDaytime: hazardSampling.isDaytime,
    }) === 'safe'
  );
}
