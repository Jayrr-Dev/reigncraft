import { resolvingWorldPlazaPlayerWorldLayer } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import { resolvingWorldPlazaProjectileArchetype } from '@/components/world/projectile/domains/definingWorldPlazaProjectileArchetypeRegistry';
import { DEFINING_WORLD_PLAZA_PROJECTILE_MIN_DIRECTION_LENGTH } from '@/components/world/projectile/domains/definingWorldPlazaProjectileConstants';
import type {
  DefiningWorldPlazaProjectileInstance,
  SpawningWorldPlazaProjectileRequest,
} from '@/components/world/projectile/domains/definingWorldPlazaProjectileTypes';
import { rollingWorldPlazaProjectileSeededUnitFloat } from '@/components/world/projectile/domains/rollingWorldPlazaProjectileSeededRandom';

/**
 * Creates a new projectile instance from a spawn request and archetype.
 *
 * @module components/world/projectile/domains/creatingWorldPlazaProjectileInstance
 */

let managingWorldPlazaProjectileInstanceIdCounter = 0;

function creatingWorldPlazaProjectileFallbackId(): string {
  managingWorldPlazaProjectileInstanceIdCounter += 1;
  return `projectile-local-${managingWorldPlazaProjectileInstanceIdCounter}-${Date.now()}`;
}

function normalizingWorldPlazaProjectileSpawnDirection(
  direction: { readonly x: number; readonly y: number } | undefined,
  origin: SpawningWorldPlazaProjectileRequest['origin'],
  targetPoint: SpawningWorldPlazaProjectileRequest['targetPoint']
): { readonly x: number; readonly y: number } {
  if (direction) {
    const length = Math.hypot(direction.x, direction.y);
    if (length >= DEFINING_WORLD_PLAZA_PROJECTILE_MIN_DIRECTION_LENGTH) {
      return { x: direction.x / length, y: direction.y / length };
    }
  }

  if (targetPoint) {
    const deltaX = targetPoint.x - origin.x;
    const deltaY = targetPoint.y - origin.y;
    const length = Math.hypot(deltaX, deltaY);
    if (length >= DEFINING_WORLD_PLAZA_PROJECTILE_MIN_DIRECTION_LENGTH) {
      return { x: deltaX / length, y: deltaY / length };
    }
  }

  return { x: 1, y: 0 };
}

/**
 * Materializes a live projectile instance from a spawn request.
 */
export function creatingWorldPlazaProjectileInstance(
  request: SpawningWorldPlazaProjectileRequest
): DefiningWorldPlazaProjectileInstance | null {
  const archetype = resolvingWorldPlazaProjectileArchetype(request.archetypeId);
  if (!archetype) {
    return null;
  }

  // Must match projectile sim / visual ticks (`performance.now()`). Wall-clock
  // stamps make `ageMs = nowMs - spawnedAtMs` massively negative.
  const spawnedAtMs = request.spawnedAtMs ?? performance.now();
  const seed =
    request.seed ??
    Math.floor(
      rollingWorldPlazaProjectileSeededUnitFloat(spawnedAtMs, 3) * 1_000_000
    );
  const direction = normalizingWorldPlazaProjectileSpawnDirection(
    request.direction,
    request.origin,
    request.targetPoint
  );
  const speed = archetype.movement.speedGridPerSec;
  const layer =
    request.origin.layer ?? resolvingWorldPlazaPlayerWorldLayer(request.origin);
  const skyDropStartAltitudePx =
    archetype.movement.skyDropStartAltitudePx ?? 140;

  return {
    projectileId:
      request.projectileId ?? creatingWorldPlazaProjectileFallbackId(),
    archetypeId: request.archetypeId,
    spawnedAtMs,
    seed,
    spawnerUserId: request.spawnerUserId ?? null,
    origin: { ...request.origin, layer },
    position: { ...request.origin, layer },
    velocityX: direction.x * speed,
    velocityY: direction.y * speed,
    altitudePx:
      archetype.altitude.mode === 'skyDrop'
        ? skyDropStartAltitudePx
        : archetype.altitude.mode === 'flying'
          ? (archetype.altitude.flyingAltitudePx ?? 24)
          : 0,
    altitudeVelocityPxPerSec: 0,
    targetPoint: request.targetPoint ?? null,
    homingLeadErrorRadians:
      archetype.movement.homingLeadErrorRadians ??
      rollingWorldPlazaProjectileSeededUnitFloat(seed, 9) * 0.5,
    lobProgress: 0,
    hasSplit: false,
    hasImpacted: false,
    hitTargetIds: [],
    missFeedbackTargetIds: [],
    telegraphStartedAtMs: null,
  };
}
