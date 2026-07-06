/**
 * Threat table advancement for wildlife aggro.
 *
 * @module components/world/wildlife/domains/advancingWildlifeAggroTick
 */

import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import {
  DEFINING_WILDLIFE_AGGRO_THREAT_THRESHOLD,
  DEFINING_WILDLIFE_PROXIMITY_THREAT_PER_SECOND,
} from '@/components/world/wildlife/domains/definingWildlifeAggroConstants';
import type { DefiningWildlifeSpeciesDefinition } from '@/components/world/wildlife/domains/definingWildlifeSpeciesRegistry';
import type {
  DefiningWildlifeAggroState,
  DefiningWildlifeInstance,
  DefiningWildlifeThreatEntry,
} from '@/components/world/wildlife/domains/definingWildlifeTypes';

export type AdvancingWildlifeAggroTickParams = {
  instance: DefiningWildlifeInstance;
  species: DefiningWildlifeSpeciesDefinition;
  nearbyInstances: readonly DefiningWildlifeInstance[];
  playerPosition: DefiningWorldPlazaWorldPoint | null;
  playerUserId: string | null;
  deltaSeconds: number;
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

function decayingThreats(
  threats: readonly DefiningWildlifeThreatEntry[],
  decayPerSecond: number,
  deltaSeconds: number,
  nowMs: number
): DefiningWildlifeThreatEntry[] {
  return threats
    .map((entry) => ({
      ...entry,
      threat: Math.max(0, entry.threat - decayPerSecond * deltaSeconds),
      lastUpdatedAtMs: nowMs,
    }))
    .filter((entry) => entry.threat > 0.05);
}

function resolvingHighestThreatTargetId(
  threats: readonly DefiningWildlifeThreatEntry[],
  currentTargetId: string | null,
  switchMargin: number
): string | null {
  if (threats.length === 0) {
    return null;
  }

  const sorted = [...threats].sort((left, right) => right.threat - left.threat);
  const top = sorted[0];

  if (!top || top.threat < DEFINING_WILDLIFE_AGGRO_THREAT_THRESHOLD) {
    return null;
  }

  if (!currentTargetId) {
    return top.targetId;
  }

  const current = threats.find((entry) => entry.targetId === currentTargetId);

  if (!current) {
    return top.targetId;
  }

  if (top.targetId === currentTargetId) {
    return currentTargetId;
  }

  return top.threat >= current.threat * switchMargin
    ? top.targetId
    : currentTargetId;
}

/**
 * Advances threat decay, proximity threat, and active target selection.
 */
export function advancingWildlifeAggroTick({
  instance,
  species,
  nearbyInstances,
  playerPosition,
  playerUserId,
  deltaSeconds,
  nowMs,
}: AdvancingWildlifeAggroTickParams): DefiningWildlifeAggroState {
  let threats = decayingThreats(
    instance.aggroState.threats,
    species.aggro.threatDecayPerSecond,
    deltaSeconds,
    nowMs
  );

  if (
    playerUserId &&
    playerPosition &&
    instance.hungerState.driveLevel === 'starving'
  ) {
    const distance = Math.hypot(
      instance.position.x - playerPosition.x,
      instance.position.y - playerPosition.y
    );

    if (distance <= species.aggro.aggroRadiusGrid) {
      threats = updatingThreatEntry(
        threats,
        playerUserId,
        DEFINING_WILDLIFE_PROXIMITY_THREAT_PER_SECOND *
          species.aggro.proximityThreatAtStarving *
          deltaSeconds,
        nowMs
      );
    }
  }

  const activeTargetId = resolvingHighestThreatTargetId(
    threats,
    instance.aggroState.activeTargetId,
    species.aggro.targetSwitchMargin
  );

  return {
    threats,
    activeTargetId,
    lastDamagedAtMs: instance.aggroState.lastDamagedAtMs,
  };
}

/**
 * Applies damage-based threat to one wildlife instance.
 */
export function applyingWildlifeDamageThreat(
  instance: DefiningWildlifeInstance,
  species: DefiningWildlifeSpeciesDefinition,
  attackerTargetId: string,
  damageAmount: number,
  nowMs: number
): DefiningWildlifeInstance {
  const addedThreat = damageAmount * species.aggro.threatPerDamage;
  const threats = updatingThreatEntry(
    instance.aggroState.threats,
    attackerTargetId,
    addedThreat,
    nowMs
  );

  const activeTargetId = resolvingHighestThreatTargetId(
    threats,
    instance.aggroState.activeTargetId,
    species.aggro.targetSwitchMargin
  );

  return {
    ...instance,
    aggroState: {
      threats,
      activeTargetId,
      lastDamagedAtMs: nowMs,
    },
  };
}

/**
 * Shares a fraction of threat with nearby same-species packmates.
 */
export function sharingWildlifePackThreat(
  packmate: DefiningWildlifeInstance,
  species: DefiningWildlifeSpeciesDefinition,
  attackerTargetId: string,
  sharedThreat: number,
  nowMs: number
): DefiningWildlifeInstance {
  const threats = updatingThreatEntry(
    packmate.aggroState.threats,
    attackerTargetId,
    sharedThreat,
    nowMs
  );

  return {
    ...packmate,
    aggroState: {
      threats,
      activeTargetId: resolvingHighestThreatTargetId(
        threats,
        packmate.aggroState.activeTargetId,
        species.aggro.targetSwitchMargin
      ),
      lastDamagedAtMs: nowMs,
    },
  };
}
