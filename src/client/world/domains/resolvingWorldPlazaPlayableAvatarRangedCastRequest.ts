/**
 * Builds a projectile spawn request for playable avatar ranged casts.
 *
 * @module components/world/domains/resolvingWorldPlazaPlayableAvatarRangedCastRequest
 */

import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import type { SpawningWorldPlazaProjectileRequest } from '@/components/world/projectile/domains/definingWorldPlazaProjectileTypes';

/**
 * Origin = player, aim = target point (or facing fallback handled by caller).
 */
export function resolvingWorldPlazaPlayableAvatarRangedCastRequest(params: {
  archetypeId: string;
  origin: DefiningWorldPlazaWorldPoint;
  targetPoint: DefiningWorldPlazaWorldPoint;
  nowMs: number;
  seed?: number;
}): SpawningWorldPlazaProjectileRequest {
  return {
    archetypeId: params.archetypeId,
    origin: {
      x: params.origin.x,
      y: params.origin.y,
      layer: params.origin.layer,
    },
    targetPoint: {
      x: params.targetPoint.x,
      y: params.targetPoint.y,
      layer: params.targetPoint.layer ?? params.origin.layer,
    },
    spawnedAtMs: params.nowMs,
    seed: params.seed ?? Math.floor(params.nowMs),
    spawnerUserId: null,
  };
}
