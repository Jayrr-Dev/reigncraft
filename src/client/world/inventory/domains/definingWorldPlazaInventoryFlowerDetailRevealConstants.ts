/**
 * Study-gated reveal flags for flower herb item inspect UI.
 *
 * Thresholds match Herbarium flower study tiers so bag tooltips unlock with the
 * same Study progress as the Guide dossier.
 *
 * @module components/world/inventory/domains/definingWorldPlazaInventoryFlowerDetailRevealConstants
 */

import type { PlazaCodexStudyTierId } from '@/components/home/domains/definingPlazaCodexStudyTier';
import { DEFINING_PLAZA_CODEX_INVENTORY_REVEAL_BY_TIER } from '@/components/world/inventory/domains/definingPlazaCodexInventoryRevealByTier';

/** Which flower inspect fields are visible at one knowledge tier. */
export type DefiningWorldPlazaInventoryFlowerDetailReveal = {
  /**
   * Flavor copy depth:
   * 0 hidden, 1 sensory summary, 2 field notes, 3 studied + properties depth.
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

function resolvingFlowerDetailRevealFromBase(
  tierId: PlazaCodexStudyTierId
): DefiningWorldPlazaInventoryFlowerDetailReveal {
  const base = DEFINING_PLAZA_CODEX_INVENTORY_REVEAL_BY_TIER[tierId];

  return {
    descriptionTier: base.descriptionTier,
    showStudyProgress: base.showStudyProgress,
    showPropertiesSummary: base.showPropertiesSummary,
    showEatEffectLabels: base.showEffectLabels,
    showEatEffectNumbers: base.showEffectNumbers,
    showRawProcChance: base.showEffectChances,
    showPetalSicknessName: base.showEffectLabels,
    showPetalSicknessDetails: base.showEffectChances,
    showFlowerDiseaseNames: base.showEffectLabels,
    showFlowerDiseaseChances: base.showEffectChances,
    showGenericItemMeta: base.showGenericItemMeta,
  };
}

/**
 * Progressive flower inspect unlocks keyed by unified Herbarium study tier.
 *
 * - awareness (0): rarity + stack; study tease
 * - familiarity (1): sensory summary
 * - understanding (5): field notes
 * - application (20): vague eat hint
 * - proficiency (50): effect labels, Petal Sickness name, disease names
 * - expertise (75): effect numbers
 * - mastery (100): proc %, Petal Sickness details, disease odds
 */
export const DEFINING_WORLD_PLAZA_INVENTORY_FLOWER_DETAIL_REVEAL_BY_TIER: Readonly<
  Record<PlazaCodexStudyTierId, DefiningWorldPlazaInventoryFlowerDetailReveal>
> = {
  awareness: resolvingFlowerDetailRevealFromBase('awareness'),
  familiarity: resolvingFlowerDetailRevealFromBase('familiarity'),
  understanding: resolvingFlowerDetailRevealFromBase('understanding'),
  application: resolvingFlowerDetailRevealFromBase('application'),
  proficiency: resolvingFlowerDetailRevealFromBase('proficiency'),
  expertise: resolvingFlowerDetailRevealFromBase('expertise'),
  mastery: resolvingFlowerDetailRevealFromBase('mastery'),
};
