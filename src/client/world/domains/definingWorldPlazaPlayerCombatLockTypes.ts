/**
 * Live player combat lock-on state (auto-melee in reach; optional chase).
 *
 * @module components/world/domains/definingWorldPlazaPlayerCombatLockTypes
 */

/** Mutable lock-on toward a wildlife instance until cancelled or the target dies. */
export type DefiningWorldPlazaPlayerCombatLockState = {
  readonly targetInstanceId: string;
  /** Last grid point used for a chase walk plan. */
  lastChaseGridX: number;
  lastChaseGridY: number;
  /** {@link performance.now} of the last chase path replan. */
  lastChaseReplanAtMs: number;
  /**
   * When true, skip auto-chase so the player can tap-walk freely.
   * Cleared on a fresh lock (new target). Set by ground taps while locked.
   */
  suppressChase: boolean;
};
