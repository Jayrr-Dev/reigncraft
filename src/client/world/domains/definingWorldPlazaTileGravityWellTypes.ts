import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';

/**
 * Shared tile gravity-well types for players, wildlife, projectiles, and other movers.
 *
 * @module components/world/domains/definingWorldPlazaTileGravityWellTypes
 */

/** Grid-space velocity in grid units per second. */
export type DefiningWorldPlazaTileGravityWellVelocity = {
  readonly x: number;
  readonly y: number;
};

/**
 * Falloff curve from the attractor out to the influence radius.
 *
 * - `none`: full strength anywhere inside the radius
 * - `linear`: strength scales with remaining distance to the edge (1 at center, 0 at radius)
 * - `inverseSquare`: strength scales with `1 / (1 + distance^2)` then zero outside radius
 */
export type DefiningWorldPlazaTileGravityWellFalloff =
  | 'none'
  | 'linear'
  | 'inverseSquare';

/**
 * Declarative gravity well: accelerate movers toward an attractor in grid space.
 *
 * Intentional locomotion (walk/run/steering) stays separate. Callers add the
 * returned acceleration into their own velocity or position step so the entity
 * can still fight the pull.
 */
export type DefiningWorldPlazaTileGravityWell = {
  /** Attractor in plaza grid floats (usually a tile diamond center). */
  readonly attractor: DefiningWorldPlazaWorldPoint;
  /**
   * Acceleration toward the attractor at full strength (grid units / s²).
   * Positive pulls inward. Negative repels (anti-gravity).
   */
  readonly accelerationGridPerSec2: number;
  /** Distance beyond which acceleration is zero. */
  readonly radiusGrid: number;
  /** How strength drops with distance. Defaults to `linear`. */
  readonly falloff?: DefiningWorldPlazaTileGravityWellFalloff;
  /** Soft settle radius; inside this, pull fades to avoid jitter at the center. */
  readonly settleRadiusGrid?: number;
  /** Optional hard cap on gravity velocity magnitude (grid / s). */
  readonly maxSpeedGridPerSec?: number;
};

/** Inputs for one gravity acceleration sample. */
export type ComputingWorldPlazaTileGravityWellAccelerationInput = {
  readonly position: DefiningWorldPlazaWorldPoint;
  readonly well: DefiningWorldPlazaTileGravityWell;
};

/** Acceleration sample for one tick (grid / s²). */
export type ComputingWorldPlazaTileGravityWellAccelerationResult = {
  readonly accelerationX: number;
  readonly accelerationY: number;
  /** True when the mover is inside the well radius. */
  readonly isInsideWell: boolean;
  /** Distance from position to attractor (grid units). */
  readonly distanceGrid: number;
  /** 0..1 strength after falloff and settle fade. */
  readonly strengthRatio: number;
};

/** Inputs for integrating gravity into a carried velocity. */
export type ComputingWorldPlazaTileGravityWellVelocityStepInput = {
  readonly position: DefiningWorldPlazaWorldPoint;
  readonly velocity: DefiningWorldPlazaTileGravityWellVelocity;
  readonly well: DefiningWorldPlazaTileGravityWell;
  readonly deltaSeconds: number;
};

/** Velocity after one gravity integration step. */
export type ComputingWorldPlazaTileGravityWellVelocityStepResult = {
  readonly velocity: DefiningWorldPlazaTileGravityWellVelocity;
  readonly accelerationX: number;
  readonly accelerationY: number;
  readonly isInsideWell: boolean;
  readonly distanceGrid: number;
  readonly strengthRatio: number;
};

/** Inputs for applying gravity as a position delta (no carried velocity). */
export type ComputingWorldPlazaTileGravityWellGridDeltaInput = {
  readonly position: DefiningWorldPlazaWorldPoint;
  readonly well: DefiningWorldPlazaTileGravityWell;
  readonly deltaSeconds: number;
  /**
   * Optional prior gravity velocity so consecutive ticks accumulate like real
   * gravity. Omit (or pass zero) for a one-shot impulse-style pull.
   */
  readonly velocity?: DefiningWorldPlazaTileGravityWellVelocity;
};

/** Position delta plus next carried velocity for the following tick. */
export type ComputingWorldPlazaTileGravityWellGridDeltaResult = {
  readonly gridDelta: DefiningWorldPlazaTileGravityWellVelocity;
  readonly nextVelocity: DefiningWorldPlazaTileGravityWellVelocity;
  readonly isInsideWell: boolean;
  readonly distanceGrid: number;
  readonly strengthRatio: number;
};
