/**
 * Derives stalk phase from legacy aggro fields for migration assertions.
 *
 * @module components/world/wildlife/domains/resolvingWildlifeStalkPhase
 */

import {
  checkingWildlifeStalkConfidentAssaultReady,
  checkingWildlifeStalkPackIsConfident,
} from '@/components/world/wildlife/domains/checkingWildlifeStalkConfidentPack';
import { checkingWildlifeStalkAttackPhaseExpired } from '@/components/world/wildlife/domains/checkingWildlifeStalkAttackPhaseExpired';
import {
  checkingWildlifeStalkKillConditions,
  checkingWildlifeStalkPackSurroundCommit,
} from '@/components/world/wildlife/domains/checkingWildlifeStalkKillConditions';
import type { DefiningWildlifeStalkPreyContext } from '@/components/world/wildlife/domains/definingWildlifeStalkPreyTypes';
import {
  DEFINING_WILDLIFE_STALK_PHASE_IDLE,
  type DefiningWildlifeStalkPhase,
} from '@/components/world/wildlife/domains/definingWildlifeStalkPhaseTypes';
import type { DefiningWildlifeAggroState } from '@/components/world/wildlife/domains/definingWildlifeTypes';

export type ResolvingWildlifeStalkPhaseParams = {
  aggroState: DefiningWildlifeAggroState;
  prey: DefiningWildlifeStalkPreyContext | null;
  stalkingElapsedMs: number;
  stalkPackCount: number;
  nowMs: number;
};

/** Pure fallback that infers phase from timers and legacy response flags. */
export function resolvingWildlifeStalkPhase({
  aggroState,
  prey,
  stalkingElapsedMs,
  stalkPackCount,
  nowMs,
}: ResolvingWildlifeStalkPhaseParams): DefiningWildlifeStalkPhase {
  if (aggroState.stalkPhase) {
    return aggroState.stalkPhase;
  }

  const legacyPackResponse = aggroState.stalkPackResponse;

  if (!aggroState.activeTargetId || !prey) {
    return DEFINING_WILDLIFE_STALK_PHASE_IDLE;
  }

  if (legacyPackResponse === 'flee') {
    return 'fleeing';
  }

  if (aggroState.stalkPlayerApproachState) {
    return 'retreating';
  }

  if (legacyPackResponse === 'regroup') {
    return 'regrouping';
  }

  if (
    legacyPackResponse === 'enrage' ||
    (aggroState.stalkAttackingPreySinceMs !== null &&
      aggroState.stalkAttackingPreySinceMs !== undefined &&
      !checkingWildlifeStalkAttackPhaseExpired({
        stalkAttackingPreySinceMs: aggroState.stalkAttackingPreySinceMs,
        nowMs,
      }))
  ) {
    return 'attacking';
  }

  if (
    (aggroState.stalkConfidentSinceMs ?? null) !== null &&
    checkingWildlifeStalkPackIsConfident(stalkPackCount) &&
    !checkingWildlifeStalkConfidentAssaultReady({
      stalkConfidentSinceMs: aggroState.stalkConfidentSinceMs,
      preyTargetId: prey.targetId,
      nowMs,
    })
  ) {
    return 'formingUp';
  }

  const killWindowOpen =
    checkingWildlifeStalkConfidentAssaultReady({
      stalkConfidentSinceMs: aggroState.stalkConfidentSinceMs,
      preyTargetId: prey.targetId,
      nowMs,
    }) ||
    checkingWildlifeStalkKillConditions({
      preyHealthRatio: prey.healthRatio,
      preyStaminaRatio: prey.staminaRatio,
      preyStaminaIsDepleted: prey.staminaIsDepleted,
      preyStillDurationMs: prey.stillDurationMs,
      stalkingElapsedMs,
    });

  if (
    killWindowOpen &&
    checkingWildlifeStalkPackSurroundCommit({
      preyHealthRatio: prey.healthRatio,
      preyStaminaRatio: prey.staminaRatio,
      preyStaminaIsDepleted: prey.staminaIsDepleted,
      preyStillDurationMs: prey.stillDurationMs,
      stalkPackCount,
      stalkingElapsedMs,
    })
  ) {
    return 'surrounding';
  }

  if (killWindowOpen) {
    return 'attacking';
  }

  if ((aggroState.stalkingPreySinceMs ?? null) !== null) {
    return 'shadowing';
  }

  return DEFINING_WILDLIFE_STALK_PHASE_IDLE;
}

/** Returns the stored phase, defaulting to idle. */
export function resolvingWildlifeStalkPhaseOrIdle(
  aggroState: DefiningWildlifeAggroState
): DefiningWildlifeStalkPhase {
  return aggroState.stalkPhase ?? DEFINING_WILDLIFE_STALK_PHASE_IDLE;
}
