/**
 * Special item tags for future quest, unique, and Godforge content.
 *
 * @module components/world/inventory/domains/definingWorldPlazaInventoryItemSpecialTagConstants
 */

import type {
  DefiningReigncraftBadgeDarkShade,
  DefiningReigncraftBadgeRainbowColor,
} from '@/components/ui/domains/definingReigncraftBadgeConstants';

/** Optional multi-select tags on an item type. */
export type DefiningWorldPlazaInventoryItemSpecialTag =
  | 'godforge'
  | 'unique'
  | 'quest-reward';

/** Rainbow paint for one special-tag badge chip. */
export type DefiningWorldPlazaInventoryItemSpecialTagPaint = {
  readonly color: DefiningReigncraftBadgeRainbowColor;
  readonly shade: DefiningReigncraftBadgeDarkShade;
};

/** Player-facing special tag labels. */
export const DEFINING_WORLD_PLAZA_INVENTORY_ITEM_SPECIAL_TAG_LABELS: Readonly<
  Record<DefiningWorldPlazaInventoryItemSpecialTag, string>
> = {
  godforge: 'Godforge',
  unique: 'Unique',
  'quest-reward': 'Quest Reward',
};

/** Thematic badge paints for special tags. */
export const DEFINING_WORLD_PLAZA_INVENTORY_ITEM_SPECIAL_TAG_PAINT: Readonly<
  Record<
    DefiningWorldPlazaInventoryItemSpecialTag,
    DefiningWorldPlazaInventoryItemSpecialTagPaint
  >
> = {
  godforge: { color: 'yellow', shade: 'deepest' },
  unique: { color: 'violet', shade: 'darker' },
  'quest-reward': { color: 'orange', shade: 'darker' },
};
