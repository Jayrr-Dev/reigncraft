/**
 * Whether a PackHunter is still in the quiet shadow phase on the player.
 *
 * @module components/world/wildlife/domains/checkingWildlifePackHunterIsShadowingPlayer
 */

import { checkingWildlifeStalkPhaseIsShadowing } from '@/components/world/wildlife/domains/checkingWildlifeStalkPhase';
import type { DefiningWildlifeSpeciesDefinition } from '@/components/world/wildlife/domains/definingWildlifeSpeciesRegistry';
import type { DefiningWildlifeAggroState } from '@/components/world/wildlife/domains/definingWildlifeTypes';

export type CheckingWildlifePackHunterIsShadowingPlayerParams = {
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
export function checkingWildlifePackHunterIsShadowingPlayer({
  species,
  aggroState,
  playerUserId,
}: CheckingWildlifePackHunterIsShadowingPlayerParams): boolean {
  if (species.temperamentId !== 'pack_hunter' && species.temperamentId !== 'stalker') {
    return false;
  }

  if (!playerUserId || aggroState.activeTargetId !== playerUserId) {
    return false;
  }

  return checkingWildlifeStalkPhaseIsShadowing(aggroState);
}
