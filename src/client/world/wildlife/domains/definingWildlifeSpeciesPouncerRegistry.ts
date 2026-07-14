/**
 * Declarative pouncer attack-pattern and jump-scare special for sunhead.
 *
 * Pattern: run backwards facing prey, cast jump scare, then leap with
 * doubled jump range. The jump-scare landing hit forces a fatal EV tier.
 *
 * @module components/world/wildlife/domains/definingWildlifeSpeciesPouncerRegistry
 */

import type { DefiningWildlifeSpeciesId } from '@/components/world/wildlife/domains/definingWildlifeTypes';

/** Combat phases for the pouncer attack pattern. */
export type DefiningWildlifePouncerPhase =
  | 'retreat'
  | 'cast'
  | 'pounce'
  | 'idle';

export type DefiningWildlifeSpeciesPouncerConfig = {
  /** Distance to back away before casting or pouncing. */
  retreatDistanceGrid: number;
  /** Minimum distance to prey before starting a retreat leg. */
  retreatTriggerMinDistanceGrid: number;
  /** Maximum distance to prey before starting a retreat leg. */
  retreatTriggerMaxDistanceGrid: number;
  /** Milliseconds the taunt / jump-scare cast holds still. */
  jumpScareCastDurationMs: number;
  /** Cooldown between jump-scare specials. */
  jumpScareCooldownMs: number;
  /** Multiplier on maxJumpDistanceGrid while jump scare is armed. */
  jumpScareRangeMultiplier: number;
  /**
   * After landing a jump-scare pounce, the next melee within this window
   * applies fatal-tier damage.
   */
  jumpScareMeleeWindowMs: number;
};

const DEFINING_WILDLIFE_SPECIES_POUNCER_REGISTRY: Partial<
  Record<DefiningWildlifeSpeciesId, DefiningWildlifeSpeciesPouncerConfig>
> = {
  sunhead: {
    retreatDistanceGrid: 3.2,
    retreatTriggerMinDistanceGrid: 2.2,
    retreatTriggerMaxDistanceGrid: 7.5,
    jumpScareCastDurationMs: 900,
    jumpScareCooldownMs: 12_000,
    jumpScareRangeMultiplier: 2,
    jumpScareMeleeWindowMs: 1_400,
  },
};

/** Resolves pouncer config for one species, or null when not a pouncer. */
export function resolvingWildlifeSpeciesPouncerConfig(
  speciesId: DefiningWildlifeSpeciesId
): DefiningWildlifeSpeciesPouncerConfig | null {
  return DEFINING_WILDLIFE_SPECIES_POUNCER_REGISTRY[speciesId] ?? null;
}
