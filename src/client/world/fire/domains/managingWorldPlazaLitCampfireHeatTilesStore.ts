import { buildingWorldPlazaLitCampfireTileKeysFromFireCells } from '@/components/world/fire/domains/buildingWorldPlazaLitCampfireTileKeysFromFireCells';
import { computingWorldPlazaCampfireTemperatureCelsiusFromFuelWoodCount } from '@/components/world/health/domains/definingWorldPlazaTemperatureConstants';
import type { WorldFireDevvitCell } from '../../../../shared/worldFireDevvit';

/**
 * Module store for tiles that radiate campfire environmental heat.
 *
 * Heat follows lit campfire fire cells, not the placed pit block. The standing
 * tile plus one Chebyshev ring around it are assignable heat sources (lava-style
 * but only one block out). Standing-tile temperature scales with fed wood.
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

let litCampfireHeatCelsiusByTile = new Map<string, number>();
let litCampfireHeatTilesCacheKey = '';

function rebuildingWorldPlazaLitCampfireHeatTilesCacheKey(
  heatCelsiusByTile: ReadonlyMap<string, number>
): string {
  return Array.from(heatCelsiusByTile.entries())
    .sort(([tileKeyA], [tileKeyB]) => tileKeyA.localeCompare(tileKeyB))
    .map(([tileKey, heatCelsius]) => `${tileKey}@${heatCelsius}`)
    .join('|');
}

/**
 * Publishes lit campfire heat tiles from the current fire-cell snapshot.
 */
export function updatingWorldPlazaLitCampfireHeatTilesFromFireCells(
  fireCells: readonly WorldFireDevvitCell[]
): void {
  litCampfireHeatCelsiusByTile = new Map(
    buildingWorldPlazaLitCampfireTileKeysFromFireCells(fireCells)
  );
  litCampfireHeatTilesCacheKey =
    rebuildingWorldPlazaLitCampfireHeatTilesCacheKey(
      litCampfireHeatCelsiusByTile
    );
}

/**
 * Returns true when a lit campfire radiates assignable heat on the tile.
 */
export function checkingWorldPlazaLitCampfireHeatAtTileIndex(
  tileX: number,
  tileY: number
): boolean {
  return litCampfireHeatCelsiusByTile.has(
    formattingWorldPlazaLitCampfireHeatTileKey(tileX, tileY)
  );
}

/**
 * Standing / radiated campfire temperature for a heat tile (°C), or null.
 */
export function resolvingWorldPlazaLitCampfireHeatCelsiusAtTileIndex(
  tileX: number,
  tileY: number
): number | null {
  const heatCelsius = litCampfireHeatCelsiusByTile.get(
    formattingWorldPlazaLitCampfireHeatTileKey(tileX, tileY)
  );

  return heatCelsius === undefined ? null : heatCelsius;
}

/**
 * Stable cache key for thaw / temperature visual invalidation.
 */
export function gettingWorldPlazaLitCampfireHeatTilesCacheKey(): string {
  return litCampfireHeatTilesCacheKey;
}

/** Test helper: clears lit heat tiles. */
export function clearingWorldPlazaLitCampfireHeatTilesForTest(): void {
  litCampfireHeatCelsiusByTile = new Map();
  litCampfireHeatTilesCacheKey = '';
}

/** Test helper: marks one tile as lit campfire standing heat. */
export function markingWorldPlazaLitCampfireHeatTileForTest(
  tileX: number,
  tileY: number,
  fuelWoodCount = 1
): void {
  litCampfireHeatCelsiusByTile = new Map([
    [
      formattingWorldPlazaLitCampfireHeatTileKey(tileX, tileY),
      computingWorldPlazaCampfireTemperatureCelsiusFromFuelWoodCount(
        Math.max(0, fuelWoodCount)
      ),
    ],
  ]);
  litCampfireHeatTilesCacheKey =
    rebuildingWorldPlazaLitCampfireHeatTilesCacheKey(
      litCampfireHeatCelsiusByTile
    );
}
