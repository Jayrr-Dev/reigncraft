/**
 * Runs the shared statechart engine for stalker-temperament wildlife.
 *
 * @module components/world/wildlife/domains/advancingWildlifeStalkerBehaviour
 */

import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import { checkingWildlifePackAlphaHasCommittedPreyAttack } from '@/components/world/wildlife/domains/checkingWildlifePackAlphaHasCommittedPreyAttack';
import { checkingWildlifeStalkAttackPhaseExpired } from '@/components/world/wildlife/domains/checkingWildlifeStalkAttackPhaseExpired';
import {
  checkingWildlifeStalkConfidentAssaultReady,
  checkingWildlifeStalkPackIsConfident,
} from '@/components/world/wildlife/domains/checkingWildlifeStalkConfidentPack';
import {
  checkingWildlifeStalkKillConditions,
  checkingWildlifeStalkPackSurroundCommit,
  resolvingWildlifeStalkWeaknessKillTriggerParamsFromPrey,
} from '@/components/world/wildlife/domains/checkingWildlifeStalkKillConditions';
import type { DefiningWildlifeSpeciesDefinition } from '@/components/world/wildlife/domains/definingWildlifeSpeciesRegistry';
import {
  DEFINING_WILDLIFE_STALK_DAMAGE_FLEE_DISTANCE_GRID,
  DEFINING_WILDLIFE_STALK_PLAYER_APPROACH_REGROUP_FLEE_DISTANCE_GRID,
} from '@/components/world/wildlife/domains/definingWildlifeStalkConstants';
import { DEFINING_WILDLIFE_STALKER_BEHAVIOUR_MACHINE } from '@/components/world/wildlife/domains/definingWildlifeStalkerBehaviourMachine';
import {
  DEFINING_WILDLIFE_STALKER_BEHAVIOUR_REGISTRY,
  type DefiningWildlifeStalkerBehaviourContext,
} from '@/components/world/wildlife/domains/definingWildlifeStalkerBehaviourRegistry';
import {
  DEFINING_WILDLIFE_STALK_PHASE_IDLE,
  type DefiningWildlifeStalkEventKind,
  type DefiningWildlifeStalkPhase,
} from '@/components/world/wildlife/domains/definingWildlifeStalkPhaseTypes';
import type {
  DefiningWildlifeAggroState,
  DefiningWildlifeInstance,
} from '@/components/world/wildlife/domains/definingWildlifeTypes';
import { countingWildlifeStalkPackmatesTargetingPrey } from '@/components/world/wildlife/domains/listingWildlifeStalkPackmatesTargetingPrey';
import { resolvingWildlifeSpawnPackAlphaInstance } from '@/components/world/wildlife/domains/resolvingWildlifeSpawnPackAlphaInstance';
import { resolvingWildlifeStalkPreyContext } from '@/components/world/wildlife/domains/resolvingWildlifeStalkPreyContext';
import { processingStateMachineExplicitEvents } from '@/lib/stateMachine/advancingStateMachine';
import type { DefiningStateMachineSnapshot } from '@/lib/stateMachine/definingStateMachineTypes';

export type AdvancingWildlifeStalkerBehaviourParams = {
  instance: DefiningWildlifeInstance;
  species: DefiningWildlifeSpeciesDefinition;
  nearbyInstances: readonly DefiningWildlifeInstance[];
  playerPosition: DefiningWorldPlazaWorldPoint | null;
  playerUserId: string | null;
  playerHealthRatio: number | null;
  playerStaminaRatio: number | null;
  playerStaminaIsDepleted: boolean;
  playerStillDurationMs: number;
  nowMs: number;
  aggroState: DefiningWildlifeAggroState;
  tickEvents?: readonly DefiningWildlifeStalkEventKind[];
  resolveSpecies: (
    speciesId: string
  ) => DefiningWildlifeSpeciesDefinition | null;
};

function resolvingDistanceGrid(
  left: DefiningWorldPlazaWorldPoint,
  right: DefiningWorldPlazaWorldPoint
): number {
  return Math.hypot(left.x - right.x, left.y - right.y);
}

function listingWildlifeNearbyAndSelf(
  instance: DefiningWildlifeInstance,
  nearbyInstances: readonly DefiningWildlifeInstance[]
): DefiningWildlifeInstance[] {
  const byId = new Map<string, DefiningWildlifeInstance>();
  byId.set(instance.instanceId, instance);

  for (const neighbor of nearbyInstances) {
    byId.set(neighbor.instanceId, neighbor);
  }

  return [...byId.values()];
}

function listingStalkerBehaviourTimerEvents(
  context: DefiningWildlifeStalkerBehaviourContext
): DefiningWildlifeStalkEventKind[] {
  const events: DefiningWildlifeStalkEventKind[] = [];
  const phase = context.enteredPhase;
  const { aggroState, prey, instance, nowMs } = context;

  if (
    phase === 'fleeing' &&
    instance.packAlphaDeathScatterUntilMs !== null &&
    instance.packAlphaDeathScatterUntilMs !== undefined &&
    nowMs >= instance.packAlphaDeathScatterUntilMs
  ) {
    events.push('FLEE_DISTANCE_REACHED');
  }

  if (!prey) {
    return events;
  }

  if (
    phase === 'fleeing' &&
    (instance.packAlphaDeathScatterUntilMs === null ||
      instance.packAlphaDeathScatterUntilMs === undefined) &&
    resolvingDistanceGrid(instance.position, prey.position) >=
      DEFINING_WILDLIFE_STALK_DAMAGE_FLEE_DISTANCE_GRID
  ) {
    events.push('FLEE_DISTANCE_REACHED');
  }

  if (
    phase === 'regrouping' &&
    resolvingDistanceGrid(instance.position, prey.position) >=
      DEFINING_WILDLIFE_STALK_PLAYER_APPROACH_REGROUP_FLEE_DISTANCE_GRID
  ) {
    events.push('REGROUP_DISTANCE_REACHED');
  }

  if (
    phase === 'attacking' &&
    aggroState.stalkAttackingPreySinceMs !== null &&
    aggroState.stalkAttackingPreySinceMs !== undefined &&
    checkingWildlifeStalkAttackPhaseExpired({
      stalkAttackingPreySinceMs: aggroState.stalkAttackingPreySinceMs,
      nowMs,
    })
  ) {
    events.push('ATTACK_TIMEOUT_10S');
  }

  if (
    phase === 'formingUp' &&
    checkingWildlifeStalkConfidentAssaultReady({
      stalkConfidentSinceMs: aggroState.stalkConfidentSinceMs,
      preyTargetId: prey.targetId,
      nowMs,
    })
  ) {
    events.push('FORMATION_TIMER_DONE');
  }

  if (phase === 'surrounding') {
    const alpha = resolvingWildlifeSpawnPackAlphaInstance({
      instance,
      instances: listingWildlifeNearbyAndSelf(
        instance,
        context.nearbyInstances
      ),
      resolveSpecies: context.resolveSpecies,
    });

    if (
      alpha &&
      checkingWildlifePackAlphaHasCommittedPreyAttack({
        alpha,
        preyTargetId: prey.targetId,
        preyPosition: prey.position,
      })
    ) {
      events.push('SLOT_REACHED_OR_ALPHA_COMMIT');
    }
  }

  if (
    (phase === 'shadowing' || phase === 'formingUp') &&
    !checkingWildlifeStalkPackIsConfident(context.stalkPackCount) &&
    (aggroState.stalkConfidentSinceMs ?? null) !== null
  ) {
    events.push('PACK_THINNED');
  }

  const weaknessParams =
    resolvingWildlifeStalkWeaknessKillTriggerParamsFromPrey(prey);
  const confidenceCommitParams = {
    stalkPackCount: context.stalkPackCount,
    preyTargetId: prey.targetId,
    stalkingPreySinceMs: aggroState.stalkingPreySinceMs,
    nowMs: context.nowMs,
  };
  const killWindowOpen = checkingWildlifeStalkKillConditions({
    ...weaknessParams,
    stalkingElapsedMs: context.stalkingElapsedMs,
    ...confidenceCommitParams,
  });
  const surroundCommit = checkingWildlifeStalkPackSurroundCommit({
    ...weaknessParams,
    stalkingElapsedMs: context.stalkingElapsedMs,
    ...confidenceCommitParams,
  });

  if (phase === 'shadowing' && surroundCommit) {
    events.push('KILL_WINDOW_PLUS_PACK');
  } else if (phase === 'shadowing' && killWindowOpen) {
    events.push('KILL_WINDOW_OPEN');
  }

  return events;
}

function resolvingStalkerBehaviourSnapshot(
  aggroState: DefiningWildlifeAggroState
): DefiningStateMachineSnapshot {
  return {
    machineId: DEFINING_WILDLIFE_STALKER_BEHAVIOUR_MACHINE.id,
    definitionVersion: DEFINING_WILDLIFE_STALKER_BEHAVIOUR_MACHINE.version ?? 1,
    currentState: aggroState.stalkPhase ?? DEFINING_WILDLIFE_STALK_PHASE_IDLE,
    previousState: null,
    stateTimeMs: 0,
  };
}

function creatingStalkerBehaviourContext(
  params: AdvancingWildlifeStalkerBehaviourParams,
  aggroState: DefiningWildlifeAggroState
): DefiningWildlifeStalkerBehaviourContext {
  const activeTargetId = aggroState.activeTargetId;
  const prey = activeTargetId
    ? resolvingWildlifeStalkPreyContext({
        activeTargetId,
        nearbyInstances: params.nearbyInstances,
        playerUserId: params.playerUserId,
        playerPosition: params.playerPosition,
        playerHealthRatio: params.playerHealthRatio,
        playerStaminaRatio: params.playerStaminaRatio,
        playerStaminaIsDepleted: params.playerStaminaIsDepleted,
        playerStillDurationMs: params.playerStillDurationMs,
      })
    : null;
  const stalkingElapsedMs =
    aggroState.stalkingPreySinceMs === null ||
    aggroState.stalkingPreySinceMs === undefined
      ? 0
      : Math.max(0, params.nowMs - aggroState.stalkingPreySinceMs);
  const stalkPackCount =
    prey === null
      ? 0
      : countingWildlifeStalkPackmatesTargetingPrey({
          instance: params.instance,
          nearbyInstances: params.nearbyInstances,
          preyTargetId: prey.targetId,
        });

  return {
    species: params.species,
    instance: params.instance,
    nearbyInstances: params.nearbyInstances,
    resolveSpecies: params.resolveSpecies,
    playerPosition: params.playerPosition,
    playerUserId: params.playerUserId,
    playerHealthRatio: params.playerHealthRatio,
    playerStaminaRatio: params.playerStaminaRatio,
    playerStaminaIsDepleted: params.playerStaminaIsDepleted,
    playerStillDurationMs: params.playerStillDurationMs,
    nowMs: params.nowMs,
    preyTargetId: activeTargetId,
    prey,
    stalkingElapsedMs,
    stalkPackCount,
    aggroState,
    enteredPhase: aggroState.stalkPhase ?? DEFINING_WILDLIFE_STALK_PHASE_IDLE,
  };
}

function syncingAggroStateFromSnapshot(
  aggroState: DefiningWildlifeAggroState,
  snapshot: DefiningStateMachineSnapshot,
  transitioned: boolean,
  nowMs: number
): DefiningWildlifeAggroState {
  const nextPhase = snapshot.currentState as DefiningWildlifeStalkPhase;

  return {
    ...aggroState,
    stalkPhase: nextPhase,
    stalkPhaseEnteredAtMs: transitioned
      ? nowMs
      : (aggroState.stalkPhaseEnteredAtMs ?? null),
    pendingStalkEvents: [],
  };
}

/**
 * Advances stalker behaviour through the shared statechart engine.
 * Replaces the bespoke phase tick; any `stalker` temperament species uses this.
 */
export function advancingWildlifeStalkerBehaviour({
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
  aggroState,
  tickEvents = [],
  resolveSpecies,
}: AdvancingWildlifeStalkerBehaviourParams): DefiningWildlifeAggroState {
  if (species.temperamentId !== 'stalker') {
    return aggroState;
  }

  let nextAggroState: DefiningWildlifeAggroState = {
    ...aggroState,
    stalkPhase: aggroState.stalkPhase ?? DEFINING_WILDLIFE_STALK_PHASE_IDLE,
    stalkPhaseEnteredAtMs: aggroState.stalkPhaseEnteredAtMs ?? null,
  };

  const context = creatingStalkerBehaviourContext(
    {
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
      aggroState: nextAggroState,
      tickEvents,
      resolveSpecies,
    },
    nextAggroState
  );

  context.enteredPhase =
    nextAggroState.stalkPhase ?? DEFINING_WILDLIFE_STALK_PHASE_IDLE;

  const timerEvents =
    context.prey === null ? [] : listingStalkerBehaviourTimerEvents(context);

  const eventKinds = [
    ...(nextAggroState.pendingStalkEvents ?? []),
    ...tickEvents,
    ...timerEvents,
  ];
  const events = eventKinds.map((type) => ({ type }));

  const result = processingStateMachineExplicitEvents({
    definition: DEFINING_WILDLIFE_STALKER_BEHAVIOUR_MACHINE,
    registry: DEFINING_WILDLIFE_STALKER_BEHAVIOUR_REGISTRY,
    snapshot: resolvingStalkerBehaviourSnapshot(nextAggroState),
    events,
    context,
    allowInternalTransitions: true,
    settleEventless: false,
    onStep: (currentStateId) => {
      context.enteredPhase = currentStateId as DefiningWildlifeStalkPhase;
    },
    beforeTransition: (nextStateId) => {
      context.enteredPhase = nextStateId as DefiningWildlifeStalkPhase;
    },
  });

  nextAggroState = syncingAggroStateFromSnapshot(
    context.aggroState,
    result.snapshot,
    result.transitioned,
    nowMs
  );

  return nextAggroState;
}
