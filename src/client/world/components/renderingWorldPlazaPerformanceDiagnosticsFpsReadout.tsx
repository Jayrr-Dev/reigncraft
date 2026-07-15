'use client';

import { DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_OVERLAY_REFRESH_MS } from '@/components/world/domains/definingWorldPlazaPerformanceDiagnosticsConstants';
import {
  DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_FPS_READOUT_PLACEHOLDER,
  DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_FPS_READOUT_SUFFIX,
} from '@/components/world/domains/definingWorldPlazaPerformanceDiagnosticsUiConstants';
import { resolvingWorldPlazaPerformanceDiagnosticsFpsReadoutViewportLayout } from '@/components/world/domains/resolvingWorldPlazaPerformanceDiagnosticsFpsReadoutViewportLayout';
import { useEffect, useMemo, useRef } from 'react';

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
 *
 * Updates the label imperatively (no React state) so the sampler does not
 * schedule re-renders every refresh tick.
 */
export function RenderingWorldPlazaPerformanceDiagnosticsFpsReadout({
  viewportHudScale = 1,
  isMobile = false,
}: RenderingWorldPlazaPerformanceDiagnosticsFpsReadoutProps = {}): React.JSX.Element {
  const labelRef = useRef<HTMLDivElement>(null);

  const viewportLayout = useMemo(
    () =>
      resolvingWorldPlazaPerformanceDiagnosticsFpsReadoutViewportLayout({
        viewportHudScale,
        isMobile,
      }),
    [isMobile, viewportHudScale]
  );

  useEffect(() => {
    const labelElement = labelRef.current;
    if (!labelElement) {
      return;
    }

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
        const framesPerSecond = (frameCount * 1000) / elapsedMs;
        labelElement.textContent = `${framesPerSecond.toFixed(0)}${DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_FPS_READOUT_SUFFIX}`;
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

  return (
    <div
      ref={labelRef}
      className={viewportLayout.anchorClassName}
      style={viewportLayout.style}
      aria-hidden="true"
    >
      {DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_FPS_READOUT_PLACEHOLDER}
    </div>
  );
}
