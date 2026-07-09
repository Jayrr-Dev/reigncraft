/**
 * One wildlife bite from a ground-food stack at melee range.
 *
 * @module components/world/wildlife/domains/applyingWildlifeGroundFoodBite
 */

import { DEFINING_WILDLIFE_MELEE_RANGE_GRID } from '@/components/world/wildlife/domains/definingWildlifeAggroConstants';
import type { DefiningWildlifeSpeciesDefinition } from '@/components/world/wildlife/domains/definingWildlifeSpeciesRegistry';
import type { DefiningWildlifeInstance } from '@/components/world/wildlife/domains/definingWildlifeTypes';
import {
  consumingWildlifeGroundFoodBridgeUnit,
  listingWildlifeGroundFoodItems,
} from '@/components/world/wildlife/domains/managingWildlifeGroundFoodBridge';
import { refillingWildlifeHungerAfterGroundFood } from '@/components/world/wildlife/domains/refillingWildlifeHungerAfterGroundFood';
import { resolvingWildlifeGroundFoodWorldPoint } from '@/components/world/wildlife/domains/resolvingWildlifeGroundFoodWorldPoint';

function checkingWildlifeAttackReady(
  attacker: DefiningWildlifeInstance,
  attackerSpecies: DefiningWildlifeSpeciesDefinition,
  nowMs: number
): boolean {
  const lastAttackAtMs = attacker.aiState.lastAttackAtMs;

  return (
    lastAttackAtMs === null ||
    nowMs - lastAttackAtMs >= attackerSpecies.vitals.attackIntervalMs
  );
}

/** Consumes one ground-food unit when in range and attack cooldown allows. */
export function applyingWildlifeGroundFoodBite(
  instance: DefiningWildlifeInstance,
  species: DefiningWildlifeSpeciesDefinition,
  groundItemId: string,
  nowMs: number
): DefiningWildlifeInstance {
  if (!checkingWildlifeAttackReady(instance, species, nowMs)) {
    return {
      ...instance,
      aiState: {
        ...instance.aiState,
        isMoving: false,
        motionClip: 'idle',
      },
    };
  }

  const groundItem = listingWildlifeGroundFoodItems(nowMs).find(
    (entry) => entry.id === groundItemId
  );

  if (!groundItem || groundItem.quantity <= 0) {
    return instance;
  }

  const targetPoint = resolvingWildlifeGroundFoodWorldPoint(groundItem);
  const distance = Math.hypot(
    instance.position.x - targetPoint.x,
    instance.position.y - targetPoint.y
  );

  if (distance > DEFINING_WILDLIFE_MELEE_RANGE_GRID) {
    return instance;
  }

  const consumed = consumingWildlifeGroundFoodBridgeUnit(
    groundItemId,
    instance.position
  );

  if (!consumed) {
    return instance;
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
      isMoving: false,
      motionClip: 'attack',
      lastAttackAtMs: nowMs,
    },
  };
}
