import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import type {
  DefiningWorldPlazaProjectileImpactConfig,
  DefiningWorldPlazaProjectileInstance,
  DefiningWorldPlazaProjectileSplitConfig,
  DefiningWorldPlazaProjectileTarget,
  SpawningWorldPlazaProjectileRequest,
} from '@/components/world/projectile/domains/definingWorldPlazaProjectileTypes';
import { rollingWorldPlazaProjectileSeededUnitFloat } from '@/components/world/projectile/domains/rollingWorldPlazaProjectileSeededRandom';

/**
 * Impact and split behavior resolvers for the projectile engine.
 *
 * @module components/world/projectile/domains/definingWorldPlazaProjectileImpactBehaviorRegistry
 */

export type ResolvingWorldPlazaProjectileSplitSpawnRequestsParams = {
  readonly instance: DefiningWorldPlazaProjectileInstance;
  readonly split: DefiningWorldPlazaProjectileSplitConfig;
  readonly nowMs: number;
};

/**
 * Builds child spawn requests when a split timer elapses.
 */
export function resolvingWorldPlazaProjectileSplitSpawnRequests({
  instance,
  split,
  nowMs,
}: ResolvingWorldPlazaProjectileSplitSpawnRequestsParams): readonly SpawningWorldPlazaProjectileRequest[] {
  const requests: SpawningWorldPlazaProjectileRequest[] = [];
  const spreadRadians = split.spreadRadians ?? Math.PI * 2;
  const baseAngle =
    split.spreadPattern === 'forwardFan'
      ? Math.atan2(instance.velocityY, instance.velocityX)
      : 0;

  for (let childIndex = 0; childIndex < split.count; childIndex += 1) {
    const angleOffset =
      split.spreadPattern === 'radial'
        ? (spreadRadians / split.count) * childIndex
        : (childIndex / Math.max(1, split.count - 1) - 0.5) * spreadRadians;
    const angle = baseAngle + angleOffset;
    const directionX = Math.cos(angle);
    const directionY = Math.sin(angle);
    const jitter = rollingWorldPlazaProjectileSeededUnitFloat(
      instance.seed,
      childIndex + 41
    );
    const childSeed = Math.floor(
      instance.seed + childIndex * 997 + jitter * 1000
    );
    requests.push({
      projectileId: `${instance.projectileId}-split-${childIndex}`,
      archetypeId: split.childArchetypeId,
      origin: instance.position,
      direction: { x: directionX, y: directionY },
      spawnedAtMs: nowMs,
      seed: childSeed,
      spawnerUserId: instance.spawnerUserId,
    });
  }

  return requests;
}

/**
 * Returns true when an AoE impact should include the given target.
 */
export function checkingWorldPlazaProjectileAoeIncludesTarget(
  impactPosition: DefiningWorldPlazaWorldPoint,
  aoeRadiusGrid: number,
  target: DefiningWorldPlazaProjectileTarget
): boolean {
  const distance = Math.hypot(
    impactPosition.x - target.point.x,
    impactPosition.y - target.point.y
  );
  return distance <= aoeRadiusGrid + target.collisionRadiusGrid;
}

/**
 * Returns whether a projectile should despawn after impact given its config.
 */
export function checkingWorldPlazaProjectileShouldDespawnAfterImpact(
  impact: DefiningWorldPlazaProjectileImpactConfig
): boolean {
  return (
    impact.behaviorId === 'singleTarget' || impact.behaviorId === 'aoeExplosion'
  );
}

/**
 * Returns telegraph start time for archetypes that telegraph ground impacts.
 */
export function resolvingWorldPlazaProjectileTelegraphStartAtMs(
  instance: DefiningWorldPlazaProjectileInstance,
  impact: DefiningWorldPlazaProjectileImpactConfig,
  nowMs: number
): number | null {
  if (!impact.telegraph) {
    return null;
  }

  const impactAtMs = instance.spawnedAtMs + impact.telegraph.leadTimeMs;
  if (nowMs < impactAtMs - impact.telegraph.durationMs) {
    return null;
  }

  return impactAtMs - impact.telegraph.durationMs;
}
