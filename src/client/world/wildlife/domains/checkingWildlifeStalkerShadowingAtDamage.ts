/**
 * Whether prey damage landed during quiet stalk shadowing.
 *
 * @module components/world/wildlife/domains/checkingWildlifeStalkerShadowingAtDamage
 */

import { checkingWildlifeStalkerIsShadowingPrey } from '@/components/world/wildlife/domains/checkingWildlifeStalkerIsShadowingPrey';
import type { DefiningWildlifeSpeciesDefinition } from '@/components/world/wildlife/domains/definingWildlifeSpeciesRegistry';
import type { DefiningWildlifeInstance } from '@/components/world/wildlife/domains/definingWildlifeTypes';

export type CheckingWildlifeStalkerShadowingAtDamageParams = {
  instance: DefiningWildlifeInstance;
  species: DefiningWildlifeSpeciesDefinition;
  preyTargetId: string;
  nowMs: number;
  preyHealthRatio?: number | null;
  preyStaminaRatio?: number | null;
  preyStaminaIsDepleted?: boolean;
  preyStillDurationMs?: number;
};

/** True when the hunter was shadowing, not rushing, when the prey struck. */
export function checkingWildlifeStalkerShadowingAtDamage({
  instance,
  species,
  preyTargetId,
  nowMs,
  preyHealthRatio = null,
  preyStaminaRatio = null,
  preyStaminaIsDepleted = false,
  preyStillDurationMs = 0,
}: CheckingWildlifeStalkerShadowingAtDamageParams): boolean {
  if (
    instance.aggroState.stalkLockedPreyTargetId &&
    preyTargetId !== instance.aggroState.stalkLockedPreyTargetId
  ) {
    return false;
  }

  if (instance.aggroState.activeTargetId !== preyTargetId) {
    return false;
  }

  const stalkingPreySinceMs = instance.aggroState.stalkingPreySinceMs;
  const stalkingElapsedMs =
    stalkingPreySinceMs === null || stalkingPreySinceMs === undefined
      ? 0
      : Math.max(0, nowMs - stalkingPreySinceMs);

  return checkingWildlifeStalkerIsShadowingPrey({
    species,
    aggroState: instance.aggroState,
    preyTargetId,
    preyHealthRatio,
    preyStaminaRatio,
    preyStaminaIsDepleted,
    preyStillDurationMs,
    stalkingElapsedMs,
  });
}
