/**
 * Study-gated reveal flags for berry and tea leaves inspect UI.
 *
 * Thresholds match Herbarium berry study tiers so bag tooltips unlock with the
 * same Study progress as the Guide dossier.
 *
 * @module components/world/inventory/domains/definingWorldPlazaInventoryBerryDetailRevealConstants
 */

import type { PlazaCodexStudyTierId } from '@/components/home/domains/definingPlazaCodexStudyTier';
import { DEFINING_PLAZA_CODEX_INVENTORY_REVEAL_BY_TIER } from '@/components/world/inventory/domains/definingPlazaCodexInventoryRevealByTier';

/** Which berry/tea inspect fields are visible at one knowledge tier. */
export type DefiningWorldPlazaInventoryBerryDetailReveal = {
  /**
   * Flavor copy depth:
   * 0 hidden, 1 sensory summary, 2 field notes.
   */
  readonly descriptionTier: 0 | 1 | 2;
  readonly showStudyProgress: boolean;
  readonly showPropertiesSummary: boolean;
  /** Hunger / heal badges from the generic food path. */
  readonly showFoodHungerBadge: boolean;
  /** Buff name without chance percent. */
  readonly showWellFedName: boolean;
  /** Append well-fed chance percent when known. */
  readonly showWellFedChance: boolean;
  readonly showGenericItemMeta: boolean;
};

function resolvingBerryDetailRevealFromBase(
  tierId: PlazaCodexStudyTierId
): DefiningWorldPlazaInventoryBerryDetailReveal {
  const base = DEFINING_PLAZA_CODEX_INVENTORY_REVEAL_BY_TIER[tierId];
  const descriptionTier: 0 | 1 | 2 =
    base.descriptionTier <= 0 ? 0 : base.descriptionTier === 1 ? 1 : 2;

  return {
    descriptionTier,
    showStudyProgress: base.showStudyProgress,
    showPropertiesSummary: base.showPropertiesSummary,
    showFoodHungerBadge: base.showEffectLabels,
    showWellFedName: base.showEffectLabels,
    showWellFedChance: base.showEffectChances,
    showGenericItemMeta: base.showGenericItemMeta,
  };
}

/**
 * Progressive berry inspect unlocks keyed by unified Herbarium study tier.
 *
 * - awareness (0): rarity + stack; study tease
 * - familiarity (1): sensory summary
 * - understanding (5): field notes
 * - application (20): gathered/eaten properties line
 * - proficiency (50): hunger/heal badges + buzz name
 * - expertise (75): same as proficiency (numbers locked)
 * - mastery (100): buzz chance percent
 */
export const DEFINING_WORLD_PLAZA_INVENTORY_BERRY_DETAIL_REVEAL_BY_TIER: Readonly<
  Record<PlazaCodexStudyTierId, DefiningWorldPlazaInventoryBerryDetailReveal>
> = {
  awareness: resolvingBerryDetailRevealFromBase('awareness'),
  familiarity: resolvingBerryDetailRevealFromBase('familiarity'),
  understanding: resolvingBerryDetailRevealFromBase('understanding'),
  application: resolvingBerryDetailRevealFromBase('application'),
  proficiency: resolvingBerryDetailRevealFromBase('proficiency'),
  expertise: resolvingBerryDetailRevealFromBase('expertise'),
  mastery: resolvingBerryDetailRevealFromBase('mastery'),
};
