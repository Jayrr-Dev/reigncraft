/**
 * Advances fishing cast surprise encounters: stalk → arm / appease / flee,
 * pinguin curiosity expiry, fairy soft departure.
 *
 * @module components/world/wildlife/domains/advancingWildlifeFishingCastEncounterTick
 */

import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import { checkingWorldPlazaInventoryItemIsFishingCatchCreatureFood } from '@/components/world/fishing/domains/checkingWorldPlazaInventoryItemIsFishingCatchCreatureFood';
import { resolvingWildlifeSpeciesDefinition } from '@/components/world/wildlife/domains/definingWildlifeSpeciesRegistry';
import type {
  DefiningWildlifeFishingCastEncounterState,
  DefiningWildlifeInstance,
} from '@/components/world/wildlife/domains/definingWildlifeTypes';
import { listingWildlifeGroundFoodItems } from '@/components/world/wildlife/domains/managingWildlifeGroundFoodBridge';
import { type ManagingWildlifeInstanceStore } from '@/components/world/wildlife/domains/managingWildlifeInstanceStore';
import { resolvingWorldPlazaFishingCastEncounterStalkIntent } from '@/components/world/fishing/domains/resolvingWorldPlazaFishingCastEncounterStalkIntent';
import { resolvingWildlifeFollowPlayerIntentFromPlayer } from '@/components/world/wildlife/domains/resolvingWildlifeDocileFollowPlayerIntent';
import { resolvingWildlifeNearestEdibleGroundFood } from '@/components/world/wildlife/domains/resolvingWildlifeNearestEdibleGroundFood';
import { applyingWildlifePetCuriousFollowGrant } from '@/components/world/wildlife/pets/domains/applyingWildlifePetCuriousFollowGrant';

export type AdvancingWildlifeFishingCastEncounterTickParams = {
  readonly store: ManagingWildlifeInstanceStore;
  readonly playerPosition: DefiningWorldPlazaWorldPoint | null;
  readonly playerUserId: string | null;
  readonly nowMs: number;
};

function checkingFishGroundFoodNearInstance(
  instance: DefiningWildlifeInstance,
  nowMs: number
): boolean {
  const species = resolvingWildlifeSpeciesDefinition(instance.speciesId);

  if (!species) {
    return false;
  }

  const nearest = resolvingWildlifeNearestEdibleGroundFood(
    instance.position,
    species,
    listingWildlifeGroundFoodItems(nowMs)
  );

  if (!nearest) {
    return false;
  }

  return checkingWorldPlazaInventoryItemIsFishingCatchCreatureFood(
    nearest.itemTypeId
  );
}

function creatingAppeasedPredator(
  instance: DefiningWildlifeInstance
): DefiningWildlifeInstance {
  const encounter = instance.fishingCastEncounter;

  if (!encounter) {
    return instance;
  }

  const nextEncounter: DefiningWildlifeFishingCastEncounterState = {
    ...encounter,
    phase: 'appeased',
  };

  return {
    ...instance,
    aggressionLevel: 'normal',
    fishingCastEncounter: nextEncounter,
    aggroState: {
      ...instance.aggroState,
      threats: [],
      activeTargetId: null,
      chaseEngagedAtMs: null,
      lastAggroedAtMs: null,
      stalkingPreySinceMs: null,
      stalkPhase: 'idle',
      stalkPhaseEnteredAtMs: null,
      pendingStalkEvents: [],
    },
    hungerState: {
      ...instance.hungerState,
      hungerRatio: Math.min(instance.hungerState.hungerRatio, 0.45),
      driveLevel: 'hungry',
    },
    aiState: {
      ...instance.aiState,
      intent: { mode: 'idle' },
    },
  };
}

function creatingArmedPredator(
  instance: DefiningWildlifeInstance,
  encounter: DefiningWildlifeFishingCastEncounterState,
  playerUserId: string | null,
  playerPosition: DefiningWorldPlazaWorldPoint | null,
  nowMs: number
): DefiningWildlifeInstance {
  const armedEncounter: DefiningWildlifeFishingCastEncounterState = {
    ...encounter,
    phase: 'armed',
  };

  if (!playerUserId || !playerPosition) {
    return {
      ...instance,
      fishingCastEncounter: armedEncounter,
      aggressionLevel: 'aggressive',
      temperamentOverrideId: instance.temperamentOverrideId ?? 'predator',
    };
  }

  return {
    ...instance,
    fishingCastEncounter: armedEncounter,
    aggressionLevel: 'aggressive',
    temperamentOverrideId: instance.temperamentOverrideId ?? 'predator',
    aggroState: {
      ...instance.aggroState,
      threats: [
        {
          targetId: playerUserId,
          threat: 12,
          lastUpdatedAtMs: nowMs,
        },
      ],
      activeTargetId: playerUserId,
      chaseEngagedAtMs: nowMs,
      lastAggroedAtMs: nowMs,
      stalkingPreySinceMs: null,
      stalkPhase: 'idle',
      stalkPhaseEnteredAtMs: null,
      pendingStalkEvents: [],
    },
    aiState: {
      ...instance.aiState,
      intent: {
        mode: 'chase',
        targetInstanceId: playerUserId,
        targetPoint: playerPosition,
      },
    },
  };
}

/**
 * Per-tick fishing cast encounter state machine for all live instances.
 */
export function advancingWildlifeFishingCastEncounterTick({
  store,
  playerPosition,
  playerUserId,
  nowMs,
}: AdvancingWildlifeFishingCastEncounterTickParams): void {
  for (const [instanceId, instance] of store.instances) {
    if (instance.isDead || !instance.fishingCastEncounter) {
      continue;
    }

    const encounter = instance.fishingCastEncounter;

    if (encounter.kind === 'predator') {
      if (encounter.phase === 'appeased' || encounter.phase === 'fled') {
        continue;
      }

      if (playerPosition) {
        const distanceToPlayer = Math.hypot(
          instance.position.x - playerPosition.x,
          instance.position.y - playerPosition.y
        );

        if (
          encounter.phase === 'stalking' &&
          distanceToPlayer >= encounter.fleeDistanceGrid
        ) {
          store.instances.delete(instanceId);
          continue;
        }
      }

      if (
        encounter.phase === 'stalking' &&
        checkingFishGroundFoodNearInstance(instance, nowMs)
      ) {
        store.instances.set(instanceId, creatingAppeasedPredator(instance));
        continue;
      }

      if (encounter.phase === 'stalking' && nowMs >= encounter.armedAtMs) {
        store.instances.set(
          instanceId,
          creatingArmedPredator(
            instance,
            encounter,
            playerUserId,
            playerPosition,
            nowMs
          )
        );
        continue;
      }

      if (encounter.phase === 'stalking') {
        store.instances.set(instanceId, {
          ...instance,
          aiState: {
            ...instance.aiState,
            intent: resolvingWorldPlazaFishingCastEncounterStalkIntent({
              instancePosition: instance.position,
              playerUserId,
              playerPosition,
            }),
          },
          aggroState: {
            ...instance.aggroState,
            threats: [],
            activeTargetId: null,
            chaseEngagedAtMs: null,
          },
        });
      }

      continue;
    }

    if (encounter.kind === 'pinguin') {
      let nextInstance = instance;

      if (
        playerUserId &&
        (nextInstance.aiState.intent.mode === 'followPlayer' ||
          (nextInstance.aiState.docileFollowUntilMs != null &&
            nextInstance.aiState.docileFollowUntilMs > nowMs))
      ) {
        nextInstance = applyingWildlifePetCuriousFollowGrant({
          instance: nextInstance,
          ownerUserId: playerUserId,
          nowMs,
        });
      }

      if (
        checkingFishGroundFoodNearInstance(nextInstance, nowMs) &&
        playerUserId
      ) {
        nextInstance = {
          ...nextInstance,
          aiState: {
            ...nextInstance.aiState,
            intent: { mode: 'idle' },
          },
          hungerState: {
            ...nextInstance.hungerState,
            hungerRatio: Math.min(nextInstance.hungerState.hungerRatio, 0.4),
            driveLevel: 'hungry',
          },
        };
        nextInstance = applyingWildlifePetCuriousFollowGrant({
          instance: {
            ...nextInstance,
            aiState: {
              ...nextInstance.aiState,
              intent: resolvingWildlifeFollowPlayerIntentFromPlayer({
                playerUserId,
                playerPosition,
              }),
              docileFollowUntilMs: Math.max(
                nextInstance.aiState.docileFollowUntilMs ?? nowMs,
                nowMs + 30_000
              ),
            },
          },
          ownerUserId: playerUserId,
          nowMs,
        });
      }

      if (
        encounter.expiresAtMs != null &&
        nowMs >= encounter.expiresAtMs &&
        !nextInstance.petBond?.isPersistent
      ) {
        if (nextInstance.petBond && nextInstance.petBond.loyalty >= 1) {
          store.instances.set(instanceId, {
            ...nextInstance,
            fishingCastEncounter: null,
          });
          continue;
        }

        store.instances.delete(instanceId);
        continue;
      }

      if (nextInstance !== instance) {
        store.instances.set(instanceId, nextInstance);
      }

      continue;
    }

    if (encounter.kind === 'fairy') {
      if (
        encounter.expiresAtMs != null &&
        nowMs >= encounter.expiresAtMs &&
        instance.softDepartureStartedAtMs == null
      ) {
        store.instances.set(instanceId, {
          ...instance,
          fishingCastEncounter: {
            ...encounter,
            phase: 'departing',
          },
          softDepartureStartedAtMs: nowMs,
          softDepartureReason: 'daybreak',
        });
      }
    }
  }
}
