/**
 * Stable selection keys for fishing tile interactions.
 *
 * @module components/world/fishing/domains/formattingWorldPlazaFishingTileSelectionKey
 */

export function formattingWorldPlazaFishingTileSelectionKey(
  tileX: number,
  tileY: number
): string {
  return `fish:${tileX},${tileY}`;
}

/**
 * Parses a fishing tile selection key back to tile coords.
 */
export function resolvingWorldPlazaFishingTileFromSelectionKey(
  selectionKey: string
): { readonly tileX: number; readonly tileY: number } | null {
  const match = /^fish:(-?\d+),(-?\d+)$/.exec(selectionKey);

  if (!match) {
    return null;
  }

  const tileX = Number(match[1]);
  const tileY = Number(match[2]);

  if (!Number.isFinite(tileX) || !Number.isFinite(tileY)) {
    return null;
  }

  return { tileX, tileY };
}
