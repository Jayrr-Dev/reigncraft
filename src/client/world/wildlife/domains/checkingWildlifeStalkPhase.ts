/**
 * Thin phase predicates for stalker behavior and damage checks.
 *
 * @module components/world/wildlife/domains/checkingWildlifeStalkPhase
 */

import {
  DEFINING_WILDLIFE_STALK_KILL_WINDOW_PHASES,
  DEFINING_WILDLIFE_STALK_PHASE_IDLE,
  DEFINING_WILDLIFE_STALK_SHADOWING_PHASES,
  type DefiningWildlifeStalkPhase,
} from '@/components/world/wildlife/domains/definingWildlifeStalkPhaseTypes';
import type { DefiningWildlifeAggroState } from '@/components/world/wildlife/domains/definingWildlifeTypes';

/** Returns the stored stalk phase, defaulting to idle. */
export function resolvingWildlifeStalkPhaseOrIdle(
  aggroState: DefiningWildlifeAggroState
): DefiningWildlifeStalkPhase {
  return aggroState.stalkPhase ?? DEFINING_WILDLIFE_STALK_PHASE_IDLE;
}

function resolvingPhase(
  aggroState: DefiningWildlifeAggroState
): DefiningWildlifeStalkPhase {
  return resolvingWildlifeStalkPhaseOrIdle(aggroState);
}

export function checkingWildlifeStalkPhaseIsIdle(
  aggroState: DefiningWildlifeAggroState
): boolean {
  return resolvingPhase(aggroState) === 'idle';
}

export function checkingWildlifeStalkPhaseIsShadowing(
  aggroState: DefiningWildlifeAggroState
): boolean {
  return DEFINING_WILDLIFE_STALK_SHADOWING_PHASES.includes(
    resolvingPhase(aggroState)
  );
}

export function checkingWildlifeStalkPhaseKillWindowOpen(
  aggroState: DefiningWildlifeAggroState
): boolean {
  return DEFINING_WILDLIFE_STALK_KILL_WINDOW_PHASES.includes(
    resolvingPhase(aggroState)
  );
}

export function checkingWildlifeStalkPhaseIsFormingUp(
  aggroState: DefiningWildlifeAggroState
): boolean {
  return resolvingPhase(aggroState) === 'formingUp';
}

export function checkingWildlifeStalkPhaseIsFleeing(
  aggroState: DefiningWildlifeAggroState
): boolean {
  return resolvingPhase(aggroState) === 'fleeing';
}

export function checkingWildlifeStalkPhaseIsRegrouping(
  aggroState: DefiningWildlifeAggroState
): boolean {
  return resolvingPhase(aggroState) === 'regrouping';
}

export function checkingWildlifeStalkPhaseIsAttacking(
  aggroState: DefiningWildlifeAggroState
): boolean {
  return resolvingPhase(aggroState) === 'attacking';
}

export function checkingWildlifeStalkPhaseIsSurrounding(
  aggroState: DefiningWildlifeAggroState
): boolean {
  return resolvingPhase(aggroState) === 'surrounding';
}

export function checkingWildlifeStalkPhaseIsRetreating(
  aggroState: DefiningWildlifeAggroState
): boolean {
  return resolvingPhase(aggroState) === 'retreating';
}
