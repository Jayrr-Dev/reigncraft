import { buildingWorldPlazaLitCampfireTileKeysFromFireCells } from '@/components/world/fire/domains/buildingWorldPlazaLitCampfireTileKeysFromFireCells';
import type { WorldFireDevvitCell } from '../../../../shared/worldFireDevvit';

/**
 * Module store for tiles that radiate campfire environmental heat.
 *
 * Heat follows lit campfire fire cells, not the placed pit block.
 *
 * @module components/world/fire/domains/managingWorldPlazaLitCampfireHeatTilesStore
 */

/** Stable 2D tile key for lit campfire heat (`tileX,tileY`). */
export function formattingWorldPlazaLitCampfireHeatTileKey(
  tileX: number,
  tileY: number
): string {
  return `${tileX},${tileY}`;
}

let litCampfireHeatTileKeys = new Set<string>();
let litCampfireHeatTilesCacheKey = '';

/**
 * Publishes lit campfire heat tiles from the current fire-cell snapshot.
 */
export function updatingWorldPlazaLitCampfireHeatTilesFromFireCells(
  fireCells: readonly WorldFireDevvitCell[]
): void {
  litCampfireHeatTileKeys =
    buildingWorldPlazaLitCampfireTileKeysFromFireCells(fireCells);
  litCampfireHeatTilesCacheKey = Array.from(litCampfireHeatTileKeys)
    .sort()
    .join('|');
}

/**
 * Returns true when a lit campfire fire cell radiates heat on the tile.
 */
export function checkingWorldPlazaLitCampfireHeatAtTileIndex(
  tileX: number,
  tileY: number
): boolean {
  return litCampfireHeatTileKeys.has(
    formattingWorldPlazaLitCampfireHeatTileKey(tileX, tileY)
  );
}

/**
 * Stable cache key for thaw / temperature visual invalidation.
 */
export function gettingWorldPlazaLitCampfireHeatTilesCacheKey(): string {
  return litCampfireHeatTilesCacheKey;
}

/** Test helper: clears lit heat tiles. */
export function clearingWorldPlazaLitCampfireHeatTilesForTest(): void {
  litCampfireHeatTileKeys = new Set();
  litCampfireHeatTilesCacheKey = '';
}

/** Test helper: marks one tile as lit campfire heat. */
export function markingWorldPlazaLitCampfireHeatTileForTest(
  tileX: number,
  tileY: number
): void {
  litCampfireHeatTileKeys = new Set([
    formattingWorldPlazaLitCampfireHeatTileKey(tileX, tileY),
  ]);
  litCampfireHeatTilesCacheKey = Array.from(litCampfireHeatTileKeys)
    .sort()
    .join('|');
}
