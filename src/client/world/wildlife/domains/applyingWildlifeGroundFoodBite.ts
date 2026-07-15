/**
 * One wildlife bite from a ground-food stack at melee range.
 *
 * Stacks and flowers chew for a rolled 5-10s window
 * (`pendingGroundFoodBite`). Long grass uses a fixed 15s chew.
 * Spritcore gulps the whole stack after a rolled 1-5s feast.
 * Then consumes exactly one unit / tile (or the full SC stack).
 *
 * @module components/world/wildlife/domains/applyingWildlifeGroundFoodBite
 */

import { DEFINING_WILDLIFE_MELEE_RANGE_GRID } from '@/components/world/wildlife/domains/definingWildlifeAggroConstants';
import {
  checkingWildlifeGroundFlowerItemId,
  parsingWildlifeGroundFlowerItemId,
} from '@/components/world/wildlife/domains/definingWildlifeGroundFlowerIdConstants';
import {
  checkingWildlifeGroundGrassItemId,
  parsingWildlifeGroundGrassItemId,
} from '@/components/world/wildlife/domains/definingWildlifeGroundGrassIdConstants';
import {
  checkingWildlifeGroundShrubItemId,
  parsingWildlifeGroundShrubItemId,
} from '@/components/world/wildlife/domains/definingWildlifeGroundShrubIdConstants';
import {
  DEFINING_WILDLIFE_GROUND_FOOD_BITE_DELAY_MAX_MS,
  DEFINING_WILDLIFE_GROUND_FOOD_BITE_DELAY_MIN_MS,
  DEFINING_WILDLIFE_GROUND_GRASS_BITE_DELAY_MS,
} from '@/components/world/wildlife/domains/definingWildlifeHuntConstants';
import {
  DEFINING_WILDLIFE_SPRITCORE_FEAST_BITE_DELAY_MAX_MS,
  DEFINING_WILDLIFE_SPRITCORE_FEAST_BITE_DELAY_MIN_MS,
} from '@/components/world/wildlife/domains/definingWildlifeSpritcoreFeastConstants';
import type { DefiningWildlifeSpeciesDefinition } from '@/components/world/wildlife/domains/definingWildlifeSpeciesRegistry';
import type {
  DefiningWildlifeInstance,
  DefiningWildlifePendingGroundFoodBite,
} from '@/components/world/wildlife/domains/definingWildlifeTypes';
import {
  checkingWildlifeGroundFlowerOptimisticIsPicked,
  consumingWildlifeGroundFlowerBridge,
} from '@/components/world/wildlife/domains/managingWildlifeGroundFlowerBridge';
import {
  consumingWildlifeGroundFoodBridgeQuantity,
  consumingWildlifeGroundFoodBridgeUnit,
  findingWildlifeGroundFoodItemById,
} from '@/components/world/wildlife/domains/managingWildlifeGroundFoodBridge';
import {
  checkingWildlifeGroundGrassOptimisticIsCleared,
  consumingWildlifeGroundGrassBridge,
} from '@/components/world/wildlife/domains/managingWildlifeGroundGrassBridge';
import {
  checkingWildlifeGroundShrubOptimisticIsPicked,
  consumingWildlifeGroundShrubBridge,
} from '@/components/world/wildlife/domains/managingWildlifeGroundShrubBridge';
import { applyingWildlifeSpritcoreFeast } from '@/components/world/wildlife/domains/applyingWildlifeSpritcoreFeast';
import { refillingWildlifeHungerAfterGroundFlower } from '@/components/world/wildlife/domains/refillingWildlifeHungerAfterGroundFlower';
import { refillingWildlifeHungerAfterGroundFood } from '@/components/world/wildlife/domains/refillingWildlifeHungerAfterGroundFood';
import { refillingWildlifeHungerAfterGroundGrass } from '@/components/world/wildlife/domains/refillingWildlifeHungerAfterGroundGrass';
import { refillingWildlifeHungerAfterGroundShrub } from '@/components/world/wildlife/domains/refillingWildlifeHungerAfterGroundShrub';
import { resolvingWildlifeGroundFoodWorldPoint } from '@/components/world/wildlife/domains/resolvingWildlifeGroundFoodWorldPoint';
import { checkingWorldPlazaInventoryItemIsSpritcore } from '@/components/world/spritcore/domains/checkingWorldPlazaInventoryItemIsSpritcore';

function rollingWildlifeGroundFoodBiteDelayMs(): number {
  return (
    DEFINING_WILDLIFE_GROUND_FOOD_BITE_DELAY_MIN_MS +
    Math.random() *
      (DEFINING_WILDLIFE_GROUND_FOOD_BITE_DELAY_MAX_MS -
        DEFINING_WILDLIFE_GROUND_FOOD_BITE_DELAY_MIN_MS)
  );
}

function rollingWildlifeSpritcoreFeastBiteDelayMs(): number {
  return (
    DEFINING_WILDLIFE_SPRITCORE_FEAST_BITE_DELAY_MIN_MS +
    Math.random() *
      (DEFINING_WILDLIFE_SPRITCORE_FEAST_BITE_DELAY_MAX_MS -
        DEFINING_WILDLIFE_SPRITCORE_FEAST_BITE_DELAY_MIN_MS)
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

function applyingWildlifeGroundFlowerBite(
  instance: DefiningWildlifeInstance,
  species: DefiningWildlifeSpeciesDefinition,
  groundItemId: string,
  nowMs: number
): DefiningWildlifeInstance {
  const tile = parsingWildlifeGroundFlowerItemId(groundItemId);

  if (!tile) {
    return clearingWildlifePendingGroundFoodBite(instance);
  }

  if (checkingWildlifeGroundFlowerOptimisticIsPicked(tile.tileX, tile.tileY)) {
    return clearingWildlifePendingGroundFoodBite(instance);
  }

  const targetPoint = {
    x: tile.tileX + 0.5,
    y: tile.tileY + 0.5,
    layer: 1,
  };
  const distance = Math.hypot(
    instance.position.x - targetPoint.x,
    instance.position.y - targetPoint.y
  );

  if (distance > DEFINING_WILDLIFE_MELEE_RANGE_GRID) {
    return clearingWildlifePendingGroundFoodBite(instance);
  }

  const pendingBite = instance.aiState.pendingGroundFoodBite;
  const pendingMatchesFlower =
    pendingBite !== null && pendingBite.groundItemId === groundItemId;

  if (!pendingMatchesFlower || pendingBite === null) {
    return applyingWildlifeIdleChewStance(instance, {
      groundItemId,
      startedAtMs: nowMs,
      readyAtMs: nowMs + rollingWildlifeGroundFoodBiteDelayMs(),
    });
  }

  if (nowMs < pendingBite.readyAtMs) {
    return applyingWildlifeIdleChewStance(instance, pendingBite);
  }

  const consumed = consumingWildlifeGroundFlowerBridge(
    groundItemId,
    instance.position
  );

  if (!consumed) {
    return clearingWildlifePendingGroundFoodBite(instance);
  }

  return {
    ...instance,
    hungerState: refillingWildlifeHungerAfterGroundFlower(
      instance.hungerState,
      species,
      nowMs
    ),
    aiState: {
      ...instance.aiState,
      pendingGroundFoodBite: null,
      isMoving: false,
      motionClip: 'attack',
      lastAttackAtMs: nowMs,
    },
  };
}

function applyingWildlifeGroundGrassBite(
  instance: DefiningWildlifeInstance,
  species: DefiningWildlifeSpeciesDefinition,
  groundItemId: string,
  nowMs: number
): DefiningWildlifeInstance {
  const tile = parsingWildlifeGroundGrassItemId(groundItemId);

  if (!tile) {
    return clearingWildlifePendingGroundFoodBite(instance);
  }

  if (checkingWildlifeGroundGrassOptimisticIsCleared(tile.tileX, tile.tileY)) {
    return clearingWildlifePendingGroundFoodBite(instance);
  }

  const targetPoint = {
    x: tile.tileX + 0.5,
    y: tile.tileY + 0.5,
    layer: 1,
  };
  const distance = Math.hypot(
    instance.position.x - targetPoint.x,
    instance.position.y - targetPoint.y
  );

  if (distance > DEFINING_WILDLIFE_MELEE_RANGE_GRID) {
    return clearingWildlifePendingGroundFoodBite(instance);
  }

  const pendingBite = instance.aiState.pendingGroundFoodBite;
  const pendingMatchesGrass =
    pendingBite !== null && pendingBite.groundItemId === groundItemId;

  if (!pendingMatchesGrass || pendingBite === null) {
    return applyingWildlifeIdleChewStance(instance, {
      groundItemId,
      startedAtMs: nowMs,
      readyAtMs: nowMs + DEFINING_WILDLIFE_GROUND_GRASS_BITE_DELAY_MS,
    });
  }

  if (nowMs < pendingBite.readyAtMs) {
    return applyingWildlifeIdleChewStance(instance, pendingBite);
  }

  const consumed = consumingWildlifeGroundGrassBridge(
    groundItemId,
    instance.position
  );

  if (!consumed) {
    return clearingWildlifePendingGroundFoodBite(instance);
  }

  return {
    ...instance,
    hungerState: refillingWildlifeHungerAfterGroundGrass(
      instance.hungerState,
      species,
      nowMs
    ),
    aiState: {
      ...instance.aiState,
      pendingGroundFoodBite: null,
      isMoving: false,
      motionClip: 'attack',
      lastAttackAtMs: nowMs,
    },
  };
}

function applyingWildlifeGroundShrubBite(
  instance: DefiningWildlifeInstance,
  species: DefiningWildlifeSpeciesDefinition,
  groundItemId: string,
  nowMs: number
): DefiningWildlifeInstance {
  const tile = parsingWildlifeGroundShrubItemId(groundItemId);

  if (!tile) {
    return clearingWildlifePendingGroundFoodBite(instance);
  }

  if (checkingWildlifeGroundShrubOptimisticIsPicked(tile.tileX, tile.tileY)) {
    return clearingWildlifePendingGroundFoodBite(instance);
  }

  const targetPoint = {
    x: tile.tileX + 0.5,
    y: tile.tileY + 0.5,
    layer: 1,
  };
  const distance = Math.hypot(
    instance.position.x - targetPoint.x,
    instance.position.y - targetPoint.y
  );

  if (distance > DEFINING_WILDLIFE_MELEE_RANGE_GRID) {
    return clearingWildlifePendingGroundFoodBite(instance);
  }

  const pendingBite = instance.aiState.pendingGroundFoodBite;
  const pendingMatchesShrub =
    pendingBite !== null && pendingBite.groundItemId === groundItemId;

  if (!pendingMatchesShrub || pendingBite === null) {
    return applyingWildlifeIdleChewStance(instance, {
      groundItemId,
      startedAtMs: nowMs,
      readyAtMs: nowMs + rollingWildlifeGroundFoodBiteDelayMs(),
    });
  }

  if (nowMs < pendingBite.readyAtMs) {
    return applyingWildlifeIdleChewStance(instance, pendingBite);
  }

  const consumed = consumingWildlifeGroundShrubBridge(
    groundItemId,
    instance.position
  );

  if (!consumed) {
    return clearingWildlifePendingGroundFoodBite(instance);
  }

  return {
    ...instance,
    hungerState: refillingWildlifeHungerAfterGroundShrub(
      instance.hungerState,
      species,
      nowMs
    ),
    aiState: {
      ...instance.aiState,
      pendingGroundFoodBite: null,
      isMoving: false,
      motionClip: 'attack',
      lastAttackAtMs: nowMs,
    },
  };
}

/** Chews, then consumes one ground-food unit, biome flower, long-grass, or shrub tile. */
export function applyingWildlifeGroundFoodBite(
  instance: DefiningWildlifeInstance,
  species: DefiningWildlifeSpeciesDefinition,
  groundItemId: string,
  nowMs: number
): DefiningWildlifeInstance {
  if (checkingWildlifeGroundFlowerItemId(groundItemId)) {
    return applyingWildlifeGroundFlowerBite(
      instance,
      species,
      groundItemId,
      nowMs
    );
  }

  if (checkingWildlifeGroundGrassItemId(groundItemId)) {
    return applyingWildlifeGroundGrassBite(
      instance,
      species,
      groundItemId,
      nowMs
    );
  }

  if (checkingWildlifeGroundShrubItemId(groundItemId)) {
    return applyingWildlifeGroundShrubBite(
      instance,
      species,
      groundItemId,
      nowMs
    );
  }

  const groundItem = findingWildlifeGroundFoodItemById(groundItemId, nowMs);

  if (!groundItem || groundItem.quantity <= 0) {
    return clearingWildlifePendingGroundFoodBite(instance);
  }

  const canonicalGroundItemId = groundItem.id;
  const targetPoint = resolvingWildlifeGroundFoodWorldPoint(groundItem);
  const distance = Math.hypot(
    instance.position.x - targetPoint.x,
    instance.position.y - targetPoint.y
  );

  if (distance > DEFINING_WILDLIFE_MELEE_RANGE_GRID) {
    return clearingWildlifePendingGroundFoodBite(instance);
  }

  const pendingBite = instance.aiState.pendingGroundFoodBite;
  const pendingMatchesStack =
    pendingBite !== null &&
    (pendingBite.groundItemId === canonicalGroundItemId ||
      pendingBite.groundItemId === groundItemId);

  const isSpritcoreFeast = checkingWorldPlazaInventoryItemIsSpritcore(
    groundItem.itemTypeId
  );
  const biteDelayMs = isSpritcoreFeast
    ? rollingWildlifeSpritcoreFeastBiteDelayMs()
    : rollingWildlifeGroundFoodBiteDelayMs();

  // Start (or restart on stack switch) the chew timer for one unit / feast.
  if (!pendingMatchesStack || pendingBite === null) {
    return applyingWildlifeIdleChewStance(instance, {
      groundItemId: canonicalGroundItemId,
      startedAtMs: nowMs,
      readyAtMs: nowMs + biteDelayMs,
    });
  }

  if (nowMs < pendingBite.readyAtMs) {
    return applyingWildlifeIdleChewStance(instance, {
      ...pendingBite,
      groundItemId: canonicalGroundItemId,
    });
  }

  if (isSpritcoreFeast) {
    const feastQuantity = groundItem.quantity;
    const consumedQuantity = consumingWildlifeGroundFoodBridgeQuantity(
      canonicalGroundItemId,
      feastQuantity,
      instance.position
    );

    if (consumedQuantity <= 0) {
      return clearingWildlifePendingGroundFoodBite(instance);
    }

    const feastedInstance = applyingWildlifeSpritcoreFeast(
      {
        ...instance,
        aiState: {
          ...instance.aiState,
          pendingGroundFoodBite: null,
          isMoving: false,
          motionClip: 'attack',
          lastAttackAtMs: nowMs,
        },
      },
      consumedQuantity,
      nowMs
    );

    return feastedInstance;
  }

  const consumed = consumingWildlifeGroundFoodBridgeUnit(
    canonicalGroundItemId,
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
