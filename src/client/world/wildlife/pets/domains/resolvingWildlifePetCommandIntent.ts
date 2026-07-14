/**
 * Resolves the wildlife AI intent a bonded pet should run under player command.
 *
 * @module components/world/wildlife/pets/domains/resolvingWildlifePetCommandIntent
 */

import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import type {
  DefiningWildlifeBehaviorIntent,
  DefiningWildlifeInstance,
} from '@/components/world/wildlife/domains/definingWildlifeTypes';
import { checkingWildlifePetMayAcceptCommand } from '@/components/world/wildlife/pets/domains/checkingWildlifePetMayAcceptCommand';

/** Follow window stamped far ahead so it reads as "until commanded otherwise". */
const DEFINING_WILDLIFE_PET_FOLLOW_HORIZON_MS = 365 * 24 * 60 * 60 * 1000;

export type ResolvingWildlifePetCommandIntentParams = {
  instance: DefiningWildlifeInstance;
  playerPosition: DefiningWorldPlazaWorldPoint;
  playerUserId: string;
  /** Live target for an issued "attack" command. */
  attackTargetInstanceId?: string | null;
  attackTargetPoint?: DefiningWorldPlazaWorldPoint | null;
  /** Recent hit-on-owner context for the "defend" command. */
  ownerWasAttacked?: boolean;
  attackerInstanceId?: string | null;
  attackerPoint?: DefiningWorldPlazaWorldPoint | null;
  nowMs: number;
};

export type ResolvingWildlifePetCommandIntentResult = {
  intent: DefiningWildlifeBehaviorIntent;
  docileFollowUntilMs: number | null;
  /** Non-null only for "stay"; callers should stamp this onto the pet bond. */
  stayPoint: DefiningWorldPlazaWorldPoint | null;
};

function resolvingWildlifePetFollowIntent(
  playerUserId: string,
  playerPosition: DefiningWorldPlazaWorldPoint,
  nowMs: number
): ResolvingWildlifePetCommandIntentResult {
  return {
    intent: {
      mode: 'followPlayer',
      targetInstanceId: playerUserId,
      targetPoint: playerPosition,
    },
    docileFollowUntilMs: nowMs + DEFINING_WILDLIFE_PET_FOLLOW_HORIZON_MS,
    stayPoint: null,
  };
}

/**
 * Maps the pet bond's active command to a behavior intent. Commands not yet
 * unlocked by loyalty fall back to "follow". Returns null when the instance
 * has no pet bond (not a companion).
 */
export function resolvingWildlifePetCommandIntent(
  params: ResolvingWildlifePetCommandIntentParams
): ResolvingWildlifePetCommandIntentResult | null {
  const { instance, playerPosition, playerUserId, nowMs } = params;
  const petBond = instance.petBond;

  if (!petBond) {
    return null;
  }

  const effectiveCommand = checkingWildlifePetMayAcceptCommand(
    petBond.loyalty,
    petBond.command
  )
    ? petBond.command
    : 'follow';

  if (effectiveCommand === 'stay') {
    const stayPoint = petBond.stayPoint ?? instance.position;

    return {
      intent: { mode: 'idle', targetPoint: stayPoint },
      docileFollowUntilMs: null,
      stayPoint,
    };
  }

  if (effectiveCommand === 'attack') {
    if (params.attackTargetInstanceId && params.attackTargetPoint) {
      return {
        intent: {
          mode: 'chase',
          targetInstanceId: params.attackTargetInstanceId,
          targetPoint: params.attackTargetPoint,
        },
        docileFollowUntilMs: null,
        stayPoint: null,
      };
    }

    return resolvingWildlifePetFollowIntent(playerUserId, playerPosition, nowMs);
  }

  if (effectiveCommand === 'defend') {
    if (
      params.ownerWasAttacked &&
      params.attackerInstanceId &&
      params.attackerPoint
    ) {
      return {
        intent: {
          mode: 'chase',
          targetInstanceId: params.attackerInstanceId,
          targetPoint: params.attackerPoint,
        },
        docileFollowUntilMs: null,
        stayPoint: null,
      };
    }

    return resolvingWildlifePetFollowIntent(playerUserId, playerPosition, nowMs);
  }

  return resolvingWildlifePetFollowIntent(playerUserId, playerPosition, nowMs);
}
