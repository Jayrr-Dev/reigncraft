'use client';

import {
  STYLING_WORLD_PLAZA_DEV_MODE_PANEL_ACTION_BUTTON_CLASS_NAME,
  STYLING_WORLD_PLAZA_DEV_MODE_PANEL_HINT_CLASS_NAME,
  STYLING_WORLD_PLAZA_DEV_MODE_PANEL_SECTION_LABEL_CLASS_NAME,
} from '@/components/world/domains/definingWorldPlazaDevModePanelConstants';
import {
  DEFINING_WORLD_PLAZA_TEMPERATURE_DEBUG_AMBIENT_OFFSET_PRESETS_CELSIUS,
  DEFINING_WORLD_PLAZA_TEMPERATURE_DEBUG_CLIMATE_SEVERITY_PRESETS,
} from '@/components/world/health/domains/definingWorldPlazaTemperatureDebugOverrideConstants';
import {
  DEFINING_WORLD_PLAZA_TEMPERATURE_DEBUG_OVERRIDE_SERVER_SNAPSHOT,
  gettingWorldPlazaTemperatureDebugOverrideSnapshot,
  resettingWorldPlazaTemperatureDebugOverride,
  settingWorldPlazaTemperatureDebugAmbientOffsetCelsius,
  settingWorldPlazaTemperatureDebugClimateSeverity,
  subscribingWorldPlazaTemperatureDebugOverride,
} from '@/components/world/health/domains/managingWorldPlazaTemperatureDebugOverrideStore';
import { useSyncExternalStore } from 'react';

const RENDERING_WORLD_PLAZA_DEV_MODE_TEMPERATURE_BUTTON_CLASS_NAME =
  `${STYLING_WORLD_PLAZA_DEV_MODE_PANEL_ACTION_BUTTON_CLASS_NAME} border-amber-400/35 text-amber-100/90 hover:bg-amber-500/15` as const;

const RENDERING_WORLD_PLAZA_DEV_MODE_TEMPERATURE_BUTTON_ACTIVE_CLASS_NAME =
  'border-amber-300/70 bg-amber-500/20 text-amber-50' as const;

function formattingWorldPlazaTemperatureDebugOffsetLabel(
  offsetCelsius: number
): string {
  if (offsetCelsius > 0) {
    return `+${offsetCelsius}°C`;
  }

  if (offsetCelsius < 0) {
    return `${offsetCelsius}°C`;
  }

  return '0°C';
}

function formattingWorldPlazaTemperatureDebugSeverityLabel(
  severity: number
): string {
  if (severity === 1) {
    return 'Live';
  }

  if (severity === 0) {
    return 'Flat';
  }

  return `${Math.round(severity * 100)}%`;
}

/**
 * Dev panel controls for ambient °C offset and climate severity (milder heat/cold).
 */
export function RenderingWorldPlazaDevModeTemperatureControls(): React.JSX.Element {
  const snapshot = useSyncExternalStore(
    subscribingWorldPlazaTemperatureDebugOverride,
    gettingWorldPlazaTemperatureDebugOverrideSnapshot,
    () => DEFINING_WORLD_PLAZA_TEMPERATURE_DEBUG_OVERRIDE_SERVER_SNAPSHOT
  );

  return (
    <div className="flex flex-col gap-2">
      <span
        className={STYLING_WORLD_PLAZA_DEV_MODE_PANEL_SECTION_LABEL_CLASS_NAME}
      >
        Climate debug
      </span>
      <div className={STYLING_WORLD_PLAZA_DEV_MODE_PANEL_HINT_CLASS_NAME}>
        Severity pulls climate toward the midpoint (less extreme heat and cold).
        Offset shifts all ambient °C after that. Lava still clamps hot. Offset{' '}
        {formattingWorldPlazaTemperatureDebugOffsetLabel(
          snapshot.ambientOffsetCelsius
        )}
        ; severity{' '}
        {formattingWorldPlazaTemperatureDebugSeverityLabel(
          snapshot.climateSeverity
        )}
        .
      </div>
      <span className="text-[10px] font-medium text-white/70">
        Climate severity
      </span>
      <div className="grid grid-cols-4 gap-1.5">
        {DEFINING_WORLD_PLAZA_TEMPERATURE_DEBUG_CLIMATE_SEVERITY_PRESETS.map(
          (severity) => {
            const isActive = snapshot.climateSeverity === severity;

            return (
              <button
                key={severity}
                type="button"
                className={`${RENDERING_WORLD_PLAZA_DEV_MODE_TEMPERATURE_BUTTON_CLASS_NAME} ${
                  isActive
                    ? RENDERING_WORLD_PLAZA_DEV_MODE_TEMPERATURE_BUTTON_ACTIVE_CLASS_NAME
                    : ''
                }`}
                onClick={() =>
                  settingWorldPlazaTemperatureDebugClimateSeverity(severity)
                }
              >
                {formattingWorldPlazaTemperatureDebugSeverityLabel(severity)}
              </button>
            );
          }
        )}
      </div>
      <span className="text-[10px] font-medium text-white/70">
        Ambient offset
      </span>
      <div className="grid grid-cols-4 gap-1.5">
        {DEFINING_WORLD_PLAZA_TEMPERATURE_DEBUG_AMBIENT_OFFSET_PRESETS_CELSIUS.map(
          (offsetCelsius) => {
            const isActive = snapshot.ambientOffsetCelsius === offsetCelsius;

            return (
              <button
                key={offsetCelsius}
                type="button"
                className={`${RENDERING_WORLD_PLAZA_DEV_MODE_TEMPERATURE_BUTTON_CLASS_NAME} ${
                  isActive
                    ? RENDERING_WORLD_PLAZA_DEV_MODE_TEMPERATURE_BUTTON_ACTIVE_CLASS_NAME
                    : ''
                }`}
                onClick={() =>
                  settingWorldPlazaTemperatureDebugAmbientOffsetCelsius(
                    offsetCelsius
                  )
                }
              >
                {formattingWorldPlazaTemperatureDebugOffsetLabel(offsetCelsius)}
              </button>
            );
          }
        )}
      </div>
      <button
        type="button"
        className={RENDERING_WORLD_PLAZA_DEV_MODE_TEMPERATURE_BUTTON_CLASS_NAME}
        onClick={() => resettingWorldPlazaTemperatureDebugOverride()}
      >
        Reset climate debug
      </button>
    </div>
  );
}
