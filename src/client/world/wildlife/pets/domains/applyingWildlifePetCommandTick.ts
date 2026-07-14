/**
 * Overrides one wildlife instance's AI intent from its owner-issued command.
 *
 * @module components/world/wildlife/pets/domains/applyingWildlifePetCommandTick
 */

import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import type { DefiningWildlifeInstance } from '@/components/world/wildlife/domains/definingWildlifeTypes';
import { checkingWildlifePetMayAcceptCommand } from '@/components/world/wildlife/pets/domains/checkingWildlifePetMayAcceptCommand';
import { resolvingWildlifePetCommandIntent } from '@/components/world/wildlife/pets/domains/resolvingWildlifePetCommandIntent';

export type ApplyingWildlifePetCommandTickParams = {
  instance: DefiningWildlifeInstance;
  playerPosition: DefiningWorldPlazaWorldPoint | null;
  playerUserId: string | null;
  attackTargetInstanceId?: string | null;
  attackTargetPoint?: DefiningWorldPlazaWorldPoint | null;
  ownerWasAttacked?: boolean;
  attackerInstanceId?: string | null;
  attackerPoint?: DefiningWorldPlazaWorldPoint | null;
  nowMs: number;
};

/**
 * Call once per think-tick for the local player's owned pets. Rewrites the
 * instance's AI intent (and follow window / stay anchor) to match the active
 * pet-bond command; no-ops for instances without a bond owned by this player,
 * or below Friendly loyalty (before the `commandsStayFollow` capability
 * unlocks) so early Curious/Familiar bonds keep the natural docile
 * approach-react follow window instead of a forced permanent follow.
 */
export function applyingWildlifePetCommandTick({
  instance,
  playerPosition,
  playerUserId,
  nowMs,
  ...commandContext
}: ApplyingWildlifePetCommandTickParams): DefiningWildlifeInstance {
  const petBond = instance.petBond;

  if (
    !petBond ||
    !playerPosition ||
    !playerUserId ||
    petBond.ownerUserId !== playerUserId ||
    !checkingWildlifePetMayAcceptCommand(petBond.loyalty, 'follow')
  ) {
    return instance;
  }

  const resolved = resolvingWildlifePetCommandIntent({
    instance,
    playerPosition,
    playerUserId,
    nowMs,
    ...commandContext,
  });

  if (!resolved) {
    return instance;
  }

  return {
    ...instance,
    petBond:
      resolved.stayPoint === null
        ? petBond
        : { ...petBond, stayPoint: resolved.stayPoint },
    aiState: {
      ...instance.aiState,
      intent: resolved.intent,
      docileFollowUntilMs: resolved.docileFollowUntilMs,
      steeringCache: null,
    },
  };
}
