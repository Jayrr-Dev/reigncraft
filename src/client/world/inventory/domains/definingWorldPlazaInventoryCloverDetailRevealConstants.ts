/**
 * Study-gated reveal flags for clover inspect UI.
 *
 * Combined clover study (three-leaf + four-leaf) gates four-leaf Lucky details.
 *
 * @module components/world/inventory/domains/definingWorldPlazaInventoryCloverDetailRevealConstants
 */

import type { PlazaCodexStudyTierId } from '@/components/home/domains/definingPlazaCodexStudyTier';
import { DEFINING_PLAZA_CODEX_INVENTORY_REVEAL_BY_TIER } from '@/components/world/inventory/domains/definingPlazaCodexInventoryRevealByTier';

/** Which clover inspect fields are visible at one knowledge tier. */
export type DefiningWorldPlazaInventoryCloverDetailReveal = {
  readonly descriptionTier: 0 | 1 | 2 | 3;
  readonly showStudyProgress: boolean;
  readonly showPropertiesSummary: boolean;
  readonly showLuckyEffectLabels: boolean;
  readonly showLuckyEffectNumbers: boolean;
  readonly showGenericItemMeta: boolean;
};

function resolvingCloverDetailRevealFromBase(
  tierId: PlazaCodexStudyTierId
): DefiningWorldPlazaInventoryCloverDetailReveal {
  const base = DEFINING_PLAZA_CODEX_INVENTORY_REVEAL_BY_TIER[tierId];

  return {
    descriptionTier: base.descriptionTier,
    showStudyProgress: base.showStudyProgress,
    showPropertiesSummary: base.showPropertiesSummary,
    showLuckyEffectLabels: base.showEffectLabels,
    showLuckyEffectNumbers: base.showEffectNumbers || base.showEffectChances,
    showGenericItemMeta: base.showGenericItemMeta,
  };
}

/**
 * Progressive clover inspect unlocks keyed by unified Herbarium study tier.
 *
 * Lucky effect numbers unlock at expertise; mastery keeps full depth.
 */
export const DEFINING_WORLD_PLAZA_INVENTORY_CLOVER_DETAIL_REVEAL_BY_TIER: Readonly<
  Record<PlazaCodexStudyTierId, DefiningWorldPlazaInventoryCloverDetailReveal>
> = {
  awareness: resolvingCloverDetailRevealFromBase('awareness'),
  familiarity: resolvingCloverDetailRevealFromBase('familiarity'),
  understanding: resolvingCloverDetailRevealFromBase('understanding'),
  application: resolvingCloverDetailRevealFromBase('application'),
  proficiency: resolvingCloverDetailRevealFromBase('proficiency'),
  expertise: resolvingCloverDetailRevealFromBase('expertise'),
  mastery: resolvingCloverDetailRevealFromBase('mastery'),
};
