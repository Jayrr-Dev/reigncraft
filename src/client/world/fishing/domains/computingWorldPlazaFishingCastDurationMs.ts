/**
 * Rolls fishing cast channel duration from catch rarity, then rod tier speed.
 *
 * @module components/world/fishing/domains/computingWorldPlazaFishingCastDurationMs
 */

import type { DefiningWorldPlazaHeldItemTier } from '@/components/world/equipment/domains/definingWorldPlazaHeldItemTypes';
import { DEFINING_WORLD_PLAZA_FISHING_CAST_DURATION_RANGE_MS_BY_RARITY } from '@/components/world/fishing/domains/definingWorldPlazaFishingCatchConstants';
import { DEFINING_WORLD_PLAZA_FISHING_CAST_DURATION_MULTIPLIER_BY_TIER } from '@/components/world/fishing/domains/definingWorldPlazaFishingConstants';
import type { DefiningWorldPlazaInventoryItemRarity } from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemRarityConstants';

/**
 * Returns cast channel duration in milliseconds for one rolled catch rarity.
 */
export function computingWorldPlazaFishingCastDurationMs(
  rarity: DefiningWorldPlazaInventoryItemRarity,
  tier: DefiningWorldPlazaHeldItemTier,
  harvestSpeedMultiplier = 1,
  unitRoll: number = Math.random()
): number {
  const range =
    DEFINING_WORLD_PLAZA_FISHING_CAST_DURATION_RANGE_MS_BY_RARITY[rarity];
  const clampedRoll = Math.min(1, Math.max(0, unitRoll));
  const spanMs = range.maxMs - range.minMs;
  const rolledMs = Math.round(range.minMs + clampedRoll * spanMs);
  const tierMultiplier =
    DEFINING_WORLD_PLAZA_FISHING_CAST_DURATION_MULTIPLIER_BY_TIER[tier];
  const resolvedSpeed = Math.max(0.25, harvestSpeedMultiplier);

  return Math.round((rolledMs * tierMultiplier) / resolvedSpeed);
}
