/**
 * Derives an already-committed pack roll from stalk phases (no stalkPackResponse).
 *
 * @module components/world/wildlife/domains/resolvingWildlifeStalkPackCommittedRoll
 */

import { DEFINING_WILDLIFE_STALK_PHASE_IDLE } from '@/components/world/wildlife/domains/definingWildlifeStalkPhaseTypes';
import type {
  DefiningWildlifeInstance,
  DefiningWildlifeStalkPackResponseKind,
} from '@/components/world/wildlife/domains/definingWildlifeTypes';

function resolvingCommittedRollFromPhase(
  phase: string | undefined
): DefiningWildlifeStalkPackResponseKind | null {
  if (phase === 'fleeing') {
    return 'flee';
  }

  if (phase === 'regrouping') {
    return 'regroup';
  }

  if (phase === 'attacking') {
    return 'enrage';
  }

  return null;
}

/** Returns the pack's committed damage/approach roll, if any packmate already transitioned. */
export function resolvingWildlifeStalkPackCommittedRoll(
  packmates: readonly DefiningWildlifeInstance[]
): DefiningWildlifeStalkPackResponseKind | null {
  for (const packmate of packmates) {
    const roll = resolvingCommittedRollFromPhase(packmate.aggroState.stalkPhase);

    if (roll) {
      return roll;
    }
  }

  return null;
}

/** True when any packmate has left shadowing via a committed flee/enrage/regroup roll. */
export function checkingWildlifeStalkPackHasCommittedRoll(
  packmates: readonly DefiningWildlifeInstance[]
): boolean {
  return resolvingWildlifeStalkPackCommittedRoll(packmates) !== null;
}

/** True when this instance's phase reflects a committed pack roll outcome. */
export function checkingWildlifeStalkInstanceHasCommittedRoll(
  instance: DefiningWildlifeInstance
): boolean {
  const phase = instance.aggroState.stalkPhase ?? DEFINING_WILDLIFE_STALK_PHASE_IDLE;

  return phase === 'fleeing' || phase === 'regrouping' || phase === 'attacking';
}
