'use client';

import {
  DEFINING_WORLD_BUILDING_CLAIM_MODE_OWNER_GROUP_CLASS_NAME,
  DEFINING_WORLD_BUILDING_CLAIM_MODE_SAVE_BUTTON_CLASS_NAME,
  DEFINING_WORLD_BUILDING_CLAIM_MODE_SECTION_LABEL_CLASS_NAME,
} from '@/components/world/building/domains/definingWorldBuildingClaimModeConstants';
import type { DefiningWorldBuildingTilePosition } from '@/components/world/building/domains/definingWorldBuildingTilePosition';
import { STYLING_WORLD_PLAZA_BUILD_MODE_FUNCTION_TOOLS_STATUS_CLASS_NAME } from '@/components/world/building/domains/definingWorldPlazaBuildModeFunctionHotbarConstants';
import {
  LABELING_WORLD_PLAZA_CLAIM_MODE_COORDS_CANCEL_PLACEMENT,
  LABELING_WORLD_PLAZA_CLAIM_MODE_COORDS_HOVER_HINT,
  LABELING_WORLD_PLAZA_CLAIM_MODE_COORDS_PLACEMENT_HINT,
} from '@/components/world/building/domains/definingWorldPlazaClaimModeFunctionRegistry';
import { DEFINING_WORLD_PLAZA_UI_DATA_ATTRIBUTE } from '@/components/world/domains/definingWorldPlazaClickMovementConstants';
import { LABELING_WORLD_PLAZA_SAVED_COORDS_SAVE_AT_CAPACITY_BUTTON } from '@/components/world/domains/definingWorldPlazaSavedCoordsListUiConstants';
import { cn } from '@/lib/utils';

/** Save coords button label before placement is armed. */
const RENDERING_WORLD_PLAZA_CLAIM_MODE_COORDS_SAVE_LABEL =
  'Save Coords' as const;

export type RenderingWorldPlazaClaimModeCoordsPanelProps = {
  readonly hoverTilePosition: DefiningWorldBuildingTilePosition | null;
  readonly isSavingCoords: boolean;
  readonly canSaveMoreCoords: boolean;
  readonly isSaveCoordsPlacementActive: boolean;
  readonly onStartSaveCoordsPlacement: () => void;
  readonly onCancelSaveCoordsPlacement: () => void;
};

/**
 * Claim-mode Saves popover: arm map placement, then click a tile to bookmark it.
 */
export function RenderingWorldPlazaClaimModeCoordsPanel({
  hoverTilePosition,
  isSavingCoords,
  canSaveMoreCoords,
  isSaveCoordsPlacementActive,
  onStartSaveCoordsPlacement,
  onCancelSaveCoordsPlacement,
}: RenderingWorldPlazaClaimModeCoordsPanelProps): React.JSX.Element {
  const statusText = isSaveCoordsPlacementActive
    ? hoverTilePosition !== null
      ? `Tile ${hoverTilePosition.tileX}, ${hoverTilePosition.tileY}. Click to save`
      : LABELING_WORLD_PLAZA_CLAIM_MODE_COORDS_PLACEMENT_HINT
    : LABELING_WORLD_PLAZA_CLAIM_MODE_COORDS_HOVER_HINT;

  return (
    <div
      className={cn(
        DEFINING_WORLD_BUILDING_CLAIM_MODE_OWNER_GROUP_CLASS_NAME,
        'flex flex-col gap-1.5'
      )}
    >
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
        {statusText}
      </p>
      <button
        type="button"
        {...{ [DEFINING_WORLD_PLAZA_UI_DATA_ATTRIBUTE]: true }}
        disabled={
          isSavingCoords || (!isSaveCoordsPlacementActive && !canSaveMoreCoords)
        }
        onClick={() => {
          if (isSaveCoordsPlacementActive) {
            onCancelSaveCoordsPlacement();
            return;
          }

          onStartSaveCoordsPlacement();
        }}
        className={DEFINING_WORLD_BUILDING_CLAIM_MODE_SAVE_BUTTON_CLASS_NAME}
      >
        {isSavingCoords
          ? 'Saving...'
          : isSaveCoordsPlacementActive
            ? LABELING_WORLD_PLAZA_CLAIM_MODE_COORDS_CANCEL_PLACEMENT
            : !canSaveMoreCoords
              ? LABELING_WORLD_PLAZA_SAVED_COORDS_SAVE_AT_CAPACITY_BUTTON
              : RENDERING_WORLD_PLAZA_CLAIM_MODE_COORDS_SAVE_LABEL}
      </button>
    </div>
  );
}
