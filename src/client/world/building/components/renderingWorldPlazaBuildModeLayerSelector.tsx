"use client";

import {
  DEFINING_WORLD_BUILDING_BUILD_MODE_LAYER_STEPPER_BUTTON_CLASS_NAME,
  DEFINING_WORLD_BUILDING_BUILD_MODE_LAYER_STEPPER_CLASS_NAME,
  DEFINING_WORLD_BUILDING_BUILD_MODE_LAYER_STEPPER_INPUT_CLASS_NAME,
  DEFINING_WORLD_BUILDING_SECTION_LABEL_CLASS_NAME,
  DEFINING_WORLD_BUILDING_VALUE_READOUT_CLASS_NAME,
} from "@/components/world/building/domains/definingWorldBuildingBuildModeConstants";
import {
  decrementingWorldBuildingWorldLayer,
  formattingWorldBuildingWorldLayerSummary,
  incrementingWorldBuildingWorldLayer,
} from "@/components/world/building/domains/formattingWorldBuildingWorldLayerSummary";
import {
  clampingWorldBuildingWorldLayer,
  DEFINING_WORLD_BUILDING_WORLD_LAYER_MAX,
  DEFINING_WORLD_BUILDING_WORLD_LAYER_MIN,
} from "@/components/world/building/domains/definingWorldBuildingWorldLayerConstants";
import { DEFINING_WORLD_PLAZA_UI_DATA_ATTRIBUTE } from "@/components/world/domains/definingWorldPlazaClickMovementConstants";
import { useCallback } from "react";

/** Accessible label for lowering the placement layer. */
const RENDERING_WORLD_PLAZA_BUILD_MODE_LAYER_DECREASE_LABEL =
  "Decrease placement layer" as const;

/** Accessible label for raising the placement layer. */
const RENDERING_WORLD_PLAZA_BUILD_MODE_LAYER_INCREASE_LABEL =
  "Increase placement layer" as const;

/** Accessible label for the placement layer field. */
const RENDERING_WORLD_PLAZA_BUILD_MODE_LAYER_INPUT_LABEL =
  "Placement layer" as const;

export interface RenderingWorldPlazaBuildModeLayerSelectorProps {
  selectedWorldLayer: number;
  onSelectWorldLayer: (worldLayer: number) => void;
}

/**
 * Placement layer (L) stepper with a number field and +/- controls.
 */
export function RenderingWorldPlazaBuildModeLayerSelector({
  selectedWorldLayer,
  onSelectWorldLayer,
}: RenderingWorldPlazaBuildModeLayerSelectorProps): React.JSX.Element {
  const clampedSelectedWorldLayer =
    clampingWorldBuildingWorldLayer(selectedWorldLayer);
  const isDecreaseDisabled =
    clampedSelectedWorldLayer <= DEFINING_WORLD_BUILDING_WORLD_LAYER_MIN;
  const isIncreaseDisabled =
    clampedSelectedWorldLayer >= DEFINING_WORLD_BUILDING_WORLD_LAYER_MAX;

  const decreasingSelectedWorldLayer = useCallback((): void => {
    onSelectWorldLayer(
      decrementingWorldBuildingWorldLayer(clampedSelectedWorldLayer),
    );
  }, [clampedSelectedWorldLayer, onSelectWorldLayer]);

  const increasingSelectedWorldLayer = useCallback((): void => {
    onSelectWorldLayer(
      incrementingWorldBuildingWorldLayer(clampedSelectedWorldLayer),
    );
  }, [clampedSelectedWorldLayer, onSelectWorldLayer]);

  const handlingLayerInputChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>): void => {
      const parsedLayer = Number.parseInt(event.target.value, 10);

      if (Number.isNaN(parsedLayer)) {
        return;
      }

      onSelectWorldLayer(parsedLayer);
    },
    [onSelectWorldLayer],
  );

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-baseline justify-between gap-1">
        <p className={DEFINING_WORLD_BUILDING_SECTION_LABEL_CLASS_NAME}>
          Layer
        </p>
        <p className={DEFINING_WORLD_BUILDING_VALUE_READOUT_CLASS_NAME}>
          {formattingWorldBuildingWorldLayerSummary(clampedSelectedWorldLayer)}
        </p>
      </div>

      <div className={DEFINING_WORLD_BUILDING_BUILD_MODE_LAYER_STEPPER_CLASS_NAME}>
        <button
          type="button"
          {...{ [DEFINING_WORLD_PLAZA_UI_DATA_ATTRIBUTE]: true }}
          aria-label={RENDERING_WORLD_PLAZA_BUILD_MODE_LAYER_DECREASE_LABEL}
          disabled={isDecreaseDisabled}
          onClick={decreasingSelectedWorldLayer}
          className={
            DEFINING_WORLD_BUILDING_BUILD_MODE_LAYER_STEPPER_BUTTON_CLASS_NAME
          }
        >
          −
        </button>
        <input
          {...{ [DEFINING_WORLD_PLAZA_UI_DATA_ATTRIBUTE]: true }}
          type="number"
          min={DEFINING_WORLD_BUILDING_WORLD_LAYER_MIN}
          max={DEFINING_WORLD_BUILDING_WORLD_LAYER_MAX}
          step={1}
          value={clampedSelectedWorldLayer}
          aria-label={RENDERING_WORLD_PLAZA_BUILD_MODE_LAYER_INPUT_LABEL}
          onChange={handlingLayerInputChange}
          className={
            DEFINING_WORLD_BUILDING_BUILD_MODE_LAYER_STEPPER_INPUT_CLASS_NAME
          }
        />
        <button
          type="button"
          {...{ [DEFINING_WORLD_PLAZA_UI_DATA_ATTRIBUTE]: true }}
          aria-label={RENDERING_WORLD_PLAZA_BUILD_MODE_LAYER_INCREASE_LABEL}
          disabled={isIncreaseDisabled}
          onClick={increasingSelectedWorldLayer}
          className={
            DEFINING_WORLD_BUILDING_BUILD_MODE_LAYER_STEPPER_BUTTON_CLASS_NAME
          }
        >
          +
        </button>
      </div>
    </div>
  );
}
