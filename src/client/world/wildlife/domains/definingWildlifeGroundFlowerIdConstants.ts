/**
 * Synthetic ground-food ids for biome flower tiles wildlife forage toward.
 *
 * Format: `wildlife-flower:{tileX},{tileY}` — reuses forageChase / forageEat.
 *
 * @module components/world/wildlife/domains/definingWildlifeGroundFlowerIdConstants
 */

export const DEFINING_WILDLIFE_GROUND_FLOWER_ITEM_ID_PREFIX =
  'wildlife-flower:' as const;

export type DefiningWildlifeGroundFlowerTile = {
  readonly tileX: number;
  readonly tileY: number;
};

/** Builds the synthetic forage id for one biome flower tile. */
export function formattingWildlifeGroundFlowerItemId(
  tileX: number,
  tileY: number
): string {
  return `${DEFINING_WILDLIFE_GROUND_FLOWER_ITEM_ID_PREFIX}${tileX},${tileY}`;
}

/** True when the id is a synthetic wildlife flower forage target. */
export function checkingWildlifeGroundFlowerItemId(itemId: string): boolean {
  return itemId.startsWith(DEFINING_WILDLIFE_GROUND_FLOWER_ITEM_ID_PREFIX);
}

/** Parses tile coords from a synthetic wildlife flower forage id. */
export function parsingWildlifeGroundFlowerItemId(
  itemId: string
): DefiningWildlifeGroundFlowerTile | null {
  if (!checkingWildlifeGroundFlowerItemId(itemId)) {
    return null;
  }

  const coords = itemId.slice(
    DEFINING_WILDLIFE_GROUND_FLOWER_ITEM_ID_PREFIX.length
  );
  const separatorIndex = coords.indexOf(',');

  if (separatorIndex <= 0 || separatorIndex >= coords.length - 1) {
    return null;
  }

  const tileX = Number(coords.slice(0, separatorIndex));
  const tileY = Number(coords.slice(separatorIndex + 1));

  if (!Number.isInteger(tileX) || !Number.isInteger(tileY)) {
    return null;
  }

  return { tileX, tileY };
}
