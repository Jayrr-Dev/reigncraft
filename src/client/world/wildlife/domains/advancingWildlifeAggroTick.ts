/**
 * Threat table advancement for wildlife aggro.
 *
 * @module components/world/wildlife/domains/advancingWildlifeAggroTick
 */

import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import { checkingWildlifeIsMotivatedToHunt } from '@/components/world/wildlife/domains/checkingWildlifeIsMotivatedToHunt';
import { checkingWildlifeMayAggroPlayerOnSight } from '@/components/world/wildlife/domains/checkingWildlifeMayAggroPlayerOnSight';
import {
  checkingWildlifePlayerIsInsideTerritoryAnchor,
  resolvingWildlifeSpeciesTerritoryConfig,
  resolvingWildlifeTerritoryLingerThreatPerSecond,
} from '@/components/world/wildlife/domains/checkingWildlifeTerritoryIntrusion';
import {
  DEFINING_WILDLIFE_AGGRO_THREAT_THRESHOLD,
  DEFINING_WILDLIFE_PROXIMITY_THREAT_PER_SECOND,
} from '@/components/world/wildlife/domains/definingWildlifeAggroConstants';
import { checkingWildlifePredatorMayHuntPrey } from '@/components/world/wildlife/domains/definingWildlifeFoodChain';
import {
  DEFINING_WILDLIFE_PREY_HUNT_RADIUS_GRID,
  DEFINING_WILDLIFE_PREY_PROXIMITY_ATTACK_RADIUS_GRID,
  DEFINING_WILDLIFE_PREY_SCENT_THREAT_PER_SECOND,
} from '@/components/world/wildlife/domains/definingWildlifeHuntConstants';
import type { DefiningWildlifeSpeciesDefinition } from '@/components/world/wildlife/domains/definingWildlifeSpeciesRegistry';
import { resolvingWildlifeSpeciesDefinition } from '@/components/world/wildlife/domains/definingWildlifeSpeciesRegistry';
import { DEFINING_WILDLIFE_TERRITORY_ESCALATE_THREAT_PER_SECOND } from '@/components/world/wildlife/domains/definingWildlifeTerritoryConstants';
import type {
  DefiningWildlifeAggroState,
  DefiningWildlifeInstance,
  DefiningWildlifeThreatEntry,
} from '@/components/world/wildlife/domains/definingWildlifeTypes';
import { resolvingWildlifeAggressionLevelProfile } from '@/components/world/wildlife/domains/resolvingWildlifeAggressionLevelFromAnchor';
import { resolvingWildlifeInstancePlayerAggroRadiusGrid } from '@/components/world/wildlife/domains/resolvingWildlifeInstancePlayerAggroRadius';

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

  if (playerUserId && playerPosition) {
    const aggressionProfile = resolvingWildlifeAggressionLevelProfile(
      instance.aggressionLevel
    );

    if (aggressionProfile.proximityThreatMode !== 'none') {
      const distance = Math.hypot(
        instance.position.x - playerPosition.x,
        instance.position.y - playerPosition.y
      );

      if (
        distance <=
        resolvingWildlifeInstancePlayerAggroRadiusGrid(species, instance)
      ) {
        const shouldBuildProximityThreat =
          aggressionProfile.proximityThreatMode === 'starving'
            ? instance.hungerState.driveLevel === 'starving'
            : checkingWildlifeMayAggroPlayerOnSight(
                species,
                instance.aggressionLevel,
                instance.hungerState.driveLevel
              );

        if (shouldBuildProximityThreat) {
          const starvingMultiplier =
            aggressionProfile.proximityThreatMode === 'onSight'
              ? 1
              : species.aggro.proximityThreatAtStarving;

          threats = updatingThreatEntry(
            threats,
            playerUserId,
            DEFINING_WILDLIFE_PROXIMITY_THREAT_PER_SECOND *
              starvingMultiplier *
              aggressionProfile.proximityThreatMultiplier *
              deltaSeconds,
            nowMs
          );
        }
      }
    }

    const territory = resolvingWildlifeSpeciesTerritoryConfig(species);

    if (
      territory &&
      instance.aggressionLevel !== 'tame' &&
      instance.aggroState.activeTargetId === null
    ) {
      const distanceToPlayer = Math.hypot(
        instance.position.x - playerPosition.x,
        instance.position.y - playerPosition.y
      );

      if (
        checkingWildlifePlayerIsInsideTerritoryAnchor(
          playerPosition,
          instance.spawnAnchor,
          territory
        ) &&
        distanceToPlayer <= territory.warnRadiusGrid
      ) {
        const territoryThreatPerSecond =
          distanceToPlayer <= territory.escalateRadiusGrid
            ? DEFINING_WILDLIFE_TERRITORY_ESCALATE_THREAT_PER_SECOND
            : resolvingWildlifeTerritoryLingerThreatPerSecond(territory);

        threats = updatingThreatEntry(
          threats,
          playerUserId,
          territoryThreatPerSecond * deltaSeconds,
          nowMs
        );
      }
    }
  }

  const hungerDriveLevel =
    instance.hungerState.driveLevel === 'starving' ? 'starving' : 'hungry';

  for (const neighbor of nearbyInstances) {
    if (neighbor.instanceId === instance.instanceId || neighbor.isDead) {
      continue;
    }

    const preySpecies = resolvingWildlifeSpeciesDefinition(neighbor.speciesId);

    if (
      !preySpecies ||
      !checkingWildlifePredatorMayHuntPrey(
        species,
        preySpecies,
        hungerDriveLevel
      )
    ) {
      continue;
    }

    const distance = Math.hypot(
      instance.position.x - neighbor.position.x,
      instance.position.y - neighbor.position.y
    );

    if (distance <= DEFINING_WILDLIFE_PREY_PROXIMITY_ATTACK_RADIUS_GRID) {
      const existingThreat = threats.find(
        (entry) => entry.targetId === neighbor.instanceId
      );
      const proximityThreatBoost = Math.max(
        0,
        DEFINING_WILDLIFE_AGGRO_THREAT_THRESHOLD - (existingThreat?.threat ?? 0)
      );

      if (proximityThreatBoost > 0) {
        threats = updatingThreatEntry(
          threats,
          neighbor.instanceId,
          proximityThreatBoost,
          nowMs
        );
      }

      continue;
    }

    if (
      !checkingWildlifeIsMotivatedToHunt(
        species,
        instance.hungerState.driveLevel
      ) ||
      distance > DEFINING_WILDLIFE_PREY_HUNT_RADIUS_GRID
    ) {
      continue;
    }

    threats = updatingThreatEntry(
      threats,
      neighbor.instanceId,
      DEFINING_WILDLIFE_PREY_SCENT_THREAT_PER_SECOND * deltaSeconds,
      nowMs
    );
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
 * Clears one target from the threat table and recomputes the active target.
 */
export function releasingWildlifeAggroOnTarget(
  aggroState: DefiningWildlifeAggroState,
  targetId: string,
  targetSwitchMargin: number
): DefiningWildlifeAggroState {
  const threats = aggroState.threats.filter(
    (entry) => entry.targetId !== targetId
  );

  const activeTargetId = resolvingHighestThreatTargetId(
    threats,
    aggroState.activeTargetId === targetId ? null : aggroState.activeTargetId,
    targetSwitchMargin
  );

  return {
    threats,
    activeTargetId,
    lastDamagedAtMs: aggroState.lastDamagedAtMs,
  };
}

/**
 * Drops player combat intent and aggro entries for one wildlife instance.
 */
export function releasingWildlifeInstancePlayerAggro(
  instance: DefiningWildlifeInstance,
  playerUserId: string,
  targetSwitchMargin: number
): DefiningWildlifeInstance {
  const intent = instance.aiState.intent;
  const isTargetingPlayer =
    (intent.mode === 'chase' ||
      intent.mode === 'attack' ||
      intent.mode === 'territoryWarn') &&
    intent.targetInstanceId === playerUserId;

  return {
    ...instance,
    aggroState: releasingWildlifeAggroOnTarget(
      instance.aggroState,
      playerUserId,
      targetSwitchMargin
    ),
    aiState: isTargetingPlayer
      ? {
          ...instance.aiState,
          intent: { mode: 'idle' },
          chargeWindupStartedAtMs: null,
          fleeTargetPoint: null,
          startledUntilMs: null,
          steeringCache: null,
        }
      : instance.aiState,
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
