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
  readonly showDescription: boolean;
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
 * - studied (1): flavor description
 * - combat (10): hunger restore numbers
 * - procs (50): raw/cooked preparation hint (no disease names yet)
 * - ecology (100): disease and well-fed names without odds
 * - full (200): exact chances, residual risk, poison damage values
 */
export const DEFINING_WORLD_PLAZA_INVENTORY_WILDLIFE_MEAT_DETAIL_REVEAL_BY_TIER: Readonly<
  Record<PlazaBestiaryStudyTierId, DefiningWorldPlazaInventoryWildlifeMeatDetailReveal>
> = {
  sighted: {
    showDescription: false,
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
    showDescription: true,
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
    showDescription: true,
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
    showDescription: true,
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
    showDescription: true,
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
    showDescription: true,
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
