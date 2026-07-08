/**
 * Forces player aggro when a favorite-prey hunter is hit off-lock.
 *
 * @module components/world/wildlife/domains/applyingWildlifeFavoritePreyPlayerRevengeAggro
 */

import { applyingWildlifeFavoritePreyThreatBoost } from '@/components/world/wildlife/domains/applyingWildlifeFavoritePreyThreatBoost';
import { DEFINING_WILDLIFE_FAVORITE_PREY_PLAYER_REVENGE_AGGRO_MS } from '@/components/world/wildlife/domains/definingWildlifeFavoritePreyConstants';
import type { DefiningWildlifeSpeciesDefinition } from '@/components/world/wildlife/domains/definingWildlifeSpeciesRegistry';
import type {
  DefiningWildlifeInstance,
  DefiningWildlifeThreatEntry,
} from '@/components/world/wildlife/domains/definingWildlifeTypes';
import { resolvingWildlifeAggroLastAggroedAtMs } from '@/components/world/wildlife/domains/resolvingWildlifeAggroLastAggroedAtMs';

export type ApplyingWildlifeFavoritePreyPlayerRevengeAggroParams = {
  instance: DefiningWildlifeInstance;
  species: DefiningWildlifeSpeciesDefinition;
  playerTargetId: string;
  damageAmount: number;
  nowMs: number;
};

function updatingThreatEntry(
  threats: readonly DefiningWildlifeThreatEntry[],
  targetId: string,
  addedThreat: number,
  nowMs: number
): DefiningWildlifeThreatEntry[] {
  const existing = threats.find((entry) => entry.targetId === targetId);
  const nextThreat = (existing?.threat ?? 0) + addedThreat;
  const withoutTarget = threats.filter((entry) => entry.targetId !== targetId);

  if (nextThreat <= 0) {
    return withoutTarget;
  }

  return [
    ...withoutTarget,
    { targetId, threat: nextThreat, lastUpdatedAtMs: nowMs },
  ];
}

/** Locks onto the player for thirty seconds after an off-lock hit. */
export function applyingWildlifeFavoritePreyPlayerRevengeAggro({
  instance,
  species,
  playerTargetId,
  damageAmount,
  nowMs,
}: ApplyingWildlifeFavoritePreyPlayerRevengeAggroParams): DefiningWildlifeInstance {
  const addedThreat = damageAmount * species.aggro.threatPerDamage;
  let threats = updatingThreatEntry(
    instance.aggroState.threats,
    playerTargetId,
    addedThreat,
    nowMs
  );
  threats = applyingWildlifeFavoritePreyThreatBoost({
    threats,
    preyTargetId: playerTargetId,
    nowMs,
  });

  return {
    ...instance,
    aggroState: {
      ...instance.aggroState,
      threats,
      activeTargetId: playerTargetId,
      lastDamagedAtMs: nowMs,
      lastAggroedAtMs: resolvingWildlifeAggroLastAggroedAtMs(
        instance.aggroState.lastAggroedAtMs,
        playerTargetId,
        nowMs
      ),
      stalkLockedPreyTargetId: playerTargetId,
      playerRevengeAggroUntilMs:
        nowMs + DEFINING_WILDLIFE_FAVORITE_PREY_PLAYER_REVENGE_AGGRO_MS,
      stalkingPreySinceMs: nowMs,
      stalkAttackingPreySinceMs: null,
      stalkPackResponse: null,
    },
  };
}
