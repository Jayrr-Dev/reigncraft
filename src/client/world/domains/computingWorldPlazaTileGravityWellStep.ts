import { computingWorldPlazaTileGravityWellAcceleration } from '@/components/world/domains/computingWorldPlazaTileGravityWellAcceleration';
import { DEFINING_WORLD_PLAZA_TILE_GRAVITY_WELL_VELOCITY_IDLE } from '@/components/world/domains/definingWorldPlazaTileGravityWellConstants';
import type {
  ComputingWorldPlazaTileGravityWellGridDeltaInput,
  ComputingWorldPlazaTileGravityWellGridDeltaResult,
  ComputingWorldPlazaTileGravityWellVelocityStepInput,
  ComputingWorldPlazaTileGravityWellVelocityStepResult,
  DefiningWorldPlazaTileGravityWellVelocity,
} from '@/components/world/domains/definingWorldPlazaTileGravityWellTypes';

/**
 * Integrates gravity-well acceleration into velocity and position deltas.
 *
 * @module components/world/domains/computingWorldPlazaTileGravityWellStep
 */

function clampingWorldPlazaTileGravityWellVelocity(
  velocity: DefiningWorldPlazaTileGravityWellVelocity,
  maxSpeedGridPerSec: number | undefined
): DefiningWorldPlazaTileGravityWellVelocity {
  if (maxSpeedGridPerSec === undefined || maxSpeedGridPerSec <= 0) {
    return velocity;
  }

  const speed = Math.hypot(velocity.x, velocity.y);
  if (speed <= maxSpeedGridPerSec || speed <= 0) {
    return velocity;
  }

  const scale = maxSpeedGridPerSec / speed;
  return {
    x: velocity.x * scale,
    y: velocity.y * scale,
  };
}

/**
 * Integrates one gravity well into a carried velocity (v += a * dt, then clamp).
 *
 * Use this for projectiles or any mover that already tracks grid velocity.
 * Intentional thrust stays in the caller's velocity; gravity only adds.
 */
export function computingWorldPlazaTileGravityWellVelocityStep({
  position,
  velocity,
  well,
  deltaSeconds,
}: ComputingWorldPlazaTileGravityWellVelocityStepInput): ComputingWorldPlazaTileGravityWellVelocityStepResult {
  const safeDeltaSeconds = Math.max(0, deltaSeconds);
  const sample = computingWorldPlazaTileGravityWellAcceleration({
    position,
    well,
  });

  if (safeDeltaSeconds <= 0 || sample.strengthRatio <= 0) {
    return {
      velocity: clampingWorldPlazaTileGravityWellVelocity(
        velocity,
        well.maxSpeedGridPerSec
      ),
      accelerationX: sample.accelerationX,
      accelerationY: sample.accelerationY,
      isInsideWell: sample.isInsideWell,
      distanceGrid: sample.distanceGrid,
      strengthRatio: sample.strengthRatio,
    };
  }

  const nextVelocity = clampingWorldPlazaTileGravityWellVelocity(
    {
      x: velocity.x + sample.accelerationX * safeDeltaSeconds,
      y: velocity.y + sample.accelerationY * safeDeltaSeconds,
    },
    well.maxSpeedGridPerSec
  );

  return {
    velocity: nextVelocity,
    accelerationX: sample.accelerationX,
    accelerationY: sample.accelerationY,
    isInsideWell: sample.isInsideWell,
    distanceGrid: sample.distanceGrid,
    strengthRatio: sample.strengthRatio,
  };
}

/**
 * Returns a position delta from gravity for movers without a full velocity model.
 *
 * Pass `velocity` across ticks to accumulate pull like real gravity. Compose the
 * returned `gridDelta` with walk/run/steering deltas so the entity can still move.
 *
 * @example
 * ```ts
 * const pull = computingWorldPlazaTileGravityWellGridDelta({
 *   position: playerPosition,
 *   well,
 *   deltaSeconds,
 *   velocity: gravityVelocityRef.current,
 * });
 * gravityVelocityRef.current = pull.nextVelocity;
 * playerPosition.x += intentDelta.x + pull.gridDelta.x;
 * playerPosition.y += intentDelta.y + pull.gridDelta.y;
 * ```
 */
export function computingWorldPlazaTileGravityWellGridDelta({
  position,
  well,
  deltaSeconds,
  velocity = DEFINING_WORLD_PLAZA_TILE_GRAVITY_WELL_VELOCITY_IDLE,
}: ComputingWorldPlazaTileGravityWellGridDeltaInput): ComputingWorldPlazaTileGravityWellGridDeltaResult {
  const safeDeltaSeconds = Math.max(0, deltaSeconds);
  const stepped = computingWorldPlazaTileGravityWellVelocityStep({
    position,
    velocity,
    well,
    deltaSeconds: safeDeltaSeconds,
  });

  return {
    gridDelta: {
      x: stepped.velocity.x * safeDeltaSeconds,
      y: stepped.velocity.y * safeDeltaSeconds,
    },
    nextVelocity: stepped.velocity,
    isInsideWell: stepped.isInsideWell,
    distanceGrid: stepped.distanceGrid,
    strengthRatio: stepped.strengthRatio,
  };
}

/**
 * Sums acceleration from multiple wells at one position (linear superposition).
 */
export function computingWorldPlazaTileGravityWellAccelerationSum(
  position: ComputingWorldPlazaTileGravityWellGridDeltaInput['position'],
  wells: readonly ComputingWorldPlazaTileGravityWellGridDeltaInput['well'][]
): { readonly accelerationX: number; readonly accelerationY: number } {
  let accelerationX = 0;
  let accelerationY = 0;

  for (const well of wells) {
    const sample = computingWorldPlazaTileGravityWellAcceleration({
      position,
      well,
    });
    accelerationX += sample.accelerationX;
    accelerationY += sample.accelerationY;
  }

  return { accelerationX, accelerationY };
}
