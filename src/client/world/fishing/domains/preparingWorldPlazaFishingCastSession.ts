/**
 * Rolls a fishing catch at cast start and derives the channel duration.
 *
 * @module components/world/fishing/domains/preparingWorldPlazaFishingCastSession
 */

import type { DefiningWorldPlazaBiomeKind } from '@/components/world/domains/definingWorldPlazaBiomeKind';
import type { DefiningWorldPlazaWaterKind } from '@/components/world/domains/definingWorldPlazaWaterKind';
import type { DefiningWorldPlazaHeldItemTier } from '@/components/world/equipment/domains/definingWorldPlazaHeldItemTypes';
import { computingWorldPlazaFishingCastDurationMs } from '@/components/world/fishing/domains/computingWorldPlazaFishingCastDurationMs';
import type { DefiningWorldPlazaFishingCastSessionContext } from '@/components/world/fishing/domains/definingWorldPlazaFishingCastSessionContext';
import type { ListingWorldPlazaFishingTilesInInteractionRangeEntry } from '@/components/world/fishing/domains/listingWorldPlazaFishingTilesInInteractionRange';
import { resolvingWorldPlazaFishingCatchRoll } from '@/components/world/fishing/domains/resolvingWorldPlazaFishingCatchRoll';

export type PreparingWorldPlazaFishingCastSessionParams = {
  readonly entry: ListingWorldPlazaFishingTilesInInteractionRangeEntry;
  readonly waterKind: DefiningWorldPlazaWaterKind;
  readonly biomeKind: DefiningWorldPlazaBiomeKind;
  readonly tier: DefiningWorldPlazaHeldItemTier;
  readonly harvestSpeedMultiplier?: number;
  readonly randomUnit?: () => number;
};

export type PreparingWorldPlazaFishingCastSessionResult = {
  readonly session: DefiningWorldPlazaFishingCastSessionContext;
  readonly durationMs: number;
};

/**
 * Rolls one catch for the tile context and returns the cast session + duration.
 */
export function preparingWorldPlazaFishingCastSession({
  entry,
  waterKind,
  biomeKind,
  tier,
  harvestSpeedMultiplier = 1,
  randomUnit = Math.random,
}: PreparingWorldPlazaFishingCastSessionParams): PreparingWorldPlazaFishingCastSessionResult | null {
  const pendingCatch = resolvingWorldPlazaFishingCatchRoll(
    { waterKind, biomeKind },
    randomUnit
  );

  if (!pendingCatch) {
    return null;
  }

  const durationMs = computingWorldPlazaFishingCastDurationMs(
    pendingCatch.rarity,
    tier,
    harvestSpeedMultiplier,
    randomUnit()
  );

  return {
    session: {
      tileX: entry.tileX,
      tileY: entry.tileY,
      pendingCatch,
    },
    durationMs,
  };
}
