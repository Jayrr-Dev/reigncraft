/**
 * Whether a stalker should back away from prey.
 *
 * @module components/world/wildlife/domains/checkingWildlifeStalkerPreyTooClose
 */

import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import { DEFINING_WILDLIFE_STALK_FOLLOW_MIN_DISTANCE_GRID } from '@/components/world/wildlife/domains/definingWildlifeStalkConstants';

export type CheckingWildlifeStalkerPreyTooCloseParams = {
  position: DefiningWorldPlazaWorldPoint;
  preyPosition: DefiningWorldPlazaWorldPoint;
};

/** True when prey has stepped inside the stalker's shadow comfort band. */
export function checkingWildlifeStalkerPreyTooClose({
  position,
  preyPosition,
}: CheckingWildlifeStalkerPreyTooCloseParams): boolean {
  const distance = Math.hypot(
    preyPosition.x - position.x,
    preyPosition.y - position.y
  );

  return distance < DEFINING_WILDLIFE_STALK_FOLLOW_MIN_DISTANCE_GRID;
}
