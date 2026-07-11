/**
 * Smoothed player movement direction for directional terrain prefetch.
 *
 * @module components/world/domains/computingWorldPlazaSmoothedMovementDirection
 */

/** Normalized movement direction on the grid plane. */
export type ComputingWorldPlazaSmoothedMovementDirection = {
  readonly x: number;
  readonly y: number;
  readonly magnitude: number;
};

/** Mutable sample history for direction smoothing. */
export type ComputingWorldPlazaSmoothedMovementDirectionState = {
  lastGridX: number;
  lastGridY: number;
  smoothedX: number;
  smoothedY: number;
};

/**
 * Creates empty movement-direction smoothing state.
 */
export function creatingWorldPlazaSmoothedMovementDirectionState(): ComputingWorldPlazaSmoothedMovementDirectionState {
  return {
    lastGridX: 0,
    lastGridY: 0,
    smoothedX: 0,
    smoothedY: 0,
  };
}

/**
 * Updates smoothed movement direction from the latest player grid position.
 *
 * @param state - Mutable smoothing state.
 * @param gridX - Current player grid X.
 * @param gridY - Current player grid Y.
 * @param smoothing - Exponential blend toward the latest delta (0–1).
 */
export function computingWorldPlazaSmoothedMovementDirection(
  state: ComputingWorldPlazaSmoothedMovementDirectionState,
  gridX: number,
  gridY: number,
  smoothing = 0.35
): ComputingWorldPlazaSmoothedMovementDirection {
  const deltaX = gridX - state.lastGridX;
  const deltaY = gridY - state.lastGridY;

  if (state.lastGridX === 0 && state.lastGridY === 0) {
    state.lastGridX = gridX;
    state.lastGridY = gridY;
    return { x: 0, y: 0, magnitude: 0 };
  }

  state.lastGridX = gridX;
  state.lastGridY = gridY;

  if (deltaX === 0 && deltaY === 0) {
    const magnitude = Math.hypot(state.smoothedX, state.smoothedY);
    return {
      x: magnitude > 0 ? state.smoothedX / magnitude : 0,
      y: magnitude > 0 ? state.smoothedY / magnitude : 0,
      magnitude,
    };
  }

  const blend = Math.min(1, Math.max(0, smoothing));
  state.smoothedX = state.smoothedX * (1 - blend) + deltaX * blend;
  state.smoothedY = state.smoothedY * (1 - blend) + deltaY * blend;

  const magnitude = Math.hypot(state.smoothedX, state.smoothedY);

  if (magnitude <= 0.001) {
    return { x: 0, y: 0, magnitude: 0 };
  }

  return {
    x: state.smoothedX / magnitude,
    y: state.smoothedY / magnitude,
    magnitude,
  };
}
