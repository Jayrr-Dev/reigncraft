"use client";

import { RenderingWorldPlazaPresetBlockTypeSizeIcon } from "@/components/world/building/components/renderingWorldPlazaPresetBlockTypeSizeIcon";
import {
  DEFINING_WORLD_BUILDING_PRESET_BLOCK_TYPES,
  DEFINING_WORLD_BUILDING_PRESET_BLOCK_TYPE_TOWER,
  DEFINING_WORLD_BUILDING_PRESET_BLOCK_TYPE_TOWER_ICON_BLOCK_HEIGHT,
  resolvingWorldBuildingPresetBlockTypeFromBlockHeight,
} from "@/components/world/building/domains/definingWorldBuildingPresetBlockTypes";
import {
  DEFINING_WORLD_BUILDING_SECTION_LABEL_CLASS_NAME,
  DEFINING_WORLD_BUILDING_SEGMENT_BUTTON_CLASS_NAME,
  DEFINING_WORLD_BUILDING_SEGMENT_BUTTON_SELECTED_CLASS_NAME,
} from "@/components/world/building/domains/definingWorldBuildingBuildModeConstants";
import { DEFINING_WORLD_PLAZA_UI_DATA_ATTRIBUTE } from "@/components/world/domains/definingWorldPlazaClickMovementConstants";

/** Preset block quick-pick grid classes. */
const RENDERING_WORLD_PLAZA_BUILD_MODE_PRESET_BLOCK_TYPE_GRID_CLASS_NAME =
  "grid grid-cols-5 gap-1" as const;

/** Pixels to lift preset block labels above the button bottom edge. */
const RENDERING_WORLD_PLAZA_BUILD_MODE_PRESET_BLOCK_TYPE_LABEL_LIFT_PX = 3 as const;

/** Preset block button inner layout classes. */
const RENDERING_WORLD_PLAZA_BUILD_MODE_PRESET_BLOCK_TYPE_BUTTON_INNER_CLASS_NAME =
  "flex flex-col items-center justify-end gap-0.5 pt-0.5 pb-1" as const;

/** Preset block short label classes. */
const RENDERING_WORLD_PLAZA_BUILD_MODE_PRESET_BLOCK_TYPE_SHORT_LABEL_CLASS_NAME =
  "text-[7px] font-medium leading-none text-white/70" as const;

export interface RenderingWorldPlazaBuildModePresetBlockTypeSelectorProps {
  selectedWorldLayer: number;
  selectedBlockHeight: number;
  isPresetBlockTypeSelected: boolean;
  onSelectBlockHeight: (blockHeight: number) => void;
}

/**
 * Pre-made block size picker for build mode placement.
 */
export function RenderingWorldPlazaBuildModePresetBlockTypeSelector({
  selectedWorldLayer,
  selectedBlockHeight,
  isPresetBlockTypeSelected,
  onSelectBlockHeight,
}: RenderingWorldPlazaBuildModePresetBlockTypeSelectorProps): React.JSX.Element {
  const selectedPresetBlockType =
    resolvingWorldBuildingPresetBlockTypeFromBlockHeight(
      selectedBlockHeight,
      selectedWorldLayer,
    );

  return (
    <div className="flex flex-col gap-1">
      <p className={DEFINING_WORLD_BUILDING_SECTION_LABEL_CLASS_NAME}>Blocks</p>

      <div
        className={RENDERING_WORLD_PLAZA_BUILD_MODE_PRESET_BLOCK_TYPE_GRID_CLASS_NAME}
      >
        {DEFINING_WORLD_BUILDING_PRESET_BLOCK_TYPES.map((presetBlockType) => {
          const isSelected =
            isPresetBlockTypeSelected &&
            selectedPresetBlockType.id === presetBlockType.id;
          const iconBlockHeight =
            presetBlockType.id === DEFINING_WORLD_BUILDING_PRESET_BLOCK_TYPE_TOWER
              ? DEFINING_WORLD_BUILDING_PRESET_BLOCK_TYPE_TOWER_ICON_BLOCK_HEIGHT
              : presetBlockType.blockHeight;
          return (
            <button
              key={presetBlockType.id}
              type="button"
              {...{ [DEFINING_WORLD_PLAZA_UI_DATA_ATTRIBUTE]: true }}
              aria-pressed={isSelected}
              aria-label={presetBlockType.ariaLabel}
              title={presetBlockType.label}
              onClick={() => {
                onSelectBlockHeight(presetBlockType.blockHeight);
              }}
              className={
                isSelected
                  ? DEFINING_WORLD_BUILDING_SEGMENT_BUTTON_SELECTED_CLASS_NAME
                  : DEFINING_WORLD_BUILDING_SEGMENT_BUTTON_CLASS_NAME
              }
            >
              <span
                className={
                  RENDERING_WORLD_PLAZA_BUILD_MODE_PRESET_BLOCK_TYPE_BUTTON_INNER_CLASS_NAME
                }
              >
                <RenderingWorldPlazaPresetBlockTypeSizeIcon
                  presetBlockTypeId={presetBlockType.id}
                  blockHeight={iconBlockHeight}
                />
                <span
                  className={
                    RENDERING_WORLD_PLAZA_BUILD_MODE_PRESET_BLOCK_TYPE_SHORT_LABEL_CLASS_NAME
                  }
                  style={{
                    transform: `translateY(-${RENDERING_WORLD_PLAZA_BUILD_MODE_PRESET_BLOCK_TYPE_LABEL_LIFT_PX}px)`,
                  }}
                >
                  {presetBlockType.label}
                </span>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
