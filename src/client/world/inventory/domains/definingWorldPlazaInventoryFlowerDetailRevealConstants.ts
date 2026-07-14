/**
 * Study-gated reveal flags for flower herb item inspect UI.
 *
 * Thresholds match Herbarium study tiers so bag tooltips unlock with the same
 * Study progress as the Guide dossier.
 *
 * @module components/world/inventory/domains/definingWorldPlazaInventoryFlowerDetailRevealConstants
 */

import type { PlazaHerbariumFlowerStudyTierId } from '@/components/home/domains/definingPlazaHerbariumFlowerStudyTier';

/** Which flower inspect fields are visible at one knowledge tier. */
export type DefiningWorldPlazaInventoryFlowerDetailReveal = {
  /**
   * Flavor copy depth:
   * 0 hidden, 1 sighting summary, 2 studied notes, 3 studied + properties line.
   */
  readonly descriptionTier: 0 | 1 | 2 | 3;
  readonly showStudyProgress: boolean;
  readonly showPropertiesSummary: boolean;
  readonly showEatEffectLabels: boolean;
  readonly showEatEffectNumbers: boolean;
  readonly showRawProcChance: boolean;
  readonly showPetalSicknessName: boolean;
  readonly showPetalSicknessDetails: boolean;
  readonly showFlowerDiseaseNames: boolean;
  readonly showFlowerDiseaseChances: boolean;
  readonly showGenericItemMeta: boolean;
};

/**
 * Progressive flower inspect unlocks keyed by highest Herbarium study tier.
 *
 * - sighted (0): rarity + stack; study tease
 * - fieldNotes (1): sighting summary
 * - properties (5): studied notes + vague eat hint
 * - habitats (15): effect labels, Petal Sickness name, disease names
 * - full (100): proc %, effect numbers, Petal Sickness details, disease odds
 */
export const DEFINING_WORLD_PLAZA_INVENTORY_FLOWER_DETAIL_REVEAL_BY_TIER: Readonly<
  Record<
    PlazaHerbariumFlowerStudyTierId,
    DefiningWorldPlazaInventoryFlowerDetailReveal
  >
> = {
  sighted: {
    descriptionTier: 0,
    showStudyProgress: true,
    showPropertiesSummary: false,
    showEatEffectLabels: false,
    showEatEffectNumbers: false,
    showRawProcChance: false,
    showPetalSicknessName: false,
    showPetalSicknessDetails: false,
    showFlowerDiseaseNames: false,
    showFlowerDiseaseChances: false,
    showGenericItemMeta: true,
  },
  fieldNotes: {
    descriptionTier: 1,
    showStudyProgress: true,
    showPropertiesSummary: false,
    showEatEffectLabels: false,
    showEatEffectNumbers: false,
    showRawProcChance: false,
    showPetalSicknessName: false,
    showPetalSicknessDetails: false,
    showFlowerDiseaseNames: false,
    showFlowerDiseaseChances: false,
    showGenericItemMeta: true,
  },
  properties: {
    descriptionTier: 2,
    showStudyProgress: true,
    showPropertiesSummary: true,
    showEatEffectLabels: false,
    showEatEffectNumbers: false,
    showRawProcChance: false,
    showPetalSicknessName: false,
    showPetalSicknessDetails: false,
    showFlowerDiseaseNames: false,
    showFlowerDiseaseChances: false,
    showGenericItemMeta: true,
  },
  habitats: {
    descriptionTier: 3,
    showStudyProgress: true,
    showPropertiesSummary: true,
    showEatEffectLabels: true,
    showEatEffectNumbers: false,
    showRawProcChance: false,
    showPetalSicknessName: true,
    showPetalSicknessDetails: false,
    showFlowerDiseaseNames: true,
    showFlowerDiseaseChances: false,
    showGenericItemMeta: true,
  },
  full: {
    descriptionTier: 3,
    showStudyProgress: true,
    showPropertiesSummary: true,
    showEatEffectLabels: true,
    showEatEffectNumbers: true,
    showRawProcChance: true,
    showPetalSicknessName: true,
    showPetalSicknessDetails: true,
    showFlowerDiseaseNames: true,
    showFlowerDiseaseChances: true,
    showGenericItemMeta: true,
  },
};
