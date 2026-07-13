import { buildingWorldPlazaLitCampfireTileKeysFromFireCells } from '@/components/world/fire/domains/buildingWorldPlazaLitCampfireTileKeysFromFireCells';
import { computingWorldPlazaCampfireTemperatureCelsiusFromFuelWoodCount } from '@/components/world/health/domains/definingWorldPlazaTemperatureConstants';
import type { WorldFireDevvitCell } from '../../../../shared/worldFireDevvit';

/**
 * Module store for tiles that radiate campfire environmental heat.
 *
 * Heat follows lit campfire fire cells, not the placed pit block. Standing-tile
 * temperature scales with inventory wood fed to that cell.
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

let litCampfireFuelWoodByTile = new Map<string, number>();
let litCampfireHeatTilesCacheKey = '';

function rebuildingWorldPlazaLitCampfireHeatTilesCacheKey(
  fuelWoodByTile: ReadonlyMap<string, number>
): string {
  return Array.from(fuelWoodByTile.entries())
    .sort(([tileKeyA], [tileKeyB]) => tileKeyA.localeCompare(tileKeyB))
    .map(([tileKey, fuelWoodCount]) => `${tileKey}@${fuelWoodCount}`)
    .join('|');
}

/**
 * Publishes lit campfire heat tiles from the current fire-cell snapshot.
 */
export function updatingWorldPlazaLitCampfireHeatTilesFromFireCells(
  fireCells: readonly WorldFireDevvitCell[]
): void {
  litCampfireFuelWoodByTile = new Map(
    buildingWorldPlazaLitCampfireTileKeysFromFireCells(fireCells)
  );
  litCampfireHeatTilesCacheKey =
    rebuildingWorldPlazaLitCampfireHeatTilesCacheKey(litCampfireFuelWoodByTile);
}

/**
 * Returns true when a lit campfire fire cell radiates heat on the tile.
 */
export function checkingWorldPlazaLitCampfireHeatAtTileIndex(
  tileX: number,
  tileY: number
): boolean {
  return litCampfireFuelWoodByTile.has(
    formattingWorldPlazaLitCampfireHeatTileKey(tileX, tileY)
  );
}

/**
 * Standing-tile campfire temperature for a lit heat tile (°C), or null.
 */
export function resolvingWorldPlazaLitCampfireHeatCelsiusAtTileIndex(
  tileX: number,
  tileY: number
): number | null {
  const fuelWoodCount = litCampfireFuelWoodByTile.get(
    formattingWorldPlazaLitCampfireHeatTileKey(tileX, tileY)
  );

  if (fuelWoodCount === undefined) {
    return null;
  }

  return computingWorldPlazaCampfireTemperatureCelsiusFromFuelWoodCount(
    fuelWoodCount
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
  litCampfireFuelWoodByTile = new Map();
  litCampfireHeatTilesCacheKey = '';
}

/** Test helper: marks one tile as lit campfire heat. */
export function markingWorldPlazaLitCampfireHeatTileForTest(
  tileX: number,
  tileY: number,
  fuelWoodCount = 1
): void {
  litCampfireFuelWoodByTile = new Map([
    [
      formattingWorldPlazaLitCampfireHeatTileKey(tileX, tileY),
      Math.max(0, fuelWoodCount),
    ],
  ]);
  litCampfireHeatTilesCacheKey =
    rebuildingWorldPlazaLitCampfireHeatTilesCacheKey(litCampfireFuelWoodByTile);
}
