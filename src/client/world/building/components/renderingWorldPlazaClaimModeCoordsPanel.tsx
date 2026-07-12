'use client';

import {
  DEFINING_WORLD_BUILDING_CLAIM_MODE_SAVE_BUTTON_CLASS_NAME,
  DEFINING_WORLD_BUILDING_CLAIM_MODE_SECTION_LABEL_CLASS_NAME,
} from '@/components/world/building/domains/definingWorldBuildingClaimModeConstants';
import type { DefiningWorldBuildingTilePosition } from '@/components/world/building/domains/definingWorldBuildingTilePosition';
import { STYLING_WORLD_PLAZA_BUILD_MODE_FUNCTION_TOOLS_STATUS_CLASS_NAME } from '@/components/world/building/domains/definingWorldPlazaBuildModeFunctionHotbarConstants';
import { LABELING_WORLD_PLAZA_CLAIM_MODE_COORDS_HOVER_HINT } from '@/components/world/building/domains/definingWorldPlazaClaimModeFunctionRegistry';
import { DEFINING_WORLD_PLAZA_UI_DATA_ATTRIBUTE } from '@/components/world/domains/definingWorldPlazaClickMovementConstants';
import { LABELING_WORLD_PLAZA_SAVED_COORDS_SAVE_AT_CAPACITY_BUTTON } from '@/components/world/domains/definingWorldPlazaSavedCoordsListUiConstants';

/** Save coords button label. */
const RENDERING_WORLD_PLAZA_CLAIM_MODE_COORDS_SAVE_LABEL =
  'Save Coords' as const;

export type RenderingWorldPlazaClaimModeCoordsPanelProps = {
  readonly hoverTilePosition: DefiningWorldBuildingTilePosition | null;
  readonly isSavingCoords: boolean;
  readonly canSaveMoreCoords: boolean;
  readonly onSaveCoordsAtHoverTile: () => void;
};

/**
 * Claim-mode Coords popover: save the hovered tile as a bookmark.
 */
export function RenderingWorldPlazaClaimModeCoordsPanel({
  hoverTilePosition,
  isSavingCoords,
  canSaveMoreCoords,
  onSaveCoordsAtHoverTile,
}: RenderingWorldPlazaClaimModeCoordsPanelProps): React.JSX.Element {
  const canSaveCoordsAtHoverTile = hoverTilePosition !== null;

  return (
    <div className="flex flex-col gap-1.5">
      <p
        className={DEFINING_WORLD_BUILDING_CLAIM_MODE_SECTION_LABEL_CLASS_NAME}
      >
        Bookmark
      </p>
      <p
        className={
          STYLING_WORLD_PLAZA_BUILD_MODE_FUNCTION_TOOLS_STATUS_CLASS_NAME
        }
      >
        {canSaveCoordsAtHoverTile
          ? `Tile ${hoverTilePosition.tileX}, ${hoverTilePosition.tileY}`
          : LABELING_WORLD_PLAZA_CLAIM_MODE_COORDS_HOVER_HINT}
      </p>
      <button
        type="button"
        {...{ [DEFINING_WORLD_PLAZA_UI_DATA_ATTRIBUTE]: true }}
        disabled={
          isSavingCoords || !canSaveMoreCoords || !canSaveCoordsAtHoverTile
        }
        onClick={onSaveCoordsAtHoverTile}
        className={DEFINING_WORLD_BUILDING_CLAIM_MODE_SAVE_BUTTON_CLASS_NAME}
      >
        {isSavingCoords
          ? 'Saving...'
          : !canSaveMoreCoords
            ? LABELING_WORLD_PLAZA_SAVED_COORDS_SAVE_AT_CAPACITY_BUTTON
            : RENDERING_WORLD_PLAZA_CLAIM_MODE_COORDS_SAVE_LABEL}
      </button>
    </div>
  );
}
