/**
 * Study-gated reveal flags for ore item inspect UI.
 *
 * Thresholds match Lapidary study tiers so bag tooltips unlock with the same
 * Study progress as the Guide dossier.
 *
 * @module components/world/inventory/domains/definingWorldPlazaInventoryOreDetailRevealConstants
 */

import type { PlazaCodexStudyTierId } from '@/components/home/domains/definingPlazaCodexStudyTier';
import { DEFINING_PLAZA_CODEX_INVENTORY_REVEAL_BY_TIER } from '@/components/world/inventory/domains/definingPlazaCodexInventoryRevealByTier';

/** Which ore inspect fields are visible at one knowledge tier. */
export type DefiningWorldPlazaInventoryOreDetailReveal = {
  /**
   * Flavor copy depth:
   * 0 hidden, 1 sensory summary, 2 field notes, 3 studied + properties line.
   */
  readonly descriptionTier: 0 | 1 | 2 | 3;
  readonly showStudyProgress: boolean;
  readonly showPropertiesSummary: boolean;
  readonly showHabitatLabel: boolean;
  readonly showVeinStatLabels: boolean;
  readonly showVeinStatNumbers: boolean;
  readonly showGenericItemMeta: boolean;
};

function resolvingOreDetailRevealFromBase(
  tierId: PlazaCodexStudyTierId
): DefiningWorldPlazaInventoryOreDetailReveal {
  const base = DEFINING_PLAZA_CODEX_INVENTORY_REVEAL_BY_TIER[tierId];

  return {
    descriptionTier: base.descriptionTier,
    showStudyProgress: base.showStudyProgress,
    showPropertiesSummary: base.showPropertiesSummary,
    showHabitatLabel: base.showEffectLabels,
    showVeinStatLabels: base.showEffectLabels,
    showVeinStatNumbers: base.showEffectNumbers || base.showEffectChances,
    showGenericItemMeta: base.showGenericItemMeta,
  };
}

/**
 * Progressive ore inspect unlocks keyed by unified Lapidary study tier.
 *
 * - awareness (0): rarity + stack; study tease
 * - familiarity (1): sensory summary
 * - understanding (5): field notes
 * - application (20): work/use hint
 * - proficiency (50): habitat line, vein labels without numbers
 * - expertise (75): vein dossier numbers
 * - mastery (100): full vein dossier
 */
export const DEFINING_WORLD_PLAZA_INVENTORY_ORE_DETAIL_REVEAL_BY_TIER: Readonly<
  Record<PlazaCodexStudyTierId, DefiningWorldPlazaInventoryOreDetailReveal>
> = {
  awareness: resolvingOreDetailRevealFromBase('awareness'),
  familiarity: resolvingOreDetailRevealFromBase('familiarity'),
  understanding: resolvingOreDetailRevealFromBase('understanding'),
  application: resolvingOreDetailRevealFromBase('application'),
  proficiency: resolvingOreDetailRevealFromBase('proficiency'),
  expertise: resolvingOreDetailRevealFromBase('expertise'),
  mastery: resolvingOreDetailRevealFromBase('mastery'),
};
