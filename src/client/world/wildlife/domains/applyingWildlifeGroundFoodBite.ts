/**
 * One wildlife bite from a ground-food stack at melee range.
 *
 * A bite is not instant: the animal chews for a rolled 5-10s window
 * (`pendingGroundFoodBite`), then consumes exactly one unit from the stack.
 *
 * @module components/world/wildlife/domains/applyingWildlifeGroundFoodBite
 */

import { DEFINING_WILDLIFE_MELEE_RANGE_GRID } from '@/components/world/wildlife/domains/definingWildlifeAggroConstants';
import {
  DEFINING_WILDLIFE_GROUND_FOOD_BITE_DELAY_MAX_MS,
  DEFINING_WILDLIFE_GROUND_FOOD_BITE_DELAY_MIN_MS,
} from '@/components/world/wildlife/domains/definingWildlifeHuntConstants';
import type { DefiningWildlifeSpeciesDefinition } from '@/components/world/wildlife/domains/definingWildlifeSpeciesRegistry';
import type {
  DefiningWildlifeInstance,
  DefiningWildlifePendingGroundFoodBite,
} from '@/components/world/wildlife/domains/definingWildlifeTypes';
import {
  consumingWildlifeGroundFoodBridgeUnit,
  listingWildlifeGroundFoodItems,
} from '@/components/world/wildlife/domains/managingWildlifeGroundFoodBridge';
import { refillingWildlifeHungerAfterGroundFood } from '@/components/world/wildlife/domains/refillingWildlifeHungerAfterGroundFood';
import { resolvingWildlifeGroundFoodWorldPoint } from '@/components/world/wildlife/domains/resolvingWildlifeGroundFoodWorldPoint';

function rollingWildlifeGroundFoodBiteDelayMs(): number {
  return (
    DEFINING_WILDLIFE_GROUND_FOOD_BITE_DELAY_MIN_MS +
    Math.random() *
      (DEFINING_WILDLIFE_GROUND_FOOD_BITE_DELAY_MAX_MS -
        DEFINING_WILDLIFE_GROUND_FOOD_BITE_DELAY_MIN_MS)
  );
}

function applyingWildlifeIdleChewStance(
  instance: DefiningWildlifeInstance,
  pendingBite: DefiningWildlifePendingGroundFoodBite | null
): DefiningWildlifeInstance {
  return {
    ...instance,
    aiState: {
      ...instance.aiState,
      pendingGroundFoodBite: pendingBite,
      isMoving: false,
      motionClip: 'idle',
    },
  };
}

/** Clears any chew timer, e.g. when the animal stops foraging. */
export function clearingWildlifePendingGroundFoodBite(
  instance: DefiningWildlifeInstance
): DefiningWildlifeInstance {
  if (instance.aiState.pendingGroundFoodBite === null) {
    return instance;
  }

  return {
    ...instance,
    aiState: {
      ...instance.aiState,
      pendingGroundFoodBite: null,
    },
  };
}

/** Chews for 5-10s, then consumes one ground-food unit when in range. */
export function applyingWildlifeGroundFoodBite(
  instance: DefiningWildlifeInstance,
  species: DefiningWildlifeSpeciesDefinition,
  groundItemId: string,
  nowMs: number
): DefiningWildlifeInstance {
  const groundItem = listingWildlifeGroundFoodItems(nowMs).find(
    (entry) => entry.id === groundItemId
  );

  if (!groundItem || groundItem.quantity <= 0) {
    return clearingWildlifePendingGroundFoodBite(instance);
  }

  const targetPoint = resolvingWildlifeGroundFoodWorldPoint(groundItem);
  const distance = Math.hypot(
    instance.position.x - targetPoint.x,
    instance.position.y - targetPoint.y
  );

  if (distance > DEFINING_WILDLIFE_MELEE_RANGE_GRID) {
    return clearingWildlifePendingGroundFoodBite(instance);
  }

  const pendingBite = instance.aiState.pendingGroundFoodBite;

  // Start (or restart on stack switch) the chew timer for one unit.
  if (pendingBite === null || pendingBite.groundItemId !== groundItemId) {
    return applyingWildlifeIdleChewStance(instance, {
      groundItemId,
      startedAtMs: nowMs,
      readyAtMs: nowMs + rollingWildlifeGroundFoodBiteDelayMs(),
    });
  }

  if (nowMs < pendingBite.readyAtMs) {
    return applyingWildlifeIdleChewStance(instance, pendingBite);
  }

  const consumed = consumingWildlifeGroundFoodBridgeUnit(
    groundItemId,
    instance.position
  );

  if (!consumed) {
    return clearingWildlifePendingGroundFoodBite(instance);
  }

  const nextHungerState = refillingWildlifeHungerAfterGroundFood(
    instance.hungerState,
    species,
    groundItem.itemTypeId,
    nowMs
  );

  return {
    ...instance,
    hungerState: nextHungerState ?? instance.hungerState,
    aiState: {
      ...instance.aiState,
      pendingGroundFoodBite: null,
      isMoving: false,
      motionClip: 'attack',
      lastAttackAtMs: nowMs,
    },
  };
}
