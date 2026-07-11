import {
  DEFINING_WORLD_PLAZA_INFINITE_MAP_SPAWN_X_PX,
  DEFINING_WORLD_PLAZA_INFINITE_MAP_SPAWN_Y_PX,
} from '@/components/world/domains/definingWorldPlazaInfiniteMapConstants';
import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import { checkingWorldPlazaDevQaLoadEnabled } from '@/components/world/domains/managingWorldPlazaDevQaLoadStore';
import { readingWorldPlazaLastPositionFromStorage } from '@/components/world/domains/readingWorldPlazaLastPositionFromStorage';
import { resolvingWorldPlazaOnlineSpawnOffset } from '@/components/world/domains/resolvingWorldPlazaOnlineSpawnOffset';

/**
 * Resolves the initial local avatar spawn for a new plaza session.
 *
 * Authenticated sessions use a temporary spawn ring until Supabase restores the
 * saved position. Guests prefer localStorage, then the sandbox origin.
 *
 * @module components/world/domains/resolvingWorldPlazaInitialPlayerSpawnWorldPoint
 */

/**
 * Resolves the spawn world point for one plaza session.
 *
 * @param onlineUserId - Auth user id, or null for offline sessions.
 * @param localPersistenceOwnerId - Scoped storage owner for offline saves.
 */
export function resolvingWorldPlazaInitialPlayerSpawnWorldPoint(
  onlineUserId: string | null,
  localPersistenceOwnerId: string | null = null
): DefiningWorldPlazaWorldPoint {
  if (onlineUserId) {
    return {
      ...resolvingWorldPlazaOnlineSpawnOffset(onlineUserId),
      layer: 1,
    };
  }

  // QA blank slate always starts at origin for a predictable perf baseline.
  if (checkingWorldPlazaDevQaLoadEnabled()) {
    return {
      x: DEFINING_WORLD_PLAZA_INFINITE_MAP_SPAWN_X_PX,
      y: DEFINING_WORLD_PLAZA_INFINITE_MAP_SPAWN_Y_PX,
      layer: 1,
    };
  }

  const lastPosition = readingWorldPlazaLastPositionFromStorage(
    localPersistenceOwnerId
  );

  if (lastPosition) {
    return {
      x: lastPosition.x,
      y: lastPosition.y,
      layer: lastPosition.layer,
    };
  }

  return {
    x: DEFINING_WORLD_PLAZA_INFINITE_MAP_SPAWN_X_PX,
    y: DEFINING_WORLD_PLAZA_INFINITE_MAP_SPAWN_Y_PX,
    layer: 1,
  };
}
