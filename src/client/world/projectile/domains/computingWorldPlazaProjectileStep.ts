import type { DefiningWorldCollisionContext } from '@/components/world/collision/domains/definingWorldCollisionContext';
import { checkingWorldCollisionBlockedAtPoint } from '@/components/world/collision/domains/queryingWorldCollisionSpatialOverlaps';
import { resolvingWorldPlazaPlayerWorldLayer } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import {
  formattingWorldPlazaClientCapturedError,
  loggingWorldPlazaClientError,
} from '@/components/world/domains/loggingWorldPlazaClientErrors';
import { resolvingWorldPlazaProjectileArchetype } from '@/components/world/projectile/domains/definingWorldPlazaProjectileArchetypeRegistry';
import {
  checkingWorldPlazaProjectileAoeIncludesTarget,
  checkingWorldPlazaProjectileShouldDespawnAfterImpact,
  checkingWorldPlazaProjectileShouldSplitByTimer,
  checkingWorldPlazaProjectileShouldSplitOnImpact,
  resolvingWorldPlazaProjectileSplitSpawnRequests,
  resolvingWorldPlazaProjectileTelegraphStartAtMs,
} from '@/components/world/projectile/domains/definingWorldPlazaProjectileImpactBehaviorRegistry';
import { advancingWorldPlazaProjectileMovement } from '@/components/world/projectile/domains/definingWorldPlazaProjectileMovementBehaviorRegistry';
import type {
  AdvancingWorldPlazaProjectileEngineStepResult,
  DefiningWorldPlazaProjectileHitEvent,
  DefiningWorldPlazaProjectileImpactEvent,
  DefiningWorldPlazaProjectileInstance,
  DefiningWorldPlazaProjectileMissEvent,
  DefiningWorldPlazaProjectileTarget,
  SpawningWorldPlazaProjectileRequest,
} from '@/components/world/projectile/domains/definingWorldPlazaProjectileTypes';
import { filteringWorldPlazaProjectileHittableTargets } from '@/components/world/projectile/domains/filteringWorldPlazaProjectileHittableTargets';
import { resolvingWorldPlazaProjectileAimPoint } from '@/components/world/projectile/domains/resolvingWorldPlazaProjectileAimPoint';
import {
  checkingWorldPlazaProjectileAlreadyHitTarget,
  resolvingWorldPlazaProjectileHit,
} from '@/components/world/projectile/domains/resolvingWorldPlazaProjectileHit';
import { resolvingWorldPlazaProjectileMissReason } from '@/components/world/projectile/domains/resolvingWorldPlazaProjectileMissReason';

/**
 * Pure per-frame projectile simulation step.
 *
 * @module components/world/projectile/domains/computingWorldPlazaProjectileStep
 */

export type ComputingWorldPlazaProjectileStepParams = {
  readonly instances: readonly DefiningWorldPlazaProjectileInstance[];
  readonly deltaSeconds: number;
  readonly nowMs: number;
  readonly targets: readonly DefiningWorldPlazaProjectileTarget[];
  readonly collisionContext: DefiningWorldCollisionContext;
};

function checkingWorldPlazaProjectileBlockedByTerrain(
  position: DefiningWorldPlazaProjectileInstance['position'],
  collisionContext: DefiningWorldCollisionContext,
  projectileLayer: number
): boolean {
  const blocked = checkingWorldCollisionBlockedAtPoint(position, {
    ...collisionContext,
    applyBlockCollision: true,
    isJumping: false,
    playerLayer: projectileLayer,
  });

  if (!blocked) {
    return false;
  }

  return true;
}

function updatingWorldPlazaProjectileInstanceFields(
  instance: DefiningWorldPlazaProjectileInstance,
  patch: Partial<DefiningWorldPlazaProjectileInstance>
): DefiningWorldPlazaProjectileInstance {
  return { ...instance, ...patch };
}

/**
 * Advances all projectile instances for one simulation tick.
 */
export function computingWorldPlazaProjectileStep({
  instances,
  deltaSeconds,
  nowMs,
  targets,
  collisionContext,
}: ComputingWorldPlazaProjectileStepParams): AdvancingWorldPlazaProjectileEngineStepResult {
  const nextInstances: DefiningWorldPlazaProjectileInstance[] = [];
  const spawnRequests: SpawningWorldPlazaProjectileRequest[] = [];
  const hitEvents: DefiningWorldPlazaProjectileHitEvent[] = [];
  const missEvents: DefiningWorldPlazaProjectileMissEvent[] = [];
  const impactEvents: DefiningWorldPlazaProjectileImpactEvent[] = [];

  for (const instance of instances) {
    try {
      const archetype = resolvingWorldPlazaProjectileArchetype(
        instance.archetypeId
      );
      if (!archetype) {
        continue;
      }

      const ageMs = nowMs - instance.spawnedAtMs;
      if (ageMs >= archetype.lifetimeMs) {
        continue;
      }

      let working = instance;

      if (
        archetype.split &&
        checkingWorldPlazaProjectileShouldSplitByTimer(
          archetype.split,
          ageMs,
          working.hasSplit
        )
      ) {
        spawnRequests.push(
          ...resolvingWorldPlazaProjectileSplitSpawnRequests({
            instance: working,
            split: archetype.split,
            nowMs,
          })
        );
        working = updatingWorldPlazaProjectileInstanceFields(working, {
          hasSplit: true,
        });
      }

      const flyingAltitudePx =
        archetype.altitude.mode === 'flying'
          ? (archetype.altitude.flyingAltitudePx ?? 24)
          : archetype.altitude.mode === 'skyDrop'
            ? working.altitudePx
            : 0;

      const hittableTargets = filteringWorldPlazaProjectileHittableTargets(
        targets,
        working.spawnerUserId
      );

      const aimPoint = resolvingWorldPlazaProjectileAimPoint({
        instance: working,
        movement: archetype.movement,
        targets: hittableTargets,
      });

      if (archetype.movement.tracksLiveTarget === true && aimPoint !== null) {
        working = updatingWorldPlazaProjectileInstanceFields(working, {
          targetPoint: aimPoint,
        });
      }

      const movementResult = advancingWorldPlazaProjectileMovement({
        instance: working,
        movement: archetype.movement,
        deltaSeconds,
        nowMs,
        targetPoint: aimPoint,
        flyingAltitudePx,
      });

      const projectileLayer =
        movementResult.position.layer ??
        resolvingWorldPlazaPlayerWorldLayer(movementResult.position);

      working = updatingWorldPlazaProjectileInstanceFields(working, {
        position: movementResult.position,
        velocityX: movementResult.velocityX,
        velocityY: movementResult.velocityY,
        altitudePx:
          archetype.altitude.mode === 'groundHugging'
            ? 0
            : archetype.altitude.mode === 'flying'
              ? flyingAltitudePx
              : movementResult.altitudePx,
        altitudeVelocityPxPerSec: movementResult.altitudeVelocityPxPerSec,
        lobProgress: movementResult.lobProgress,
        telegraphStartedAtMs:
          resolvingWorldPlazaProjectileTelegraphStartAtMs(
            working,
            archetype.impact,
            nowMs
          ) ?? working.telegraphStartedAtMs,
      });

      if (
        archetype.blocksOnTerrain &&
        checkingWorldPlazaProjectileBlockedByTerrain(
          working.position,
          collisionContext,
          projectileLayer
        )
      ) {
        if (archetype.impact.behaviorId === 'aoeExplosion') {
          impactEvents.push({
            projectileId: working.projectileId,
            archetypeId: working.archetypeId,
            position: working.position,
            impactBehaviorId: archetype.impact.behaviorId,
            aoeRadiusGrid: archetype.impact.aoeRadiusGrid ?? null,
          });
        }

        if (
          archetype.split &&
          checkingWorldPlazaProjectileShouldSplitOnImpact(
            archetype.split,
            true,
            working.hasSplit
          )
        ) {
          spawnRequests.push(
            ...resolvingWorldPlazaProjectileSplitSpawnRequests({
              instance: working,
              split: archetype.split,
              nowMs,
            })
          );
        }

        continue;
      }

      if (movementResult.hasImpacted && !working.hasImpacted) {
        working = updatingWorldPlazaProjectileInstanceFields(working, {
          hasImpacted: true,
        });

        if (archetype.impact.behaviorId === 'aoeExplosion') {
          impactEvents.push({
            projectileId: working.projectileId,
            archetypeId: working.archetypeId,
            position: working.position,
            impactBehaviorId: archetype.impact.behaviorId,
            aoeRadiusGrid: archetype.impact.aoeRadiusGrid ?? null,
          });

          for (const target of hittableTargets) {
            try {
              if (
                archetype.impact.aoeRadiusGrid !== undefined &&
                checkingWorldPlazaProjectileAoeIncludesTarget(
                  working.position,
                  archetype.impact.aoeRadiusGrid,
                  target
                ) &&
                !checkingWorldPlazaProjectileAlreadyHitTarget(
                  working,
                  target.targetId
                )
              ) {
                hitEvents.push({
                  projectileId: working.projectileId,
                  archetypeId: working.archetypeId,
                  targetId: target.targetId,
                  position: working.position,
                });
                working = updatingWorldPlazaProjectileInstanceFields(working, {
                  hitTargetIds: [...working.hitTargetIds, target.targetId],
                });
              }
            } catch (error) {
              loggingWorldPlazaClientError(
                `[projectile:aoe-hit:${working.projectileId}:${target.targetId}] ${formattingWorldPlazaClientCapturedError(error)}`
              );
            }
          }

          if (
            checkingWorldPlazaProjectileShouldDespawnAfterImpact(
              archetype.impact
            )
          ) {
            continue;
          }
        }
      }

      if (archetype.impact.behaviorId === 'singleTarget') {
        for (const target of hittableTargets) {
          try {
            if (
              checkingWorldPlazaProjectileAlreadyHitTarget(
                working,
                target.targetId
              )
            ) {
              continue;
            }

            if (
              resolvingWorldPlazaProjectileHit({
                instance: working,
                archetype,
                target,
              })
            ) {
              hitEvents.push({
                projectileId: working.projectileId,
                archetypeId: working.archetypeId,
                targetId: target.targetId,
                position: working.position,
              });
              working = updatingWorldPlazaProjectileInstanceFields(working, {
                hitTargetIds: [...working.hitTargetIds, target.targetId],
                hasImpacted: true,
              });
            } else if (
              resolvingWorldPlazaProjectileMissReason({
                instance: working,
                archetype,
                target,
              }) === 'jump_dodge' &&
              !working.missFeedbackTargetIds.includes(target.targetId)
            ) {
              missEvents.push({
                projectileId: working.projectileId,
                archetypeId: working.archetypeId,
                targetId: target.targetId,
                position: working.position,
                reason: 'jump_dodge',
              });
              working = updatingWorldPlazaProjectileInstanceFields(working, {
                missFeedbackTargetIds: [
                  ...working.missFeedbackTargetIds,
                  target.targetId,
                ],
              });
            }
          } catch (error) {
            loggingWorldPlazaClientError(
              `[projectile:hit:${working.projectileId}:${target.targetId}] ${formattingWorldPlazaClientCapturedError(error)}`
            );
          }
        }

        if (
          working.hasImpacted &&
          checkingWorldPlazaProjectileShouldDespawnAfterImpact(archetype.impact)
        ) {
          if (
            archetype.split &&
            checkingWorldPlazaProjectileShouldSplitOnImpact(
              archetype.split,
              working.hasImpacted,
              working.hasSplit
            )
          ) {
            spawnRequests.push(
              ...resolvingWorldPlazaProjectileSplitSpawnRequests({
                instance: working,
                split: archetype.split,
                nowMs,
              })
            );
          }

          continue;
        }
      }

      nextInstances.push(working);
    } catch (error) {
      loggingWorldPlazaClientError(
        `[projectile:sim:${instance.projectileId}] ${formattingWorldPlazaClientCapturedError(error)}`
      );
    }
  }

  return {
    instances: nextInstances,
    spawnRequests,
    hitEvents,
    missEvents,
    impactEvents,
  };
}
