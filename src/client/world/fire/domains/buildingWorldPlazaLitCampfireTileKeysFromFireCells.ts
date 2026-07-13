import { formattingWorldPlazaLitCampfireHeatTileKey } from '@/components/world/fire/domains/managingWorldPlazaLitCampfireHeatTilesStore';
import type { WorldFireDevvitCell } from '../../../../shared/worldFireDevvit';

/**
 * Builds 2D tile → inventory fuel-wood counts for campfires that are lit.
 *
 * Any world-layer campfire with fuel counts; environmental heat is sampled in
 * tile X/Y only. Same X/Y on multiple layers keeps the higher wood count.
 */
export function buildingWorldPlazaLitCampfireTileKeysFromFireCells(
  fireCells: readonly WorldFireDevvitCell[]
): ReadonlyMap<string, number> {
  const litCampfireFuelWoodByTile = new Map<string, number>();

  for (const cell of fireCells) {
    if (
      cell.kind !== 'campfire' ||
      !Number.isFinite(cell.fuelRemainingMs) ||
      cell.fuelRemainingMs <= 0
    ) {
      continue;
    }

    const tileKey = formattingWorldPlazaLitCampfireHeatTileKey(
      cell.tileX,
      cell.tileY
    );
    const fuelWoodCount = Math.max(0, cell.inventoryFuelWoodCount ?? 0);
    const existingFuelWoodCount = litCampfireFuelWoodByTile.get(tileKey) ?? 0;

    if (fuelWoodCount >= existingFuelWoodCount) {
      litCampfireFuelWoodByTile.set(tileKey, fuelWoodCount);
    }
  }

  return litCampfireFuelWoodByTile;
}
