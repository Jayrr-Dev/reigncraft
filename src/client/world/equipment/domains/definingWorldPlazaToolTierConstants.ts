/**
 * Declarative balance for tiered plaza tools (wood → gold).
 *
 * @module components/world/equipment/domains/definingWorldPlazaToolTierConstants
 */

import type { DefiningWorldPlazaHeldItemTier } from '@/components/world/equipment/domains/definingWorldPlazaHeldItemTypes';
import type { DefiningWorldPlazaEntityHealthDamageRollModifierKind } from '@/components/world/health/domains/definingWorldPlazaEntityHealthTypes';

/** Passive attacker roll crumb baked into a tool tier (gold variance, etc.). */
export type DefiningWorldPlazaToolTierAttackerRollCrumb = {
  readonly kind: DefiningWorldPlazaEntityHealthDamageRollModifierKind;
  readonly value: number;
};

export type DefiningWorldPlazaToolTierStats = {
  /** Multiplies character attack EV while this tier weapon is equipped. */
  readonly meleeDamageMultiplier: number;
  /** Flat attack EV added after the multiplier. */
  readonly meleeFlatDamage: number;
  readonly harvestSpeedMultiplier: number;
  readonly maxDurability: number;
  readonly displayNameSuffix: string;
  /**
   * Optional attacker roll crumbs while equipped (gold = wilder swings).
   * Mean EV stays steel-parity; variance is the gold identity.
   */
  readonly attackerRollModifiers?: readonly DefiningWorldPlazaToolTierAttackerRollCrumb[];
};

/**
 * Per-tier combat, harvest, and durability tuning.
 * Gold matches steel EV (1.3× + 50 flat) and adds damage-roll variance.
 */
export const DEFINING_WORLD_PLAZA_TOOL_TIER_STATS: Record<
  DefiningWorldPlazaHeldItemTier,
  DefiningWorldPlazaToolTierStats
> = {
  wood: {
    meleeDamageMultiplier: 1,
    meleeFlatDamage: 10,
    harvestSpeedMultiplier: 1,
    maxDurability: 80,
    displayNameSuffix: 'Wood',
  },
  iron: {
    meleeDamageMultiplier: 1.15,
    meleeFlatDamage: 20,
    harvestSpeedMultiplier: 1.2,
    maxDurability: 134,
    displayNameSuffix: 'Iron',
  },
  steel: {
    meleeDamageMultiplier: 1.3,
    meleeFlatDamage: 50,
    harvestSpeedMultiplier: 1.4,
    maxDurability: 200,
    displayNameSuffix: 'Steel',
  },
  gold: {
    meleeDamageMultiplier: 1.3,
    meleeFlatDamage: 50,
    harvestSpeedMultiplier: 1.6,
    maxDurability: 266,
    displayNameSuffix: 'Gold',
    attackerRollModifiers: [{ kind: 'variance', value: 1.35 }],
  },
};
