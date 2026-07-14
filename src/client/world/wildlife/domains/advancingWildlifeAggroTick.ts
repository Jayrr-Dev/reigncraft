/**
 * Threat table advancement for wildlife aggro.
 *
 * @module components/world/wildlife/domains/advancingWildlifeAggroTick
 */

import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import { checkingWildlifeMayHuntNpcPrey } from '@/components/world/npc/domains/checkingWildlifeMayHuntNpcPrey';
import type { DefiningNpcPreyTarget } from '@/components/world/npc/domains/definingNpcTypes';
import { advancingWildlifeStalkAggroTick } from '@/components/world/wildlife/domains/advancingWildlifeStalkAggroTick';
import { advancingWildlifePackHunterBehaviour } from '@/components/world/wildlife/domains/advancingWildlifePackHunterBehaviour';
import { advancingWildlifeStalkerBehaviour } from '@/components/world/wildlife/domains/advancingWildlifeStalkerBehaviour';
import { applyingWildlifeFavoritePreyPlayerRevengeAggro } from '@/components/world/wildlife/domains/applyingWildlifeFavoritePreyPlayerRevengeAggro';
import { applyingWildlifeFavoritePreyThreatBoost } from '@/components/world/wildlife/domains/applyingWildlifeFavoritePreyThreatBoost';
import { checkingWildlifeChaseShouldGiveUpWithoutDamage } from '@/components/world/wildlife/domains/checkingWildlifeChaseShouldGiveUpWithoutDamage';
import { checkingWildlifeInstanceHasProvokedWildlifeAggro } from '@/components/world/wildlife/domains/checkingWildlifeInstanceHasProvokedWildlifeAggro';
import { checkingWildlifeIsMotivatedToHunt } from '@/components/world/wildlife/domains/checkingWildlifeIsMotivatedToHunt';
import { checkingWildlifeIsStalkHuntTemperament } from '@/components/world/wildlife/domains/checkingWildlifeIsStalkHuntTemperament';
import { checkingWildlifeMayAggroPlayerOnSight } from '@/components/world/wildlife/domains/checkingWildlifeMayAggroPlayerOnSight';
import { checkingWildlifePlayerOccludedByColumnRock } from '@/components/world/wildlife/domains/checkingWildlifePlayerOccludedByColumnRock';
import { checkingWildlifePlayerRevengeAggroIsActive } from '@/components/world/wildlife/domains/checkingWildlifePlayerRevengeAggroIsActive';
import { checkingWildlifePointIsInsideTerritoryAnchor } from '@/components/world/wildlife/domains/checkingWildlifePointIsInsideTerritoryAnchor';
import { checkingWildlifeShareSpawnPack } from '@/components/world/wildlife/domains/checkingWildlifeShareSpawnPack';
import { checkingWildlifeSocialHunterMayHunt } from '@/components/world/wildlife/domains/checkingWildlifeSocialHunterMayHunt';
import { checkingWildlifeSpeciesIsFavoritePrey } from '@/components/world/wildlife/domains/checkingWildlifeSpeciesIsFavoritePrey';
import { checkingWildlifePackHunterMayInitiatePreyStalk } from '@/components/world/wildlife/domains/checkingWildlifePackHunterMayInitiatePreyStalk';
import {
  resolvingWildlifeSpeciesTerritoryConfig,
  resolvingWildlifeTerritoryLingerThreatPerSecond,
} from '@/components/world/wildlife/domains/checkingWildlifeTerritoryIntrusion';
import {
  DEFINING_WILDLIFE_AGGRO_THREAT_THRESHOLD,
  DEFINING_WILDLIFE_PROXIMITY_THREAT_PER_SECOND,
} from '@/components/world/wildlife/domains/definingWildlifeAggroConstants';
import {
  DEFINING_WILDLIFE_BOULDER_COVER_CHASE_BREAK_DISTANCE_GRID,
  DEFINING_WILDLIFE_BOULDER_COVER_DETECTION_THREAT_MULTIPLIER,
} from '@/components/world/wildlife/domains/definingWildlifeBoulderCoverConstants';
import { DEFINING_WILDLIFE_FAVORITE_PREY_SIGHT_RADIUS_GRID } from '@/components/world/wildlife/domains/definingWildlifeFavoritePreyConstants';
import { checkingWildlifePredatorMayHuntPrey } from '@/components/world/wildlife/domains/definingWildlifeFoodChain';
import {
  DEFINING_WILDLIFE_PREY_HUNT_RADIUS_GRID,
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
import { listingWildlifePackHunterPreyTargetCandidates } from '@/components/world/wildlife/domains/listingWildlifePackHunterPreyTargetCandidates';
import { pickingWildlifeStalkAlphaPreyTargetId } from '@/components/world/wildlife/domains/pickingWildlifeStalkAlphaPreyTargetId';
import { resolvingWildlifeAggressionLevelProfile } from '@/components/world/wildlife/domains/resolvingWildlifeAggressionLevelFromAnchor';
import { resolvingWildlifeAggroLastAggroedAtMs } from '@/components/world/wildlife/domains/resolvingWildlifeAggroLastAggroedAtMs';
import { resolvingWildlifeChaseEngagedAtMs } from '@/components/world/wildlife/domains/resolvingWildlifeChaseEngagedAtMs';
import { resolvingWildlifeInstancePlayerAggroRadiusGrid } from '@/components/world/wildlife/domains/resolvingWildlifeInstancePlayerAggroRadius';
import { resolvingWildlifeNearestFavoritePreyTargetId } from '@/components/world/wildlife/domains/resolvingWildlifeNearestFavoritePreyTargetId';
import { resolvingWildlifePreyProximityAttackRadiusGrid } from '@/components/world/wildlife/domains/resolvingWildlifePreyProximityAttackRadiusGrid';
import { resolvingWildlifeStalkLockedActiveTargetId } from '@/components/world/wildlife/domains/resolvingWildlifeStalkLockedActiveTargetId';
import { resolvingWildlifeStalkPackJoinPreyTargetId } from '@/components/world/wildlife/domains/resolvingWildlifeStalkPackJoinPreyTargetId';

export type AdvancingWildlifeAggroTickParams = {
  instance: DefiningWildlifeInstance;
  species: DefiningWildlifeSpeciesDefinition;
  nearbyInstances: readonly DefiningWildlifeInstance[];
  playerPosition: DefiningWorldPlazaWorldPoint | null;
  playerUserId: string | null;
  playerHealthRatio?: number | null;
  playerStaminaRatio?: number | null;
  playerStaminaIsDepleted?: boolean;
  playerStillDurationMs?: number;
  deltaSeconds: number;
  nowMs: number;
  npcPreyTargets?: readonly DefiningNpcPreyTarget[];
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
  playerHealthRatio = null,
  playerStaminaRatio = null,
  playerStaminaIsDepleted = false,
  playerStillDurationMs = 0,
  deltaSeconds,
  nowMs,
  npcPreyTargets = [],
}: AdvancingWildlifeAggroTickParams): DefiningWildlifeAggroState {
  let stalkLockedPreyTargetId =
    instance.aggroState.stalkLockedPreyTargetId ?? null;
  const previousStalkLockedPreyTargetId = stalkLockedPreyTargetId;
  const playerRevengeAggroActive = checkingWildlifePlayerRevengeAggroIsActive({
    aggroState: instance.aggroState,
    playerUserId,
    nowMs,
  });
  const resolvedPlayerRevengeAggroUntilMs =
    instance.aggroState.playerRevengeAggroUntilMs !== null &&
    instance.aggroState.playerRevengeAggroUntilMs !== undefined &&
    nowMs >= instance.aggroState.playerRevengeAggroUntilMs
      ? null
      : (instance.aggroState.playerRevengeAggroUntilMs ?? null);
  const mayInitiatePreyStalk =
    species.temperamentId === 'stalker'
      ? true
      : species.temperamentId === 'pack_hunter'
        ? checkingWildlifePackHunterMayInitiatePreyStalk({
            instance,
            nearbyInstances,
            resolveSpecies: resolvingWildlifeSpeciesDefinition,
          }) &&
          checkingWildlifeSocialHunterMayHunt({
            instance,
            species,
            nearbyInstances,
          })
        : false;
  const packJoinPreyTargetId =
    species.temperamentId === 'pack_hunter'
      ? resolvingWildlifeStalkPackJoinPreyTargetId({
          instance,
          nearbyInstances,
          resolveSpecies: resolvingWildlifeSpeciesDefinition,
        })
      : null;
  const sightedFavoritePreyTargetId = mayInitiatePreyStalk
    ? resolvingWildlifeNearestFavoritePreyTargetId({
        instance,
        species,
        nearbyInstances,
        resolveSpecies: resolvingWildlifeSpeciesDefinition,
        nowMs,
      })
    : null;
  const shouldResetStalkStateForFavoritePrey =
    !playerRevengeAggroActive &&
    packJoinPreyTargetId === null &&
    sightedFavoritePreyTargetId !== null &&
    sightedFavoritePreyTargetId !== previousStalkLockedPreyTargetId;

  if (playerRevengeAggroActive && playerUserId) {
    stalkLockedPreyTargetId = playerUserId;
  } else if (packJoinPreyTargetId) {
    stalkLockedPreyTargetId = packJoinPreyTargetId;
  } else if (sightedFavoritePreyTargetId) {
    stalkLockedPreyTargetId = sightedFavoritePreyTargetId;
  }

  const stalkPreyCandidates = checkingWildlifeIsStalkHuntTemperament(
    species.temperamentId
  )
    ? listingWildlifePackHunterPreyTargetCandidates({
        instance,
        species,
        nearbyInstances,
        playerPosition,
        playerUserId,
        resolveSpecies: resolvingWildlifeSpeciesDefinition,
        nowMs,
        npcPreyTargets,
      })
    : [];

  if (checkingWildlifeIsStalkHuntTemperament(species.temperamentId)) {
    if (
      !playerRevengeAggroActive &&
      packJoinPreyTargetId === null &&
      stalkLockedPreyTargetId &&
      !stalkPreyCandidates.some(
        (candidate) => candidate.targetId === stalkLockedPreyTargetId
      ) &&
      (instance.aggroState.stalkingPreySinceMs === null ||
        instance.aggroState.stalkingPreySinceMs === undefined)
    ) {
      stalkLockedPreyTargetId = null;
    }

    if (
      !stalkLockedPreyTargetId &&
      !sightedFavoritePreyTargetId &&
      mayInitiatePreyStalk &&
      stalkPreyCandidates.length > 0
    ) {
      stalkLockedPreyTargetId = pickingWildlifeStalkAlphaPreyTargetId(
        instance.instanceId,
        stalkPreyCandidates,
        nowMs
      );
    }
  }

  const mayBuildThreatToTarget = (targetId: string): boolean => {
    if (!checkingWildlifeIsStalkHuntTemperament(species.temperamentId)) {
      return true;
    }

    if (!stalkLockedPreyTargetId) {
      return false;
    }

    return targetId === stalkLockedPreyTargetId;
  };

  let threats = decayingThreats(
    instance.aggroState.threats,
    species.aggro.threatDecayPerSecond,
    deltaSeconds,
    nowMs
  );

  let chaseGiveUpUntilPlayerExitsAggro =
    instance.aggroState.chaseGiveUpUntilPlayerExitsAggro === true;
  const lastDealtDamageAtMs = instance.aggroState.lastDealtDamageAtMs ?? null;

  if (playerUserId && playerPosition) {
    const aggressionProfile = resolvingWildlifeAggressionLevelProfile(
      instance.aggressionLevel
    );
    const distanceToPlayer = Math.hypot(
      instance.position.x - playerPosition.x,
      instance.position.y - playerPosition.y
    );
    const playerAggroRadiusGrid =
      resolvingWildlifeInstancePlayerAggroRadiusGrid(species, instance);
    const playerOccludedByBoulder = checkingWildlifePlayerOccludedByColumnRock(
      instance.position,
      playerPosition
    );
    const boulderCoverDetectionMultiplier = playerOccludedByBoulder
      ? DEFINING_WILDLIFE_BOULDER_COVER_DETECTION_THREAT_MULTIPLIER
      : 1;

    if (
      chaseGiveUpUntilPlayerExitsAggro &&
      distanceToPlayer > playerAggroRadiusGrid
    ) {
      chaseGiveUpUntilPlayerExitsAggro = false;
    }

    if (aggressionProfile.proximityThreatMode !== 'none') {
      if (distanceToPlayer <= playerAggroRadiusGrid) {
        const shouldBuildProximityThreat =
          !chaseGiveUpUntilPlayerExitsAggro &&
          (aggressionProfile.proximityThreatMode === 'starving'
            ? instance.hungerState.driveLevel === 'starving'
            : checkingWildlifeMayAggroPlayerOnSight(
                species,
                instance.aggressionLevel,
                instance.hungerState.driveLevel
              ) &&
              (species.temperamentId !== 'pack_hunter' || mayInitiatePreyStalk));

        if (
          shouldBuildProximityThreat &&
          mayBuildThreatToTarget(playerUserId)
        ) {
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
              boulderCoverDetectionMultiplier *
              deltaSeconds,
            nowMs
          );
        }
      }
    }

    const territory = resolvingWildlifeSpeciesTerritoryConfig(
      species,
      instance.aggressionLevel
    );

    if (
      territory &&
      instance.aggressionLevel !== 'tame' &&
      !chaseGiveUpUntilPlayerExitsAggro &&
      (instance.aggroState.activeTargetId === null || !stalkLockedPreyTargetId)
    ) {
      if (
        checkingWildlifePointIsInsideTerritoryAnchor(
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
          territoryThreatPerSecond *
            boulderCoverDetectionMultiplier *
            deltaSeconds,
          nowMs
        );
      }
    }

    if (
      playerOccludedByBoulder &&
      distanceToPlayer >=
        DEFINING_WILDLIFE_BOULDER_COVER_CHASE_BREAK_DISTANCE_GRID &&
      (instance.aggroState.activeTargetId === playerUserId ||
        stalkLockedPreyTargetId === playerUserId ||
        threats.some((entry) => entry.targetId === playerUserId))
    ) {
      threats = threats.filter((entry) => entry.targetId !== playerUserId);

      if (stalkLockedPreyTargetId === playerUserId) {
        stalkLockedPreyTargetId = null;
      }
    }
  }

  const territory = resolvingWildlifeSpeciesTerritoryConfig(
    species,
    instance.aggressionLevel
  );

  if (territory && instance.aggressionLevel !== 'tame') {
    for (const neighbor of nearbyInstances) {
      if (
        neighbor.instanceId === instance.instanceId ||
        neighbor.isDead ||
        neighbor.speciesId !== species.speciesId
      ) {
        continue;
      }

      if (checkingWildlifeShareSpawnPack(instance, neighbor)) {
        continue;
      }

      const distanceToIntruder = Math.hypot(
        instance.position.x - neighbor.position.x,
        instance.position.y - neighbor.position.y
      );

      if (
        !checkingWildlifePointIsInsideTerritoryAnchor(
          neighbor.position,
          instance.spawnAnchor,
          territory
        ) ||
        distanceToIntruder > territory.warnRadiusGrid
      ) {
        continue;
      }

      const territoryThreatPerSecond =
        distanceToIntruder <= territory.escalateRadiusGrid
          ? DEFINING_WILDLIFE_TERRITORY_ESCALATE_THREAT_PER_SECOND
          : resolvingWildlifeTerritoryLingerThreatPerSecond(territory);

      threats = updatingThreatEntry(
        threats,
        neighbor.instanceId,
        territoryThreatPerSecond * deltaSeconds,
        nowMs
      );
    }
  }

  const hungerDriveLevel =
    instance.hungerState.driveLevel === 'starving' ? 'starving' : 'hungry';

  const proximityAttackRadiusGrid =
    resolvingWildlifePreyProximityAttackRadiusGrid(species);

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
        hungerDriveLevel,
        {
          preyHasProvokedWildlifeAggro:
            checkingWildlifeInstanceHasProvokedWildlifeAggro(neighbor, nowMs),
        }
      )
    ) {
      continue;
    }

    if (
      species.temperamentId === 'pack_hunter' &&
      !mayInitiatePreyStalk
    ) {
      continue;
    }

    if (!mayBuildThreatToTarget(neighbor.instanceId)) {
      continue;
    }

    const distance = Math.hypot(
      instance.position.x - neighbor.position.x,
      instance.position.y - neighbor.position.y
    );
    const isFavoritePrey = checkingWildlifeSpeciesIsFavoritePrey(
      species,
      preySpecies.speciesId
    );

    if (isFavoritePrey) {
      if (distance > DEFINING_WILDLIFE_FAVORITE_PREY_SIGHT_RADIUS_GRID) {
        continue;
      }

      threats = applyingWildlifeFavoritePreyThreatBoost({
        threats,
        preyTargetId: neighbor.instanceId,
        nowMs,
      });
      continue;
    }

    if (distance <= proximityAttackRadiusGrid) {
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

  for (const npcPrey of npcPreyTargets) {
    if (
      !checkingWildlifeMayHuntNpcPrey(species, npcPrey, hungerDriveLevel) ||
      (species.temperamentId === 'pack_hunter' && !mayInitiatePreyStalk) ||
      !mayBuildThreatToTarget(npcPrey.targetId)
    ) {
      continue;
    }

    const distance = Math.hypot(
      instance.position.x - npcPrey.position.x,
      instance.position.y - npcPrey.position.y
    );

    if (distance <= proximityAttackRadiusGrid) {
      const existingThreat = threats.find(
        (entry) => entry.targetId === npcPrey.targetId
      );
      const proximityThreatBoost = Math.max(
        0,
        DEFINING_WILDLIFE_AGGRO_THREAT_THRESHOLD - (existingThreat?.threat ?? 0)
      );

      if (proximityThreatBoost > 0) {
        threats = updatingThreatEntry(
          threats,
          npcPrey.targetId,
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
      npcPrey.targetId,
      DEFINING_WILDLIFE_PREY_SCENT_THREAT_PER_SECOND * deltaSeconds,
      nowMs
    );
  }

  if (
    checkingWildlifeIsStalkHuntTemperament(species.temperamentId) &&
    stalkLockedPreyTargetId
  ) {
    const territorialIntruderIds = new Set(
      nearbyInstances
        .filter(
          (neighbor) =>
            !neighbor.isDead &&
            neighbor.speciesId === species.speciesId &&
            !checkingWildlifeShareSpawnPack(instance, neighbor)
        )
        .map((neighbor) => neighbor.instanceId)
    );

    threats = threats.filter(
      (entry) =>
        entry.targetId === stalkLockedPreyTargetId ||
        territorialIntruderIds.has(entry.targetId)
    );
  }

  // Followers inherit the alpha lock before proximity threat can build. Seed
  // enough threat so activeTarget flips this think; otherwise they fall through
  // to seek-pack / wander while only the alpha engages.
  if (packJoinPreyTargetId) {
    const lockThreat =
      threats.find((entry) => entry.targetId === packJoinPreyTargetId)
        ?.threat ?? 0;
    const threatDeficit = DEFINING_WILDLIFE_AGGRO_THREAT_THRESHOLD - lockThreat;

    if (threatDeficit > 0) {
      threats = updatingThreatEntry(
        threats,
        packJoinPreyTargetId,
        threatDeficit,
        nowMs
      );
    }
  }

  let activeTargetId = resolvingWildlifeStalkLockedActiveTargetId({
    threats,
    stalkLockedPreyTargetId,
    currentTargetId: instance.aggroState.activeTargetId,
    targetSwitchMargin: species.aggro.targetSwitchMargin,
    resolveHighestThreatTargetId: resolvingHighestThreatTargetId,
  });

  let chaseEngagedAtMs = resolvingWildlifeChaseEngagedAtMs({
    previousChaseEngagedAtMs: instance.aggroState.chaseEngagedAtMs,
    previousActiveTargetId: instance.aggroState.activeTargetId,
    activeTargetId,
    nowMs,
  });

  if (
    checkingWildlifeChaseShouldGiveUpWithoutDamage({
      chaseGiveUpWithoutDamageMs: species.aggro.chaseGiveUpWithoutDamageMs,
      activeTargetId,
      playerUserId,
      lastDealtDamageAtMs,
      chaseEngagedAtMs,
      nowMs,
    }) &&
    playerUserId
  ) {
    threats = threats.filter((entry) => entry.targetId !== playerUserId);

    if (stalkLockedPreyTargetId === playerUserId) {
      stalkLockedPreyTargetId = null;
    }

    activeTargetId = resolvingWildlifeStalkLockedActiveTargetId({
      threats,
      stalkLockedPreyTargetId,
      currentTargetId: null,
      targetSwitchMargin: species.aggro.targetSwitchMargin,
      resolveHighestThreatTargetId: resolvingHighestThreatTargetId,
    });
    chaseEngagedAtMs = resolvingWildlifeChaseEngagedAtMs({
      previousChaseEngagedAtMs: null,
      previousActiveTargetId: playerUserId,
      activeTargetId,
      nowMs,
    });
    chaseGiveUpUntilPlayerExitsAggro = true;
  }

  const baseAggroState: DefiningWildlifeAggroState = {
    threats,
    activeTargetId,
    lastDamagedAtMs: instance.aggroState.lastDamagedAtMs,
    lastDealtDamageAtMs,
    chaseEngagedAtMs,
    chaseGiveUpUntilPlayerExitsAggro,
    stalkingPreySinceMs: shouldResetStalkStateForFavoritePrey
      ? null
      : instance.aggroState.stalkingPreySinceMs,
    stalkAttackingPreySinceMs: shouldResetStalkStateForFavoritePrey
      ? null
      : instance.aggroState.stalkAttackingPreySinceMs,
    stalkConfidentSinceMs: shouldResetStalkStateForFavoritePrey
      ? null
      : instance.aggroState.stalkConfidentSinceMs,
    stalkPlayerApproachState: shouldResetStalkStateForFavoritePrey
      ? null
      : instance.aggroState.stalkPlayerApproachState,
    stalkPlayerApproachReactedAtMs:
      instance.aggroState.stalkPlayerApproachReactedAtMs,
    stalkPhase: shouldResetStalkStateForFavoritePrey
      ? 'idle'
      : instance.aggroState.stalkPhase,
    stalkPhaseEnteredAtMs: shouldResetStalkStateForFavoritePrey
      ? null
      : instance.aggroState.stalkPhaseEnteredAtMs,
    pendingStalkEvents: shouldResetStalkStateForFavoritePrey
      ? []
      : instance.aggroState.pendingStalkEvents,
    stalkLockedPreyTargetId,
    playerRevengeAggroUntilMs: resolvedPlayerRevengeAggroUntilMs,
    lastAggroedAtMs: resolvingWildlifeAggroLastAggroedAtMs(
      instance.aggroState.lastAggroedAtMs,
      activeTargetId,
      nowMs
    ),
    defendingYoungUntilMs:
      activeTargetId === null
        ? null
        : (instance.aggroState.defendingYoungUntilMs ?? null),
  };

  const stalkAggroResult = advancingWildlifeStalkAggroTick({
    instance,
    species,
    nearbyInstances,
    playerPosition,
    playerUserId,
    playerHealthRatio,
    playerStaminaRatio,
    playerStaminaIsDepleted,
    playerStillDurationMs,
    deltaSeconds,
    nowMs,
    resolveSpecies: resolvingWildlifeSpeciesDefinition,
    aggroState: {
      ...baseAggroState,
      activeTargetId,
    },
  });

  const stalkBehaviourParams = {
    instance,
    species,
    nearbyInstances,
    playerPosition,
    playerUserId,
    playerHealthRatio,
    playerStaminaRatio,
    playerStaminaIsDepleted,
    playerStillDurationMs,
    nowMs,
    aggroState: stalkAggroResult.aggroState,
    tickEvents: stalkAggroResult.events,
    resolveSpecies: resolvingWildlifeSpeciesDefinition,
  };

  const stalkPhaseState =
    species.temperamentId === 'stalker'
      ? advancingWildlifeStalkerBehaviour(stalkBehaviourParams)
      : advancingWildlifePackHunterBehaviour(stalkBehaviourParams);

  return {
    ...stalkPhaseState,
    stalkLockedPreyTargetId:
      stalkPhaseState.stalkLockedPreyTargetId ?? stalkLockedPreyTargetId,
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
  if (instance.aggroState.stalkLockedPreyTargetId) {
    if (attackerTargetId !== instance.aggroState.stalkLockedPreyTargetId) {
      if (damageAmount <= 0 || !species.favoritePreySpeciesIds?.length) {
        return instance;
      }

      return applyingWildlifeFavoritePreyPlayerRevengeAggro({
        instance,
        species,
        playerTargetId: attackerTargetId,
        damageAmount,
        nowMs,
      });
    }
  }

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
      ...instance.aggroState,
      threats,
      activeTargetId,
      lastDamagedAtMs: nowMs,
      chaseGiveUpUntilPlayerExitsAggro: false,
      lastAggroedAtMs: resolvingWildlifeAggroLastAggroedAtMs(
        instance.aggroState.lastAggroedAtMs,
        activeTargetId,
        nowMs
      ),
      stalkingPreySinceMs:
        activeTargetId === attackerTargetId &&
        instance.speciesId &&
        checkingWildlifeIsStalkHuntTemperament(species.temperamentId)
          ? (instance.aggroState.stalkingPreySinceMs ?? nowMs)
          : instance.aggroState.stalkingPreySinceMs,
      defendingYoungUntilMs:
        activeTargetId === null
          ? null
          : instance.aggroState.defendingYoungUntilMs,
    },
  };
}

/**
 * Clears one target from the threat table and recomputes the active target.
 */
export function releasingWildlifeAggroOnTarget(
  aggroState: DefiningWildlifeAggroState,
  targetId: string,
  targetSwitchMargin: number,
  nowMs: number
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
    ...aggroState,
    threats,
    activeTargetId,
    lastDamagedAtMs: aggroState.lastDamagedAtMs,
    lastAggroedAtMs: resolvingWildlifeAggroLastAggroedAtMs(
      aggroState.lastAggroedAtMs,
      activeTargetId,
      nowMs
    ),
    stalkingPreySinceMs:
      activeTargetId !== null &&
      aggroState.activeTargetId === activeTargetId &&
      aggroState.stalkingPreySinceMs !== null
        ? aggroState.stalkingPreySinceMs
        : null,
    stalkAttackingPreySinceMs: null,
    stalkLockedPreyTargetId:
      targetId === aggroState.stalkLockedPreyTargetId || activeTargetId === null
        ? null
        : aggroState.stalkLockedPreyTargetId,
    playerRevengeAggroUntilMs:
      targetId === aggroState.stalkLockedPreyTargetId
        ? null
        : aggroState.playerRevengeAggroUntilMs,
    defendingYoungUntilMs:
      activeTargetId === null ? null : aggroState.defendingYoungUntilMs,
  };
}

/**
 * Drops player combat intent and aggro entries for one wildlife instance.
 */
export function releasingWildlifeInstancePlayerAggro(
  instance: DefiningWildlifeInstance,
  playerUserId: string,
  targetSwitchMargin: number,
  nowMs: number
): DefiningWildlifeInstance {
  const intent = instance.aiState.intent;
  const isTargetingPlayer =
    (intent.mode === 'chase' ||
      intent.mode === 'attack' ||
      intent.mode === 'stalk' ||
      intent.mode === 'territoryWarn') &&
    intent.targetInstanceId === playerUserId;

  return {
    ...instance,
    aggroState: releasingWildlifeAggroOnTarget(
      instance.aggroState,
      playerUserId,
      targetSwitchMargin,
      nowMs
    ),
    aiState: isTargetingPlayer
      ? {
          ...instance.aiState,
          intent: { mode: 'idle' },
          chargeWindupStartedAtMs: null,
          bluffChargePlayerExitedTerritory: false,
          bluffReturnPoint: null,
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

  const activeTargetId = resolvingHighestThreatTargetId(
    threats,
    packmate.aggroState.activeTargetId,
    species.aggro.targetSwitchMargin
  );

  return {
    ...packmate,
    aggroState: {
      ...packmate.aggroState,
      threats,
      activeTargetId,
      lastDamagedAtMs: nowMs,
      lastAggroedAtMs: resolvingWildlifeAggroLastAggroedAtMs(
        packmate.aggroState.lastAggroedAtMs,
        activeTargetId,
        nowMs
      ),
      stalkingPreySinceMs:
        checkingWildlifeIsStalkHuntTemperament(species.temperamentId) &&
        activeTargetId === attackerTargetId
          ? (packmate.aggroState.stalkingPreySinceMs ?? nowMs)
          : packmate.aggroState.stalkingPreySinceMs,
      defendingYoungUntilMs:
        activeTargetId === null
          ? null
          : packmate.aggroState.defendingYoungUntilMs,
    },
  };
}
