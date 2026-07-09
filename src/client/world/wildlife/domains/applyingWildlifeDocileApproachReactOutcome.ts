/**
 * Applies docile approach-react timer side effects after behavior evaluation.
 *
 * @module components/world/wildlife/domains/applyingWildlifeDocileApproachReactOutcome
 */

import { checkingWildlifeSpeciesIsDocile } from '@/components/world/wildlife/domains/checkingWildlifeSpeciesIsDocile';
import { checkingWildlifeIntentIsDocileFollowPlayer } from '@/components/world/wildlife/domains/checkingWildlifeIntentIsDocileFollowPlayer';
import { checkingWildlifeShouldDocileApproachReact } from '@/components/world/wildlife/domains/checkingWildlifeShouldDocileApproachReact';
import { computingWildlifeDocileFollowDurationMs } from '@/components/world/wildlife/domains/computingWildlifeDocileFollowDurationMs';
import type { DefiningWildlifeBehaviorBlackboard } from '@/components/world/wildlife/domains/definingWildlifeBehaviorConditionRegistry';
import type {
  DefiningWildlifeBehaviorIntent,
  DefiningWildlifeInstance,
} from '@/components/world/wildlife/domains/definingWildlifeTypes';

export type ApplyingWildlifeDocileApproachReactOutcomeParams = {
  instance: DefiningWildlifeInstance;
  species: DefiningWildlifeBehaviorBlackboard['species'];
  intent: DefiningWildlifeBehaviorIntent;
  blackboard: DefiningWildlifeBehaviorBlackboard;
  nowMs: number;
};

function resolvingWildlifeDocileApproachAnchorFromInstance(
  instance: DefiningWildlifeInstance
): { tileX: number; tileY: number; packIndex: number } {
  const tileX = Math.floor(instance.spawnAnchor.x);
  const tileY = Math.floor(instance.spawnAnchor.y);
  const packIndexMatch = instance.anchorId.match(/:(\d+)$/);
  const packIndex = packIndexMatch ? Number(packIndexMatch[1]) : 0;

  return { tileX, tileY, packIndex };
}

/**
 * Stamps react cooldown and follow window when the docile approach branch fired.
 */
export function applyingWildlifeDocileApproachReactOutcome({
  instance,
  species,
  intent,
  blackboard,
  nowMs,
}: ApplyingWildlifeDocileApproachReactOutcomeParams): DefiningWildlifeInstance {
  if (!checkingWildlifeSpeciesIsDocile(species)) {
    return instance;
  }

  const wasApproachReactFrame = checkingWildlifeShouldDocileApproachReact({
    ...blackboard,
    instance,
  });

  if (!wasApproachReactFrame) {
    return instance;
  }

  if (checkingWildlifeIntentIsDocileFollowPlayer(intent)) {
    const followDurationMs = computingWildlifeDocileFollowDurationMs(
      resolvingWildlifeDocileApproachAnchorFromInstance(instance),
      Math.floor(nowMs / 1000)
    );

    return {
      ...instance,
      aiState: {
        ...instance.aiState,
        docileLastReactAtMs: nowMs,
        docileFollowUntilMs: nowMs + followDurationMs,
      },
    };
  }

  if (intent.mode === 'flee') {
    return {
      ...instance,
      aiState: {
        ...instance.aiState,
        docileLastReactAtMs: nowMs,
        docileFollowUntilMs: null,
      },
    };
  }

  return instance;
}

/**
 * Clears an expired follow window so graze/wander can resume.
 */
export function clearingWildlifeDocileExpiredFollowTimer(
  instance: DefiningWildlifeInstance,
  nowMs: number
): DefiningWildlifeInstance {
  const followUntilMs = instance.aiState.docileFollowUntilMs;

  if (followUntilMs === null || followUntilMs > nowMs) {
    return instance;
  }

  return {
    ...instance,
    aiState: {
      ...instance.aiState,
      docileFollowUntilMs: null,
    },
  };
}
