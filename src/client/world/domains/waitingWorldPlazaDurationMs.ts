/**
 * Async timing helpers for plaza UI transitions.
 *
 * @module components/world/domains/waitingWorldPlazaDurationMs
 */

/**
 * Resolves after a wall-clock delay.
 *
 * @param durationMs - Delay in milliseconds.
 */
export function waitingWorldPlazaDurationMs(durationMs: number): Promise<void> {
  return new Promise((resolve) => {
    window.setTimeout(resolve, durationMs);
  });
}

/**
 * Resolves after the next animation frame so CSS transitions can start.
 */
export function waitingWorldPlazaNextAnimationFrame(): Promise<void> {
  return new Promise((resolve) => {
    window.requestAnimationFrame(() => {
      resolve();
    });
  });
}
