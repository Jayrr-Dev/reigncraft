/**
 * Study-gated reveal flags for wildlife meat item inspect UI.
 *
 * Thresholds match bestiary study tiers so meat tooltips unlock with the same
 * corpse Study progress as the Guide dossier.
 *
 * @module components/world/inventory/domains/definingWorldPlazaInventoryWildlifeMeatDetailRevealConstants
 */

import type { PlazaBestiaryStudyTierId } from '@/components/home/domains/definingPlazaBestiaryStudyTier';

/** Which meat inspect fields are visible at one knowledge tier. */
export type DefiningWorldPlazaInventoryWildlifeMeatDetailReveal = {
  /** Flavor copy depth: 0 hidden, 1 vague, 2 cautious, 3 full. */
  readonly descriptionTier: 0 | 1 | 2 | 3;
  readonly showHungerRestore: boolean;
  readonly showPreparationHint: boolean;
  readonly showDiseaseName: boolean;
  readonly showDiseaseChance: boolean;
  readonly showWellFedName: boolean;
  readonly showWellFedChance: boolean;
  readonly showResidualDisease: boolean;
  readonly showPoisonDamage: boolean;
  readonly showGenericItemMeta: boolean;
};

/**
 * Progressive meat inspect unlocks keyed by highest bestiary study tier.
 *
 * - sighted (0): title only
 * - studied (1): flavor tier 1 (vague sensory line)
 * - combat (10): flavor tier 2 (cautious risk hint) + hunger numbers
 * - procs (20): flavor tier 3 (full copy) + preparation hint
 * - ecology (50): disease and well-fed names without odds
 * - full (75): exact chances, residual risk, poison damage values
 * - playable (100): same meat inspect depth as full
 */
export const DEFINING_WORLD_PLAZA_INVENTORY_WILDLIFE_MEAT_DETAIL_REVEAL_BY_TIER: Readonly<
  Record<PlazaBestiaryStudyTierId, DefiningWorldPlazaInventoryWildlifeMeatDetailReveal>
> = {
  sighted: {
    descriptionTier: 0,
    showHungerRestore: false,
    showPreparationHint: false,
    showDiseaseName: false,
    showDiseaseChance: false,
    showWellFedName: false,
    showWellFedChance: false,
    showResidualDisease: false,
    showPoisonDamage: false,
    showGenericItemMeta: false,
  },
  studied: {
    descriptionTier: 1,
    showHungerRestore: false,
    showPreparationHint: false,
    showDiseaseName: false,
    showDiseaseChance: false,
    showWellFedName: false,
    showWellFedChance: false,
    showResidualDisease: false,
    showPoisonDamage: false,
    showGenericItemMeta: false,
  },
  combat: {
    descriptionTier: 2,
    showHungerRestore: true,
    showPreparationHint: false,
    showDiseaseName: false,
    showDiseaseChance: false,
    showWellFedName: false,
    showWellFedChance: false,
    showResidualDisease: false,
    showPoisonDamage: false,
    showGenericItemMeta: true,
  },
  procs: {
    descriptionTier: 3,
    showHungerRestore: true,
    showPreparationHint: true,
    showDiseaseName: false,
    showDiseaseChance: false,
    showWellFedName: false,
    showWellFedChance: false,
    showResidualDisease: false,
    showPoisonDamage: false,
    showGenericItemMeta: true,
  },
  ecology: {
    descriptionTier: 3,
    showHungerRestore: true,
    showPreparationHint: true,
    showDiseaseName: true,
    showDiseaseChance: false,
    showWellFedName: true,
    showWellFedChance: false,
    showResidualDisease: false,
    showPoisonDamage: false,
    showGenericItemMeta: true,
  },
  full: {
    descriptionTier: 3,
    showHungerRestore: true,
    showPreparationHint: true,
    showDiseaseName: true,
    showDiseaseChance: true,
    showWellFedName: true,
    showWellFedChance: true,
    showResidualDisease: true,
    showPoisonDamage: true,
    showGenericItemMeta: true,
  },
  playable: {
    descriptionTier: 3,
    showHungerRestore: true,
    showPreparationHint: true,
    showDiseaseName: true,
    showDiseaseChance: true,
    showWellFedName: true,
    showWellFedChance: true,
    showResidualDisease: true,
    showPoisonDamage: true,
    showGenericItemMeta: true,
  },
};
