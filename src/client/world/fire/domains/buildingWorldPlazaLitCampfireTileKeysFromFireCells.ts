import { formattingWorldPlazaLitCampfireHeatTileKey } from '@/components/world/fire/domains/managingWorldPlazaLitCampfireHeatTilesStore';
import type { WorldFireDevvitCell } from '../../../../shared/worldFireDevvit';

/**
 * Builds 2D tile keys for campfires that are currently lit.
 *
 * Any world-layer campfire with fuel counts; environmental heat is sampled in
 * tile X/Y only.
 */
export function buildingWorldPlazaLitCampfireTileKeysFromFireCells(
  fireCells: readonly WorldFireDevvitCell[]
): ReadonlySet<string> {
  const litCampfireTileKeys = new Set<string>();

  for (const cell of fireCells) {
    if (cell.kind !== 'campfire' || cell.fuelRemainingMs <= 0) {
      continue;
    }

    litCampfireTileKeys.add(
      formattingWorldPlazaLitCampfireHeatTileKey(cell.tileX, cell.tileY)
    );
  }

  return litCampfireTileKeys;
}
