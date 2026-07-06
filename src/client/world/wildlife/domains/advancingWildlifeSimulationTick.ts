/**
 * Main wildlife simulation tick orchestrator.
 *
 * @module components/world/wildlife/domains/advancingWildlifeSimulationTick
 */

import type { DefiningWorldBuildingPlacedBlock } from '@/components/world/building/domains/definingWorldBuildingPlacedBlock';
import type { DefiningWorldPlazaGirlSampleWalkDirection } from '@/components/world/domains/definingWorldPlazaGirlSampleWalkConstants';
import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import { computingWorldPlazaEntityHealthDamage } from '@/components/world/health/domains/computingWorldPlazaEntityHealthDamage';
import {
  advancingWildlifeAggroTick,
  applyingWildlifeDamageThreat,
  sharingWildlifePackThreat,
} from '@/components/world/wildlife/domains/advancingWildlifeAggroTick';
import { advancingWildlifeBehaviorTick } from '@/components/world/wildlife/domains/advancingWildlifeBehaviorTick';
import {
  advancingWildlifeHungerTick,
  refillingWildlifeHungerAfterKill,
} from '@/components/world/wildlife/domains/advancingWildlifeHungerTick';
import { DEFINING_WILDLIFE_PACK_THREAT_SHARE_RATIO } from '@/components/world/wildlife/domains/definingWildlifeAggroConstants';
import type { DefiningWildlifeBehaviorBlackboard } from '@/components/world/wildlife/domains/definingWildlifeBehaviorConditionRegistry';
import { checkingWildlifePredatorMayHuntPrey } from '@/components/world/wildlife/domains/definingWildlifeFoodChain';
import type { DefiningWildlifeSpeciesDefinition } from '@/components/world/wildlife/domains/definingWildlifeSpeciesRegistry';
import type {
  DefiningWildlifeBehaviorIntent,
  DefiningWildlifeInstance,
  DefiningWildlifeNetworkSnapshot,
} from '@/components/world/wildlife/domains/definingWildlifeTypes';
import type { ManagingWildlifeInstanceStore } from '@/components/world/wildlife/domains/managingWildlifeInstanceStore';
import {
  despawningWildlifeInstancesBeyondRadius,
  hydratingWildlifeInstancesNearPoint,
  listingWildlifeInstances,
  replacingWildlifeInstance,
} from '@/components/world/wildlife/domains/managingWildlifeInstanceStore';
import { resolvingWildlifeSteeringStep } from '@/components/world/wildlife/domains/resolvingWildlifeSteeringStep';

export const DEFINING_WILDLIFE_AI_THINK_INTERVAL_MS = 200;

const DEFINING_WILDLIFE_MELEE_RANGE_GRID = 1.1;
const DEFINING_WILDLIFE_MELEE_COOLDOWN_MS = 900;

export type AdvancingWildlifeSimulationTickParams = {
  store: ManagingWildlifeInstanceStore;
  center: DefiningWorldPlazaWorldPoint;
  playerPosition: DefiningWorldPlazaWorldPoint | null;
  playerUserId: string | null;
  resolveSpecies: (
    speciesId: string
  ) => DefiningWildlifeSpeciesDefinition | null;
  deltaSeconds: number;
  nowMs: number;
  placedBlocks?: readonly DefiningWorldBuildingPlacedBlock[];
  onPlayerDamaged?: (damageAmount: number) => void;
  isLeader: boolean;
  remoteSnapshots?: readonly DefiningWildlifeNetworkSnapshot[];
};

export type AdvancingWildlifeSimulationTickResult = {
  snapshots: readonly DefiningWildlifeNetworkSnapshot[];
};

function resolvingFacingFromDelta(
  deltaX: number,
  deltaY: number
): DefiningWorldPlazaGirlSampleWalkDirection {
  if (Math.abs(deltaX) >= Math.abs(deltaY)) {
    return deltaX >= 0 ? 'Right' : 'Left';
  }

  return deltaY >= 0 ? 'Down' : 'Up';
}

function resolvingDesiredDirection(
  instance: DefiningWildlifeInstance,
  intent: DefiningWildlifeBehaviorIntent
): { x: number; y: number } {
  const targetPoint =
    intent.mode === 'chase' ||
    intent.mode === 'attack' ||
    intent.mode === 'flee' ||
    intent.mode === 'wander' ||
    intent.mode === 'return'
      ? intent.targetPoint
      : null;

  if (!targetPoint) {
    return { x: 0, y: 0 };
  }

  const deltaX = targetPoint.x - instance.position.x;
  const deltaY = targetPoint.y - instance.position.y;
  const length = Math.hypot(deltaX, deltaY) || 1;

  return { x: deltaX / length, y: deltaY / length };
}

function applyingWildlifeMeleeAttack(
  attacker: DefiningWildlifeInstance,
  attackerSpecies: DefiningWildlifeSpeciesDefinition,
  target: DefiningWildlifeInstance | null,
  targetSpecies: DefiningWildlifeSpeciesDefinition | null,
  playerPosition: DefiningWorldPlazaWorldPoint | null,
  intent: DefiningWildlifeBehaviorIntent,
  nowMs: number,
  onPlayerDamaged?: (damageAmount: number) => void
): {
  attacker: DefiningWildlifeInstance;
  target: DefiningWildlifeInstance | null;
} {
  if (intent.mode !== 'attack') {
    return { attacker, target };
  }

  if (target && targetSpecies) {
    const distance = Math.hypot(
      attacker.position.x - target.position.x,
      attacker.position.y - target.position.y
    );

    if (distance > DEFINING_WILDLIFE_MELEE_RANGE_GRID) {
      return { attacker, target };
    }

    const damageResult = computingWorldPlazaEntityHealthDamage({
      state: target.healthState,
      rawAmount: attackerSpecies.vitals.attackPower,
      kind: 'physical',
      nowMs,
      options: { skipDamageRoll: true },
    });

    const nextHealth = damageResult.state.currentHealth;
    const died = nextHealth <= 0;

    return {
      attacker: {
        ...attacker,
        hungerState: died
          ? refillingWildlifeHungerAfterKill(
              attacker.hungerState,
              attackerSpecies,
              nowMs
            )
          : attacker.hungerState,
        aiState: {
          ...attacker.aiState,
          motionClip: 'attack',
        },
      },
      target: {
        ...target,
        healthState: damageResult.state,
        isDead: died,
        diedAtMs: died ? nowMs : null,
        aiState: {
          ...target.aiState,
          motionClip: died ? 'die' : 'takeDamage',
        },
      },
    };
  }

  if (playerPosition && onPlayerDamaged) {
    const distance = Math.hypot(
      attacker.position.x - playerPosition.x,
      attacker.position.y - playerPosition.y
    );

    if (distance <= DEFINING_WILDLIFE_MELEE_RANGE_GRID) {
      onPlayerDamaged(attackerSpecies.vitals.attackPower);
    }
  }

  return {
    attacker: {
      ...attacker,
      aiState: { ...attacker.aiState, motionClip: 'attack' },
    },
    target,
  };
}

function buildingWildlifeNetworkSnapshots(
  instances: readonly DefiningWildlifeInstance[]
): readonly DefiningWildlifeNetworkSnapshot[] {
  return instances
    .filter((instance) => !instance.isDead)
    .map((instance) => ({
      instanceId: instance.instanceId,
      speciesId: instance.speciesId,
      x: instance.position.x,
      y: instance.position.y,
      facingDirection: instance.facingDirection,
      motionClip: instance.aiState.motionClip,
      healthCurrent: instance.healthState.currentHealth,
    }));
}

function applyingRemoteWildlifeSnapshots(
  store: ManagingWildlifeInstanceStore,
  snapshots: readonly DefiningWildlifeNetworkSnapshot[]
): void {
  for (const snapshot of snapshots) {
    const existing = store.instances.get(snapshot.instanceId);

    if (!existing) {
      continue;
    }

    replacingWildlifeInstance(store, {
      ...existing,
      position: {
        x: snapshot.x,
        y: snapshot.y,
        layer: existing.position.layer,
      },
      facingDirection:
        snapshot.facingDirection as DefiningWildlifeInstance['facingDirection'],
      healthState: {
        ...existing.healthState,
        currentHealth: snapshot.healthCurrent,
      },
      aiState: {
        ...existing.aiState,
        motionClip:
          snapshot.motionClip as DefiningWildlifeInstance['aiState']['motionClip'],
      },
    });
  }
}

/**
 * Advances one wildlife simulation frame.
 */
export function advancingWildlifeSimulationTick({
  store,
  center,
  playerPosition,
  playerUserId,
  resolveSpecies,
  deltaSeconds,
  nowMs,
  placedBlocks = [],
  onPlayerDamaged,
  isLeader,
  remoteSnapshots = [],
}: AdvancingWildlifeSimulationTickParams): AdvancingWildlifeSimulationTickResult {
  hydratingWildlifeInstancesNearPoint(store, center, resolveSpecies, nowMs);
  despawningWildlifeInstancesBeyondRadius(store, center);

  if (!isLeader) {
    applyingRemoteWildlifeSnapshots(store, remoteSnapshots);
    return {
      snapshots: buildingWildlifeNetworkSnapshots(
        listingWildlifeInstances(store)
      ),
    };
  }

  const instances = [...listingWildlifeInstances(store)];
  const updatedById = new Map<string, DefiningWildlifeInstance>();

  for (const instance of instances) {
    const species = resolveSpecies(instance.speciesId);

    if (!species || instance.isDead) {
      updatedById.set(instance.instanceId, instance);
      continue;
    }

    let nextInstance = { ...instance };

    if (
      nowMs - nextInstance.aiState.lastThinkAtMs >=
      DEFINING_WILDLIFE_AI_THINK_INTERVAL_MS
    ) {
      const nearbyInstances = instances.filter(
        (entry) => entry.instanceId !== instance.instanceId && !entry.isDead
      );

      nextInstance = {
        ...nextInstance,
        aggroState: advancingWildlifeAggroTick({
          instance: nextInstance,
          species,
          nearbyInstances,
          playerPosition,
          playerUserId,
          deltaSeconds,
          nowMs,
        }),
      };

      const blackboard: DefiningWildlifeBehaviorBlackboard = {
        instance: nextInstance,
        species,
        nearbyInstances,
        playerPosition,
        playerUserId,
        nowMs,
        selectedPreyInstanceId: null,
        resolveSpecies,
      };

      const intent = advancingWildlifeBehaviorTick(blackboard);
      const isGrazing = intent.mode === 'graze';

      nextInstance = {
        ...nextInstance,
        hungerState: advancingWildlifeHungerTick({
          state: nextInstance.hungerState,
          species,
          deltaSeconds,
          isGrazing,
          nowMs,
        }).state,
        aiState: {
          ...nextInstance.aiState,
          intent,
          lastThinkAtMs: nowMs,
        },
      };
    } else {
      nextInstance = {
        ...nextInstance,
        hungerState: advancingWildlifeHungerTick({
          state: nextInstance.hungerState,
          species,
          deltaSeconds,
          isGrazing: nextInstance.aiState.intent.mode === 'graze',
          nowMs,
        }).state,
      };
    }

    const intent = nextInstance.aiState.intent;
    const desiredDirection = resolvingDesiredDirection(nextInstance, intent);
    const speed =
      intent.mode === 'flee' ||
      intent.mode === 'chase' ||
      intent.mode === 'attack'
        ? species.vitals.runSpeedGridPerSecond
        : intent.mode === 'wander' || intent.mode === 'return'
          ? species.vitals.walkSpeedGridPerSecond
          : 0;

    if (
      speed > 0 &&
      intent.mode !== 'attack' &&
      intent.mode !== 'graze' &&
      intent.mode !== 'idle'
    ) {
      const steering = resolvingWildlifeSteeringStep({
        instance: nextInstance,
        species,
        desiredDirection,
        speedGridPerSecond: speed,
        deltaSeconds,
        nearbyInstances: instances,
        placedBlocks,
      });

      nextInstance = {
        ...nextInstance,
        position: steering.nextPosition,
        facingDirection: resolvingFacingFromDelta(
          steering.nextPosition.x - nextInstance.position.x,
          steering.nextPosition.y - nextInstance.position.y
        ),
        aiState: {
          ...nextInstance.aiState,
          isMoving: steering.moved,
          motionClip:
            intent.mode === 'flee' || intent.mode === 'chase'
              ? 'run'
              : steering.moved
                ? 'walk'
                : 'idle',
        },
      };
    } else if (intent.mode === 'graze' || intent.mode === 'idle') {
      nextInstance = {
        ...nextInstance,
        aiState: {
          ...nextInstance.aiState,
          isMoving: false,
          motionClip: 'idle',
        },
      };
    }

    if (intent.mode === 'attack') {
      const prey =
        intent.targetInstanceId && intent.targetInstanceId !== playerUserId
          ? (instances.find(
              (entry) => entry.instanceId === intent.targetInstanceId
            ) ??
            updatedById.get(intent.targetInstanceId) ??
            null)
          : null;
      const preySpecies = prey ? resolveSpecies(prey.speciesId) : null;

      if (
        prey &&
        preySpecies &&
        checkingWildlifePredatorMayHuntPrey(species, preySpecies)
      ) {
        const attackResult = applyingWildlifeMeleeAttack(
          nextInstance,
          species,
          prey,
          preySpecies,
          playerPosition,
          intent,
          nowMs
        );
        nextInstance = attackResult.attacker;

        if (attackResult.target) {
          updatedById.set(attackResult.target.instanceId, attackResult.target);
        }
      } else if (playerPosition && onPlayerDamaged) {
        const attackResult = applyingWildlifeMeleeAttack(
          nextInstance,
          species,
          null,
          null,
          playerPosition,
          intent,
          nowMs,
          onPlayerDamaged
        );
        nextInstance = attackResult.attacker;
      }
    }

    updatedById.set(nextInstance.instanceId, nextInstance);
  }

  for (const [instanceId, instance] of updatedById) {
    replacingWildlifeInstance(store, instance);
  }

  return {
    snapshots: buildingWildlifeNetworkSnapshots(
      listingWildlifeInstances(store)
    ),
  };
}

/**
 * Applies player or remote damage to one wildlife instance.
 */
export function applyingWildlifeInstanceDamage(
  store: ManagingWildlifeInstanceStore,
  instanceId: string,
  damageAmount: number,
  attackerTargetId: string,
  resolveSpecies: (
    speciesId: string
  ) => DefiningWildlifeSpeciesDefinition | null,
  nowMs: number
): DefiningWildlifeInstance | null {
  const instance = store.instances.get(instanceId);

  if (!instance || instance.isDead) {
    return null;
  }

  const species = resolveSpecies(instance.speciesId);

  if (!species) {
    return null;
  }

  const damageResult = computingWorldPlazaEntityHealthDamage({
    state: instance.healthState,
    rawAmount: damageAmount,
    kind: 'physical',
    nowMs,
    options: { skipDamageRoll: true },
  });

  const died = damageResult.state.currentHealth <= 0;
  const nextInstance = applyingWildlifeDamageThreat(
    {
      ...instance,
      healthState: damageResult.state,
      isDead: died,
      diedAtMs: died ? nowMs : null,
      aiState: {
        ...instance.aiState,
        motionClip: died ? 'die' : 'takeDamage',
      },
    },
    species,
    attackerTargetId,
    damageAmount,
    nowMs
  );

  replacingWildlifeInstance(store, nextInstance);

  const sharedThreat =
    damageAmount *
    species.aggro.threatPerDamage *
    DEFINING_WILDLIFE_PACK_THREAT_SHARE_RATIO;

  for (const packmate of listingWildlifeInstances(store)) {
    if (
      packmate.instanceId === instanceId ||
      packmate.speciesId !== instance.speciesId
    ) {
      continue;
    }

    const distance = Math.hypot(
      packmate.position.x - instance.position.x,
      packmate.position.y - instance.position.y
    );

    if (distance > species.aggro.packShareRadiusGrid) {
      continue;
    }

    replacingWildlifeInstance(
      store,
      sharingWildlifePackThreat(
        packmate,
        species,
        attackerTargetId,
        sharedThreat,
        nowMs
      )
    );
  }

  return nextInstance;
}
