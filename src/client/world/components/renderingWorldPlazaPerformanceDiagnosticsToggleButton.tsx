'use client';

import { DEFINING_WORLD_PLAZA_UI_DATA_ATTRIBUTE } from '@/components/world/domains/definingWorldPlazaClickMovementConstants';
import { DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_OVERLAY_REFRESH_MS } from '@/components/world/domains/definingWorldPlazaPerformanceDiagnosticsConstants';
import {
  DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_TOGGLE_ARIA_LABEL,
  DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_TOGGLE_BUTTON_ACTIVE_CLASS_NAME,
  DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_TOGGLE_BUTTON_CLASS_NAME,
  DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_TOGGLE_BUTTON_LABEL,
  DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_TOGGLE_FPS_CLASS_NAME,
  DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_TOGGLE_FPS_PLACEHOLDER,
} from '@/components/world/domains/definingWorldPlazaPerformanceDiagnosticsUiConstants';
import { useEffect, useState } from 'react';

export type RenderingWorldPlazaPerformanceDiagnosticsToggleButtonProps = {
  /** True when diagnostics are visible and recording. */
  isVisible: boolean;
  /** Flips diagnostics visibility. */
  onToggle: () => void;
};

/**
 * Perf diagnostics toggle button for the plaza debug control stack.
 *
 * Shows a live FPS readout to the right of the Perf label so playtesters can
 * glance at frame rate without opening the overlay.
 */
export function RenderingWorldPlazaPerformanceDiagnosticsToggleButton({
  isVisible,
  onToggle,
}: RenderingWorldPlazaPerformanceDiagnosticsToggleButtonProps): React.JSX.Element {
  const [framesPerSecond, setFramesPerSecond] = useState<number | null>(null);

  useEffect(() => {
    let frameCount = 0;
    let rafId = 0;
    let lastSampleAtMs = performance.now();

    const tick = (nowMs: number): void => {
      frameCount += 1;
      const elapsedMs = nowMs - lastSampleAtMs;

      if (
        elapsedMs >=
        DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_OVERLAY_REFRESH_MS
      ) {
        setFramesPerSecond((frameCount * 1000) / elapsedMs);
        frameCount = 0;
        lastSampleAtMs = nowMs;
      }

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId);
    };
  }, []);

  const fpsLabel =
    framesPerSecond === null
      ? DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_TOGGLE_FPS_PLACEHOLDER
      : framesPerSecond.toFixed(0);

  return (
    <button
      type="button"
      {...{ [DEFINING_WORLD_PLAZA_UI_DATA_ATTRIBUTE]: true }}
      aria-label={`${DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_TOGGLE_ARIA_LABEL}. ${fpsLabel} frames per second`}
      aria-pressed={isVisible}
      onClick={onToggle}
      className={
        isVisible
          ? DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_TOGGLE_BUTTON_ACTIVE_CLASS_NAME
          : DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_TOGGLE_BUTTON_CLASS_NAME
      }
    >
      {DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_TOGGLE_BUTTON_LABEL}
      <span
        className={
          DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_TOGGLE_FPS_CLASS_NAME
        }
      >
        {fpsLabel}
      </span>
    </button>
  );
}
