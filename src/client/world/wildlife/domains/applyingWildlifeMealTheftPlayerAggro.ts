/**
 * Hard player aggro when someone steals a meal mid-chew.
 *
 * @module components/world/wildlife/domains/applyingWildlifeMealTheftPlayerAggro
 */

import { applyingWildlifeFavoritePreyThreatBoost } from '@/components/world/wildlife/domains/applyingWildlifeFavoritePreyThreatBoost';
import { DEFINING_WILDLIFE_MEAL_THEFT_PLAYER_AGGRO_MS } from '@/components/world/wildlife/domains/definingWildlifeMealTheftConstants';
import type { DefiningWildlifeInstance } from '@/components/world/wildlife/domains/definingWildlifeTypes';
import { resolvingWildlifeAggroLastAggroedAtMs } from '@/components/world/wildlife/domains/resolvingWildlifeAggroLastAggroedAtMs';

export type ApplyingWildlifeMealTheftPlayerAggroParams = {
  instance: DefiningWildlifeInstance;
  playerTargetId: string;
  nowMs: number;
};

/**
 * Drops the feed lock and locks onto the player until death (or player death clear).
 */
export function applyingWildlifeMealTheftPlayerAggro({
  instance,
  playerTargetId,
  nowMs,
}: ApplyingWildlifeMealTheftPlayerAggroParams): DefiningWildlifeInstance {
  const threats = applyingWildlifeFavoritePreyThreatBoost({
    threats: instance.aggroState.threats,
    preyTargetId: playerTargetId,
    nowMs,
  });

  return {
    ...instance,
    aggroState: {
      ...instance.aggroState,
      threats,
      activeTargetId: playerTargetId,
      lastDamagedAtMs: nowMs,
      lastAggroedAtMs: resolvingWildlifeAggroLastAggroedAtMs(
        instance.aggroState.lastAggroedAtMs,
        playerTargetId,
        nowMs
      ),
      stalkLockedPreyTargetId: playerTargetId,
      playerRevengeAggroUntilMs:
        nowMs + DEFINING_WILDLIFE_MEAL_THEFT_PLAYER_AGGRO_MS,
      stalkingPreySinceMs: nowMs,
      stalkAttackingPreySinceMs: null,
    },
    aiState: {
      ...instance.aiState,
      feedingOnKillUntilMs: null,
      feedingOnKillGroundItemId: null,
      pendingGroundFoodBite: null,
      intent: {
        mode: 'chase',
        targetInstanceId: playerTargetId,
        targetPoint: instance.position,
      },
      isMoving: true,
      motionClip: 'run',
      chargeWindupStartedAtMs: null,
      fleeTargetPoint: null,
      steeringCache: null,
    },
  };
}
