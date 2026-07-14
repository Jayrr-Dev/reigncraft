/**
 * Synthetic ground-food ids for long-grass tiles wildlife forage toward.
 *
 * Format: `wildlife-grass:{tileX},{tileY}` — reuses forageChase / forageEat.
 *
 * @module components/world/wildlife/domains/definingWildlifeGroundGrassIdConstants
 */

export const DEFINING_WILDLIFE_GROUND_GRASS_ITEM_ID_PREFIX =
  'wildlife-grass:' as const;

export type DefiningWildlifeGroundGrassTile = {
  readonly tileX: number;
  readonly tileY: number;
};

/** Builds the synthetic forage id for one long-grass tile. */
export function formattingWildlifeGroundGrassItemId(
  tileX: number,
  tileY: number
): string {
  return `${DEFINING_WILDLIFE_GROUND_GRASS_ITEM_ID_PREFIX}${tileX},${tileY}`;
}

/** True when the id is a synthetic wildlife grass forage target. */
export function checkingWildlifeGroundGrassItemId(itemId: string): boolean {
  return itemId.startsWith(DEFINING_WILDLIFE_GROUND_GRASS_ITEM_ID_PREFIX);
}

/** Parses tile coords from a synthetic wildlife grass forage id. */
export function parsingWildlifeGroundGrassItemId(
  itemId: string
): DefiningWildlifeGroundGrassTile | null {
  if (!checkingWildlifeGroundGrassItemId(itemId)) {
    return null;
  }

  const coords = itemId.slice(
    DEFINING_WILDLIFE_GROUND_GRASS_ITEM_ID_PREFIX.length
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
