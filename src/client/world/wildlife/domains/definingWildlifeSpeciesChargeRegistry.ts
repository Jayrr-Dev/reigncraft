/**
 * Per-species charge tuning for burst melee rush attacks.
 *
 * @module components/world/wildlife/domains/definingWildlifeSpeciesChargeRegistry
 */

import { DEFINING_WILDLIFE_STAMINA_EXHAUSTED_EXIT_RATIO } from '@/components/world/wildlife/domains/advancingWildlifeStaminaTick';
import { resolvingWildlifeSpeciesStaminaExhaustedRecoveryRatio } from '@/components/world/wildlife/domains/definingWildlifeSpeciesRegistry';
import type { DefiningWildlifeSpeciesId } from '@/components/world/wildlife/domains/definingWildlifeTypes';

/** Optional first-charge intimidation abort (rhino bluff charge). */
export type DefiningWildlifeSpeciesBluffChargeConfig = {
  /** When true, the first player charge may abort as a bluff. */
  enabled: boolean;
  /**
   * Abort the bluff and return home once stamina falls to this ratio,
   * but only after the player has run past the territory line.
   */
  staminaAbortThreshold: number;
  /**
   * When true, bluff abort requires the player to leave the home patch
   * (`anchorRadiusGrid` around spawn) during the charge.
   */
  requiresPlayerExitedTerritory: boolean;
};

export type DefiningWildlifeSpeciesChargeConfig = {
  /** Milliseconds the animal holds still before sprinting at the player. */
  windupMs: number;
  /** Stamina ratio required to begin a charge wind-up. */
  fullStaminaThreshold: number;
  /** Charge bonus ends once stamina falls below this ratio. */
  chargeStaminaExitThreshold: number;
  /**
   * Stamina ratio required to leave the exhausted state after a charge sprint.
   * Boars must fully recover before they can rush again.
   */
  exhaustedRecoveryRatio: number;
  /** Multiplier applied to melee damage while sprinting or mid-charge. */
  runDamageMultiplier: number;
  /** Optional first-charge bluff (intimidate then wheel home). */
  bluff?: DefiningWildlifeSpeciesBluffChargeConfig;
};

const DEFINING_WILDLIFE_RHINO_BLUFF_CHARGE: DefiningWildlifeSpeciesBluffChargeConfig =
  {
    enabled: true,
    staminaAbortThreshold: 0.5,
    requiresPlayerExitedTerritory: true,
  };

const DEFINING_WILDLIFE_SPECIES_CHARGE_REGISTRY: Partial<
  Record<DefiningWildlifeSpeciesId, DefiningWildlifeSpeciesChargeConfig>
> = {
  boar: {
    windupMs: 1000,
    fullStaminaThreshold: 0.98,
    chargeStaminaExitThreshold: 0.35,
    exhaustedRecoveryRatio: 0.98,
    runDamageMultiplier: 1.85,
  },
  rhino: {
    windupMs: 1400,
    fullStaminaThreshold: 0.95,
    chargeStaminaExitThreshold: 0.4,
    exhaustedRecoveryRatio: 0.95,
    runDamageMultiplier: 2.1,
    bluff: DEFINING_WILDLIFE_RHINO_BLUFF_CHARGE,
  },
  'rhino-female': {
    windupMs: 1400,
    fullStaminaThreshold: 0.95,
    chargeStaminaExitThreshold: 0.4,
    exhaustedRecoveryRatio: 0.95,
    runDamageMultiplier: 2,
    bluff: DEFINING_WILDLIFE_RHINO_BLUFF_CHARGE,
  },
  bull: {
    windupMs: 1100,
    fullStaminaThreshold: 0.96,
    chargeStaminaExitThreshold: 0.35,
    exhaustedRecoveryRatio: 0.96,
    runDamageMultiplier: 1.9,
  },
  ram: {
    windupMs: 900,
    fullStaminaThreshold: 0.96,
    chargeStaminaExitThreshold: 0.4,
    exhaustedRecoveryRatio: 0.9,
    runDamageMultiplier: 1.75,
  },
};

export function resolvingWildlifeSpeciesExhaustedExitRatio(
  speciesId: DefiningWildlifeSpeciesId
): number {
  const chargeConfig = DEFINING_WILDLIFE_SPECIES_CHARGE_REGISTRY[speciesId];

  return (
    chargeConfig?.exhaustedRecoveryRatio ??
    resolvingWildlifeSpeciesStaminaExhaustedRecoveryRatio(speciesId) ??
    DEFINING_WILDLIFE_STAMINA_EXHAUSTED_EXIT_RATIO
  );
}

export function resolvingWildlifeSpeciesChargeConfig(
  speciesId: DefiningWildlifeSpeciesId
): DefiningWildlifeSpeciesChargeConfig | null {
  return DEFINING_WILDLIFE_SPECIES_CHARGE_REGISTRY[speciesId] ?? null;
}

export function resolvingWildlifeSpeciesBluffChargeConfig(
  speciesId: DefiningWildlifeSpeciesId
): DefiningWildlifeSpeciesBluffChargeConfig | null {
  const chargeConfig = resolvingWildlifeSpeciesChargeConfig(speciesId);
  const bluff = chargeConfig?.bluff;

  if (!bluff?.enabled) {
    return null;
  }

  return bluff;
}
