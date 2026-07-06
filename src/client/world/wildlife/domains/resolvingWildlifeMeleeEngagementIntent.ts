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
};

/**
 * Converts an in-range chase into an attack so predators swing every frame,
 * not only on behavior-tree think ticks.
 */
export function resolvingWildlifeMeleeEngagementIntent({
  intent,
  position,
  targetPosition,
}: ResolvingWildlifeMeleeEngagementIntentParams): DefiningWildlifeBehaviorIntent {
  if (intent.mode !== 'chase' || !intent.targetInstanceId || !targetPosition) {
    return intent;
  }

  const distance = Math.hypot(
    targetPosition.x - position.x,
    targetPosition.y - position.y
  );

  if (distance > DEFINING_WILDLIFE_MELEE_RANGE_GRID) {
    return intent;
  }

  return {
    mode: 'attack',
    targetInstanceId: intent.targetInstanceId,
    targetPoint: targetPosition,
  };
}
