/**
 * Tracks how long the local player has stood still for PackHunter kill triggers.
 *
 * @module components/world/domains/computingWorldPlazaPlayerStillDurationMs
 */

import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';

/** Grid movement below this counts as standing still. */
export const COMPUTING_WORLD_PLAZA_PLAYER_STILLNESS_POSITION_EPSILON_GRID = 0.08;

export type ComputingWorldPlazaPlayerStillnessSample = {
  lastActiveAtMs: number;
  x: number;
  y: number;
};

export type ComputingWorldPlazaPlayerStillDurationMsParams = {
  sample: ComputingWorldPlazaPlayerStillnessSample | null;
  position: DefiningWorldPlazaWorldPoint;
  isWalking: boolean;
  isRunning: boolean;
  isJumping: boolean;
  nowMs: number;
  positionEpsilonGrid?: number;
};

export type ComputingWorldPlazaPlayerStillDurationMsResult = {
  sample: ComputingWorldPlazaPlayerStillnessSample;
  stillDurationMs: number;
};

function checkingWorldPlazaPlayerMovedBeyondStillnessEpsilon(
  sample: ComputingWorldPlazaPlayerStillnessSample,
  position: DefiningWorldPlazaWorldPoint,
  positionEpsilonGrid: number
): boolean {
  return (
    Math.hypot(position.x - sample.x, position.y - sample.y) >
    positionEpsilonGrid
  );
}

/**
 * Returns how long the player has been idle: no walk/run/jump input and no
 * meaningful position change since the last active sample.
 */
export function computingWorldPlazaPlayerStillDurationMs({
  sample,
  position,
  isWalking,
  isRunning,
  isJumping,
  nowMs,
  positionEpsilonGrid = COMPUTING_WORLD_PLAZA_PLAYER_STILLNESS_POSITION_EPSILON_GRID,
}: ComputingWorldPlazaPlayerStillDurationMsParams): ComputingWorldPlazaPlayerStillDurationMsResult {
  const isActivelyMoving = isWalking || isRunning || isJumping;
  const movedSinceSample =
    sample !== null &&
    checkingWorldPlazaPlayerMovedBeyondStillnessEpsilon(
      sample,
      position,
      positionEpsilonGrid
    );

  if (!sample || isActivelyMoving || movedSinceSample) {
    const nextSample = {
      lastActiveAtMs: nowMs,
      x: position.x,
      y: position.y,
    };

    return {
      sample: nextSample,
      stillDurationMs: 0,
    };
  }

  return {
    sample,
    stillDurationMs: Math.max(0, nowMs - sample.lastActiveAtMs),
  };
}
