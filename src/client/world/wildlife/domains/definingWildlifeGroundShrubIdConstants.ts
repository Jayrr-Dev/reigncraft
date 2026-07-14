/**
 * Synthetic ground-food ids for berry-shrub tiles wildlife forage toward.
 *
 * Format: `wildlife-shrub:{tileX},{tileY}` — reuses forageChase / forageEat.
 *
 * @module components/world/wildlife/domains/definingWildlifeGroundShrubIdConstants
 */

export const DEFINING_WILDLIFE_GROUND_SHRUB_ITEM_ID_PREFIX =
  'wildlife-shrub:' as const;

export type DefiningWildlifeGroundShrubTile = {
  readonly tileX: number;
  readonly tileY: number;
};

/** Builds the synthetic forage id for one berry-shrub tile. */
export function formattingWildlifeGroundShrubItemId(
  tileX: number,
  tileY: number
): string {
  return `${DEFINING_WILDLIFE_GROUND_SHRUB_ITEM_ID_PREFIX}${tileX},${tileY}`;
}

/** True when the id is a synthetic wildlife shrub forage target. */
export function checkingWildlifeGroundShrubItemId(itemId: string): boolean {
  return itemId.startsWith(DEFINING_WILDLIFE_GROUND_SHRUB_ITEM_ID_PREFIX);
}

/** Parses tile coords from a synthetic wildlife shrub forage id. */
export function parsingWildlifeGroundShrubItemId(
  itemId: string
): DefiningWildlifeGroundShrubTile | null {
  if (!checkingWildlifeGroundShrubItemId(itemId)) {
    return null;
  }

  const coords = itemId.slice(
    DEFINING_WILDLIFE_GROUND_SHRUB_ITEM_ID_PREFIX.length
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
