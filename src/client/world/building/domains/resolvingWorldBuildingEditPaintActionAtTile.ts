import {
  DEFINING_WORLD_BUILDING_EDIT_MODE_BUILD,
  DEFINING_WORLD_BUILDING_EDIT_MODE_CLAIM,
  type DefiningWorldBuildingEditMode,
  type DefiningWorldBuildingEditPaintAction,
} from '@/components/world/building/domains/definingWorldBuildingEditMode';
import {
  findingWorldBuildingPlotContainingTilePosition,
  type DefiningWorldBuildingPlot,
} from '@/components/world/building/domains/definingWorldBuildingPlot';
import type { DefiningWorldBuildingTilePosition } from '@/components/world/building/domains/definingWorldBuildingTilePosition';

/**
 * Picks the sticky hold-to-paint action from the tile under the pointer.
 *
 * @module components/world/building/domains/resolvingWorldBuildingEditPaintActionAtTile
 */

export type ResolvingWorldBuildingEditPaintActionAtTileInput = {
  readonly editMode: DefiningWorldBuildingEditMode;
  readonly tilePosition: DefiningWorldBuildingTilePosition;
  readonly activeViewportPlots: readonly DefiningWorldBuildingPlot[];
  readonly ownerUserId: string;
  readonly isBuildPlacementSelectionActive: boolean;
  readonly canPlaceAtTile: boolean;
  readonly canRemoveAtTile: boolean;
  /** Selected claim hotbar paint tool; required for claim-mode painting. */
  readonly selectedClaimPaintAction: 'claim' | 'unclaim' | null;
  /** Selected build hotbar paint tool; required for build-mode painting. */
  readonly selectedBuildPaintAction: 'place' | 'remove' | null;
};

/**
 * Resolves claim/unclaim or place/remove from the first painted tile.
 */
export function resolvingWorldBuildingEditPaintActionAtTile(
  input: ResolvingWorldBuildingEditPaintActionAtTileInput
): DefiningWorldBuildingEditPaintAction | null {
  const {
    editMode,
    tilePosition,
    activeViewportPlots,
    ownerUserId,
    isBuildPlacementSelectionActive,
    canPlaceAtTile,
    canRemoveAtTile,
    selectedClaimPaintAction,
    selectedBuildPaintAction,
  } = input;

  if (editMode === DEFINING_WORLD_BUILDING_EDIT_MODE_CLAIM) {
    if (selectedClaimPaintAction === null) {
      return null;
    }

    const existingPlot = findingWorldBuildingPlotContainingTilePosition(
      activeViewportPlots,
      tilePosition
    );
    const ownsTile = existingPlot?.ownerId === ownerUserId;

    if (selectedClaimPaintAction === 'claim') {
      return ownsTile ? null : 'claim';
    }

    return ownsTile ? 'unclaim' : null;
  }

  if (editMode === DEFINING_WORLD_BUILDING_EDIT_MODE_BUILD) {
    if (selectedBuildPaintAction === 'place') {
      if (isBuildPlacementSelectionActive && canPlaceAtTile) {
        return 'place';
      }

      return null;
    }

    if (selectedBuildPaintAction === 'remove') {
      return canRemoveAtTile ? 'remove' : null;
    }
  }

  return null;
}
