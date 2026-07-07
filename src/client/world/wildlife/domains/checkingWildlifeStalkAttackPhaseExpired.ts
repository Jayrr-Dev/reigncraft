/**
 * Whether a stalk rush has failed to kill the player within its time limit.
 *
 * @module components/world/wildlife/domains/checkingWildlifeStalkAttackPhaseExpired
 */

import { DEFINING_WILDLIFE_STALK_ATTACK_KILL_TIMEOUT_MS } from '@/components/world/wildlife/domains/definingWildlifeStalkConstants';

export type CheckingWildlifeStalkAttackPhaseExpiredParams = {
  stalkAttackingPreySinceMs: number | null | undefined;
  nowMs: number;
};

/** True once the pack has been attacking long enough to fall back to shadowing. */
export function checkingWildlifeStalkAttackPhaseExpired({
  stalkAttackingPreySinceMs,
  nowMs,
}: CheckingWildlifeStalkAttackPhaseExpiredParams): boolean {
  if (
    stalkAttackingPreySinceMs === null ||
    stalkAttackingPreySinceMs === undefined
  ) {
    return false;
  }

  return (
    nowMs - stalkAttackingPreySinceMs >=
    DEFINING_WILDLIFE_STALK_ATTACK_KILL_TIMEOUT_MS
  );
}
