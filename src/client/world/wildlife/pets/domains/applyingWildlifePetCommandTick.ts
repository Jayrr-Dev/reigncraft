/**
 * Overrides one wildlife instance's AI intent from its owner-issued command.
 *
 * @module components/world/wildlife/pets/domains/applyingWildlifePetCommandTick
 */

import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import type { DefiningWildlifeInstance } from '@/components/world/wildlife/domains/definingWildlifeTypes';
import { checkingWildlifePetAllied } from '@/components/world/wildlife/pets/domains/checkingWildlifePetAllied';
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
 * pet-bond command.
 *
 * Familiar+ (`allied`) companions permanently trail the owner (default follow).
 * Curious/Comfortable bonds skip this path so they keep temporary docile
 * approach-react follow windows. Stay / Attack / Defend still require their
 * higher loyalty capabilities inside {@link resolvingWildlifePetCommandIntent}.
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
    !checkingWildlifePetAllied(instance)
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
