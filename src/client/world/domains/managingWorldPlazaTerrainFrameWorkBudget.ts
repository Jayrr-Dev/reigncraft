/**
 * Per-frame terrain work deadline used by the terrain layer engine.
 *
 * @module components/world/domains/managingWorldPlazaTerrainFrameWorkBudget
 */

/** Mutable per-tick terrain work budget. */
export type ManagingWorldPlazaTerrainFrameWorkBudget = {
  readonly startedAtMs: number;
  readonly deadlineMs: number;
  didExpire: boolean;
};

/**
 * Starts a terrain work budget for the current frame.
 *
 * @param budgetMs - Maximum milliseconds terrain work may consume this frame.
 */
export function beginningWorldPlazaTerrainFrameWorkBudget(
  budgetMs: number
): ManagingWorldPlazaTerrainFrameWorkBudget {
  return {
    startedAtMs: performance.now(),
    deadlineMs: Math.max(0, budgetMs),
    didExpire: false,
  };
}

/**
 * Returns true when terrain work should stop for this frame.
 *
 * @param budget - Active frame budget.
 */
export function checkingWorldPlazaTerrainFrameWorkBudgetExpired(
  budget: ManagingWorldPlazaTerrainFrameWorkBudget
): boolean {
  if (budget.didExpire) {
    return true;
  }

  if (budget.deadlineMs <= 0) {
    return false;
  }

  const elapsedMs = performance.now() - budget.startedAtMs;

  if (elapsedMs >= budget.deadlineMs) {
    budget.didExpire = true;
    return true;
  }

  return false;
}
