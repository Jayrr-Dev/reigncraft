/**
 * Whether player revenge aggro is still overriding favorite-prey priority.
 *
 * @module components/world/wildlife/domains/checkingWildlifePlayerRevengeAggroIsActive
 */

import type { DefiningWildlifeAggroState } from '@/components/world/wildlife/domains/definingWildlifeTypes';

export type CheckingWildlifePlayerRevengeAggroIsActiveParams = {
  aggroState: DefiningWildlifeAggroState;
  playerUserId: string | null;
  nowMs: number;
};

/** True while a recent player hit still owns the hunt lock. */
export function checkingWildlifePlayerRevengeAggroIsActive({
  aggroState,
  playerUserId,
  nowMs,
}: CheckingWildlifePlayerRevengeAggroIsActiveParams): boolean {
  if (!playerUserId) {
    return false;
  }

  const revengeUntilMs = aggroState.playerRevengeAggroUntilMs;

  return (
    revengeUntilMs !== null &&
    revengeUntilMs !== undefined &&
    nowMs < revengeUntilMs
  );
}
