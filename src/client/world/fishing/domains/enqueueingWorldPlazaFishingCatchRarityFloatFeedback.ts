/**
 * Enqueues a rising fishing rarity float above the local player.
 *
 * @module components/world/fishing/domains/enqueueingWorldPlazaFishingCatchRarityFloatFeedback
 */

import type { DefiningWorldPlazaInventoryItemRarity } from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemRarityConstants';

export type EnqueueingWorldPlazaFishingCatchRarityFloatOptions = {
  readonly escaped?: boolean;
};

export type EnqueueingWorldPlazaFishingCatchRarityFloat = (
  rarity: DefiningWorldPlazaInventoryItemRarity,
  options?: EnqueueingWorldPlazaFishingCatchRarityFloatOptions
) => void;

/**
 * Calls the player HUD float hook for a catch or escaped rarity reveal.
 */
export function enqueueingWorldPlazaFishingCatchRarityFloatFeedback(
  enqueueFishingCatchRarityFloat: EnqueueingWorldPlazaFishingCatchRarityFloat,
  rarity: DefiningWorldPlazaInventoryItemRarity,
  options?: EnqueueingWorldPlazaFishingCatchRarityFloatOptions
): void {
  enqueueFishingCatchRarityFloat(rarity, options);
}
