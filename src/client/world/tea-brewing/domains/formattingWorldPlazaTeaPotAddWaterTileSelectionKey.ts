/**
 * Stable selection keys for teapot Add Water shore interactions.
 *
 * @module components/world/tea-brewing/domains/formattingWorldPlazaTeaPotAddWaterTileSelectionKey
 */

export function formattingWorldPlazaTeaPotAddWaterTileSelectionKey(
  tileX: number,
  tileY: number
): string {
  return `tea-pot-add-water:${tileX},${tileY}`;
}
