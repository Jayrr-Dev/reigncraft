"use client";

import { RenderingWorldPlazaBlockPalette } from "@/components/world/building/components/renderingWorldPlazaBlockPalette";
import { RenderingWorldPlazaBuildModeCutFootprintSelector } from "@/components/world/building/components/renderingWorldPlazaBuildModeCutFootprintSelector";
import { RenderingWorldPlazaBuildModeLayerSelector } from "@/components/world/building/components/renderingWorldPlazaBuildModeLayerSelector";
import { RenderingWorldPlazaBuildModePresetBlockTypeSelector } from "@/components/world/building/components/renderingWorldPlazaBuildModePresetBlockTypeSelector";
import {
  DEFINING_WORLD_BUILDING_ERROR_TEXT_CLASS_NAME,
} from "@/components/world/building/domains/definingWorldBuildingBuildModeConstants";
import type { DefiningWorldBuildingBlockDefinitionId } from "@/components/world/building/domains/definingWorldBuildingBlockDefinition";
import type { DefiningWorldBuildingCutGridAxisCellCount } from "@/components/world/building/domains/definingWorldBuildingCutFootprintConstants";
import {
  LABELING_WORLD_PLAZA_BUILD_MODE_HOTBAR,
  STYLING_WORLD_PLAZA_EDIT_MODE_HOTBAR_ANCHOR_CLASS_NAME,
  STYLING_WORLD_PLAZA_EDIT_MODE_HOTBAR_SHELL_CLASS_NAME,
} from "@/components/world/building/domains/definingWorldPlazaEditModeHotbarConstants";
import { DEFINING_WORLD_PLAZA_UI_DATA_ATTRIBUTE } from "@/components/world/domains/definingWorldPlazaClickMovementConstants";
import { cn } from "@/lib/utils";

/** Horizontal controls row inside the build hotbar. */
const RENDERING_WORLD_PLAZA_BUILD_MODE_HOTBAR_CONTROLS_ROW_CLASS_NAME =
  "flex min-w-0 flex-wrap items-start gap-2" as const;

/** Compact column for layer and preset pickers. */
const RENDERING_WORLD_PLAZA_BUILD_MODE_HOTBAR_SIDE_CONTROLS_CLASS_NAME =
  "flex shrink-0 flex-col gap-1.5" as const;

/** Scrollable palette region. */
const RENDERING_WORLD_PLAZA_BUILD_MODE_HOTBAR_PALETTE_REGION_CLASS_NAME =
  "min-w-0 flex-1 overflow-x-auto" as const;

/** Auto-save status line classes. */
const RENDERING_WORLD_PLAZA_BUILD_MODE_HOTBAR_STATUS_CLASS_NAME =
  "text-[9px] font-medium text-white/50" as const;

export interface RenderingWorldPlazaBuildModeHotbarProps {
  isVisible: boolean;
  selectedDefinitionId: DefiningWorldBuildingBlockDefinitionId | null;
  selectedWorldLayer: number;
  selectedBlockHeight: number;
  isPresetBlockTypeSelected: boolean;
  selectedCutFootprintMask: number;
  selectedCutGridAxisCellCount: DefiningWorldBuildingCutGridAxisCellCount;
  buildErrorMessage: string | null;
  isSavingBuildDraft: boolean;
  onSelectDefinition: (
    definitionId: DefiningWorldBuildingBlockDefinitionId,
  ) => void;
  onSelectWorldLayer: (worldLayer: number) => void;
  onSelectBlockHeight: (blockHeight: number) => void;
  onSelectCutFootprintMask: (cutFootprintMask: number) => void;
  onSelectCutGridAxisCellCount: (
    axisCellCount: DefiningWorldBuildingCutGridAxisCellCount,
  ) => void;
}

/**
 * Bottom-center build controls shown in place of the inventory hotbar.
 */
export function RenderingWorldPlazaBuildModeHotbar({
  isVisible,
  selectedDefinitionId,
  selectedWorldLayer,
  selectedBlockHeight,
  isPresetBlockTypeSelected,
  selectedCutFootprintMask,
  selectedCutGridAxisCellCount,
  buildErrorMessage,
  isSavingBuildDraft,
  onSelectDefinition,
  onSelectWorldLayer,
  onSelectBlockHeight,
  onSelectCutFootprintMask,
  onSelectCutGridAxisCellCount,
}: RenderingWorldPlazaBuildModeHotbarProps): React.JSX.Element | null {
  if (!isVisible) {
    return null;
  }

  return (
    <div
      className={STYLING_WORLD_PLAZA_EDIT_MODE_HOTBAR_ANCHOR_CLASS_NAME}
      aria-label={LABELING_WORLD_PLAZA_BUILD_MODE_HOTBAR}
    >
      <div
        {...{ [DEFINING_WORLD_PLAZA_UI_DATA_ATTRIBUTE]: true }}
        className={STYLING_WORLD_PLAZA_EDIT_MODE_HOTBAR_SHELL_CLASS_NAME}
      >
        <div className={RENDERING_WORLD_PLAZA_BUILD_MODE_HOTBAR_CONTROLS_ROW_CLASS_NAME}>
          <div className={RENDERING_WORLD_PLAZA_BUILD_MODE_HOTBAR_SIDE_CONTROLS_CLASS_NAME}>
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
          </div>
          <div className={RENDERING_WORLD_PLAZA_BUILD_MODE_HOTBAR_PALETTE_REGION_CLASS_NAME}>
            <RenderingWorldPlazaBlockPalette
              selectedDefinitionId={selectedDefinitionId}
              onSelectDefinition={onSelectDefinition}
            />
          </div>
        </div>
        <div className="flex min-w-0 items-center justify-between gap-2">
          <p className={RENDERING_WORLD_PLAZA_BUILD_MODE_HOTBAR_STATUS_CLASS_NAME}>
            {isSavingBuildDraft
              ? "Saving..."
              : "Click tiles to place or remove blocks"}
          </p>
          {buildErrorMessage ? (
            <p
              className={cn(
                DEFINING_WORLD_BUILDING_ERROR_TEXT_CLASS_NAME,
                "min-w-0 truncate text-right",
              )}
            >
              {buildErrorMessage}
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
