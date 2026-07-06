/**
 * Per-spawn aggression tiers and bell-curve spawn distribution.
 *
 * @module components/world/wildlife/domains/definingWildlifeAggressionLevelConstants
 */

import type { DefiningWildlifeAggressionLevel } from '@/components/world/wildlife/domains/definingWildlifeTypes';

/** Salt for the first Box-Muller uniform when rolling aggression level. */
export const DEFINING_WILDLIFE_AGGRESSION_LEVEL_BELL_CURVE_SEED_SALT_U1 = 103;

/** Salt for the second Box-Muller uniform when rolling aggression level. */
export const DEFINING_WILDLIFE_AGGRESSION_LEVEL_BELL_CURVE_SEED_SALT_U2 = 107;

/**
 * Standard-normal sample below this maps to tame (~9% at zero species shift).
 * Above {@link DEFINING_WILDLIFE_AGGRESSION_LEVEL_AGGRESSIVE_THRESHOLD} maps to aggressive.
 */
export const DEFINING_WILDLIFE_AGGRESSION_LEVEL_TAME_THRESHOLD = -1.35;

/** Standard-normal sample above this maps to aggressive (~9% at zero species shift). */
export const DEFINING_WILDLIFE_AGGRESSION_LEVEL_AGGRESSIVE_THRESHOLD = 1.35;

export type DefiningWildlifeAggressionLevelProfile = {
  aggressionLevel: DefiningWildlifeAggressionLevel;
  /** Scales how far away a skittish animal starts fleeing from the player. */
  fleeRadiusMultiplier: number;
  /**
   * How proximity threat toward the player is built:
   * - none: only damage-based threat
   * - starving: legacy starving-only buildup
   * - onSight: threat while the player is inside aggro radius
   */
  proximityThreatMode: 'none' | 'starving' | 'onSight';
  /** Multiplier on proximity threat per second. */
  proximityThreatMultiplier: number;
  /** Whether ambushers and predators may strike on sight without hunger. */
  mayAttackPlayerOnSight: boolean;
};

export const DEFINING_WILDLIFE_AGGRESSION_LEVEL_PROFILES: Record<
  DefiningWildlifeAggressionLevel,
  DefiningWildlifeAggressionLevelProfile
> = {
  tame: {
    aggressionLevel: 'tame',
    fleeRadiusMultiplier: 1.45,
    proximityThreatMode: 'none',
    proximityThreatMultiplier: 0,
    mayAttackPlayerOnSight: false,
  },
  normal: {
    aggressionLevel: 'normal',
    fleeRadiusMultiplier: 1,
    proximityThreatMode: 'starving',
    proximityThreatMultiplier: 1,
    mayAttackPlayerOnSight: false,
  },
  aggressive: {
    aggressionLevel: 'aggressive',
    fleeRadiusMultiplier: 0.4,
    proximityThreatMode: 'onSight',
    proximityThreatMultiplier: 2.2,
    mayAttackPlayerOnSight: true,
  },
};
