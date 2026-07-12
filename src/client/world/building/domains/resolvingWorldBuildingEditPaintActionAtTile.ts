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
  } = input;

  if (editMode === DEFINING_WORLD_BUILDING_EDIT_MODE_CLAIM) {
    const existingPlot = findingWorldBuildingPlotContainingTilePosition(
      activeViewportPlots,
      tilePosition
    );

    if (existingPlot?.ownerId === ownerUserId) {
      return 'unclaim';
    }

    return 'claim';
  }

  if (editMode === DEFINING_WORLD_BUILDING_EDIT_MODE_BUILD) {
    if (isBuildPlacementSelectionActive && canPlaceAtTile) {
      return 'place';
    }

    if (canRemoveAtTile) {
      return 'remove';
    }
  }

  return null;
}
