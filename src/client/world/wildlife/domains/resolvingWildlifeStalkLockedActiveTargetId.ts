/**
 * Active target resolution while a PackHunter hunt lock is active.
 *
 * @module components/world/wildlife/domains/resolvingWildlifeStalkLockedActiveTargetId
 */

import { DEFINING_WILDLIFE_AGGRO_THREAT_THRESHOLD } from '@/components/world/wildlife/domains/definingWildlifeAggroConstants';
import type { DefiningWildlifeThreatEntry } from '@/components/world/wildlife/domains/definingWildlifeTypes';

export type ResolvingWildlifeStalkLockedActiveTargetIdParams = {
  threats: readonly DefiningWildlifeThreatEntry[];
  stalkLockedPreyTargetId: string | null;
  currentTargetId: string | null;
  targetSwitchMargin: number;
  resolveHighestThreatTargetId: (
    threats: readonly DefiningWildlifeThreatEntry[],
    currentTargetId: string | null,
    targetSwitchMargin: number
  ) => string | null;
};

/** Keeps the locked prey as the active target until its threat decays away. */
export function resolvingWildlifeStalkLockedActiveTargetId({
  threats,
  stalkLockedPreyTargetId,
  currentTargetId,
  targetSwitchMargin,
  resolveHighestThreatTargetId,
}: ResolvingWildlifeStalkLockedActiveTargetIdParams): string | null {
  if (!stalkLockedPreyTargetId) {
    return resolveHighestThreatTargetId(
      threats,
      currentTargetId,
      targetSwitchMargin
    );
  }

  const lockThreat = threats.find(
    (entry) => entry.targetId === stalkLockedPreyTargetId
  );

  if (
    !lockThreat ||
    lockThreat.threat < DEFINING_WILDLIFE_AGGRO_THREAT_THRESHOLD
  ) {
    return null;
  }

  return stalkLockedPreyTargetId;
}
