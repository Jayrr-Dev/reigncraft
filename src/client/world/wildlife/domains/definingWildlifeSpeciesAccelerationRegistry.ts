/**
 * Per-species run acceleration: short-term burst ramp and long-term momentum.
 *
 * Species absent from the registry keep instant top speed (legacy behavior).
 *
 * @module components/world/wildlife/domains/definingWildlifeSpeciesAccelerationRegistry
 */

import type { DefiningWildlifeSpeciesId } from '@/components/world/wildlife/domains/definingWildlifeTypes';

export type DefiningWildlifeSpeciesAccelerationConfig = {
  /** Seconds from walk speed to base run speed (short-term ramp). */
  burstRampSeconds: number;
  /** Extra top-speed multiplier earned by sustained running (long-term). */
  momentumBonusMultiplier: number;
  /** Continuous running seconds to reach full momentum bonus. */
  momentumRampSeconds: number;
};

/**
 * Instant top speed, no momentum. Used when a species has no acceleration row.
 */
export const DEFINING_WILDLIFE_DEFAULT_ACCELERATION_CONFIG: DefiningWildlifeSpeciesAccelerationConfig =
  {
    burstRampSeconds: 0,
    momentumBonusMultiplier: 0,
    momentumRampSeconds: 0,
  };

/**
 * Fleet prey acceleration identities. Other wildlife omit entries and stay
 * at instant run speed.
 */
const DEFINING_WILDLIFE_SPECIES_ACCELERATION: Partial<
  Record<DefiningWildlifeSpeciesId, DefiningWildlifeSpeciesAccelerationConfig>
> = {
  // Startle sprinter — near-instant burst, no long-term gear.
  deer: {
    burstRampSeconds: 0.4,
    momentumBonusMultiplier: 0,
    momentumRampSeconds: 0,
  },
  // Heavy deer — slower launch, small sustained bonus, biggest leaps.
  stag: {
    burstRampSeconds: 0.8,
    momentumBonusMultiplier: 0.05,
    momentumRampSeconds: 5,
  },
  // Pronghorn theme — quick launch, strong momentum peak.
  antilope: {
    burstRampSeconds: 0.6,
    momentumBonusMultiplier: 0.15,
    momentumRampSeconds: 4,
  },
  // Desert diesel — slow launch, long momentum climb.
  oryx: {
    burstRampSeconds: 1.2,
    momentumBonusMultiplier: 0.08,
    momentumRampSeconds: 8,
  },
  // Gallop machine — slow starter (ambush window), strong mid-chase gear.
  zebra: {
    burstRampSeconds: 1.5,
    momentumBonusMultiplier: 0.12,
    momentumRampSeconds: 6,
  },
  // Fastest biped — medium launch, quick to full stride.
  ostrich: {
    burstRampSeconds: 1,
    momentumBonusMultiplier: 0.1,
    momentumRampSeconds: 3,
  },
  // Floating companion — slow graceful wind-up, gentle sustained glide.
  fairy: {
    burstRampSeconds: 1.4,
    momentumBonusMultiplier: 0.08,
    momentumRampSeconds: 3,
  },
  // Grizzly — heavy wind-up, then outruns most prey once rolling.
  grizzly: {
    burstRampSeconds: 2.2,
    momentumBonusMultiplier: 0.2,
    momentumRampSeconds: 7,
  },
};

export function resolvingWildlifeSpeciesAccelerationConfig(
  speciesId: DefiningWildlifeSpeciesId
): DefiningWildlifeSpeciesAccelerationConfig {
  return (
    DEFINING_WILDLIFE_SPECIES_ACCELERATION[speciesId] ??
    DEFINING_WILDLIFE_DEFAULT_ACCELERATION_CONFIG
  );
}
