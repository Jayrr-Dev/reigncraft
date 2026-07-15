'use client';

import { DEFINING_WORLD_PLAZA_UI_DATA_ATTRIBUTE } from '@/components/world/domains/definingWorldPlazaClickMovementConstants';
import {
  DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_FPS_TOGGLE_ARIA_LABEL,
  DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_FPS_TOGGLE_BUTTON_ACTIVE_CLASS_NAME,
  DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_FPS_TOGGLE_BUTTON_CLASS_NAME,
  DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_FPS_TOGGLE_BUTTON_LABEL,
} from '@/components/world/domains/definingWorldPlazaPerformanceDiagnosticsUiConstants';

export type RenderingWorldPlazaPerformanceDiagnosticsFpsToggleButtonProps = {
  /** True when the corner FPS readout is visible. */
  isVisible: boolean;
  /** Flips corner FPS readout visibility. */
  onToggle: () => void;
};

/**
 * FPS readout toggle for the plaza debug toolbar.
 */
export function RenderingWorldPlazaPerformanceDiagnosticsFpsToggleButton({
  isVisible,
  onToggle,
}: RenderingWorldPlazaPerformanceDiagnosticsFpsToggleButtonProps): React.JSX.Element {
  return (
    <button
      type="button"
      {...{ [DEFINING_WORLD_PLAZA_UI_DATA_ATTRIBUTE]: true }}
      aria-label={
        DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_FPS_TOGGLE_ARIA_LABEL
      }
      aria-pressed={isVisible}
      onClick={onToggle}
      className={
        isVisible
          ? DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_FPS_TOGGLE_BUTTON_ACTIVE_CLASS_NAME
          : DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_FPS_TOGGLE_BUTTON_CLASS_NAME
      }
    >
      {DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_FPS_TOGGLE_BUTTON_LABEL}
    </button>
  );
}
