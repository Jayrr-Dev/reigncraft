'use client';

import type { DefiningWorldPlazaPlacedBlocksSceneRef } from '@/components/world/domains/buildingWorldPlazaPlacedBlocksSceneRef';
import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import type { DefiningWorldPlazaEntityHealthState } from '@/components/world/health/domains/definingWorldPlazaEntityHealthTypes';
import { DEFINING_WORLD_PLAZA_PROJECTILE_ONLINE_SYNC_MAX_SPAWN_EVENTS } from '@/components/world/projectile/domains/definingWorldPlazaProjectileConstants';
import type {
  DefiningWorldPlazaPlayerProjectileDodgeState,
  SpawningWorldPlazaProjectileRequest,
} from '@/components/world/projectile/domains/definingWorldPlazaProjectileTypes';
import {
  creatingWorldPlazaProjectileStore,
  spawningWorldPlazaProjectile,
  type ManagingWorldPlazaProjectileStore,
} from '@/components/world/projectile/domains/managingWorldPlazaProjectileStore';
import { useCallback, useRef } from 'react';
import type { PlazaDevvitOnlineProjectileSpawnEvent } from '../../../../shared/plazaDevvitOnline';

export type UsingWorldPlazaProjectileEngineParams = {
  readonly isEnabled: boolean;
  readonly localUserId: string | null;
};

export type UsingWorldPlazaProjectileEngineResult = {
  readonly projectileStoreRef: React.RefObject<ManagingWorldPlazaProjectileStore>;
  readonly localPlayerDodgeStateRef: React.RefObject<DefiningWorldPlazaPlayerProjectileDodgeState>;
  readonly spawnProjectileRef: React.RefObject<
    (request: SpawningWorldPlazaProjectileRequest) => string | null
  >;
  readonly pendingOnlineSpawnEventsRef: React.RefObject<
    PlazaDevvitOnlineProjectileSpawnEvent[]
  >;
  readonly ingestOnlineSpawnEvents: (
    events: readonly PlazaDevvitOnlineProjectileSpawnEvent[]
  ) => void;
};

function mappingPlazaDevvitOnlineProjectileSpawnEventToRequest(
  event: PlazaDevvitOnlineProjectileSpawnEvent
): SpawningWorldPlazaProjectileRequest {
  return {
    projectileId: event.projectileId,
    archetypeId: event.archetypeId,
    origin: {
      x: event.originX,
      y: event.originY,
      layer: event.originLayer,
    },
    targetPoint:
      event.targetX !== undefined && event.targetY !== undefined
        ? {
            x: event.targetX,
            y: event.targetY,
            layer: event.targetLayer,
          }
        : undefined,
    direction:
      event.directionX !== undefined && event.directionY !== undefined
        ? { x: event.directionX, y: event.directionY }
        : undefined,
    spawnedAtMs: event.spawnedAtMs,
    seed: event.seed,
    spawnerUserId: event.spawnerUserId,
  };
}

/**
 * Wires projectile store, spawn API, and multiplayer spawn-event queue.
 */
export function usingWorldPlazaProjectileEngine({
  isEnabled,
  localUserId,
}: UsingWorldPlazaProjectileEngineParams): UsingWorldPlazaProjectileEngineResult {
  const projectileStoreRef = useRef<ManagingWorldPlazaProjectileStore>(
    creatingWorldPlazaProjectileStore()
  );
  const localPlayerDodgeStateRef =
    useRef<DefiningWorldPlazaPlayerProjectileDodgeState>({
      jumpArcOffsetPx: 0,
      collisionRadiusGrid: 0.25,
    });
  const pendingOnlineSpawnEventsRef = useRef<
    PlazaDevvitOnlineProjectileSpawnEvent[]
  >([]);
  const spawnProjectileRef = useRef<
    (request: SpawningWorldPlazaProjectileRequest) => string | null
  >(() => null);

  spawnProjectileRef.current = (request) => {
    if (!isEnabled) {
      return null;
    }

    const projectileId = spawningWorldPlazaProjectile(
      projectileStoreRef.current,
      request
    );

    if (projectileId && localUserId) {
      const queue = pendingOnlineSpawnEventsRef.current;
      queue.push({
        projectileId,
        archetypeId: request.archetypeId,
        originX: request.origin.x,
        originY: request.origin.y,
        originLayer: request.origin.layer ?? 1,
        targetX: request.targetPoint?.x,
        targetY: request.targetPoint?.y,
        targetLayer: request.targetPoint?.layer,
        directionX: request.direction?.x,
        directionY: request.direction?.y,
        spawnedAtMs: request.spawnedAtMs ?? Date.now(),
        seed: request.seed ?? 0,
        spawnerUserId: localUserId,
      });

      if (
        queue.length >
        DEFINING_WORLD_PLAZA_PROJECTILE_ONLINE_SYNC_MAX_SPAWN_EVENTS
      ) {
        queue.splice(
          0,
          queue.length -
            DEFINING_WORLD_PLAZA_PROJECTILE_ONLINE_SYNC_MAX_SPAWN_EVENTS
        );
      }
    }

    return projectileId;
  };

  const ingestOnlineSpawnEvents = useCallback(
    (events: readonly PlazaDevvitOnlineProjectileSpawnEvent[]) => {
      if (!isEnabled) {
        return;
      }

      for (const event of events) {
        if (localUserId && event.spawnerUserId === localUserId) {
          continue;
        }

        spawningWorldPlazaProjectile(
          projectileStoreRef.current,
          mappingPlazaDevvitOnlineProjectileSpawnEventToRequest(event)
        );
      }
    },
    [isEnabled, localUserId]
  );

  return {
    projectileStoreRef,
    localPlayerDodgeStateRef,
    spawnProjectileRef,
    pendingOnlineSpawnEventsRef,
    ingestOnlineSpawnEvents,
  };
}

export type UsingWorldPlazaProjectileEngineSceneBindings = {
  readonly projectileStoreRef: React.RefObject<ManagingWorldPlazaProjectileStore>;
  readonly localPlayerDodgeStateRef: React.RefObject<DefiningWorldPlazaPlayerProjectileDodgeState>;
  readonly playerPositionRef: React.RefObject<DefiningWorldPlazaWorldPoint>;
  readonly healthStateRef: React.RefObject<DefiningWorldPlazaEntityHealthState>;
  readonly placedBlocksRef: React.RefObject<DefiningWorldPlazaPlacedBlocksSceneRef>;
  readonly localUserId: string | null;
  readonly isEnabled: boolean;
};
