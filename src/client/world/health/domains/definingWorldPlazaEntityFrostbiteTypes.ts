/**
 * Frostbite stack state shapes.
 *
 * @module components/world/health/domains/definingWorldPlazaEntityFrostbiteTypes
 */

import type { DefiningWorldPlazaEntityFrostbiteStageId } from '@/components/world/health/domains/definingWorldPlazaEntityFrostbiteStageRegistry';

/** Live frostbite meter on entity health. */
export type DefiningWorldPlazaEntityFrostbiteState = {
  /** Accumulated frost damage ticks (0..max). */
  stackCount: number;
  /** Stage resolved from {@link stackCount}, or null below Chilled. */
  activeStageId: DefiningWorldPlazaEntityFrostbiteStageId | null;
  /** Simulation clock of last stack gain. */
  lastGainAtMs: number | null;
  /** Simulation clock of last warm decay step. */
  lastDecayAtMs: number | null;
  /**
   * Highest hypothermia sleep-spell stack threshold already fired
   * (500, 600, 700, …). Null until first spell.
   */
  lastSleepSpellAtStacks: number | null;
};
