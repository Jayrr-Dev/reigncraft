/**
 * Shared stamina core types for player and wildlife run bars.
 *
 * Consumer wrappers keep host-specific fields (fatigue, regen delays, species
 * multipliers) outside this shape.
 *
 * @module components/world/stamina/domains/definingStaminaCoreTypes
 */

/** Minimal stamina bar state shared by both hosts. */
export type DefiningStaminaCoreState = {
  /** Current bar as a 0..maxStaminaRatio value. */
  staminaRatio: number;
  /** True while run is locked until ratio reaches runLockedExitRatio. */
  isRunLocked: boolean;
};

/** Per-frame rates and latch thresholds for {@link advancingStaminaCoreTick}. */
export type DefiningStaminaCoreTickConfig = {
  /** Stamina drained per second while running (after multipliers). */
  drainPerSecond: number;
  /** Stamina regenerated per second while not running (after multipliers). */
  regenPerSecond: number;
  /**
   * While run-locked, ratio must reach this value before the lock clears.
   * Player maps fatigue unlock; wildlife maps exhaustedExitRatio.
   */
  runLockedExitRatio: number;
  /** Upper clamp for staminaRatio (wildlife apex may exceed 1). */
  maxStaminaRatio: number;
};

/** Result of one core stamina frame. */
export type AdvancingStaminaCoreTickResult = {
  state: DefiningStaminaCoreState;
  /** True when this frame actually drained stamina for a run. */
  isRunning: boolean;
};
