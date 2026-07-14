/**
 * Resolves lapidary rarity id + label for one ore guide entry.
 *
 * Pulls rarity from the shared ore ladder (same as inventory badges).
 *
 * @module components/home/domains/resolvingPlazaLapidaryRarity
 */

import type { DefiningWorldPlazaInventoryItemRarity } from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemRarityConstants';
import { DEFINING_WORLD_PLAZA_INVENTORY_ITEM_RARITY_LABELS } from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemRarityConstants';
import {
  resolvingWorldOreSpeciesRarity,
  type WorldOreSpeciesId,
} from '../../../../shared/worldOreRarity';

/**
 * Resolves the rarity id for one lapidary guide entry.
 */
export function resolvingPlazaLapidaryEntryRarity(
  speciesId: WorldOreSpeciesId
): DefiningWorldPlazaInventoryItemRarity {
  return resolvingWorldOreSpeciesRarity(speciesId);
}

/**
 * Player-facing rarity label for one lapidary entry.
 */
export function resolvingPlazaLapidaryEntryRarityLabel(
  rarity: DefiningWorldPlazaInventoryItemRarity
): string {
  return DEFINING_WORLD_PLAZA_INVENTORY_ITEM_RARITY_LABELS[rarity];
}

/**
 * Inventory detail badge variant for one lapidary rarity.
 */
export function resolvingPlazaLapidaryEntryRarityBadgeVariant(
  rarity: DefiningWorldPlazaInventoryItemRarity
): `rarity-${DefiningWorldPlazaInventoryItemRarity}` {
  return `rarity-${rarity}`;
}
