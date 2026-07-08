/**
 * Stalker behaviour domain registry: guards and actions for the shared
 * statechart engine. Any species with temperamentId `stalker` uses this
 * vocabulary; species-specific tuning stays in constants and species defs.
 *
 * @module components/world/wildlife/domains/definingWildlifeStalkerBehaviourRegistry
 */

import { releasingWildlifeAggroOnTarget } from '@/components/world/wildlife/domains/advancingWildlifeAggroTick';
import { DEFINING_WILDLIFE_AGGRO_THREAT_THRESHOLD } from '@/components/world/wildlife/domains/definingWildlifeAggroConstants';
import type { DefiningWildlifeStalkPreyContext } from '@/components/world/wildlife/domains/definingWildlifeStalkPreyTypes';
import type { DefiningWildlifeStalkPhase } from '@/components/world/wildlife/domains/definingWildlifeStalkPhaseTypes';
import type { DefiningWildlifeSpeciesDefinition } from '@/components/world/wildlife/domains/definingWildlifeSpeciesRegistry';
import type {
  DefiningWildlifeAggroState,
  DefiningWildlifeInstance,
} from '@/components/world/wildlife/domains/definingWildlifeTypes';
import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import { resolvingWildlifeAggroLastAggroedAtMs } from '@/components/world/wildlife/domains/resolvingWildlifeAggroLastAggroedAtMs';
import type { DefiningStateMachineRegistry } from '@/lib/stateMachine/definingStateMachineTypes';

export type DefiningWildlifeStalkerBehaviourContext = {
  species: DefiningWildlifeSpeciesDefinition;
  instance: DefiningWildlifeInstance;
  nearbyInstances: readonly DefiningWildlifeInstance[];
  resolveSpecies: (
    speciesId: string
  ) => DefiningWildlifeSpeciesDefinition | null;
  playerPosition: DefiningWorldPlazaWorldPoint | null;
  playerUserId: string | null;
  playerHealthRatio: number | null;
  playerStaminaRatio: number | null;
  playerStaminaIsDepleted: boolean;
  playerStillDurationMs: number;
  nowMs: number;
  preyTargetId: string | null;
  prey: DefiningWildlifeStalkPreyContext | null;
  stalkingElapsedMs: number;
  stalkPackCount: number;
  aggroState: DefiningWildlifeAggroState;
  enteredPhase: DefiningWildlifeStalkPhase;
};

export type DefiningWildlifeStalkerBehaviourCommand = never;

function releasingStalkerAggroOnPrey(
  context: DefiningWildlifeStalkerBehaviourContext
): void {
  if (!context.preyTargetId) {
    return;
  }

  context.aggroState = releasingWildlifeAggroOnTarget(
    context.aggroState,
    context.preyTargetId,
    context.species.aggro.targetSwitchMargin,
    context.nowMs
  );
}

/** Stalker bounded-context registry for the shared statechart engine. */
export const DEFINING_WILDLIFE_STALKER_BEHAVIOUR_REGISTRY: DefiningStateMachineRegistry<
  DefiningWildlifeStalkerBehaviourContext,
  DefiningWildlifeStalkerBehaviourCommand
> = {
  guards: {},

  actions: {
    'stalker.commitAttack': (context) => {
      context.aggroState = {
        ...context.aggroState,
        stalkAttackingPreySinceMs:
          context.aggroState.stalkAttackingPreySinceMs ?? context.nowMs,
      };
    },

    'stalker.applyEnrageThreat': (context, event) => {
      if (!context.preyTargetId) {
        return;
      }

      const nextThreats = [
        ...context.aggroState.threats.filter(
          (entry) => entry.targetId !== context.preyTargetId
        ),
        {
          targetId: context.preyTargetId,
          threat: Math.max(
            DEFINING_WILDLIFE_AGGRO_THREAT_THRESHOLD,
            ...context.aggroState.threats.map((entry) => entry.threat),
            0
          ),
          lastUpdatedAtMs: context.nowMs,
        },
      ];

      context.aggroState = {
        ...context.aggroState,
        threats: nextThreats,
        activeTargetId: context.preyTargetId,
        lastAggroedAtMs: resolvingWildlifeAggroLastAggroedAtMs(
          context.aggroState.lastAggroedAtMs,
          context.preyTargetId,
          context.nowMs
        ),
        stalkAttackingPreySinceMs: null,
        stalkingPreySinceMs:
          context.aggroState.stalkingPreySinceMs ?? context.nowMs,
        stalkPlayerApproachReactedAtMs:
          event?.type === 'RETREAT_DONE_ROLL_ENRAGE'
            ? (context.aggroState.stalkPlayerApproachReactedAtMs ??
              context.nowMs)
            : context.aggroState.stalkPlayerApproachReactedAtMs,
        stalkPlayerApproachState: null,
      };
    },

    'stalker.onEnterIdle': (context, event) => {
      const shouldReleaseAggro =
        event?.type === 'STALK_TIMEOUT_2MIN' ||
        event?.type === 'FLEE_DISTANCE_REACHED' ||
        event?.type === 'TARGET_DEAD_OR_LOST';

      if (shouldReleaseAggro) {
        releasingStalkerAggroOnPrey(context);
      }

      context.aggroState = {
        ...context.aggroState,
        stalkingPreySinceMs: null,
        stalkConfidentSinceMs: null,
        stalkAttackingPreySinceMs: null,
        stalkPlayerApproachState: null,
        stalkLockedPreyTargetId: shouldReleaseAggro
          ? null
          : context.aggroState.stalkLockedPreyTargetId,
      };
    },

    'stalker.onEnterShadowing': (context) => {
      context.aggroState = {
        ...context.aggroState,
        stalkAttackingPreySinceMs: null,
        stalkPlayerApproachState: null,
      };
    },

    'stalker.onEnterRetreating': (context) => {
      context.aggroState = {
        ...context.aggroState,
        stalkAttackingPreySinceMs: null,
      };
    },

    'stalker.onEnterFleeing': (context, event) => {
      const releasedAggro =
        event?.type === 'RETREAT_DONE_ROLL_FLEE' ||
        event?.type === 'DAMAGED_ROLL_FLEE' ||
        event?.type === 'ALPHA_DIED';

      if (releasedAggro) {
        releasingStalkerAggroOnPrey(context);
      }

      context.aggroState = {
        ...context.aggroState,
        stalkAttackingPreySinceMs: null,
        stalkPlayerApproachState: null,
      };
    },

    'stalker.onEnterRegrouping': (context) => {
      context.aggroState = {
        ...context.aggroState,
        stalkAttackingPreySinceMs: null,
        stalkPlayerApproachReactedAtMs:
          context.aggroState.stalkPlayerApproachReactedAtMs ?? context.nowMs,
        stalkPlayerApproachState: null,
      };
    },

    'stalker.onEnterAttacking': (context, event) => {
      if (
        event?.type === 'DAMAGED_ROLL_ENRAGE' ||
        event?.type === 'RETREAT_DONE_ROLL_ENRAGE'
      ) {
        return;
      }

      context.aggroState = {
        ...context.aggroState,
        stalkAttackingPreySinceMs: null,
        stalkPlayerApproachState: null,
      };
    },

    'stalker.onEnterFormingUp': () => {},
    'stalker.onEnterSurrounding': () => {},
  },
};
