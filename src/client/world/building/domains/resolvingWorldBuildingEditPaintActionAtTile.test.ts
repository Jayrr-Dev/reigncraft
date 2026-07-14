import { creatingWorldBuildingPlot } from '@/components/world/building/domains/definingWorldBuildingPlot';
import { resolvingWorldBuildingEditPaintActionAtTile } from '@/components/world/building/domains/resolvingWorldBuildingEditPaintActionAtTile';
import { describe, expect, it } from 'vitest';

const OWNER_USER_ID = 'owner-1';

const ownedPlot = creatingWorldBuildingPlot({
  plotId: 'plot-1',
  ownerId: OWNER_USER_ID,
  bounds: {
    minTileX: 0,
    maxTileX: 0,
    minTileY: 0,
    maxTileY: 0,
  },
  createdAt: '2026-01-01T00:00:00.000Z',
});

describe('resolvingWorldBuildingEditPaintActionAtTile', () => {
  it('returns claim only when claim tool is selected on free tile', () => {
    expect(
      resolvingWorldBuildingEditPaintActionAtTile({
        editMode: 'claim',
        tilePosition: { tileX: 1, tileY: 0 },
        activeViewportPlots: [ownedPlot],
        ownerUserId: OWNER_USER_ID,
        isBuildPlacementSelectionActive: false,
        canPlaceAtTile: false,
        canRemoveAtTile: false,
        selectedClaimPaintAction: 'claim',
        selectedBuildPaintAction: null,
      })
    ).toBe('claim');
  });

  it('returns null when claim tool is selected on owned tile', () => {
    expect(
      resolvingWorldBuildingEditPaintActionAtTile({
        editMode: 'claim',
        tilePosition: { tileX: 0, tileY: 0 },
        activeViewportPlots: [ownedPlot],
        ownerUserId: OWNER_USER_ID,
        isBuildPlacementSelectionActive: false,
        canPlaceAtTile: false,
        canRemoveAtTile: false,
        selectedClaimPaintAction: 'claim',
        selectedBuildPaintAction: null,
      })
    ).toBeNull();
  });

  it('returns unclaim only when unclaim tool is selected on owned tile', () => {
    expect(
      resolvingWorldBuildingEditPaintActionAtTile({
        editMode: 'claim',
        tilePosition: { tileX: 0, tileY: 0 },
        activeViewportPlots: [ownedPlot],
        ownerUserId: OWNER_USER_ID,
        isBuildPlacementSelectionActive: false,
        canPlaceAtTile: false,
        canRemoveAtTile: false,
        selectedClaimPaintAction: 'unclaim',
        selectedBuildPaintAction: null,
      })
    ).toBe('unclaim');
  });

  it('returns null when no claim paint tool is selected', () => {
    expect(
      resolvingWorldBuildingEditPaintActionAtTile({
        editMode: 'claim',
        tilePosition: { tileX: 1, tileY: 0 },
        activeViewportPlots: [ownedPlot],
        ownerUserId: OWNER_USER_ID,
        isBuildPlacementSelectionActive: false,
        canPlaceAtTile: false,
        canRemoveAtTile: false,
        selectedClaimPaintAction: null,
        selectedBuildPaintAction: null,
      })
    ).toBeNull();
  });

  it('returns place only when place tool is selected and placement is ready', () => {
    expect(
      resolvingWorldBuildingEditPaintActionAtTile({
        editMode: 'build',
        tilePosition: { tileX: 0, tileY: 0 },
        activeViewportPlots: [ownedPlot],
        ownerUserId: OWNER_USER_ID,
        isBuildPlacementSelectionActive: true,
        canPlaceAtTile: true,
        canRemoveAtTile: true,
        selectedClaimPaintAction: null,
        selectedBuildPaintAction: 'place',
      })
    ).toBe('place');
  });

  it('returns null when place tool is selected but placement is not ready', () => {
    expect(
      resolvingWorldBuildingEditPaintActionAtTile({
        editMode: 'build',
        tilePosition: { tileX: 0, tileY: 0 },
        activeViewportPlots: [ownedPlot],
        ownerUserId: OWNER_USER_ID,
        isBuildPlacementSelectionActive: false,
        canPlaceAtTile: true,
        canRemoveAtTile: true,
        selectedClaimPaintAction: null,
        selectedBuildPaintAction: 'place',
      })
    ).toBeNull();
  });

  it('returns remove only when remove tool is selected on removable tile', () => {
    expect(
      resolvingWorldBuildingEditPaintActionAtTile({
        editMode: 'build',
        tilePosition: { tileX: 0, tileY: 0 },
        activeViewportPlots: [ownedPlot],
        ownerUserId: OWNER_USER_ID,
        isBuildPlacementSelectionActive: true,
        canPlaceAtTile: true,
        canRemoveAtTile: true,
        selectedClaimPaintAction: null,
        selectedBuildPaintAction: 'remove',
      })
    ).toBe('remove');
  });

  it('returns null when no build paint tool is selected', () => {
    expect(
      resolvingWorldBuildingEditPaintActionAtTile({
        editMode: 'build',
        tilePosition: { tileX: 0, tileY: 0 },
        activeViewportPlots: [ownedPlot],
        ownerUserId: OWNER_USER_ID,
        isBuildPlacementSelectionActive: true,
        canPlaceAtTile: true,
        canRemoveAtTile: true,
        selectedClaimPaintAction: null,
        selectedBuildPaintAction: null,
      })
    ).toBeNull();
  });
});
