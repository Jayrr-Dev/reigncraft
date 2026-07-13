/**
 * Whether the player is walking or running toward a stalking wolf at close range.
 *
 * @module components/world/wildlife/domains/checkingWildlifePlayerApproachingPackHunter
 */

import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import {
  DEFINING_WILDLIFE_STALK_PLAYER_APPROACH_CLOSE_DISTANCE_GRID,
  DEFINING_WILDLIFE_STALK_PLAYER_APPROACH_CLOSING_DOT_THRESHOLD,
  DEFINING_WILDLIFE_STALK_PLAYER_APPROACH_MIN_MOVEMENT_GRID,
} from '@/components/world/wildlife/domains/definingWildlifeStalkConstants';

export type CheckingWildlifePlayerApproachingPackHunterParams = {
  playerPosition: DefiningWorldPlazaWorldPoint;
  playerPreviousPosition: DefiningWorldPlazaWorldPoint;
  wolfPosition: DefiningWorldPlazaWorldPoint;
  isPlayerWalking: boolean;
  isPlayerRunning: boolean;
  closeDistanceGrid?: number;
  closingDotThreshold?: number;
  minMovementGrid?: number;
};

/** True when the player is actively closing distance on a nearby PackHunter. */
export function checkingWildlifePlayerApproachingPackHunter({
  playerPosition,
  playerPreviousPosition,
  wolfPosition,
  isPlayerWalking,
  isPlayerRunning,
  closeDistanceGrid = DEFINING_WILDLIFE_STALK_PLAYER_APPROACH_CLOSE_DISTANCE_GRID,
  closingDotThreshold = DEFINING_WILDLIFE_STALK_PLAYER_APPROACH_CLOSING_DOT_THRESHOLD,
  minMovementGrid = DEFINING_WILDLIFE_STALK_PLAYER_APPROACH_MIN_MOVEMENT_GRID,
}: CheckingWildlifePlayerApproachingPackHunterParams): boolean {
  if (!isPlayerWalking && !isPlayerRunning) {
    return false;
  }

  const distanceToWolf = Math.hypot(
    playerPosition.x - wolfPosition.x,
    playerPosition.y - wolfPosition.y
  );

  if (distanceToWolf > closeDistanceGrid) {
    return false;
  }

  const playerMoveX = playerPosition.x - playerPreviousPosition.x;
  const playerMoveY = playerPosition.y - playerPreviousPosition.y;
  const moveMagnitude = Math.hypot(playerMoveX, playerMoveY);

  if (moveMagnitude < minMovementGrid) {
    return false;
  }

  const towardWolfX = wolfPosition.x - playerPosition.x;
  const towardWolfY = wolfPosition.y - playerPosition.y;
  const towardMagnitude = Math.hypot(towardWolfX, towardWolfY);

  if (towardMagnitude < 0.01) {
    return true;
  }

  const closingDot =
    (playerMoveX * towardWolfX + playerMoveY * towardWolfY) /
    (moveMagnitude * towardMagnitude);

  return closingDot >= closingDotThreshold;
}
