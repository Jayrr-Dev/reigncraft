/**
 * Live player combat lock-on state (chase + auto-melee).
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
};
