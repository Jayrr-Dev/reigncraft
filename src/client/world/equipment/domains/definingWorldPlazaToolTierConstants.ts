/**
 * Declarative balance for tiered plaza tools (wood → gold).
 *
 * @module components/world/equipment/domains/definingWorldPlazaToolTierConstants
 */

import type { DefiningWorldPlazaHeldItemTier } from '@/components/world/equipment/domains/definingWorldPlazaHeldItemTypes';

export type DefiningWorldPlazaToolTierStats = {
  readonly meleeDamageMultiplier: number;
  readonly harvestSpeedMultiplier: number;
  readonly maxDurability: number;
  readonly displayNameSuffix: string;
};

/** Per-tier combat, harvest, and durability tuning. */
export const DEFINING_WORLD_PLAZA_TOOL_TIER_STATS: Record<
  DefiningWorldPlazaHeldItemTier,
  DefiningWorldPlazaToolTierStats
> = {
  wood: {
    meleeDamageMultiplier: 1,
    harvestSpeedMultiplier: 1,
    maxDurability: 80,
    displayNameSuffix: 'Wood',
  },
  iron: {
    meleeDamageMultiplier: 1.15,
    harvestSpeedMultiplier: 1.2,
    maxDurability: 134,
    displayNameSuffix: 'Iron',
  },
  steel: {
    meleeDamageMultiplier: 1.3,
    harvestSpeedMultiplier: 1.4,
    maxDurability: 200,
    displayNameSuffix: 'Steel',
  },
  gold: {
    meleeDamageMultiplier: 1.45,
    harvestSpeedMultiplier: 1.6,
    maxDurability: 266,
    displayNameSuffix: 'Gold',
  },
};
