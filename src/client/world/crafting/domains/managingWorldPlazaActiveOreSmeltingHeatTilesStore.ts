import type { DefiningWorldBuildingPlacedBlock } from '@/components/world/building/domains/definingWorldBuildingPlacedBlock';
import { buildingWorldPlazaActiveOreSmeltingHeatTilesFromPlacedBlocks } from '@/components/world/crafting/domains/buildingWorldPlazaActiveOreSmeltingHeatTilesFromPlacedBlocks';

/**
 * Module store for tiles that radiate heat while ore-smelting stations run.
 *
 * Active bloomery / kiln / stove footprint tiles plus one Chebyshev ring around
 * them are assignable heat sources (same pattern as lit campfires).
 *
 * @module components/world/crafting/domains/managingWorldPlazaActiveOreSmeltingHeatTilesStore
 */

/** Stable 2D tile key for active smelting heat (`tileX,tileY`). */
export function formattingWorldPlazaActiveOreSmeltingHeatTileKey(
  tileX: number,
  tileY: number
): string {
  return `${tileX},${tileY}`;
}

let activeOreSmeltingHeatCelsiusByTile = new Map<string, number>();
let activeOreSmeltingHeatTilesCacheKey = '';

function rebuildingWorldPlazaActiveOreSmeltingHeatTilesCacheKey(
  heatCelsiusByTile: ReadonlyMap<string, number>
): string {
  return Array.from(heatCelsiusByTile.entries())
    .sort(([tileKeyA], [tileKeyB]) => tileKeyA.localeCompare(tileKeyB))
    .map(([tileKey, heatCelsius]) => `${tileKey}@${heatCelsius}`)
    .join('|');
}

/**
 * Publishes active smelting heat tiles from placed blocks + active station ids.
 */
export function updatingWorldPlazaActiveOreSmeltingHeatTilesFromPlacedBlocks(
  placedBlocks: readonly DefiningWorldBuildingPlacedBlock[],
  activeBlockIds: ReadonlySet<string>
): void {
  activeOreSmeltingHeatCelsiusByTile = new Map(
    buildingWorldPlazaActiveOreSmeltingHeatTilesFromPlacedBlocks(
      placedBlocks,
      activeBlockIds
    )
  );
  activeOreSmeltingHeatTilesCacheKey =
    rebuildingWorldPlazaActiveOreSmeltingHeatTilesCacheKey(
      activeOreSmeltingHeatCelsiusByTile
    );
}

/**
 * Returns true when an active smelting station radiates heat on the tile.
 */
export function checkingWorldPlazaActiveOreSmeltingHeatAtTileIndex(
  tileX: number,
  tileY: number
): boolean {
  return activeOreSmeltingHeatCelsiusByTile.has(
    formattingWorldPlazaActiveOreSmeltingHeatTileKey(tileX, tileY)
  );
}

/**
 * Active smelting heat for a tile (°C), or null.
 */
export function resolvingWorldPlazaActiveOreSmeltingHeatCelsiusAtTileIndex(
  tileX: number,
  tileY: number
): number | null {
  const heatCelsius = activeOreSmeltingHeatCelsiusByTile.get(
    formattingWorldPlazaActiveOreSmeltingHeatTileKey(tileX, tileY)
  );

  return heatCelsius === undefined ? null : heatCelsius;
}

/**
 * Stable cache key for temperature visual invalidation.
 */
export function gettingWorldPlazaActiveOreSmeltingHeatTilesCacheKey(): string {
  return activeOreSmeltingHeatTilesCacheKey;
}

/** Test helper: clears active smelting heat tiles. */
export function clearingWorldPlazaActiveOreSmeltingHeatTilesForTest(): void {
  activeOreSmeltingHeatCelsiusByTile = new Map();
  activeOreSmeltingHeatTilesCacheKey = '';
}

/** Test helper: marks one tile as active smelting heat. */
export function markingWorldPlazaActiveOreSmeltingHeatTileForTest(
  tileX: number,
  tileY: number,
  heatCelsius: number
): void {
  activeOreSmeltingHeatCelsiusByTile = new Map([
    [
      formattingWorldPlazaActiveOreSmeltingHeatTileKey(tileX, tileY),
      heatCelsius,
    ],
  ]);
  activeOreSmeltingHeatTilesCacheKey =
    rebuildingWorldPlazaActiveOreSmeltingHeatTilesCacheKey(
      activeOreSmeltingHeatCelsiusByTile
    );
}
