import { computingPlazaMechanicsCombatEvDamageRollPreview } from '@/components/home/domains/computingPlazaMechanicsCombatEvDamageRollPreview';
import { formattingPlazaMechanicsCombatTierThresholdLabel } from '@/components/home/domains/formattingPlazaMechanicsCombatTierThresholdLabel';
import {
  DEFINING_WORLD_PLAZA_DAMAGE_OUTCOME_TIER_REGISTRY,
  listingWorldPlazaDamageOutcomeTierDevRollOrder,
} from '@/components/world/health/domains/definingWorldPlazaDamageOutcomeTierRegistry';
import type { DefiningWorldPlazaDamageOutcomeTier } from '@/components/world/health/domains/definingWorldPlazaEntityHealthTypes';

export type DefiningPlazaMechanicsCombatTierGuideEntry = {
  tier: DefiningWorldPlazaDamageOutcomeTier;
  label: string;
  thresholdLabel: string;
  exampleAmount: number;
};

/** Base classes for combat tier guide badges (dark bg, light text). */
export const STYLING_PLAZA_MECHANICS_COMBAT_TIER_BADGE_BASE_CLASS_NAME =
  'cursor-pointer rounded-sm border border-parchment/20 bg-ink px-2 py-1 text-parchment transition hover:border-parchment/35 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-poster-teal/40' as const;

/** Extra classes when a combat tier badge is selected. */
export const STYLING_PLAZA_MECHANICS_COMBAT_TIER_BADGE_SELECTED_CLASS_NAME =
  'border-poster-gold/55 ring-1 ring-poster-gold/35' as const;

function buildingPlazaMechanicsCombatTierGuideEntry(
  tier: DefiningWorldPlazaDamageOutcomeTier
): DefiningPlazaMechanicsCombatTierGuideEntry {
  const descriptor = DEFINING_WORLD_PLAZA_DAMAGE_OUTCOME_TIER_REGISTRY[tier];
  const rollPreview = computingPlazaMechanicsCombatEvDamageRollPreview({
    forcedTier: tier,
  });

  return {
    tier,
    label: descriptor.label,
    thresholdLabel:
      formattingPlazaMechanicsCombatTierThresholdLabel(descriptor),
    exampleAmount: rollPreview.rolledDamage,
  };
}

/** Ordered combat outcome tiers for the mechanics guide (low rolls → high rolls). */
export const DEFINING_PLAZA_MECHANICS_COMBAT_TIER_GUIDE_ENTRIES: readonly DefiningPlazaMechanicsCombatTierGuideEntry[] =
  listingWorldPlazaDamageOutcomeTierDevRollOrder()
    .filter((tier) => tier !== 'true_strike')
    .map((tier) => buildingPlazaMechanicsCombatTierGuideEntry(tier));

export const DEFINING_PLAZA_MECHANICS_COMBAT_TIER_GUIDE_DEFAULT_TIER: DefiningWorldPlazaDamageOutcomeTier =
  'normal';

export const DEFINING_PLAZA_MECHANICS_COMBAT_FLOAT_PREVIEW_BUTTON_LABEL =
  'Roll EV damage' as const;
