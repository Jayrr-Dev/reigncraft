/**
 * Drops meat from a hunter kill and locks the predator into a feeding session.
 *
 * @module components/world/wildlife/domains/feedingWildlifeHunterFromKill
 */

import type { DefiningWildlifeMeatDropContext } from '@/components/world/wildlife/domains/attemptingWildlifeMeatGroundDropOnDeath';
import { checkingWildlifeSpeciesMayEatGroundFood } from '@/components/world/wildlife/domains/checkingWildlifeSpeciesMayEatGroundFood';
import { DEFINING_WILDLIFE_HUNTER_KILL_FEEDING_DURATION_MS } from '@/components/world/wildlife/domains/definingWildlifeHunterFeedingConstants';
import type { DefiningWildlifeSpeciesDefinition } from '@/components/world/wildlife/domains/definingWildlifeSpeciesRegistry';
import type { DefiningWildlifeInstance } from '@/components/world/wildlife/domains/definingWildlifeTypes';
import type { ManagingWildlifeInstanceStore } from '@/components/world/wildlife/domains/managingWildlifeInstanceStore';
import { replacingWildlifeInstance } from '@/components/world/wildlife/domains/managingWildlifeInstanceStore';
import { resolvingWildlifeGroundFoodWorldPoint } from '@/components/world/wildlife/domains/resolvingWildlifeGroundFoodWorldPoint';
import { spawningWildlifeKillMeatGroundItem } from '@/components/world/wildlife/domains/spawningWildlifeKillMeatGroundItem';

export type FeedingWildlifeHunterFromKillParams = {
  store: ManagingWildlifeInstanceStore;
  preyInstance: DefiningWildlifeInstance;
  preySpecies: DefiningWildlifeSpeciesDefinition;
  hunterInstance: DefiningWildlifeInstance;
  hunterSpecies: DefiningWildlifeSpeciesDefinition;
  meatDropContext: DefiningWildlifeMeatDropContext | null | undefined;
  nowMs: number;
};

export type FeedingWildlifeHunterFromKillResult = {
  prey: DefiningWildlifeInstance;
  hunter: DefiningWildlifeInstance;
};

/**
 * Marks the corpse looted, spawns meat at the body, and starts a feeding lock.
 */
export function feedingWildlifeHunterFromKill({
  store,
  preyInstance,
  preySpecies,
  hunterInstance,
  hunterSpecies,
  meatDropContext,
  nowMs,
}: FeedingWildlifeHunterFromKillParams): FeedingWildlifeHunterFromKillResult {
  if (
    !preyInstance.isDead ||
    preyInstance.hasDroppedLoot ||
    preySpecies.loot.quantity <= 0
  ) {
    return { prey: preyInstance, hunter: hunterInstance };
  }

  const markedPrey: DefiningWildlifeInstance = {
    ...preyInstance,
    hasDroppedLoot: true,
  };

  replacingWildlifeInstance(store, markedPrey);

  const groundItem = spawningWildlifeKillMeatGroundItem({
    instance: markedPrey,
    species: preySpecies,
    meatDropContext,
  });

  if (
    !groundItem ||
    !checkingWildlifeSpeciesMayEatGroundFood(
      hunterSpecies,
      preySpecies.loot.rawMeatItemTypeId
    )
  ) {
    return { prey: markedPrey, hunter: hunterInstance };
  }

  const targetPoint = resolvingWildlifeGroundFoodWorldPoint(groundItem);

  return {
    prey: markedPrey,
    hunter: {
      ...hunterInstance,
      aggroState: {
        threats: [],
        activeTargetId: null,
        lastDamagedAtMs: hunterInstance.aggroState.lastDamagedAtMs,
      },
      aiState: {
        ...hunterInstance.aiState,
        feedingOnKillUntilMs:
          nowMs + DEFINING_WILDLIFE_HUNTER_KILL_FEEDING_DURATION_MS,
        feedingOnKillGroundItemId: groundItem.id,
        intent: {
          mode: 'forageEat',
          targetGroundItemId: groundItem.id,
          targetPoint,
        },
        isMoving: false,
        motionClip: 'idle',
        chargeWindupStartedAtMs: null,
        fleeTargetPoint: null,
        steeringCache: null,
      },
    },
  };
}
