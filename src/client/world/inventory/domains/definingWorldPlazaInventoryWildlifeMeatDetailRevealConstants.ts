/**
 * Study-gated reveal flags for wildlife meat item inspect UI.
 *
 * Thresholds match bestiary study tiers so meat tooltips unlock with the same
 * corpse Study progress as the Guide dossier.
 *
 * @module components/world/inventory/domains/definingWorldPlazaInventoryWildlifeMeatDetailRevealConstants
 */

import type { PlazaCodexStudyTierId } from '@/components/home/domains/definingPlazaCodexStudyTier';

/** Which meat inspect fields are visible at one knowledge tier. */
export type DefiningWorldPlazaInventoryWildlifeMeatDetailReveal = {
  /** Flavor copy depth: 0 hidden, 1 sensory, 2 cautious, 3 full. */
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
 * Progressive meat inspect unlocks keyed by unified Bestiary study tier.
 *
 * - awareness (0): title only
 * - familiarity (1): sensory flavor
 * - understanding (5): cautious risk hint
 * - application (20): full flavor + hunger / heal + prep hint
 * - proficiency (50): disease and well-fed names
 * - expertise (75): poison damage values
 * - mastery (100): exact chances, residual risk
 */
export const DEFINING_WORLD_PLAZA_INVENTORY_WILDLIFE_MEAT_DETAIL_REVEAL_BY_TIER: Readonly<
  Record<
    PlazaCodexStudyTierId,
    DefiningWorldPlazaInventoryWildlifeMeatDetailReveal
  >
> = {
  awareness: {
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
  familiarity: {
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
  understanding: {
    descriptionTier: 2,
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
  application: {
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
  proficiency: {
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
  expertise: {
    descriptionTier: 3,
    showHungerRestore: true,
    showPreparationHint: true,
    showDiseaseName: true,
    showDiseaseChance: false,
    showWellFedName: true,
    showWellFedChance: false,
    showResidualDisease: false,
    showPoisonDamage: true,
    showGenericItemMeta: true,
  },
  mastery: {
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
