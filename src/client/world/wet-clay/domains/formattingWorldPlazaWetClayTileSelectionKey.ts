/**
 * Stable selection keys for wet-clay water tile interactions.
 *
 * @module components/world/wet-clay/domains/formattingWorldPlazaWetClayTileSelectionKey
 */

export function formattingWorldPlazaWetClayTileSelectionKey(
  tileX: number,
  tileY: number
): string {
  return `wet-clay:${tileX},${tileY}`;
}
