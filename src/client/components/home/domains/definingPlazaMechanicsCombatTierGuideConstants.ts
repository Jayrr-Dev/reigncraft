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
  badgeClassName: string;
  badgeActiveClassName: string;
};

const PLAZA_MECHANICS_COMBAT_TIER_BADGE_CLASS_NAMES: Record<
  DefiningWorldPlazaDamageOutcomeTier,
  { badgeClassName: string; badgeActiveClassName: string }
> = {
  dodged: {
    badgeClassName:
      'border-slate-400/50 bg-slate-100/80 text-slate-700 hover:border-slate-500/70',
    badgeActiveClassName: 'border-slate-600 bg-slate-200/90 text-slate-900',
  },
  blocked: {
    badgeClassName:
      'border-slate-400/50 bg-slate-100/80 text-slate-700 hover:border-slate-500/70',
    badgeActiveClassName: 'border-slate-600 bg-slate-200/90 text-slate-900',
  },
  softened: {
    badgeClassName:
      'border-slate-300/60 bg-slate-50/90 text-slate-600 hover:border-slate-400/70',
    badgeActiveClassName: 'border-slate-500 bg-slate-100 text-slate-800',
  },
  normal: {
    badgeClassName:
      'border-red-400/45 bg-red-50/90 text-red-700 hover:border-red-500/60',
    badgeActiveClassName: 'border-red-600 bg-red-100/90 text-red-900',
  },
  true_strike: {
    badgeClassName:
      'border-yellow-500/50 bg-yellow-50/90 text-yellow-800 hover:border-yellow-600/60',
    badgeActiveClassName: 'border-yellow-600 bg-yellow-100 text-yellow-900',
  },
  critical: {
    badgeClassName:
      'border-amber-400/55 bg-amber-50/90 text-amber-800 hover:border-amber-500/65',
    badgeActiveClassName: 'border-amber-600 bg-amber-100 text-amber-950',
  },
  lethal: {
    badgeClassName:
      'border-orange-400/55 bg-orange-50/90 text-orange-800 hover:border-orange-500/65',
    badgeActiveClassName: 'border-orange-600 bg-orange-100 text-orange-950',
  },
  fatal: {
    badgeClassName:
      'border-red-700/50 bg-red-950/10 text-red-950 hover:border-red-800/60',
    badgeActiveClassName: 'border-red-900 bg-red-950/20 text-red-950',
  },
};

function buildingPlazaMechanicsCombatTierGuideEntry(
  tier: DefiningWorldPlazaDamageOutcomeTier
): DefiningPlazaMechanicsCombatTierGuideEntry {
  const descriptor = DEFINING_WORLD_PLAZA_DAMAGE_OUTCOME_TIER_REGISTRY[tier];
  const badgeClassNames = PLAZA_MECHANICS_COMBAT_TIER_BADGE_CLASS_NAMES[tier];
  const rollPreview = computingPlazaMechanicsCombatEvDamageRollPreview({
    forcedTier: tier,
  });

  return {
    tier,
    label: descriptor.label,
    thresholdLabel:
      formattingPlazaMechanicsCombatTierThresholdLabel(descriptor),
    exampleAmount: rollPreview.rolledDamage,
    badgeClassName: badgeClassNames.badgeClassName,
    badgeActiveClassName: badgeClassNames.badgeActiveClassName,
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
