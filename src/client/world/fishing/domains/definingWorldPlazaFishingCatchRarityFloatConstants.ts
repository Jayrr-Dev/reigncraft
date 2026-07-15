/**
 * Player-facing fishing catch rarity float: icon + "{Rarity} Catch".
 *
 * @module components/world/fishing/domains/definingWorldPlazaFishingCatchRarityFloatConstants
 */

import type { DefiningWorldPlazaInventoryItemRarity } from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemRarityConstants';
import { DEFINING_WORLD_PLAZA_INVENTORY_ITEM_RARITY_LABELS } from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemRarityConstants';

/** DOM size for the rarity glyph inside the combat float row. */
export const DEFINING_WORLD_PLAZA_FISHING_CATCH_RARITY_FLOAT_ICON_PX = 22;

/**
 * Text colors for rarity float labels (stroke handled by shared float CSS).
 */
export const DEFINING_WORLD_PLAZA_FISHING_CATCH_RARITY_FLOAT_TEXT_COLOR: Readonly<
  Record<DefiningWorldPlazaInventoryItemRarity, string>
> = {
  basic: '#9aa3b5',
  common: '#d5dbe6',
  uncommon: '#5fd08a',
  rare: '#5b8cff',
  epic: '#b57bff',
  mythic: '#ff9a3c',
  legendary: '#f4d35e',
  godly: '#ff4d5e',
};

/**
 * Builds the rising float label, e.g. "Legendary Catch".
 */
export function formattingWorldPlazaFishingCatchRarityFloatLabel(
  rarity: DefiningWorldPlazaInventoryItemRarity
): string {
  return `${DEFINING_WORLD_PLAZA_INVENTORY_ITEM_RARITY_LABELS[rarity]} Catch`;
}
