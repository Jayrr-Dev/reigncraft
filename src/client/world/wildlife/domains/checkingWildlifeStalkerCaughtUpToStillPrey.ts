/**
 * Whether a stalker has closed to shadow range while the prey stands still.
 *
 * @module components/world/wildlife/domains/checkingWildlifeStalkerCaughtUpToStillPrey
 */

import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import {
  DEFINING_WILDLIFE_STALK_CAUGHT_UP_IDLE_PREY_STILL_MS,
  DEFINING_WILDLIFE_STALK_FOLLOW_MAX_DISTANCE_GRID,
  DEFINING_WILDLIFE_STALK_FOLLOW_MIN_DISTANCE_GRID,
} from '@/components/world/wildlife/domains/definingWildlifeStalkConstants';

export type CheckingWildlifeStalkerCaughtUpToStillPreyParams = {
  position: DefiningWorldPlazaWorldPoint;
  preyPosition: DefiningWorldPlazaWorldPoint;
  preyStillDurationMs: number;
};

/**
 * True when the prey has been still long enough and the stalker is in the
 * comfort band (not catching up or backing off).
 */
export function checkingWildlifeStalkerCaughtUpToStillPrey({
  position,
  preyPosition,
  preyStillDurationMs,
}: CheckingWildlifeStalkerCaughtUpToStillPreyParams): boolean {
  if (preyStillDurationMs < DEFINING_WILDLIFE_STALK_CAUGHT_UP_IDLE_PREY_STILL_MS) {
    return false;
  }

  const distance = Math.hypot(
    preyPosition.x - position.x,
    preyPosition.y - position.y
  );

  return (
    distance >= DEFINING_WILDLIFE_STALK_FOLLOW_MIN_DISTANCE_GRID &&
    distance <= DEFINING_WILDLIFE_STALK_FOLLOW_MAX_DISTANCE_GRID
  );
}
