/**
 * Whether a stalker is still in the quiet shadow phase on the player.
 *
 * @module components/world/wildlife/domains/checkingWildlifeStalkerIsShadowingPlayer
 */

import { checkingWildlifeStalkKillConditions } from '@/components/world/wildlife/domains/checkingWildlifeStalkKillConditions';
import type { DefiningWildlifeSpeciesDefinition } from '@/components/world/wildlife/domains/definingWildlifeSpeciesRegistry';
import type { DefiningWildlifeAggroState } from '@/components/world/wildlife/domains/definingWildlifeTypes';

export type CheckingWildlifeStalkerIsShadowingPlayerParams = {
  species: DefiningWildlifeSpeciesDefinition;
  aggroState: DefiningWildlifeAggroState;
  playerUserId: string | null;
  playerHealthRatio: number | null;
  playerStaminaRatio: number | null;
  playerStaminaIsDepleted: boolean;
  playerStillDurationMs: number;
  stalkingElapsedMs: number;
};

/** True while shadowing before a rush, flee, or enrage response. */
export function checkingWildlifeStalkerIsShadowingPlayer({
  species,
  aggroState,
  playerUserId,
  playerHealthRatio,
  playerStaminaRatio,
  playerStaminaIsDepleted,
  playerStillDurationMs,
  stalkingElapsedMs,
}: CheckingWildlifeStalkerIsShadowingPlayerParams): boolean {
  if (species.temperamentId !== 'stalker') {
    return false;
  }

  if (!playerUserId || aggroState.activeTargetId !== playerUserId) {
    return false;
  }

  if (aggroState.stalkPackResponse) {
    return false;
  }

  if (
    aggroState.stalkAttackingPreySinceMs !== null &&
    aggroState.stalkAttackingPreySinceMs !== undefined
  ) {
    return false;
  }

  return !checkingWildlifeStalkKillConditions({
    preyHealthRatio: playerHealthRatio,
    preyStaminaRatio: playerStaminaRatio,
    preyStaminaIsDepleted: playerStaminaIsDepleted,
    preyStillDurationMs: playerStillDurationMs,
    stalkingElapsedMs,
  });
}
