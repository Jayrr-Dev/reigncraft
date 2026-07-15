'use client';

import { DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_OVERLAY_REFRESH_MS } from '@/components/world/domains/definingWorldPlazaPerformanceDiagnosticsConstants';
import {
  DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_FPS_READOUT_PLACEHOLDER,
  DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_FPS_READOUT_SUFFIX,
} from '@/components/world/domains/definingWorldPlazaPerformanceDiagnosticsUiConstants';
import { resolvingWorldPlazaPerformanceDiagnosticsFpsReadoutViewportLayout } from '@/components/world/domains/resolvingWorldPlazaPerformanceDiagnosticsFpsReadoutViewportLayout';
import { useEffect, useMemo, useState } from 'react';

export type RenderingWorldPlazaPerformanceDiagnosticsFpsReadoutProps = {
  /** Live HUD scale from the plaza viewport frame. */
  viewportHudScale?: number;
  /** When true, sit below the action bar on the right instead of the top corner. */
  isMobile?: boolean;
};

/**
 * Live FPS counter for plaza playtesting.
 *
 * Desktop: top-right corner. Mobile: bottom-right of the top action bar
 * (just under the shell so it does not overlap the bar).
 */
export function RenderingWorldPlazaPerformanceDiagnosticsFpsReadout({
  viewportHudScale = 1,
  isMobile = false,
}: RenderingWorldPlazaPerformanceDiagnosticsFpsReadoutProps = {}): React.JSX.Element {
  const [framesPerSecond, setFramesPerSecond] = useState<number | null>(null);

  const viewportLayout = useMemo(
    () =>
      resolvingWorldPlazaPerformanceDiagnosticsFpsReadoutViewportLayout({
        viewportHudScale,
        isMobile,
      }),
    [isMobile, viewportHudScale]
  );

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
      ? DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_FPS_READOUT_PLACEHOLDER
      : `${framesPerSecond.toFixed(0)}${DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_FPS_READOUT_SUFFIX}`;

  return (
    <div
      className={viewportLayout.anchorClassName}
      style={viewportLayout.style}
      aria-live="polite"
      aria-label={`${fpsLabel} frames per second`}
    >
      {fpsLabel}
    </div>
  );
}
