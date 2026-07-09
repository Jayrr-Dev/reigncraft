/**
 * Maintains the post-kill feeding lock and forage intent each simulation tick.
 *
 * @module components/world/wildlife/domains/advancingWildlifeHunterKillFeedingTick
 */

import type { DefiningWildlifeInstance } from '@/components/world/wildlife/domains/definingWildlifeTypes';
import { listingWildlifeGroundFoodItems } from '@/components/world/wildlife/domains/managingWildlifeGroundFoodBridge';
import { resolvingWildlifeGroundFoodWorldPoint } from '@/components/world/wildlife/domains/resolvingWildlifeGroundFoodWorldPoint';

function clearingWildlifeHunterKillFeeding(
  instance: DefiningWildlifeInstance
): DefiningWildlifeInstance {
  return {
    ...instance,
    aiState: {
      ...instance.aiState,
      feedingOnKillUntilMs: null,
      feedingOnKillGroundItemId: null,
      intent: { mode: 'idle' },
      isMoving: false,
      motionClip: 'idle',
      steeringCache: null,
    },
  };
}

/**
 * Keeps the hunter on its kill meal until the feeding window ends or the meat is gone.
 */
export function advancingWildlifeHunterKillFeedingTick(
  instance: DefiningWildlifeInstance,
  nowMs: number
): DefiningWildlifeInstance {
  const feedingUntilMs = instance.aiState.feedingOnKillUntilMs;
  const groundItemId = instance.aiState.feedingOnKillGroundItemId;

  if (!feedingUntilMs || !groundItemId || nowMs >= feedingUntilMs) {
    return clearingWildlifeHunterKillFeeding(instance);
  }

  const groundItem = listingWildlifeGroundFoodItems(nowMs).find(
    (entry) => entry.id === groundItemId
  );

  if (!groundItem || groundItem.quantity <= 0) {
    return clearingWildlifeHunterKillFeeding(instance);
  }

  const targetPoint = resolvingWildlifeGroundFoodWorldPoint(groundItem);

  return {
    ...instance,
    aggroState: {
      threats: [],
      activeTargetId: null,
      lastDamagedAtMs: instance.aggroState.lastDamagedAtMs,
    },
    aiState: {
      ...instance.aiState,
      intent: {
        mode: 'forageEat',
        targetGroundItemId: groundItemId,
        targetPoint,
      },
      chargeWindupStartedAtMs: null,
      hasUsedBluffCharge: false,
      bluffChargePlayerExitedTerritory: false,
      bluffReturnPoint: null,
      fleeTargetPoint: null,
      isMoving: false,
      motionClip: instance.aiState.motionClip === 'attack' ? 'attack' : 'idle',
      steeringCache: null,
    },
  };
}
