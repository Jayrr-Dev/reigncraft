/**
 * Herbarium rarity for trees (flowers use inventory item rarity).
 *
 * @module components/home/domains/definingPlazaHerbariumRarityConstants
 */

import type { DefiningWorldPlazaTreeVariantKind } from '@/components/world/domains/definingWorldPlazaTreeConstants';
import type { DefiningWorldPlazaInventoryItemRarity } from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemRarityConstants';

/**
 * Tree silhouette rarity.
 * Shared multi-biome trees sit lower; biome-exclusive crowns sit higher.
 */
export const DEFINING_PLAZA_HERBARIUM_TREE_RARITY_BY_VARIANT: Readonly<
  Record<DefiningWorldPlazaTreeVariantKind, DefiningWorldPlazaInventoryItemRarity>
> = {
  oak: 'basic',
  birch: 'basic',
  pine: 'basic',
  deadwood: 'common',
  cactus: 'common',
  blossom: 'uncommon',
  willow: 'uncommon',
  acacia: 'uncommon',
  spruce: 'uncommon',
  palm: 'uncommon',
};
