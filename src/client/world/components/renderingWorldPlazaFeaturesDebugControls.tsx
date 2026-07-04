"use client";

import {
  DEFINING_WORLD_PLAZA_DAY_NIGHT_DEBUG_PRESET_LABELS,
  DEFINING_WORLD_PLAZA_DAY_NIGHT_DEBUG_SECTION_DESCRIPTION,
  DEFINING_WORLD_PLAZA_DAY_NIGHT_DEBUG_SECTION_HEADING,
  type DefiningWorldPlazaDayNightDebugPreset,
} from "@/components/world/domains/definingWorldPlazaDayNightDebugOverrideConstants";
import {
  DEFINING_WORLD_PLAZA_FEATURES_DEBUG_OPTION_BUTTON_ACTIVE_CLASS_NAME,
  DEFINING_WORLD_PLAZA_FEATURES_DEBUG_OPTION_BUTTON_BASE_CLASS_NAME,
  DEFINING_WORLD_PLAZA_FEATURES_DEBUG_OPTION_BUTTON_INACTIVE_CLASS_NAME,
  DEFINING_WORLD_PLAZA_FEATURES_DEBUG_OPTION_DESCRIPTION_CLASS_NAME,
  DEFINING_WORLD_PLAZA_FEATURES_DEBUG_PANEL_CLASS_NAME,
  DEFINING_WORLD_PLAZA_FEATURES_DEBUG_PANEL_HEADING_CLASS_NAME,
  DEFINING_WORLD_PLAZA_FEATURES_DEBUG_TOGGLE_ARIA_LABEL,
  DEFINING_WORLD_PLAZA_FEATURES_DEBUG_TOGGLE_BUTTON_ACTIVE_CLASS_NAME,
  DEFINING_WORLD_PLAZA_FEATURES_DEBUG_TOGGLE_BUTTON_CLASS_NAME,
  DEFINING_WORLD_PLAZA_FEATURES_DEBUG_TOGGLE_BUTTON_LABEL,
  DEFINING_WORLD_PLAZA_ISLAND_MODE_FEATURE_TOGGLE_DESCRIPTION,
  DEFINING_WORLD_PLAZA_ISLAND_MODE_FEATURE_TOGGLE_LABEL,
} from "@/components/world/domains/definingWorldPlazaFeaturesDebugUiConstants";
import { DEFINING_WORLD_PLAZA_UI_DATA_ATTRIBUTE } from "@/components/world/domains/definingWorldPlazaClickMovementConstants";
import { usingWorldPlazaDayNightDebugOverrideState } from "@/components/world/hooks/usingWorldPlazaDayNightDebugOverrideState";
import { usingWorldPlazaIslandModeFeatureEnabledState } from "@/components/world/hooks/usingWorldPlazaIslandModeFeatureEnabledState";

const RENDERING_WORLD_PLAZA_FEATURES_DEBUG_DAY_NIGHT_PRESETS: ReadonlyArray<DefiningWorldPlazaDayNightDebugPreset> =
  ["day", "afternoon", "night", "live"];

export interface RenderingWorldPlazaFeaturesDebugControlsProps {
  /** True when the Features panel is open. */
  isVisible: boolean;
  /** Flips Features panel visibility. */
  onToggle: () => void;
}

/**
 * Features toggle and expandable feature-flag panel below Character debug controls.
 */
export function RenderingWorldPlazaFeaturesDebugControls({
  isVisible,
  onToggle,
}: RenderingWorldPlazaFeaturesDebugControlsProps): React.JSX.Element {
  const { isIslandModeEnabled, settingIslandModeEnabled } =
    usingWorldPlazaIslandModeFeatureEnabledState();
  const { activePreset, applyingDayNightDebugPreset } =
    usingWorldPlazaDayNightDebugOverrideState();

  return (
    <div className="pointer-events-none flex flex-col gap-1">
      <button
        type="button"
        {...{ [DEFINING_WORLD_PLAZA_UI_DATA_ATTRIBUTE]: true }}
        aria-label={DEFINING_WORLD_PLAZA_FEATURES_DEBUG_TOGGLE_ARIA_LABEL}
        aria-pressed={isVisible}
        aria-expanded={isVisible}
        onClick={onToggle}
        className={
          isVisible
            ? DEFINING_WORLD_PLAZA_FEATURES_DEBUG_TOGGLE_BUTTON_ACTIVE_CLASS_NAME
            : DEFINING_WORLD_PLAZA_FEATURES_DEBUG_TOGGLE_BUTTON_CLASS_NAME
        }
      >
        {DEFINING_WORLD_PLAZA_FEATURES_DEBUG_TOGGLE_BUTTON_LABEL}
      </button>

      {isVisible ? (
        <div className={DEFINING_WORLD_PLAZA_FEATURES_DEBUG_PANEL_CLASS_NAME}>
          <p className={DEFINING_WORLD_PLAZA_FEATURES_DEBUG_PANEL_HEADING_CLASS_NAME}>
            World
          </p>
          <button
            type="button"
            {...{ [DEFINING_WORLD_PLAZA_UI_DATA_ATTRIBUTE]: true }}
            aria-pressed={isIslandModeEnabled}
            className={`${DEFINING_WORLD_PLAZA_FEATURES_DEBUG_OPTION_BUTTON_BASE_CLASS_NAME} ${
              isIslandModeEnabled
                ? DEFINING_WORLD_PLAZA_FEATURES_DEBUG_OPTION_BUTTON_ACTIVE_CLASS_NAME
                : DEFINING_WORLD_PLAZA_FEATURES_DEBUG_OPTION_BUTTON_INACTIVE_CLASS_NAME
            }`}
            onClick={() => {
              settingIslandModeEnabled(!isIslandModeEnabled);
            }}
          >
            {DEFINING_WORLD_PLAZA_ISLAND_MODE_FEATURE_TOGGLE_LABEL}
          </button>
          <p
            className={DEFINING_WORLD_PLAZA_FEATURES_DEBUG_OPTION_DESCRIPTION_CLASS_NAME}
          >
            {DEFINING_WORLD_PLAZA_ISLAND_MODE_FEATURE_TOGGLE_DESCRIPTION}
          </p>

          <p className={DEFINING_WORLD_PLAZA_FEATURES_DEBUG_PANEL_HEADING_CLASS_NAME}>
            {DEFINING_WORLD_PLAZA_DAY_NIGHT_DEBUG_SECTION_HEADING}
          </p>
          <div className="flex flex-wrap gap-1">
            {RENDERING_WORLD_PLAZA_FEATURES_DEBUG_DAY_NIGHT_PRESETS.map(
              (preset) => (
                <button
                  key={preset}
                  type="button"
                  {...{ [DEFINING_WORLD_PLAZA_UI_DATA_ATTRIBUTE]: true }}
                  aria-pressed={activePreset === preset}
                  className={`${DEFINING_WORLD_PLAZA_FEATURES_DEBUG_OPTION_BUTTON_BASE_CLASS_NAME} ${
                    activePreset === preset
                      ? DEFINING_WORLD_PLAZA_FEATURES_DEBUG_OPTION_BUTTON_ACTIVE_CLASS_NAME
                      : DEFINING_WORLD_PLAZA_FEATURES_DEBUG_OPTION_BUTTON_INACTIVE_CLASS_NAME
                  }`}
                  onClick={() => {
                    applyingDayNightDebugPreset(preset);
                  }}
                >
                  {DEFINING_WORLD_PLAZA_DAY_NIGHT_DEBUG_PRESET_LABELS[preset]}
                </button>
              ),
            )}
          </div>
          <p
            className={DEFINING_WORLD_PLAZA_FEATURES_DEBUG_OPTION_DESCRIPTION_CLASS_NAME}
          >
            {DEFINING_WORLD_PLAZA_DAY_NIGHT_DEBUG_SECTION_DESCRIPTION}
          </p>
        </div>
      ) : null}
    </div>
  );
}
