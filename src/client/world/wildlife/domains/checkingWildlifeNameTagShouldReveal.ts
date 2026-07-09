/**
 * Visibility rules for wildlife name tags above sprites.
 *
 * @module components/world/wildlife/domains/checkingWildlifeNameTagShouldReveal
 */

import type { DefiningWorldPlazaGirlSampleWalkDirection } from '@/components/world/domains/definingWorldPlazaGirlSampleWalkConstants';
import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import { checkingWildlifeNameTagIsInFrontOfPlayer } from '@/components/world/wildlife/domains/checkingWildlifeNameTagIsInFrontOfPlayer';
import { checkingWildlifePlayerRevengeAggroIsActive } from '@/components/world/wildlife/domains/checkingWildlifePlayerRevengeAggroIsActive';
import { checkingWildlifePointWithinRadiusGrid } from '@/components/world/wildlife/domains/checkingWildlifePointWithinRadiusGrid';
import {
  DEFINING_WILDLIFE_NAME_TAG_PROXIMITY_REVEAL_RADIUS_GRID,
  DEFINING_WILDLIFE_NAME_TAG_RECENT_COMBAT_REVEAL_MS,
} from '@/components/world/wildlife/domains/definingWildlifeNameTagConstants';
import type { DefiningWildlifeInstance } from '@/components/world/wildlife/domains/definingWildlifeTypes';

export type CheckingWildlifeNameTagShouldRevealParams = {
  instance: Pick<
    DefiningWildlifeInstance,
    'instanceId' | 'position' | 'aggroState'
  >;
  playerPosition: DefiningWorldPlazaWorldPoint;
  playerFacingDirection: DefiningWorldPlazaGirlSampleWalkDirection;
  playerUserId: string | null;
  nowMs: number;
  hoveredInstanceId: string | null;
  wildlifeDamagedPlayerAtMs: number | null;
};

function checkingWildlifeNameTagRecentCombatRevealIsActive(
  eventAtMs: number | null | undefined,
  nowMs: number
): boolean {
  return (
    eventAtMs !== null &&
    eventAtMs !== undefined &&
    nowMs - eventAtMs <= DEFINING_WILDLIFE_NAME_TAG_RECENT_COMBAT_REVEAL_MS
  );
}

/** True when a wildlife name tag should fade in for the local player. */
export function checkingWildlifeNameTagShouldReveal({
  instance,
  playerPosition,
  playerFacingDirection,
  playerUserId,
  nowMs,
  hoveredInstanceId,
  wildlifeDamagedPlayerAtMs,
}: CheckingWildlifeNameTagShouldRevealParams): boolean {
  if (hoveredInstanceId === instance.instanceId) {
    return true;
  }

  if (
    checkingWildlifePointWithinRadiusGrid(
      instance.position,
      playerPosition,
      DEFINING_WILDLIFE_NAME_TAG_PROXIMITY_REVEAL_RADIUS_GRID
    ) &&
    checkingWildlifeNameTagIsInFrontOfPlayer(
      instance.position,
      playerPosition,
      playerFacingDirection
    )
  ) {
    return true;
  }

  if (
    checkingWildlifePlayerRevengeAggroIsActive({
      aggroState: instance.aggroState,
      playerUserId,
      nowMs,
    })
  ) {
    return true;
  }

  if (
    checkingWildlifeNameTagRecentCombatRevealIsActive(
      instance.aggroState.lastDamagedAtMs,
      nowMs
    )
  ) {
    return true;
  }

  if (
    checkingWildlifeNameTagRecentCombatRevealIsActive(
      wildlifeDamagedPlayerAtMs,
      nowMs
    )
  ) {
    return true;
  }

  return false;
}
