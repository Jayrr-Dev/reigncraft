import { buildingWorldPlazaLitCampfireTileKeysFromFireCells } from '@/components/world/fire/domains/buildingWorldPlazaLitCampfireTileKeysFromFireCells';
import { formattingWorldPlazaLitCampfireHeatTileKey } from '@/components/world/fire/domains/managingWorldPlazaLitCampfireHeatTilesStore';
import { describe, expect, it } from 'vitest';
import type { WorldFireDevvitCell } from '../../../../shared/worldFireDevvit';

function creatingWorldPlazaCampfireFireCellForTest(
  overrides: Partial<WorldFireDevvitCell> &
    Pick<WorldFireDevvitCell, 'tileX' | 'tileY'>
): WorldFireDevvitCell {
  return {
    worldLayer: 1,
    kind: 'campfire',
    ignitedAtMs: 0,
    fuelRemainingMs: 60_000,
    initialFuelMs: 60_000,
    intensity: 1,
    ...overrides,
  };
}

describe('buildingWorldPlazaLitCampfireTileKeysFromFireCells', () => {
  it('includes campfire cells with remaining fuel as 2D tile keys', () => {
    const keys = buildingWorldPlazaLitCampfireTileKeysFromFireCells([
      creatingWorldPlazaCampfireFireCellForTest({ tileX: 3, tileY: 4 }),
    ]);

    expect(keys.has(formattingWorldPlazaLitCampfireHeatTileKey(3, 4))).toBe(
      true
    );
  });

  it('excludes spreading fire and empty-fuel campfires', () => {
    const keys = buildingWorldPlazaLitCampfireTileKeysFromFireCells([
      creatingWorldPlazaCampfireFireCellForTest({
        tileX: 1,
        tileY: 1,
        kind: 'spreading',
      }),
      creatingWorldPlazaCampfireFireCellForTest({
        tileX: 2,
        tileY: 2,
        fuelRemainingMs: 0,
      }),
    ]);

    expect(keys.size).toBe(0);
  });
});
