/**
 * Whether a stalker is quietly trailing prey instead of rushing.
 *
 * @module components/world/wildlife/domains/checkingWildlifeStalkerIsShadowingPrey
 */

import { checkingWildlifeStalkKillConditions } from '@/components/world/wildlife/domains/checkingWildlifeStalkKillConditions';
import type { DefiningWildlifeSpeciesDefinition } from '@/components/world/wildlife/domains/definingWildlifeSpeciesRegistry';
import type { DefiningWildlifeAggroState } from '@/components/world/wildlife/domains/definingWildlifeTypes';

export type CheckingWildlifeStalkerIsShadowingPreyParams = {
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
export function checkingWildlifeStalkerIsShadowingPrey({
  species,
  aggroState,
  preyTargetId,
  preyHealthRatio,
  preyStaminaRatio,
  preyStaminaIsDepleted,
  preyStillDurationMs,
  stalkingElapsedMs,
}: CheckingWildlifeStalkerIsShadowingPreyParams): boolean {
  if (species.temperamentId !== 'stalker') {
    return false;
  }

  if (aggroState.activeTargetId !== preyTargetId) {
    return false;
  }

  if (
    aggroState.stalkPackResponse === 'flee' ||
    aggroState.stalkPackResponse === 'enrage'
  ) {
    return false;
  }

  if (
    aggroState.stalkAttackingPreySinceMs !== null &&
    aggroState.stalkAttackingPreySinceMs !== undefined
  ) {
    return false;
  }

  if (
    checkingWildlifeStalkKillConditions({
      preyHealthRatio,
      preyStaminaRatio,
      preyStaminaIsDepleted,
      preyStillDurationMs,
      stalkingElapsedMs,
    })
  ) {
    return false;
  }

  return (
    stalkingElapsedMs > 0 ||
    aggroState.stalkingPreySinceMs !== null
  );
}
