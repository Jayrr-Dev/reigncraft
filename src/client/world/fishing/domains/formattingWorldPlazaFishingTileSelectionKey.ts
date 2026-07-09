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
