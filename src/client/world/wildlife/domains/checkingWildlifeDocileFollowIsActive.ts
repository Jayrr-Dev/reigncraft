/**
 * True while a docile animal is in its temporary follow window.
 *
 * @module components/world/wildlife/domains/checkingWildlifeDocileFollowIsActive
 */

import type { DefiningWildlifeInstance } from '@/components/world/wildlife/domains/definingWildlifeTypes';

export function checkingWildlifeDocileFollowIsActive(
  instance: Pick<DefiningWildlifeInstance, 'aiState'>,
  nowMs: number
): boolean {
  const followUntilMs = instance.aiState.docileFollowUntilMs;

  return followUntilMs !== null && followUntilMs > nowMs;
}
