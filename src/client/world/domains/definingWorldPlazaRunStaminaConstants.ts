/**
 * Hold-to-run stamina tuning for the plaza avatar.
 *
 * Stamina is tracked as a 0..1 ratio so the HUD bar maps directly to width.
 *
 * @module components/world/domains/definingWorldPlazaRunStaminaConstants
 */

/** Seconds of continuous running to drain a full stamina bar. */
export const DEFINING_WORLD_PLAZA_RUN_STAMINA_RUN_DURATION_SECONDS = 12.8;

/** Seconds of resting to regenerate a full stamina bar. */
export const DEFINING_WORLD_PLAZA_RUN_STAMINA_FULL_REGEN_SECONDS = 4.5;

/** Stamina drained per second while running (ratio units). */
export const DEFINING_WORLD_PLAZA_RUN_STAMINA_DRAIN_PER_SECOND =
  1 / DEFINING_WORLD_PLAZA_RUN_STAMINA_RUN_DURATION_SECONDS;

/** Stamina regenerated per second while not running (ratio units). */
export const DEFINING_WORLD_PLAZA_RUN_STAMINA_REGEN_PER_SECOND =
  1 / DEFINING_WORLD_PLAZA_RUN_STAMINA_FULL_REGEN_SECONDS;

/**
 * After stamina hits zero, running stays locked until it regenerates back to
 * this ratio.
 */
export const DEFINING_WORLD_PLAZA_RUN_STAMINA_RECOVER_RATIO = 0.75;

/** How long stamina stays at zero before regeneration begins (ms). */
export const DEFINING_WORLD_PLAZA_RUN_STAMINA_DEPLETION_REGEN_DELAY_MS = 2000;

/** Stamina consumed by a standing/walk jump (ratio units). */
export const DEFINING_WORLD_PLAZA_JUMP_STAMINA_COST_RATIO = 0.0625;

/** Stamina consumed by a run jump (ratio units). */
export const DEFINING_WORLD_PLAZA_RUN_JUMP_STAMINA_COST_RATIO = 0.0875;

/** Ratio under which the HUD bar switches to a low-stamina warning color. */
export const DEFINING_WORLD_PLAZA_RUN_STAMINA_LOW_RATIO = 0.3;

/** How long the pointer must be held before a walk upgrades to a run (ms). */
export const DEFINING_WORLD_PLAZA_RUN_STAMINA_HOLD_TO_RUN_MS = 150;

/** Minimum interval between HUD stamina state pushes (ms). */
export const DEFINING_WORLD_PLAZA_RUN_STAMINA_HUD_PUSH_INTERVAL_MS = 80;

/** Largest frame delta applied to stamina to survive tab stalls (seconds). */
export const DEFINING_WORLD_PLAZA_RUN_STAMINA_MAX_FRAME_DELTA_SECONDS = 0.05;

/** Runtime stamina state shared between the rAF loop and the HUD. */
export interface DefiningWorldPlazaRunStaminaState {
  /** Current stamina as a 0..1 ratio. */
  staminaRatio: number;
  /** True after stamina hit zero, until it recovers past the recover ratio. */
  isDepleted: boolean;
  /** Wall-clock ms when stamina last hit zero; null outside depletion lockout. */
  depletedAtMs: number | null;
}

/** Stamina starts full and ready. */
export const DEFINING_WORLD_PLAZA_RUN_STAMINA_INITIAL_STATE: DefiningWorldPlazaRunStaminaState =
  {
    staminaRatio: 1,
    isDepleted: false,
    depletedAtMs: null,
  };
