"use client";

import { RenderingWorldPlazaBlockPalette } from "@/components/world/building/components/renderingWorldPlazaBlockPalette";
import { RenderingWorldPlazaBuildModePresetBlockTypeSelector } from "@/components/world/building/components/renderingWorldPlazaBuildModePresetBlockTypeSelector";
import { RenderingWorldPlazaBuildModeCutFootprintSelector } from "@/components/world/building/components/renderingWorldPlazaBuildModeCutFootprintSelector";
import { RenderingWorldPlazaBuildModeLayerSelector } from "@/components/world/building/components/renderingWorldPlazaBuildModeLayerSelector";
import { RenderingWorldPlazaSidebarPanelHeader } from "@/components/world/components/renderingWorldPlazaSidebarPanelHeader";
import type { DefiningWorldBuildingBlockDefinitionId } from "@/components/world/building/domains/definingWorldBuildingBlockDefinition";
import type { DefiningWorldBuildingCutGridAxisCellCount } from "@/components/world/building/domains/definingWorldBuildingCutFootprintConstants";
import {
  DEFINING_WORLD_BUILDING_BUILD_MODE_SIDEBAR_ANCHOR_CLASS_NAME,
  DEFINING_WORLD_BUILDING_BUILD_MODE_SIDEBAR_CLASS_NAME,
  DEFINING_WORLD_BUILDING_BUILD_MODE_SIDEBAR_WIDTH_CLASS_NAME,
  DEFINING_WORLD_BUILDING_DEV_CLEAR_ALL_BUTTON_CLASS_NAME,
  DEFINING_WORLD_BUILDING_DEV_CLEAR_ALL_BUTTON_LABEL,
  DEFINING_WORLD_BUILDING_ERROR_TEXT_CLASS_NAME,
  DEFINING_WORLD_BUILDING_SAVE_DRAFT_BUTTON_CLASS_NAME,
  DEFINING_WORLD_BUILDING_UNSAVED_DRAFT_BADGE_CLASS_NAME,
} from "@/components/world/building/domains/definingWorldBuildingBuildModeConstants";
import { DEFINING_WORLD_BUILDING_BUILD_MODE_TOGGLE_KEY } from "@/components/world/building/domains/definingWorldBuildingPlotConstants";
import { DEFINING_WORLD_PLAZA_UI_DATA_ATTRIBUTE } from "@/components/world/domains/definingWorldPlazaClickMovementConstants";

/** Sidebar header classes. */
const RENDERING_WORLD_PLAZA_BUILD_MODE_SIDEBAR_HEADER_CLASS_NAME =
  "text-[10px] font-semibold uppercase tracking-wide text-[#f4d35e]" as const;

/** Build mode sidebar title label. */
const RENDERING_WORLD_PLAZA_BUILD_MODE_SIDEBAR_TITLE = "Build" as const;

/** Accessible label for saving the build draft. */
const RENDERING_WORLD_PLAZA_SAVE_BUILD_DRAFT_BUTTON_LABEL =
  "Save build changes" as const;

export interface RenderingWorldPlazaBuildModePanelProps {
  isBlockBuildModeActive: boolean;
  selectedDefinitionId: DefiningWorldBuildingBlockDefinitionId | null;
  selectedWorldLayer: number;
  selectedBlockHeight: number;
  isPresetBlockTypeSelected: boolean;
  selectedCutFootprintMask: number;
  selectedCutGridAxisCellCount: DefiningWorldBuildingCutGridAxisCellCount;
  buildErrorMessage: string | null;
  hasUnsavedBuildChanges: boolean;
  isSavingBuildDraft: boolean;
  isLocalhostDevEnvironment: boolean;
  isClearingAllDevPlacedObjects: boolean;
  onToggleBuildMode: () => void;
  onSelectDefinition: (
    definitionId: DefiningWorldBuildingBlockDefinitionId,
  ) => void;
  onSelectWorldLayer: (worldLayer: number) => void;
  onSelectBlockHeight: (blockHeight: number) => void;
  onSelectCutFootprintMask: (cutFootprintMask: number) => void;
  onSelectCutGridAxisCellCount: (
    axisCellCount: DefiningWorldBuildingCutGridAxisCellCount,
  ) => void;
  onSaveBuildDraft: () => void;
  onClearAllDevPlacedObjects: () => void;
}

/**
 * Compact build mode controls in a right-side sidebar.
 */
export function RenderingWorldPlazaBuildModePanel({
  isBlockBuildModeActive,
  selectedDefinitionId,
  selectedWorldLayer,
  selectedBlockHeight,
  isPresetBlockTypeSelected,
  selectedCutFootprintMask,
  selectedCutGridAxisCellCount,
  buildErrorMessage,
  hasUnsavedBuildChanges,
  isSavingBuildDraft,
  isLocalhostDevEnvironment,
  isClearingAllDevPlacedObjects,
  onToggleBuildMode,
  onSelectDefinition,
  onSelectWorldLayer,
  onSelectBlockHeight,
  onSelectCutFootprintMask,
  onSelectCutGridAxisCellCount,
  onSaveBuildDraft,
  onClearAllDevPlacedObjects,
}: RenderingWorldPlazaBuildModePanelProps): React.JSX.Element | null {
  const renderingLocalhostDevClearAllButton = isLocalhostDevEnvironment ? (
    <button
      type="button"
      disabled={isClearingAllDevPlacedObjects}
      onClick={onClearAllDevPlacedObjects}
      className={DEFINING_WORLD_BUILDING_DEV_CLEAR_ALL_BUTTON_CLASS_NAME}
    >
      {isClearingAllDevPlacedObjects
        ? "Clearing..."
        : DEFINING_WORLD_BUILDING_DEV_CLEAR_ALL_BUTTON_LABEL}
    </button>
  ) : null;

  if (!isBlockBuildModeActive) {
    return null;
  }

  return (
    <div
      className={`${DEFINING_WORLD_BUILDING_BUILD_MODE_SIDEBAR_ANCHOR_CLASS_NAME} ${DEFINING_WORLD_BUILDING_BUILD_MODE_SIDEBAR_WIDTH_CLASS_NAME}`}
    >
      <div
        {...{ [DEFINING_WORLD_PLAZA_UI_DATA_ATTRIBUTE]: true }}
        className={`${DEFINING_WORLD_BUILDING_BUILD_MODE_SIDEBAR_CLASS_NAME} ${DEFINING_WORLD_BUILDING_BUILD_MODE_SIDEBAR_WIDTH_CLASS_NAME}`}
      >
        <RenderingWorldPlazaSidebarPanelHeader
          panelTitle={RENDERING_WORLD_PLAZA_BUILD_MODE_SIDEBAR_TITLE}
          shortcutKey={DEFINING_WORLD_BUILDING_BUILD_MODE_TOGGLE_KEY}
          titleClassName={RENDERING_WORLD_PLAZA_BUILD_MODE_SIDEBAR_HEADER_CLASS_NAME}
          onExit={onToggleBuildMode}
          exitAriaLabel="Exit build mode"
          titleTrailing={
            hasUnsavedBuildChanges ? (
              <span
                className={DEFINING_WORLD_BUILDING_UNSAVED_DRAFT_BADGE_CLASS_NAME}
              >
                Unsaved
              </span>
            ) : null
          }
        />

        <RenderingWorldPlazaBuildModeLayerSelector
          selectedWorldLayer={selectedWorldLayer}
          onSelectWorldLayer={onSelectWorldLayer}
        />

        <RenderingWorldPlazaBuildModePresetBlockTypeSelector
          selectedWorldLayer={selectedWorldLayer}
          selectedBlockHeight={selectedBlockHeight}
          isPresetBlockTypeSelected={isPresetBlockTypeSelected}
          onSelectBlockHeight={onSelectBlockHeight}
        />

        <RenderingWorldPlazaBuildModeCutFootprintSelector
          selectedCutGridAxisCellCount={selectedCutGridAxisCellCount}
          selectedCutFootprintMask={selectedCutFootprintMask}
          onChangeCutGridAxisCellCount={onSelectCutGridAxisCellCount}
          onChangeCutFootprintMask={onSelectCutFootprintMask}
        />

        <RenderingWorldPlazaBlockPalette
          selectedDefinitionId={selectedDefinitionId}
          onSelectDefinition={onSelectDefinition}
        />

        <div className="mt-auto flex flex-col gap-1 border-t border-white/10 pt-2">
          <button
            type="button"
            aria-label={RENDERING_WORLD_PLAZA_SAVE_BUILD_DRAFT_BUTTON_LABEL}
            disabled={!hasUnsavedBuildChanges || isSavingBuildDraft}
            onClick={onSaveBuildDraft}
            className={DEFINING_WORLD_BUILDING_SAVE_DRAFT_BUTTON_CLASS_NAME}
          >
            {isSavingBuildDraft ? "Saving..." : "Save"}
          </button>
          {buildErrorMessage ? (
            <p className={DEFINING_WORLD_BUILDING_ERROR_TEXT_CLASS_NAME}>
              {buildErrorMessage}
            </p>
          ) : null}
          {renderingLocalhostDevClearAllButton}
        </div>
      </div>
    </div>
  );
}
