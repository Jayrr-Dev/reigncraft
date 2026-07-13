/**
 * Applies pack-wide stalk phase events and advances the machine immediately.
 *
 * @module components/world/wildlife/domains/applyingWildlifeStalkPackEvent
 */

import { advancingWildlifePackHunterBehaviour } from '@/components/world/wildlife/domains/advancingWildlifePackHunterBehaviour';
import { advancingWildlifeStalkerBehaviour } from '@/components/world/wildlife/domains/advancingWildlifeStalkerBehaviour';
import type { DefiningWildlifeStalkEventKind } from '@/components/world/wildlife/domains/definingWildlifeStalkPhaseTypes';
import type { DefiningWildlifeSpeciesDefinition } from '@/components/world/wildlife/domains/definingWildlifeSpeciesRegistry';
import type { DefiningWildlifeInstance } from '@/components/world/wildlife/domains/definingWildlifeTypes';
import { listingWildlifeStalkPackmatesTargetingPrey } from '@/components/world/wildlife/domains/listingWildlifeStalkPackmatesTargetingPrey';
import type { ManagingWildlifeInstanceStore } from '@/components/world/wildlife/domains/managingWildlifeInstanceStore';
import {
  listingWildlifeInstances,
  replacingWildlifeInstance,
} from '@/components/world/wildlife/domains/managingWildlifeInstanceStore';
import { queueingWildlifeStalkEventOnInstance } from '@/components/world/wildlife/domains/queueingWildlifeStalkEvent';

export type ApplyingWildlifeStalkPackEventParams = {
  store: ManagingWildlifeInstanceStore;
  anchorInstance: DefiningWildlifeInstance;
  species: DefiningWildlifeSpeciesDefinition;
  preyTargetId: string;
  nearbyInstances: readonly DefiningWildlifeInstance[];
  eventKind: DefiningWildlifeStalkEventKind;
  nowMs: number;
  resolveSpecies: (
    speciesId: string
  ) => DefiningWildlifeSpeciesDefinition | null;
  playerUserId?: string | null;
  playerHealthRatio?: number | null;
  playerStaminaRatio?: number | null;
  playerStaminaIsDepleted?: boolean;
  playerStillDurationMs?: number;
  playerPosition?: DefiningWildlifeInstance['position'] | null;
  reactedAtMs?: number | null;
};

export type ApplyingWildlifeStalkEventToInstanceParams = {
  instance: DefiningWildlifeInstance;
  species: DefiningWildlifeSpeciesDefinition;
  nearbyInstances: readonly DefiningWildlifeInstance[];
  eventKind: DefiningWildlifeStalkEventKind;
  nowMs: number;
  resolveSpecies: (
    speciesId: string
  ) => DefiningWildlifeSpeciesDefinition | null;
  playerUserId?: string | null;
  playerHealthRatio?: number | null;
  playerStaminaRatio?: number | null;
  playerStaminaIsDepleted?: boolean;
  playerStillDurationMs?: number;
  playerPosition?: DefiningWildlifeInstance['position'] | null;
  reactedAtMs?: number | null;
};

/** Applies one stalk event to a single instance and runs the phase machine. */
export function applyingWildlifeStalkEventToInstance({
  instance,
  species,
  nearbyInstances,
  eventKind,
  nowMs,
  resolveSpecies,
  playerUserId = null,
  playerHealthRatio = null,
  playerStaminaRatio = null,
  playerStaminaIsDepleted = false,
  playerStillDurationMs = 0,
  playerPosition = null,
  reactedAtMs = null,
}: ApplyingWildlifeStalkEventToInstanceParams): DefiningWildlifeInstance {
  const queued = queueingWildlifeStalkEventOnInstance(instance, eventKind);
  const withReactionTimestamp =
    reactedAtMs === null
      ? queued
      : {
          ...queued,
          aggroState: {
            ...queued.aggroState,
            stalkPlayerApproachReactedAtMs: reactedAtMs,
          },
        };
  const behaviourParams = {
    instance: withReactionTimestamp,
    species,
    nearbyInstances,
    playerPosition,
    playerUserId,
    playerHealthRatio,
    playerStaminaRatio,
    playerStaminaIsDepleted,
    playerStillDurationMs,
    nowMs,
    aggroState: withReactionTimestamp.aggroState,
    tickEvents: [eventKind],
    resolveSpecies,
  };
  const nextAggroState =
    species.temperamentId === 'stalker'
      ? advancingWildlifeStalkerBehaviour(behaviourParams)
      : advancingWildlifePackHunterBehaviour(behaviourParams);

  const phaseEnteredViaFlee =
    eventKind === 'RETREAT_DONE_ROLL_FLEE' ||
    eventKind === 'DAMAGED_ROLL_FLEE' ||
    eventKind === 'ALPHA_DIED';

  return {
    ...withReactionTimestamp,
    aggroState: nextAggroState,
    aiState: phaseEnteredViaFlee
      ? {
          ...withReactionTimestamp.aiState,
          intent: { mode: 'idle' },
          fleeTargetPoint: null,
          chargeWindupStartedAtMs: null,
          steeringCache: null,
        }
      : withReactionTimestamp.aiState,
  };
}

/** Queues one stalk event on every hunter and runs the phase machine immediately. */
export function applyingWildlifeStalkPackEvent({
  store,
  anchorInstance,
  species,
  preyTargetId,
  nearbyInstances,
  eventKind,
  nowMs,
  resolveSpecies,
  playerUserId = null,
  playerHealthRatio = null,
  playerStaminaRatio = null,
  playerStaminaIsDepleted = false,
  playerStillDurationMs = 0,
  playerPosition = null,
  reactedAtMs = null,
}: ApplyingWildlifeStalkPackEventParams): void {
  const packmates = listingWildlifeStalkPackmatesTargetingPrey({
    instance: anchorInstance,
    nearbyInstances,
    preyTargetId,
  });

  if (packmates.length === 0) {
    return;
  }

  for (const packmate of packmates) {
    const packmateSpecies = resolveSpecies(packmate.speciesId);

    if (!packmateSpecies) {
      continue;
    }

    const livePackmate = store.instances.get(packmate.instanceId) ?? packmate;

    replacingWildlifeInstance(
      store,
      applyingWildlifeStalkEventToInstance({
        instance: livePackmate,
        species: packmateSpecies,
        nearbyInstances,
        eventKind,
        nowMs,
        resolveSpecies,
        playerUserId,
        playerHealthRatio,
        playerStaminaRatio,
        playerStaminaIsDepleted,
        playerStillDurationMs,
        playerPosition,
        reactedAtMs,
      })
    );
  }

  for (const instance of listingWildlifeInstances(store)) {
    if (
      instance.isDead ||
      instance.speciesId !== anchorInstance.speciesId ||
      instance.aggroState.activeTargetId !== preyTargetId
    ) {
      continue;
    }

    if (
      packmates.some((packmate) => packmate.instanceId === instance.instanceId)
    ) {
      continue;
    }

    const distantSpecies = resolveSpecies(instance.speciesId);

    if (!distantSpecies) {
      continue;
    }

    const liveInstance = store.instances.get(instance.instanceId) ?? instance;

    replacingWildlifeInstance(
      store,
      applyingWildlifeStalkEventToInstance({
        instance: liveInstance,
        species: distantSpecies,
        nearbyInstances,
        eventKind,
        nowMs,
        resolveSpecies,
        playerUserId,
        playerHealthRatio,
        playerStaminaRatio,
        playerStaminaIsDepleted,
        playerStillDurationMs,
        playerPosition,
        reactedAtMs,
      })
    );
  }
}
