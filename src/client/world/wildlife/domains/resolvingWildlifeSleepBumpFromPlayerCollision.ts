/**
 * Player bump against a sleeping animal: one wake roll per contact session.
 *
 * @module components/world/wildlife/domains/resolvingWildlifeSleepBumpFromPlayerCollision
 */

import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import { checkingWorldPlazaEntityHealthSleepCanWakeFromDamage } from '@/components/world/health/domains/checkingWorldPlazaEntityHealthSleepCanWakeFromDamage';
import { DEFINING_WILDLIFE_SLEEP_BUMP_WAKE_CHANCE } from '@/components/world/wildlife/domains/definingWildlifeSleepConstants';
import type { DefiningWildlifeSpeciesDefinition } from '@/components/world/wildlife/domains/definingWildlifeSpeciesRegistry';
import type { DefiningWildlifeInstance } from '@/components/world/wildlife/domains/definingWildlifeTypes';
import type { ResolvingWildlifeSteeringHazardSampling } from '@/components/world/wildlife/domains/resolvingWildlifeSteeringStep';
import { wakingWildlifeFromSleepHit } from '@/components/world/wildlife/domains/wakingWildlifeFromSleepHit';

export type ResolvingWildlifeSleepBumpFromPlayerCollisionParams = {
  instance: DefiningWildlifeInstance;
  species: DefiningWildlifeSpeciesDefinition;
  pushedPosition: DefiningWorldPlazaWorldPoint;
  playerPosition: DefiningWorldPlazaWorldPoint;
  playerUserId: string | null;
  hazardSampling: ResolvingWildlifeSteeringHazardSampling;
  nowMs: number;
  roll?: () => number;
};

/**
 * Pushes the sleeper aside. On first overlap of a contact, rolls wake chance;
 * success startles awake (flee or attack). Later frames of the same contact
 * only keep the push without re-rolling.
 */
export function resolvingWildlifeSleepBumpFromPlayerCollision({
  instance,
  species,
  pushedPosition,
  playerPosition,
  playerUserId,
  hazardSampling,
  nowMs,
  roll = Math.random,
}: ResolvingWildlifeSleepBumpFromPlayerCollisionParams): DefiningWildlifeInstance {
  const pushedInstance: DefiningWildlifeInstance = {
    ...instance,
    position: pushedPosition,
  };

  if (instance.aiState.hasPlayerSleepBumpContact) {
    return pushedInstance;
  }

  const contactedInstance: DefiningWildlifeInstance = {
    ...pushedInstance,
    aiState: {
      ...pushedInstance.aiState,
      hasPlayerSleepBumpContact: true,
    },
  };

  if (roll() >= DEFINING_WILDLIFE_SLEEP_BUMP_WAKE_CHANCE) {
    return contactedInstance;
  }

  if (
    !checkingWorldPlazaEntityHealthSleepCanWakeFromDamage(
      contactedInstance.healthState,
      nowMs
    )
  ) {
    return contactedInstance;
  }

  return wakingWildlifeFromSleepHit({
    instance: contactedInstance,
    species,
    threatPoint: playerPosition,
    threatTargetId: playerUserId,
    hazardSampling,
    nowMs,
  });
}

/** Clears the bump-contact lock once the player is no longer overlapping. */
export function clearingWildlifeSleepBumpContact(
  instance: DefiningWildlifeInstance
): DefiningWildlifeInstance {
  if (!instance.aiState.hasPlayerSleepBumpContact) {
    return instance;
  }

  return {
    ...instance,
    aiState: {
      ...instance.aiState,
      hasPlayerSleepBumpContact: false,
    },
  };
}
