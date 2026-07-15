/**
 * Study-gated reveal flags for mushroom inspect UI.
 *
 * Thresholds match Herbarium mushroom study tiers so bag tooltips unlock with
 * the same Study progress as the (future) Guide dossier.
 *
 * @module components/world/inventory/domains/definingWorldPlazaInventoryMushroomDetailRevealConstants
 */

import type { PlazaCodexStudyTierId } from '@/components/home/domains/definingPlazaCodexStudyTier';
import { DEFINING_PLAZA_CODEX_INVENTORY_REVEAL_BY_TIER } from '@/components/world/inventory/domains/definingPlazaCodexInventoryRevealByTier';

/** Which mushroom inspect fields are visible at one knowledge tier. */
export type DefiningWorldPlazaInventoryMushroomDetailReveal = {
  /**
   * Flavor copy depth:
   * 0 hidden, 1 sensory summary, 2 field notes, 3 full studied body.
   */
  readonly descriptionTier: 0 | 1 | 2 | 3;
  readonly showStudyProgress: boolean;
  readonly showPropertiesSummary: boolean;
  /** Vague hunger / heal labels without exact numbers. */
  readonly showFoodEffectLabels: boolean;
  /** Exact hunger % and HP heal badges. */
  readonly showFoodHungerBadge: boolean;
  readonly showPreparationHint: boolean;
  readonly showDiseaseName: boolean;
  readonly showDiseaseChance: boolean;
  readonly showWellFedName: boolean;
  readonly showWellFedChance: boolean;
  readonly showResidualDisease: boolean;
  /** Poison flat damage and duration. */
  readonly showPoisonDamage: boolean;
  readonly showGenericItemMeta: boolean;
};

function resolvingMushroomDetailRevealFromBase(
  tierId: PlazaCodexStudyTierId
): DefiningWorldPlazaInventoryMushroomDetailReveal {
  const base = DEFINING_PLAZA_CODEX_INVENTORY_REVEAL_BY_TIER[tierId];

  return {
    descriptionTier: base.descriptionTier,
    showStudyProgress: base.showStudyProgress,
    showPropertiesSummary: base.showPropertiesSummary,
    showFoodEffectLabels: base.showEffectLabels,
    showFoodHungerBadge: base.showEffectNumbers,
    showPreparationHint: base.showPropertiesSummary,
    showDiseaseName: base.showEffectLabels,
    showDiseaseChance: base.showEffectChances,
    showWellFedName: base.showEffectLabels,
    showWellFedChance: base.showEffectChances,
    showResidualDisease: base.showEffectChances,
    showPoisonDamage: base.showEffectNumbers,
    showGenericItemMeta: base.showGenericItemMeta,
  };
}

/**
 * Progressive mushroom inspect unlocks keyed by unified Herbarium study tier.
 *
 * - awareness (0): rarity + stack; study tease
 * - familiarity (1): sensory summary
 * - understanding (5): field notes
 * - application (20): when-eaten properties + prep hint
 * - proficiency (50): vague food / risk / buff labels
 * - expertise (75): exact hunger %, HP heal, poison numbers
 * - mastery (100): disease / well-fed / residual chances
 */
export const DEFINING_WORLD_PLAZA_INVENTORY_MUSHROOM_DETAIL_REVEAL_BY_TIER: Readonly<
  Record<PlazaCodexStudyTierId, DefiningWorldPlazaInventoryMushroomDetailReveal>
> = {
  awareness: resolvingMushroomDetailRevealFromBase('awareness'),
  familiarity: resolvingMushroomDetailRevealFromBase('familiarity'),
  understanding: resolvingMushroomDetailRevealFromBase('understanding'),
  application: resolvingMushroomDetailRevealFromBase('application'),
  proficiency: resolvingMushroomDetailRevealFromBase('proficiency'),
  expertise: resolvingMushroomDetailRevealFromBase('expertise'),
  mastery: resolvingMushroomDetailRevealFromBase('mastery'),
};
