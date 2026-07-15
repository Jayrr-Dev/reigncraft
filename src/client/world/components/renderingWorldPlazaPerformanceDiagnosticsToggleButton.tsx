'use client';

import { DEFINING_WORLD_PLAZA_UI_DATA_ATTRIBUTE } from '@/components/world/domains/definingWorldPlazaClickMovementConstants';
import {
  DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_TOGGLE_ARIA_LABEL,
  DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_TOGGLE_BUTTON_ACTIVE_CLASS_NAME,
  DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_TOGGLE_BUTTON_CLASS_NAME,
  DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_TOGGLE_BUTTON_LABEL,
} from '@/components/world/domains/definingWorldPlazaPerformanceDiagnosticsUiConstants';

export type RenderingWorldPlazaPerformanceDiagnosticsToggleButtonProps = {
  /** True when diagnostics are visible and recording. */
  isVisible: boolean;
  /** Flips diagnostics visibility. */
  onToggle: () => void;
};

/**
 * Perf diagnostics toggle button for the plaza debug control stack.
 *
 * Live FPS lives in the top-right corner readout, not on this badge.
 */
export function RenderingWorldPlazaPerformanceDiagnosticsToggleButton({
  isVisible,
  onToggle,
}: RenderingWorldPlazaPerformanceDiagnosticsToggleButtonProps): React.JSX.Element {
  return (
    <button
      type="button"
      {...{ [DEFINING_WORLD_PLAZA_UI_DATA_ATTRIBUTE]: true }}
      aria-label={
        DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_TOGGLE_ARIA_LABEL
      }
      aria-pressed={isVisible}
      onClick={onToggle}
      className={
        isVisible
          ? DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_TOGGLE_BUTTON_ACTIVE_CLASS_NAME
          : DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_TOGGLE_BUTTON_CLASS_NAME
      }
    >
      {DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_TOGGLE_BUTTON_LABEL}
    </button>
  );
}
