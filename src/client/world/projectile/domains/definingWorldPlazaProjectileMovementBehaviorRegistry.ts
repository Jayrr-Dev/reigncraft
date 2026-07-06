import { computingWorldPlazaGirlSampleJumpArcOffsetPx } from '@/components/world/domains/computingWorldPlazaGirlSampleJumpArcOffsetPx';
import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import {
  DEFINING_WORLD_PLAZA_PROJECTILE_HOMING_SOFT_LEAD_ERROR_RAD,
  DEFINING_WORLD_PLAZA_PROJECTILE_HOMING_SOFT_MAX_TURN_RATE_RAD_PER_SEC,
  DEFINING_WORLD_PLAZA_PROJECTILE_MIN_DIRECTION_LENGTH,
} from '@/components/world/projectile/domains/definingWorldPlazaProjectileConstants';
import type {
  DefiningWorldPlazaProjectileInstance,
  DefiningWorldPlazaProjectileMovementConfig,
} from '@/components/world/projectile/domains/definingWorldPlazaProjectileTypes';
import { rollingWorldPlazaProjectileSeededUnitFloat } from '@/components/world/projectile/domains/rollingWorldPlazaProjectileSeededRandom';

/**
 * Pure projectile movement behavior steppers.
 *
 * @module components/world/projectile/domains/definingWorldPlazaProjectileMovementBehaviorRegistry
 */

export type AdvancingWorldPlazaProjectileMovementParams = {
  readonly instance: DefiningWorldPlazaProjectileInstance;
  readonly movement: DefiningWorldPlazaProjectileMovementConfig;
  readonly deltaSeconds: number;
  readonly nowMs: number;
  readonly targetPoint: DefiningWorldPlazaWorldPoint | null;
  readonly flyingAltitudePx: number;
};

export type AdvancingWorldPlazaProjectileMovementResult = {
  readonly position: DefiningWorldPlazaWorldPoint;
  readonly velocityX: number;
  readonly velocityY: number;
  readonly altitudePx: number;
  readonly altitudeVelocityPxPerSec: number;
  readonly lobProgress: number;
  readonly hasImpacted: boolean;
};

function normalizingWorldPlazaProjectileDirection(
  x: number,
  y: number
): { readonly x: number; readonly y: number } {
  const length = Math.hypot(x, y);
  if (length < DEFINING_WORLD_PLAZA_PROJECTILE_MIN_DIRECTION_LENGTH) {
    return { x: 1, y: 0 };
  }
  return { x: x / length, y: y / length };
}

function rotatingWorldPlazaProjectileVectorToward(
  currentX: number,
  currentY: number,
  targetX: number,
  targetY: number,
  maxTurnRadians: number
): { readonly x: number; readonly y: number } {
  const currentLength = Math.hypot(currentX, currentY);
  const normalizedCurrent =
    currentLength < DEFINING_WORLD_PLAZA_PROJECTILE_MIN_DIRECTION_LENGTH
      ? { x: 1, y: 0 }
      : { x: currentX / currentLength, y: currentY / currentLength };
  const normalizedTarget = normalizingWorldPlazaProjectileDirection(
    targetX,
    targetY
  );
  const dot = Math.max(
    -1,
    Math.min(
      1,
      normalizedCurrent.x * normalizedTarget.x +
        normalizedCurrent.y * normalizedTarget.y
    )
  );
  const angleBetween = Math.acos(dot);
  const cross =
    normalizedCurrent.x * normalizedTarget.y -
    normalizedCurrent.y * normalizedTarget.x;
  const signedAngle = cross >= 0 ? angleBetween : -angleBetween;
  const clampedTurn = Math.max(
    -maxTurnRadians,
    Math.min(maxTurnRadians, signedAngle)
  );
  const cos = Math.cos(clampedTurn);
  const sin = Math.sin(clampedTurn);
  const rotatedX = normalizedCurrent.x * cos - normalizedCurrent.y * sin;
  const rotatedY = normalizedCurrent.x * sin + normalizedCurrent.y * cos;
  return normalizingWorldPlazaProjectileDirection(rotatedX, rotatedY);
}

function advancingWorldPlazaProjectileLinearMovement({
  instance,
  movement,
  deltaSeconds,
}: AdvancingWorldPlazaProjectileMovementParams): AdvancingWorldPlazaProjectileMovementResult {
  const nextX = instance.position.x + instance.velocityX * deltaSeconds;
  const nextY = instance.position.y + instance.velocityY * deltaSeconds;
  return {
    position: { ...instance.position, x: nextX, y: nextY },
    velocityX: instance.velocityX,
    velocityY: instance.velocityY,
    altitudePx: instance.altitudePx,
    altitudeVelocityPxPerSec: instance.altitudeVelocityPxPerSec,
    lobProgress: instance.lobProgress,
    hasImpacted: false,
  };
}

function advancingWorldPlazaProjectileHomingSoftMovement({
  instance,
  movement,
  deltaSeconds,
  targetPoint,
}: AdvancingWorldPlazaProjectileMovementParams): AdvancingWorldPlazaProjectileMovementResult {
  if (!targetPoint) {
    return advancingWorldPlazaProjectileLinearMovement({
      instance,
      movement,
      deltaSeconds,
      nowMs: 0,
      targetPoint: null,
      flyingAltitudePx: 0,
    });
  }

  const leadError =
    movement.homingLeadErrorRadians ??
    DEFINING_WORLD_PLAZA_PROJECTILE_HOMING_SOFT_LEAD_ERROR_RAD;
  const errorScale =
    1 +
    (rollingWorldPlazaProjectileSeededUnitFloat(instance.seed, 17) - 0.5) *
      leadError;
  const toTargetX = targetPoint.x - instance.position.x;
  const toTargetY = targetPoint.y - instance.position.y;
  const rotated = rotatingWorldPlazaProjectileVectorToward(
    instance.velocityX,
    instance.velocityY,
    toTargetX * errorScale,
    toTargetY * errorScale,
    (movement.maxTurnRateRadiansPerSec ??
      DEFINING_WORLD_PLAZA_PROJECTILE_HOMING_SOFT_MAX_TURN_RATE_RAD_PER_SEC) *
      deltaSeconds
  );
  const speed = movement.speedGridPerSec;
  const velocityX = rotated.x * speed;
  const velocityY = rotated.y * speed;
  return {
    position: {
      ...instance.position,
      x: instance.position.x + velocityX * deltaSeconds,
      y: instance.position.y + velocityY * deltaSeconds,
    },
    velocityX,
    velocityY,
    altitudePx: instance.altitudePx,
    altitudeVelocityPxPerSec: instance.altitudeVelocityPxPerSec,
    lobProgress: instance.lobProgress,
    hasImpacted: false,
  };
}

function advancingWorldPlazaProjectileHomingDirectMovement({
  instance,
  movement,
  deltaSeconds,
  targetPoint,
}: AdvancingWorldPlazaProjectileMovementParams): AdvancingWorldPlazaProjectileMovementResult {
  if (!targetPoint) {
    return advancingWorldPlazaProjectileLinearMovement({
      instance,
      movement,
      deltaSeconds,
      nowMs: 0,
      targetPoint: null,
      flyingAltitudePx: 0,
    });
  }

  const direction = normalizingWorldPlazaProjectileDirection(
    targetPoint.x - instance.position.x,
    targetPoint.y - instance.position.y
  );
  const velocityX = direction.x * movement.speedGridPerSec;
  const velocityY = direction.y * movement.speedGridPerSec;
  return {
    position: {
      ...instance.position,
      x: instance.position.x + velocityX * deltaSeconds,
      y: instance.position.y + velocityY * deltaSeconds,
    },
    velocityX,
    velocityY,
    altitudePx: instance.altitudePx,
    altitudeVelocityPxPerSec: instance.altitudeVelocityPxPerSec,
    lobProgress: instance.lobProgress,
    hasImpacted: false,
  };
}

function advancingWorldPlazaProjectileLobbedArcMovement({
  instance,
  movement,
  deltaSeconds,
  nowMs,
  targetPoint,
  flyingAltitudePx,
}: AdvancingWorldPlazaProjectileMovementParams): AdvancingWorldPlazaProjectileMovementResult {
  const flightDurationMs = movement.lobFlightDurationMs ?? 1_000;
  const elapsedMs = nowMs - instance.spawnedAtMs;
  const progress = Math.min(1, elapsedMs / flightDurationMs);
  const target = targetPoint ?? instance.targetPoint ?? instance.origin;
  const nextX = instance.origin.x + (target.x - instance.origin.x) * progress;
  const nextY = instance.origin.y + (target.y - instance.origin.y) * progress;
  const arcPeakPx = Math.max(48, flyingAltitudePx + 40);
  const altitudePx = -computingWorldPlazaGirlSampleJumpArcOffsetPx(
    progress,
    arcPeakPx
  );
  const hasImpacted = progress >= 1;
  return {
    position: { ...instance.position, x: nextX, y: nextY, layer: target.layer },
    velocityX: 0,
    velocityY: 0,
    altitudePx,
    altitudeVelocityPxPerSec: 0,
    lobProgress: progress,
    hasImpacted,
  };
}

function advancingWorldPlazaProjectileSkyDropMovement({
  instance,
  movement,
  deltaSeconds,
  targetPoint,
}: AdvancingWorldPlazaProjectileMovementParams): AdvancingWorldPlazaProjectileMovementResult {
  const target = targetPoint ?? instance.targetPoint ?? instance.origin;
  const fallSpeed = movement.skyDropFallSpeedPxPerSec ?? 180;
  const nextAltitude = Math.max(
    0,
    instance.altitudePx - fallSpeed * deltaSeconds
  );
  const hasImpacted = nextAltitude <= 0;
  return {
    position: {
      x: target.x,
      y: target.y,
      layer: target.layer ?? instance.position.layer,
    },
    velocityX: 0,
    velocityY: 0,
    altitudePx: nextAltitude,
    altitudeVelocityPxPerSec: -fallSpeed,
    lobProgress: instance.lobProgress,
    hasImpacted,
  };
}

export const DEFINING_WORLD_PLAZA_PROJECTILE_MOVEMENT_BEHAVIOR_REGISTRY = {
  linear: advancingWorldPlazaProjectileLinearMovement,
  homingSoft: advancingWorldPlazaProjectileHomingSoftMovement,
  homingDirect: advancingWorldPlazaProjectileHomingDirectMovement,
  lobbedArc: advancingWorldPlazaProjectileLobbedArcMovement,
  skyDrop: advancingWorldPlazaProjectileSkyDropMovement,
} as const;

/**
 * Advances one projectile instance using its movement behavior.
 */
export function advancingWorldPlazaProjectileMovement(
  params: AdvancingWorldPlazaProjectileMovementParams
): AdvancingWorldPlazaProjectileMovementResult {
  const stepper =
    DEFINING_WORLD_PLAZA_PROJECTILE_MOVEMENT_BEHAVIOR_REGISTRY[
      params.movement.behaviorId
    ];
  return stepper(params);
}
