/**
 * Intent key formatting for steering cache invalidation.
 *
 * @module components/world/wildlife/domains/formattingWildlifeIntentKey
 */

import type { DefiningWildlifeBehaviorIntent } from '@/components/world/wildlife/domains/definingWildlifeTypes';

/**
 * Builds a stable string key from the current behavior intent.
 */
export function formattingWildlifeIntentKey(
  intent: DefiningWildlifeBehaviorIntent
): string {
  if (
    intent.mode === 'chase' ||
    intent.mode === 'attack' ||
    intent.mode === 'stalk'
  ) {
    const facingSuffix =
      intent.mode === 'stalk' && intent.facingPoint !== undefined
        ? `:face:${intent.facingPoint.x.toFixed(2)}:${intent.facingPoint.y.toFixed(2)}`
        : '';

    return `${intent.mode}:${intent.targetInstanceId}:${intent.targetPoint.x.toFixed(2)}:${intent.targetPoint.y.toFixed(2)}${facingSuffix}`;
  }

  if (intent.mode === 'territoryWarn') {
    return `${intent.mode}:${intent.targetInstanceId}:${intent.targetPoint.x.toFixed(2)}:${intent.targetPoint.y.toFixed(2)}`;
  }

  if (intent.mode === 'forageChase' || intent.mode === 'forageEat') {
    return `${intent.mode}:${intent.targetGroundItemId}:${intent.targetPoint.x.toFixed(2)}:${intent.targetPoint.y.toFixed(2)}`;
  }

  if (
    intent.mode === 'flee' ||
    intent.mode === 'wander' ||
    intent.mode === 'return'
  ) {
    const targetPoint = intent.targetPoint;

    if (!targetPoint) {
      return intent.mode;
    }

    return `${intent.mode}:${targetPoint.x.toFixed(2)}:${targetPoint.y.toFixed(2)}`;
  }

  return intent.mode;
}
