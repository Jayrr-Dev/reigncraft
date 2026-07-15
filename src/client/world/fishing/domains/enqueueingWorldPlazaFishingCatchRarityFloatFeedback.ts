/**
 * Enqueues a rising fishing rarity float above the local player.
 *
 * @module components/world/fishing/domains/enqueueingWorldPlazaFishingCatchRarityFloatFeedback
 */

import type { DefiningWorldPlazaInventoryItemRarity } from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemRarityConstants';

/**
 * Calls the player HUD float hook for a successful catch rarity reveal.
 */
export function enqueueingWorldPlazaFishingCatchRarityFloatFeedback(
  enqueueFishingCatchRarityFloat: (
    rarity: DefiningWorldPlazaInventoryItemRarity
  ) => void,
  rarity: DefiningWorldPlazaInventoryItemRarity
): void {
  enqueueFishingCatchRarityFloat(rarity);
}
