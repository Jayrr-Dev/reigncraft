/**
 * Item rarity ladder for world plaza inventory types.
 *
 * @module components/world/inventory/domains/definingWorldPlazaInventoryItemRarityConstants
 */

import type {
  DefiningReigncraftBadgeDarkShade,
  DefiningReigncraftBadgeRainbowColor,
} from '@/components/ui/domains/definingReigncraftBadgeConstants';

/** Ordered rarity ranks from lowest to highest. */
export type DefiningWorldPlazaInventoryItemRarity =
  | 'basic'
  | 'common'
  | 'uncommon'
  | 'rare'
  | 'epic'
  | 'mythic'
  | 'legendary'
  | 'godly';

/** Shared rarity id used by the generic inventory engine and plaza defs. */
export type DefiningInventoryItemRarity = DefiningWorldPlazaInventoryItemRarity;

/** Rainbow paint for one rarity badge chip. */
export type DefiningWorldPlazaInventoryItemRarityPaint = {
  readonly color: DefiningReigncraftBadgeRainbowColor;
  readonly shade: DefiningReigncraftBadgeDarkShade;
};

/** Ladder order for comparisons and catalogs. */
export const DEFINING_WORLD_PLAZA_INVENTORY_ITEM_RARITY_ORDER: readonly DefiningWorldPlazaInventoryItemRarity[] =
  [
    'basic',
    'common',
    'uncommon',
    'rare',
    'epic',
    'mythic',
    'legendary',
    'godly',
  ] as const;

/** Player-facing rarity labels. */
export const DEFINING_WORLD_PLAZA_INVENTORY_ITEM_RARITY_LABELS: Readonly<
  Record<DefiningWorldPlazaInventoryItemRarity, string>
> = {
  basic: 'Basic',
  common: 'Common',
  uncommon: 'Uncommon',
  rare: 'Rare',
  epic: 'Epic',
  mythic: 'Mythic',
  legendary: 'Legendary',
  godly: 'Godly',
};

/**
 * Thematic badge paints: slate → teal → green → blue → violet → amber → gold → crimson.
 */
export const DEFINING_WORLD_PLAZA_INVENTORY_ITEM_RARITY_PAINT: Readonly<
  Record<
    DefiningWorldPlazaInventoryItemRarity,
    DefiningWorldPlazaInventoryItemRarityPaint
  >
> = {
  basic: { color: 'indigo', shade: 'darker' },
  common: { color: 'blue', shade: 'dark' },
  uncommon: { color: 'green', shade: 'dark' },
  rare: { color: 'blue', shade: 'darker' },
  epic: { color: 'violet', shade: 'dark' },
  mythic: { color: 'orange', shade: 'dark' },
  legendary: { color: 'yellow', shade: 'dark' },
  godly: { color: 'red', shade: 'deepest' },
};
