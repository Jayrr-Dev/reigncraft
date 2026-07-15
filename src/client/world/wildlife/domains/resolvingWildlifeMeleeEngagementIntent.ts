/**
 * Upgrades chase intents into melee attack when the target is in range.
 *
 * @module components/world/wildlife/domains/resolvingWildlifeMeleeEngagementIntent
 */

import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import { DEFINING_WILDLIFE_MELEE_RANGE_GRID } from '@/components/world/wildlife/domains/definingWildlifeAggroConstants';
import type { DefiningWildlifeBehaviorIntent } from '@/components/world/wildlife/domains/definingWildlifeTypes';

export type ResolvingWildlifeMeleeEngagementIntentParams = {
  intent: DefiningWildlifeBehaviorIntent;
  position: DefiningWorldPlazaWorldPoint;
  targetPosition: DefiningWorldPlazaWorldPoint | null;
  /**
   * Override engagement radius (grid). Used by ranged casters so chase upgrades
   * to attack at cast range instead of melee range.
   */
  engagementRangeGrid?: number;
};

/**
 * Converts an in-range chase into an attack so predators swing every frame,
 * not only on behavior-tree think ticks. Also downgrades attack back to chase
 * when the live target leaves melee so animals keep closing instead of
 * swinging at air (common after a pounce lands short of a moving player).
 */
export function resolvingWildlifeMeleeEngagementIntent({
  intent,
  position,
  targetPosition,
  engagementRangeGrid = DEFINING_WILDLIFE_MELEE_RANGE_GRID,
}: ResolvingWildlifeMeleeEngagementIntentParams): DefiningWildlifeBehaviorIntent {
  if (
    (intent.mode !== 'chase' && intent.mode !== 'attack') ||
    !intent.targetInstanceId ||
    !targetPosition
  ) {
    return intent;
  }

  const distance = Math.hypot(
    targetPosition.x - position.x,
    targetPosition.y - position.y
  );

  if (distance > engagementRangeGrid) {
    if (intent.mode === 'attack') {
      return {
        mode: 'chase',
        targetInstanceId: intent.targetInstanceId,
        targetPoint: targetPosition,
      };
    }

    return intent;
  }

  return {
    mode: 'attack',
    targetInstanceId: intent.targetInstanceId,
    targetPoint: targetPosition,
  };
}
