/**
 * Whether a PackHunter is quietly trailing prey instead of rushing.
 *
 * @module components/world/wildlife/domains/checkingWildlifePackHunterIsShadowingPrey
 */

import { checkingWildlifeStalkPhaseIsShadowing } from '@/components/world/wildlife/domains/checkingWildlifeStalkPhase';
import type { DefiningWildlifeSpeciesDefinition } from '@/components/world/wildlife/domains/definingWildlifeSpeciesRegistry';
import type { DefiningWildlifeAggroState } from '@/components/world/wildlife/domains/definingWildlifeTypes';

export type CheckingWildlifePackHunterIsShadowingPreyParams = {
  species: DefiningWildlifeSpeciesDefinition;
  aggroState: DefiningWildlifeAggroState;
  preyTargetId: string;
  preyHealthRatio: number | null;
  preyStaminaRatio: number | null;
  preyStaminaIsDepleted: boolean;
  preyStillDurationMs: number;
  stalkingElapsedMs: number;
};

/** True when the hunter is shadowing prey, not in an attack rush or kill window. */
export function checkingWildlifePackHunterIsShadowingPrey({
  species,
  aggroState,
  preyTargetId,
}: CheckingWildlifePackHunterIsShadowingPreyParams): boolean {
  if (species.temperamentId !== 'pack_hunter' && species.temperamentId !== 'stalker') {
    return false;
  }

  if (aggroState.activeTargetId !== preyTargetId) {
    return false;
  }

  return checkingWildlifeStalkPhaseIsShadowing(aggroState);
}
