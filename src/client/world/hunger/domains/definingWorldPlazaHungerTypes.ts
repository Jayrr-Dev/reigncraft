/**
 * Runtime hunger state shared between the rAF loop and the HUD.
 *
 * @module components/world/hunger/domains/definingWorldPlazaHungerTypes
 */

import { DEFINING_WORLD_PLAZA_HUNGER_INITIAL_RATIO } from '@/components/world/hunger/domains/definingWorldPlazaHungerConstants';

/** Runtime hunger state. */
export type DefiningWorldPlazaHungerState = {
  /** Current hunger as a 0..1 ratio (1 = full, 0 = starving). */
  hungerRatio: number;
  /**
   * Accrued continuous drain not yet large enough for a discrete step.
   * Keeps full-bar idle time the same while ratio only moves in step jumps.
   */
  pendingDrainRatio: number;
  /** Wall-clock ms of the last starvation damage tick; null when not starving. */
  lastStarvationTickAtMs: number | null;
};

/** Hunger starts full and unstarved. */
export const DEFINING_WORLD_PLAZA_HUNGER_INITIAL_STATE: DefiningWorldPlazaHungerState =
  {
    hungerRatio: DEFINING_WORLD_PLAZA_HUNGER_INITIAL_RATIO,
    pendingDrainRatio: 0,
    lastStarvationTickAtMs: null,
  };
