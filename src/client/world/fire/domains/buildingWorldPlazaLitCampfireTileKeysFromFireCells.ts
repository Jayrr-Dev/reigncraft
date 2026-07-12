import {
  buildingWorldFireDevvitTileKey,
  type WorldFireDevvitCell,
} from '../../../../shared/worldFireDevvit';

/**
 * Builds the set of fire-tile keys for campfires that are currently lit.
 *
 * Keys match {@link buildingWorldFireDevvitTileKey} so temperature sampling can
 * gate campfire heat on the same identity as fire cells.
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
      buildingWorldFireDevvitTileKey(cell.tileX, cell.tileY, cell.worldLayer)
    );
  }

  return litCampfireTileKeys;
}
