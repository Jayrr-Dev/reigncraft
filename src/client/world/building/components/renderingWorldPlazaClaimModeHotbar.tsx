"use client";

import {
  DEFINING_WORLD_BUILDING_CLAIM_MODE_CAPACITY_BADGE_BASE_CLASS_NAME,
  DEFINING_WORLD_BUILDING_CLAIM_MODE_CAPACITY_BADGE_LABEL_CLASS_NAME,
  DEFINING_WORLD_BUILDING_CLAIM_MODE_CAPACITY_BADGE_ROW_CLASS_NAME,
  DEFINING_WORLD_BUILDING_CLAIM_MODE_CAPACITY_BADGE_VALUE_CLASS_NAME,
  DEFINING_WORLD_BUILDING_CLAIM_MODE_ERROR_TEXT_CLASS_NAME,
  DEFINING_WORLD_BUILDING_CLAIM_MODE_LEGEND_CLAIMABLE_SWATCH_CLASS_NAME,
  DEFINING_WORLD_BUILDING_CLAIM_MODE_LEGEND_LABEL_CLASS_NAME,
  DEFINING_WORLD_BUILDING_CLAIM_MODE_LEGEND_OWNED_SWATCH_CLASS_NAME,
  DEFINING_WORLD_BUILDING_CLAIM_MODE_LEGEND_TEMPORARY_SWATCH_CLASS_NAME,
  DEFINING_WORLD_BUILDING_CLAIM_MODE_SAVE_BUTTON_CLASS_NAME,
} from "@/components/world/building/domains/definingWorldBuildingClaimModeConstants";
import type { DefiningWorldBuildingPlotOwnerLimits } from "@/components/world/building/domains/definingWorldBuildingPlotOwnerLimits";
import type { DefiningWorldBuildingTilePosition } from "@/components/world/building/domains/definingWorldBuildingTilePosition";
import {
  LABELING_WORLD_PLAZA_CLAIM_MODE_HOTBAR,
  STYLING_WORLD_PLAZA_EDIT_MODE_HOTBAR_ANCHOR_CLASS_NAME,
  STYLING_WORLD_PLAZA_EDIT_MODE_HOTBAR_SHELL_CLASS_NAME,
} from "@/components/world/building/domains/definingWorldPlazaEditModeHotbarConstants";
import { DEFINING_WORLD_PLAZA_UI_DATA_ATTRIBUTE } from "@/components/world/domains/definingWorldPlazaClickMovementConstants";
import { LABELING_WORLD_PLAZA_SAVED_COORDS_SAVE_AT_CAPACITY_BUTTON } from "@/components/world/domains/definingWorldPlazaSavedCoordsListUiConstants";
import { cn } from "@/lib/utils";

/** Legend row inside the claim hotbar. */
const RENDERING_WORLD_PLAZA_CLAIM_MODE_HOTBAR_LEGEND_ROW_CLASS_NAME =
  "flex flex-wrap items-center gap-x-3 gap-y-1" as const;

/** Single legend item row. */
const RENDERING_WORLD_PLAZA_CLAIM_MODE_HOTBAR_LEGEND_ITEM_CLASS_NAME =
  "flex items-center gap-1" as const;

/** Primary controls row. */
const RENDERING_WORLD_PLAZA_CLAIM_MODE_HOTBAR_CONTROLS_ROW_CLASS_NAME =
  "flex min-w-0 flex-wrap items-center justify-between gap-2" as const;

/** Hint text for one-click claiming. */
const RENDERING_WORLD_PLAZA_CLAIM_MODE_HOTBAR_HINT =
  "Click a tile to claim or unclaim" as const;

/** Save coords button label. */
const RENDERING_WORLD_PLAZA_CLAIM_MODE_HOTBAR_SAVE_COORDS_LABEL =
  "Save Coords" as const;

/** Auto-save status line classes. */
const RENDERING_WORLD_PLAZA_CLAIM_MODE_HOTBAR_STATUS_CLASS_NAME =
  "text-[9px] font-medium text-white/50" as const;

export interface RenderingWorldPlazaClaimModeHotbarProps {
  isVisible: boolean;
  localOwnedPlotCount: number;
  localTileClaimCount: number;
  plotOwnerLimits: DefiningWorldBuildingPlotOwnerLimits;
  hoverTilePosition: DefiningWorldBuildingTilePosition | null;
  claimErrorMessage: string | null;
  isSavingClaimDraft: boolean;
  isSavingCoords: boolean;
  canSaveMoreCoords: boolean;
  onSaveCoordsAtHoverTile: () => void;
}

/**
 * Bottom-center claim controls shown in place of the inventory hotbar.
 */
export function RenderingWorldPlazaClaimModeHotbar({
  isVisible,
  localOwnedPlotCount,
  localTileClaimCount,
  plotOwnerLimits,
  hoverTilePosition,
  claimErrorMessage,
  isSavingClaimDraft,
  isSavingCoords,
  canSaveMoreCoords,
  onSaveCoordsAtHoverTile,
}: RenderingWorldPlazaClaimModeHotbarProps): React.JSX.Element | null {
  if (!isVisible) {
    return null;
  }

  const canSaveCoordsAtHoverTile = hoverTilePosition !== null;

  return (
    <div
      className={STYLING_WORLD_PLAZA_EDIT_MODE_HOTBAR_ANCHOR_CLASS_NAME}
      aria-label={LABELING_WORLD_PLAZA_CLAIM_MODE_HOTBAR}
    >
      <div
        {...{ [DEFINING_WORLD_PLAZA_UI_DATA_ATTRIBUTE]: true }}
        className={STYLING_WORLD_PLAZA_EDIT_MODE_HOTBAR_SHELL_CLASS_NAME}
      >
        <div className={RENDERING_WORLD_PLAZA_CLAIM_MODE_HOTBAR_CONTROLS_ROW_CLASS_NAME}>
          <div className={RENDERING_WORLD_PLAZA_CLAIM_MODE_HOTBAR_LEGEND_ROW_CLASS_NAME}>
            <div className={RENDERING_WORLD_PLAZA_CLAIM_MODE_HOTBAR_LEGEND_ITEM_CLASS_NAME}>
              <span
                aria-hidden
                className={DEFINING_WORLD_BUILDING_CLAIM_MODE_LEGEND_OWNED_SWATCH_CLASS_NAME}
              />
              <span className={DEFINING_WORLD_BUILDING_CLAIM_MODE_LEGEND_LABEL_CLASS_NAME}>
                Yours
              </span>
            </div>
            <div className={RENDERING_WORLD_PLAZA_CLAIM_MODE_HOTBAR_LEGEND_ITEM_CLASS_NAME}>
              <span
                aria-hidden
                className={DEFINING_WORLD_BUILDING_CLAIM_MODE_LEGEND_CLAIMABLE_SWATCH_CLASS_NAME}
              />
              <span className={DEFINING_WORLD_BUILDING_CLAIM_MODE_LEGEND_LABEL_CLASS_NAME}>
                Claimable
              </span>
            </div>
            <div className={RENDERING_WORLD_PLAZA_CLAIM_MODE_HOTBAR_LEGEND_ITEM_CLASS_NAME}>
              <span
                aria-hidden
                className={DEFINING_WORLD_BUILDING_CLAIM_MODE_LEGEND_TEMPORARY_SWATCH_CLASS_NAME}
              />
              <span className={DEFINING_WORLD_BUILDING_CLAIM_MODE_LEGEND_LABEL_CLASS_NAME}>
                Temp
              </span>
            </div>
          </div>

          <div className={DEFINING_WORLD_BUILDING_CLAIM_MODE_CAPACITY_BADGE_ROW_CLASS_NAME}>
            <div
              className={cn(
                DEFINING_WORLD_BUILDING_CLAIM_MODE_CAPACITY_BADGE_BASE_CLASS_NAME,
                "border-sky-300/30 bg-sky-400/10",
              )}
            >
              <span
                className={DEFINING_WORLD_BUILDING_CLAIM_MODE_CAPACITY_BADGE_LABEL_CLASS_NAME}
              >
                Plots
              </span>
              <span
                className={DEFINING_WORLD_BUILDING_CLAIM_MODE_CAPACITY_BADGE_VALUE_CLASS_NAME}
              >
                {localOwnedPlotCount}/{plotOwnerLimits.maxOwnedPlotCount}
              </span>
            </div>
            <div
              className={cn(
                DEFINING_WORLD_BUILDING_CLAIM_MODE_CAPACITY_BADGE_BASE_CLASS_NAME,
                "border-emerald-300/30 bg-emerald-400/10",
              )}
            >
              <span
                className={DEFINING_WORLD_BUILDING_CLAIM_MODE_CAPACITY_BADGE_LABEL_CLASS_NAME}
              >
                Tiles
              </span>
              <span
                className={DEFINING_WORLD_BUILDING_CLAIM_MODE_CAPACITY_BADGE_VALUE_CLASS_NAME}
              >
                {localTileClaimCount}/{plotOwnerLimits.maxTileClaimCount}
              </span>
            </div>
          </div>

          <button
            type="button"
            disabled={
              isSavingCoords || !canSaveMoreCoords || !canSaveCoordsAtHoverTile
            }
            onClick={onSaveCoordsAtHoverTile}
            className={DEFINING_WORLD_BUILDING_CLAIM_MODE_SAVE_BUTTON_CLASS_NAME}
          >
            {isSavingCoords
              ? "Saving..."
              : !canSaveMoreCoords
                ? LABELING_WORLD_PLAZA_SAVED_COORDS_SAVE_AT_CAPACITY_BUTTON
                : RENDERING_WORLD_PLAZA_CLAIM_MODE_HOTBAR_SAVE_COORDS_LABEL}
          </button>
        </div>

        <div className="flex min-w-0 items-center justify-between gap-2">
          <p className={RENDERING_WORLD_PLAZA_CLAIM_MODE_HOTBAR_STATUS_CLASS_NAME}>
            {isSavingClaimDraft
              ? "Saving..."
              : RENDERING_WORLD_PLAZA_CLAIM_MODE_HOTBAR_HINT}
          </p>
          {claimErrorMessage ? (
            <p
              className={cn(
                DEFINING_WORLD_BUILDING_CLAIM_MODE_ERROR_TEXT_CLASS_NAME,
                "min-w-0 truncate text-right",
              )}
            >
              {claimErrorMessage}
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
