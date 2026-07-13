/**
 * Hold-to-run stamina tuning for the plaza avatar.
 *
 * Stamina is tracked as a 0..1 ratio so the HUD bar maps directly to width.
 * Fatigue tiers (winded through spent) gate recovery after full depletions;
 * ladder matches wildlife: 66% → 33% → full 100% heal.
 * see {@link definingWorldPlazaPlayerStaminaFatigueConstants}.
 *
 * @module components/world/domains/definingWorldPlazaRunStaminaConstants
 */

import {
  DEFINING_WORLD_PLAZA_PLAYER_STAMINA_FATIGUE_INITIAL_TIER,
  type DefiningWorldPlazaPlayerStaminaFatigueTier,
} from '@/components/world/domains/definingWorldPlazaPlayerStaminaFatigueConstants';

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

/** How long stamina stays at zero before regeneration begins (ms). */
export const DEFINING_WORLD_PLAZA_RUN_STAMINA_DEPLETION_REGEN_DELAY_MS = 2000;

/**
 * Pause before stamina regenerates after jump, roll, or other action spends (ms).
 * Tune this single value to change post-action recovery wind-up.
 */
export const DEFINING_WORLD_PLAZA_RUN_STAMINA_ACTION_SPEND_REGEN_DELAY_MS = 600;

/** Stamina consumed by a standing/walk jump (ratio units). */
export const DEFINING_WORLD_PLAZA_JUMP_STAMINA_COST_RATIO = 0.0625;

/** Stamina consumed by a run jump (ratio units). */
export const DEFINING_WORLD_PLAZA_RUN_JUMP_STAMINA_COST_RATIO = 0.0875;

/** Roll dodge stamina cost as a multiple of a standing/walk jump. */
export const DEFINING_WORLD_PLAZA_ROLL_STAMINA_JUMP_COST_MULTIPLIER = 1.5;

/** Stamina consumed by a roll dodge (ratio units). */
export const DEFINING_WORLD_PLAZA_ROLL_STAMINA_COST_RATIO =
  DEFINING_WORLD_PLAZA_JUMP_STAMINA_COST_RATIO *
  DEFINING_WORLD_PLAZA_ROLL_STAMINA_JUMP_COST_MULTIPLIER;

/** Ratio under which the HUD bar switches to a low-stamina warning color. */
export const DEFINING_WORLD_PLAZA_RUN_STAMINA_LOW_RATIO = 0.3;

/** How long the pointer must be held before a walk upgrades to a run (ms). */
export const DEFINING_WORLD_PLAZA_RUN_STAMINA_HOLD_TO_RUN_MS = 150;

/**
 * Fraction of the walk→run speed gap reached in the fast burst phase.
 * Remaining `(1 - ratio)` of the gap uses the slow top-end phase.
 */
export const DEFINING_WORLD_PLAZA_RUN_STAMINA_BURST_FAST_RATIO = 0.75;

/**
 * Seconds to lerp walk speed up to {@link DEFINING_WORLD_PLAZA_RUN_STAMINA_BURST_FAST_RATIO}
 * of the walk→run gap after a sprint starts.
 */
export const DEFINING_WORLD_PLAZA_RUN_STAMINA_BURST_FAST_SECONDS = 1;

/**
 * Seconds to lerp from the fast-phase speed up to full run speed
 * (the last `(1 - fastRatio)` of the walk→run gap).
 */
export const DEFINING_WORLD_PLAZA_RUN_STAMINA_BURST_TOP_SECONDS = 3;

/**
 * Total seconds of continuous sprint to reach full run speed
 * (fast phase + top-end phase).
 */
export const DEFINING_WORLD_PLAZA_RUN_STAMINA_BURST_RAMP_SECONDS =
  DEFINING_WORLD_PLAZA_RUN_STAMINA_BURST_FAST_SECONDS +
  DEFINING_WORLD_PLAZA_RUN_STAMINA_BURST_TOP_SECONDS;

/**
 * Stamina ratio at and below which sprint speed starts lerping toward walk.
 * At this ratio: full burst speed. At 0: walk speed.
 */
export const DEFINING_WORLD_PLAZA_RUN_STAMINA_EXHAUSTION_FADE_START_RATIO = 0.2;

/** Minimum interval between HUD stamina state pushes (ms). */
export const DEFINING_WORLD_PLAZA_RUN_STAMINA_HUD_PUSH_INTERVAL_MS = 80;

/** Largest frame delta applied to stamina to survive tab stalls (seconds). */
export const DEFINING_WORLD_PLAZA_RUN_STAMINA_MAX_FRAME_DELTA_SECONDS = 0.05;

/** Runtime stamina state shared between the rAF loop and the HUD. */
export interface DefiningWorldPlazaRunStaminaState {
  /** Current stamina as a 0..1 ratio. */
  staminaRatio: number;
  /** Fatigue tier after repeated full depletions; resets on a full bar. */
  fatigueTier: DefiningWorldPlazaPlayerStaminaFatigueTier;
  /** True after stamina hit zero, until it recovers past the tier threshold. */
  isDepleted: boolean;
  /** Wall-clock ms when stamina last hit zero; null outside depletion lockout. */
  depletedAtMs: number | null;
  /** Regeneration stays paused until this timestamp after action spends. */
  regenPausedUntilMs: number | null;
  /** Continuous seconds spent sprinting; resets when not running. Feeds burst ramp. */
  runningForSeconds: number;
}

/** Stamina starts full and ready. */
export const DEFINING_WORLD_PLAZA_RUN_STAMINA_INITIAL_STATE: DefiningWorldPlazaRunStaminaState =
  {
    staminaRatio: 1,
    fatigueTier: DEFINING_WORLD_PLAZA_PLAYER_STAMINA_FATIGUE_INITIAL_TIER,
    isDepleted: false,
    depletedAtMs: null,
    regenPausedUntilMs: null,
    runningForSeconds: 0,
  };
