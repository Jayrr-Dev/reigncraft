/**
 * Immediate threat spike when a favorite prey is spotted on sight.
 *
 * @module components/world/wildlife/domains/applyingWildlifeFavoritePreyThreatBoost
 */

import { DEFINING_WILDLIFE_AGGRO_THREAT_THRESHOLD } from '@/components/world/wildlife/domains/definingWildlifeAggroConstants';
import type { DefiningWildlifeThreatEntry } from '@/components/world/wildlife/domains/definingWildlifeTypes';

export type ApplyingWildlifeFavoritePreyThreatBoostParams = {
  threats: readonly DefiningWildlifeThreatEntry[];
  preyTargetId: string;
  nowMs: number;
};

/** Raises favorite-prey threat to the engage threshold in one step. */
export function applyingWildlifeFavoritePreyThreatBoost({
  threats,
  preyTargetId,
  nowMs,
}: ApplyingWildlifeFavoritePreyThreatBoostParams): DefiningWildlifeThreatEntry[] {
  const existingThreat = threats.find(
    (entry) => entry.targetId === preyTargetId
  );
  const proximityThreatBoost = Math.max(
    0,
    DEFINING_WILDLIFE_AGGRO_THREAT_THRESHOLD - (existingThreat?.threat ?? 0)
  );

  if (proximityThreatBoost <= 0) {
    return [...threats];
  }

  const withoutTarget = threats.filter(
    (entry) => entry.targetId !== preyTargetId
  );

  return [
    ...withoutTarget,
    {
      targetId: preyTargetId,
      threat: (existingThreat?.threat ?? 0) + proximityThreatBoost,
      lastUpdatedAtMs: nowMs,
    },
  ];
}
