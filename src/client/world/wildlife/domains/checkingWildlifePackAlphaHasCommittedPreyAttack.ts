/**
 * Whether the pack alpha has started rushing or striking the prey.
 *
 * @module components/world/wildlife/domains/checkingWildlifePackAlphaHasCommittedPreyAttack
 */

import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import { DEFINING_WILDLIFE_MELEE_RANGE_GRID } from '@/components/world/wildlife/domains/definingWildlifeAggroConstants';
import type { DefiningWildlifeInstance } from '@/components/world/wildlife/domains/definingWildlifeTypes';

export type CheckingWildlifePackAlphaHasCommittedPreyAttackParams = {
  alpha: DefiningWildlifeInstance;
  preyTargetId: string;
  preyPosition: DefiningWorldPlazaWorldPoint;
};

/** True once the alpha closes on the prey or lands the opening hit. */
export function checkingWildlifePackAlphaHasCommittedPreyAttack({
  alpha,
  preyTargetId,
  preyPosition,
}: CheckingWildlifePackAlphaHasCommittedPreyAttackParams): boolean {
  if (
    alpha.aggroState.stalkAttackingPreySinceMs !== null &&
    alpha.aggroState.stalkAttackingPreySinceMs !== undefined
  ) {
    return true;
  }

  // Attack phase means the alpha already committed; followers must not wait for
  // a chase targetPoint that still points at a flank slot mid-repath.
  if (
    alpha.aggroState.stalkPhase === 'attacking' &&
    (alpha.aggroState.activeTargetId === preyTargetId ||
      alpha.aggroState.stalkLockedPreyTargetId === preyTargetId)
  ) {
    return true;
  }

  const intent = alpha.aiState.intent;

  if (intent.mode === 'attack' && intent.targetInstanceId === preyTargetId) {
    return true;
  }

  if (
    intent.mode === 'chase' &&
    intent.targetInstanceId === preyTargetId &&
    intent.targetPoint
  ) {
    const distanceToPrey = Math.hypot(
      intent.targetPoint.x - preyPosition.x,
      intent.targetPoint.y - preyPosition.y
    );

    return distanceToPrey <= DEFINING_WILDLIFE_MELEE_RANGE_GRID * 1.5;
  }

  return false;
}
