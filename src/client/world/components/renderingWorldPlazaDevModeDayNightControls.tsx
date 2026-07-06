'use client';

import { convertingWorldPlazaDayNightClockTimeValueToCyclePhase } from '@/components/world/domains/convertingWorldPlazaDayNightClockTimeValueToCyclePhase';
import { DEFINING_WORLD_PLAZA_UI_DATA_ATTRIBUTE } from '@/components/world/domains/definingWorldPlazaClickMovementConstants';
import {
  DEFINING_WORLD_PLAZA_DAY_NIGHT_DEBUG_CLOCK_INPUT_LABEL,
  DEFINING_WORLD_PLAZA_DAY_NIGHT_DEBUG_PRESET_LABELS,
  DEFINING_WORLD_PLAZA_DAY_NIGHT_DEBUG_QUICK_PRESETS,
  DEFINING_WORLD_PLAZA_DAY_NIGHT_DEBUG_SECTION_DESCRIPTION,
  STYLING_WORLD_PLAZA_DAY_NIGHT_DEBUG_CLOCK_INPUT_CLASS_NAME,
  STYLING_WORLD_PLAZA_DAY_NIGHT_DEBUG_PRESET_BUTTON_ACTIVE_CLASS_NAME,
  STYLING_WORLD_PLAZA_DAY_NIGHT_DEBUG_PRESET_BUTTON_BASE_CLASS_NAME,
  STYLING_WORLD_PLAZA_DAY_NIGHT_DEBUG_PRESET_BUTTON_INACTIVE_CLASS_NAME,
} from '@/components/world/domains/definingWorldPlazaDayNightDebugOverrideConstants';
import { STYLING_WORLD_PLAZA_DEV_MODE_PANEL_SECTION_LABEL_CLASS_NAME } from '@/components/world/domains/definingWorldPlazaDevModePanelConstants';
import { formattingWorldPlazaDayNightClockTime } from '@/components/world/domains/formattingWorldPlazaDayNightClockTime';
import { usingWorldPlazaDayNightDebugOverrideState } from '@/components/world/hooks/usingWorldPlazaDayNightDebugOverrideState';

/**
 * World-tab controls for overriding the shared day/night cycle.
 */
export function RenderingWorldPlazaDevModeDayNightControls(): React.JSX.Element {
  const {
    activePreset,
    isLive,
    clockTimeValue,
    applyingDayNightDebugPreset,
    applyingDayNightDebugCyclePhase,
  } = usingWorldPlazaDayNightDebugOverrideState();

  return (
    <div className="flex flex-col gap-2">
      <span
        className={STYLING_WORLD_PLAZA_DEV_MODE_PANEL_SECTION_LABEL_CLASS_NAME}
      >
        Time of day
      </span>

      <div className="flex flex-wrap gap-1">
        <button
          type="button"
          {...{ [DEFINING_WORLD_PLAZA_UI_DATA_ATTRIBUTE]: true }}
          aria-pressed={isLive}
          className={`${STYLING_WORLD_PLAZA_DAY_NIGHT_DEBUG_PRESET_BUTTON_BASE_CLASS_NAME} ${
            isLive
              ? STYLING_WORLD_PLAZA_DAY_NIGHT_DEBUG_PRESET_BUTTON_ACTIVE_CLASS_NAME
              : STYLING_WORLD_PLAZA_DAY_NIGHT_DEBUG_PRESET_BUTTON_INACTIVE_CLASS_NAME
          }`}
          onClick={() => {
            applyingDayNightDebugPreset('live');
          }}
        >
          {DEFINING_WORLD_PLAZA_DAY_NIGHT_DEBUG_PRESET_LABELS.live}
        </button>

        {DEFINING_WORLD_PLAZA_DAY_NIGHT_DEBUG_QUICK_PRESETS.map((preset) => (
          <button
            key={preset}
            type="button"
            {...{ [DEFINING_WORLD_PLAZA_UI_DATA_ATTRIBUTE]: true }}
            aria-pressed={!isLive && activePreset === preset}
            className={`${STYLING_WORLD_PLAZA_DAY_NIGHT_DEBUG_PRESET_BUTTON_BASE_CLASS_NAME} ${
              !isLive && activePreset === preset
                ? STYLING_WORLD_PLAZA_DAY_NIGHT_DEBUG_PRESET_BUTTON_ACTIVE_CLASS_NAME
                : STYLING_WORLD_PLAZA_DAY_NIGHT_DEBUG_PRESET_BUTTON_INACTIVE_CLASS_NAME
            }`}
            onClick={() => {
              applyingDayNightDebugPreset(preset);
            }}
          >
            {DEFINING_WORLD_PLAZA_DAY_NIGHT_DEBUG_PRESET_LABELS[preset]}
          </button>
        ))}
      </div>

      <label className="flex flex-col gap-1">
        <span
          className={
            STYLING_WORLD_PLAZA_DEV_MODE_PANEL_SECTION_LABEL_CLASS_NAME
          }
        >
          {DEFINING_WORLD_PLAZA_DAY_NIGHT_DEBUG_CLOCK_INPUT_LABEL}
        </span>
        <input
          type="time"
          step={60}
          value={clockTimeValue}
          onChange={(event) => {
            applyingDayNightDebugCyclePhase(
              convertingWorldPlazaDayNightClockTimeValueToCyclePhase(
                event.currentTarget.value
              )
            );
          }}
          className={STYLING_WORLD_PLAZA_DAY_NIGHT_DEBUG_CLOCK_INPUT_CLASS_NAME}
          aria-label={DEFINING_WORLD_PLAZA_DAY_NIGHT_DEBUG_CLOCK_INPUT_LABEL}
        />
      </label>

      <p className="text-[10px] leading-snug text-white/55">
        {DEFINING_WORLD_PLAZA_DAY_NIGHT_DEBUG_SECTION_DESCRIPTION}
      </p>
      <p className="text-[10px] font-medium text-white/75">
        Preview: {formattingWorldPlazaDayNightClockTime()}
      </p>
    </div>
  );
}
