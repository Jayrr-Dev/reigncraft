/**
 * Dev-only aggressive chicken spawns near the local player.
 *
 * @module components/world/wildlife/domains/spawningWildlifeDevAggressiveChickensNearPoint
 */

import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import { DEFINING_WILDLIFE_AI_THINK_INTERVAL_NEAR_MS } from '@/components/world/wildlife/domains/definingWildlifeAiLodConstants';
import { DEFINING_WILDLIFE_AGGRO_THREAT_THRESHOLD } from '@/components/world/wildlife/domains/definingWildlifeAggroConstants';
import { DEFINING_WILDLIFE_AGGRESSIVE_CHICKEN_SPECIES_ID } from '@/components/world/wildlife/domains/definingWildlifeAggressiveChickenConstants';
import { DEFINING_WILDLIFE_DEV_AGGRESSIVE_CHICKEN_SPAWN_RADIUS_GRID } from '@/components/world/wildlife/domains/definingWildlifeDevSpawnConstants';
import { resolvingWildlifeSpeciesDefinition } from '@/components/world/wildlife/domains/definingWildlifeSpeciesRegistry';
import type {
  DefiningWildlifeInstance,
  DefiningWildlifeSpawnAnchor,
} from '@/components/world/wildlife/domains/definingWildlifeTypes';
import {
  creatingWildlifeInstanceAtPosition,
  type ManagingWildlifeInstanceStore,
} from '@/components/world/wildlife/domains/managingWildlifeInstanceStore';

function buildingWildlifeDevSpawnThinkAnchor(
  instanceId: string,
  position: DefiningWorldPlazaWorldPoint,
  packIndex: number,
  packSize: number
): DefiningWildlifeSpawnAnchor {
  return {
    anchorId: instanceId,
    tileX: Math.floor(position.x),
    tileY: Math.floor(position.y),
    speciesId: DEFINING_WILDLIFE_AGGRESSIVE_CHICKEN_SPECIES_ID,
    packIndex,
    packSize,
    seed: packIndex * 0.17,
  };
}

function resolvingWildlifeDevAggressiveChickenSpawnPosition(
  center: DefiningWorldPlazaWorldPoint,
  index: number,
  count: number
): DefiningWorldPlazaWorldPoint {
  if (count <= 1) {
    return {
      x:
        center.x +
        DEFINING_WILDLIFE_DEV_AGGRESSIVE_CHICKEN_SPAWN_RADIUS_GRID * 0.6,
      y: center.y,
      layer: center.layer,
    };
  }

  const angle = (index / count) * Math.PI * 2;

  return {
    x:
      center.x +
      Math.cos(angle) *
        DEFINING_WILDLIFE_DEV_AGGRESSIVE_CHICKEN_SPAWN_RADIUS_GRID,
    y:
      center.y +
      Math.sin(angle) *
        DEFINING_WILDLIFE_DEV_AGGRESSIVE_CHICKEN_SPAWN_RADIUS_GRID,
    layer: center.layer,
  };
}

function bootstrappingWildlifeDevAggressiveChickenForPlayer(
  instance: DefiningWildlifeInstance,
  playerUserId: string,
  playerPosition: DefiningWorldPlazaWorldPoint,
  nowMs: number
): DefiningWildlifeInstance {
  return {
    ...instance,
    aggroState: {
      threats: [
        {
          targetId: playerUserId,
          threat: DEFINING_WILDLIFE_AGGRO_THREAT_THRESHOLD + 1,
          lastUpdatedAtMs: nowMs,
        },
      ],
      activeTargetId: playerUserId,
      lastDamagedAtMs: null,
    },
    aiState: {
      ...instance.aiState,
      intent: {
        mode: 'chase',
        targetInstanceId: playerUserId,
        targetPoint: playerPosition,
      },
      isMoving: true,
      motionClip: 'run',
      lastThinkAtMs: nowMs - DEFINING_WILDLIFE_AI_THINK_INTERVAL_NEAR_MS,
      steeringCache: null,
    },
  };
}

export type SpawningWildlifeDevAggressiveChickensNearPointParams = {
  store: ManagingWildlifeInstanceStore;
  center: DefiningWorldPlazaWorldPoint;
  count: number;
  /** Must use the same clock as the Pixi wildlife tick (`performance.now()`). */
  nowMs: number;
  playerUserId: string | null;
};

/**
 * Spawns aggressive cucco-style chickens around a point and returns how many were added.
 */
export function spawningWildlifeDevAggressiveChickensNearPoint({
  store,
  center,
  count,
  nowMs,
  playerUserId,
}: SpawningWildlifeDevAggressiveChickensNearPointParams): number {
  const species = resolvingWildlifeSpeciesDefinition(
    DEFINING_WILDLIFE_AGGRESSIVE_CHICKEN_SPECIES_ID
  );

  if (!species || count <= 0) {
    return 0;
  }

  let spawnedCount = 0;

  for (let index = 0; index < count; index += 1) {
    const instanceId = `wildlife:dev:chicken:${nowMs}:${index}`;
    const position = resolvingWildlifeDevAggressiveChickenSpawnPosition(
      center,
      index,
      count
    );
    const thinkScheduleAnchor = buildingWildlifeDevSpawnThinkAnchor(
      instanceId,
      position,
      index,
      count
    );
    let instance = creatingWildlifeInstanceAtPosition({
      instanceId,
      anchorId: instanceId,
      species,
      position,
      spawnAnchor: position,
      aggressionLevel: 'aggressive',
      thinkScheduleAnchor,
      nowMs,
    });

    if (playerUserId) {
      instance = bootstrappingWildlifeDevAggressiveChickenForPlayer(
        instance,
        playerUserId,
        center,
        nowMs
      );
    }

    store.instances.set(instanceId, instance);
    spawnedCount += 1;
  }

  return spawnedCount;
}
