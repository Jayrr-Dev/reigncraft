/**
 * Resolves Spritcore granted when a living fishing catch is landed.
 *
 * @module components/world/fishing/domains/resolvingWorldPlazaFishingCatchSpritcoreDrop
 */

import { DEFINING_WORLD_PLAZA_GENERATION_FEATURE } from '@/components/world/domains/definingWorldPlazaGenerationFeatureRegistry';
import { checkingWorldPlazaGenerationFeatureEnabled } from '@/components/world/domains/managingWorldPlazaGenerationFeatureStore';
import { DEFINING_WORLD_PLAZA_FISHING_CATCH_SPRITCORE_AMOUNT_RANGE_BY_RARITY } from '@/components/world/fishing/domains/definingWorldPlazaFishingCatchConstants';
import type { DefiningWorldPlazaFishingCatchCatalogEntry } from '@/components/world/fishing/domains/definingWorldPlazaFishingCatchRegistry';
import { DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_SPRITCORE } from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemTypeIds';
import { resolvingWorldPlazaSpritcoreDropTierDefinition } from '@/components/world/spritcore/domains/resolvingWorldPlazaSpritcoreDropTier';

export type ResolvingWorldPlazaFishingCatchSpritcoreDrop = {
  readonly amount: number;
  readonly itemTypeId: string;
  readonly displayName: string;
};

export type ResolvingWorldPlazaFishingCatchSpritcoreDropParams = {
  readonly entry: DefiningWorldPlazaFishingCatchCatalogEntry;
  /** Unit random in [0, 1). Inject for tests. */
  readonly rollUnit?: () => number;
};

function rollingInclusiveAmount(
  minInclusive: number,
  maxInclusive: number,
  rollUnit: () => number
): number {
  const low = Math.min(minInclusive, maxInclusive);
  const high = Math.max(minInclusive, maxInclusive);
  const span = high - low;

  if (span <= 0) {
    return Math.max(0, Math.floor(low));
  }

  return low + Math.floor(rollUnit() * (span + 1));
}

/**
 * Returns a small Spritcore stack for a living catch, or null for junk / disabled.
 */
export function resolvingWorldPlazaFishingCatchSpritcoreDrop(
  entryOrParams:
    | DefiningWorldPlazaFishingCatchCatalogEntry
    | ResolvingWorldPlazaFishingCatchSpritcoreDropParams
): ResolvingWorldPlazaFishingCatchSpritcoreDrop | null {
  const params =
    'entry' in entryOrParams
      ? entryOrParams
      : { entry: entryOrParams, rollUnit: undefined };
  const { entry, rollUnit = Math.random } = params;

  if (entry.kind !== 'creature') {
    return null;
  }

  if (
    !checkingWorldPlazaGenerationFeatureEnabled(
      DEFINING_WORLD_PLAZA_GENERATION_FEATURE.SPRITCORE_LEVELING
    )
  ) {
    return null;
  }

  const range =
    DEFINING_WORLD_PLAZA_FISHING_CATCH_SPRITCORE_AMOUNT_RANGE_BY_RARITY[
      entry.rarity
    ];
  const amount = rollingInclusiveAmount(
    range.minInclusive,
    range.maxInclusive,
    rollUnit
  );

  if (amount <= 0) {
    return null;
  }

  const tierDefinition = resolvingWorldPlazaSpritcoreDropTierDefinition(amount);

  return {
    amount,
    itemTypeId: DEFINING_WORLD_PLAZA_INVENTORY_ITEM_TYPE_SPRITCORE,
    displayName: tierDefinition.displayName,
  };
}
