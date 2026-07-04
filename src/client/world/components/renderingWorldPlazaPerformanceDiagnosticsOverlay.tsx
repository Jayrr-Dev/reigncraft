'use client';

import {
  RenderingWorldPlazaPerformanceDiagnosticsOverlayTabs,
  type RenderingWorldPlazaPerformanceDiagnosticsOverlayTabId,
} from '@/components/world/components/renderingWorldPlazaPerformanceDiagnosticsOverlayTabs';
import { RenderingWorldPlazaPerformanceDiagnosticsRenderLayerToggles } from '@/components/world/components/renderingWorldPlazaPerformanceDiagnosticsRenderLayerToggles';
import { DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_OVERLAY_REFRESH_MS } from '@/components/world/domains/definingWorldPlazaPerformanceDiagnosticsConstants';
import {
  DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_OVERLAY_CLASS_NAME,
  DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_OVERLAY_TAB_BODY_CLASS_NAME,
} from '@/components/world/domains/definingWorldPlazaPerformanceDiagnosticsUiConstants';
import {
  buildingWorldPlazaPerformanceDiagnosticsSnapshot,
  dumpingWorldPlazaPerformanceDiagnosticsToConsole,
  markingWorldPlazaPerformanceDiagnosticsFrame,
  type MeasuringWorldPlazaPerformanceDiagnosticsSnapshot,
} from '@/components/world/domains/measuringWorldPlazaPerformanceDiagnostics';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

/** Shared action button classes inside the overlay. */
const RENDERING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_OVERLAY_ACTION_BUTTON_CLASS_NAME =
  'rounded border border-amber-200/30 bg-amber-400/10 px-2 py-0.5 text-[10px] font-semibold text-amber-50 hover:bg-amber-400/20';

const RENDERING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_OVERLAY_SECTION_LABEL_CLASS_NAME =
  'font-semibold text-amber-200' as const;

export interface RenderingWorldPlazaPerformanceDiagnosticsOverlayProps {
  /** True when diagnostics are visible and recording. */
  isVisible: boolean;
}

/**
 * Live FPS and subsystem timing panel portaled outside the plaza viewport.
 */
export function RenderingWorldPlazaPerformanceDiagnosticsOverlay({
  isVisible,
}: RenderingWorldPlazaPerformanceDiagnosticsOverlayProps): React.JSX.Element | null {
  const [snapshot, setSnapshot] =
    useState<MeasuringWorldPlazaPerformanceDiagnosticsSnapshot | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [activeTabId, setActiveTabId] =
    useState<RenderingWorldPlazaPerformanceDiagnosticsOverlayTabId>('summary');

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isVisible) {
      setSnapshot(null);
      return;
    }

    let animationFrameId = 0;
    let refreshTimeoutId = 0;

    const refreshingSnapshot = (): void => {
      setSnapshot(buildingWorldPlazaPerformanceDiagnosticsSnapshot());
      refreshTimeoutId = window.setTimeout(
        refreshingSnapshot,
        DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_OVERLAY_REFRESH_MS
      );
    };

    const trackingFrame = (): void => {
      markingWorldPlazaPerformanceDiagnosticsFrame();
      animationFrameId = window.requestAnimationFrame(trackingFrame);
    };

    refreshingSnapshot();
    animationFrameId = window.requestAnimationFrame(trackingFrame);

    return () => {
      window.cancelAnimationFrame(animationFrameId);
      window.clearTimeout(refreshTimeoutId);
    };
  }, [isVisible]);

  if (!isMounted || !isVisible || !snapshot) {
    return null;
  }

  return createPortal(
    <div
      className={
        DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_OVERLAY_CLASS_NAME
      }
    >
      <div className="mb-1 shrink-0 font-semibold text-amber-200">
        Plaza perf ({snapshot.framesPerSecond.toFixed(0)} fps)
      </div>

      <RenderingWorldPlazaPerformanceDiagnosticsOverlayTabs
        activeTabId={activeTabId}
        onSelectTab={setActiveTabId}
      />

      <div
        className={
          DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_OVERLAY_TAB_BODY_CLASS_NAME
        }
      >
        {activeTabId === 'summary' ? (
          <div>
            <div>
              frame avg {snapshot.frameAverageMs.toFixed(1)}ms | p95{' '}
              {snapshot.framePercentile95Ms.toFixed(1)}ms | max{' '}
              {snapshot.frameMaxMs.toFixed(1)}ms
            </div>
            <div className="mb-1 text-amber-100/90">
              slow frames {snapshot.slowFrameCount}
            </div>

            {snapshot.recentSpikeLines.length > 0 ? (
              <>
                <div
                  className={
                    RENDERING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_OVERLAY_SECTION_LABEL_CLASS_NAME
                  }
                >
                  Recent spikes
                </div>
                {snapshot.recentSpikeLines.map((spikeLine, spikeLineIndex) => (
                  <div
                    key={`${spikeLineIndex}-${spikeLine}`}
                    className="text-red-200"
                  >
                    {spikeLine}
                  </div>
                ))}
              </>
            ) : (
              <div className="text-amber-100/80">No recent spikes.</div>
            )}
          </div>
        ) : null}

        {activeTabId === 'samples' ? (
          <div>
            {snapshot.samples.length === 0 ? (
              <div className="text-amber-100/80">
                Move around to collect timings.
              </div>
            ) : (
              snapshot.samples.map((sampleStats) => (
                <div key={sampleStats.sampleId}>
                  {sampleStats.sampleId}: avg {sampleStats.averageMs.toFixed(1)}{' '}
                  | p95 {sampleStats.percentile95Ms.toFixed(1)} | max{' '}
                  {sampleStats.maxMs.toFixed(1)} | last{' '}
                  {sampleStats.lastMs.toFixed(1)}
                  {sampleStats.spikeCount > 0
                    ? ` | spikes ${sampleStats.spikeCount}`
                    : ''}
                </div>
              ))
            )}
          </div>
        ) : null}

        {activeTabId === 'metrics' ? (
          <div>
            <div
              className={
                RENDERING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_OVERLAY_SECTION_LABEL_CLASS_NAME
              }
            >
              Gauges
            </div>
            {Object.keys(snapshot.gauges).length === 0 ? (
              <div className="mb-2 text-amber-100/80">none yet</div>
            ) : (
              Object.entries(snapshot.gauges).map(([gaugeId, gaugeValue]) => (
                <div key={gaugeId}>
                  {gaugeId}: {gaugeValue}
                </div>
              ))
            )}

            <div
              className={`mt-2 ${RENDERING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_OVERLAY_SECTION_LABEL_CLASS_NAME}`}
            >
              Events / sec
            </div>
            {Object.keys(snapshot.countersPerSecond).length === 0 ? (
              <div className="text-amber-100/80">none yet</div>
            ) : (
              Object.entries(snapshot.countersPerSecond).map(
                ([counterId, counterRate]) => (
                  <div key={counterId}>
                    {counterId}: {counterRate.toFixed(2)}
                  </div>
                )
              )
            )}
          </div>
        ) : null}

        {activeTabId === 'layers' ? (
          <RenderingWorldPlazaPerformanceDiagnosticsRenderLayerToggles layout="embedded" />
        ) : null}
      </div>

      <div className="mt-2 shrink-0 border-t border-amber-300/20 pt-2">
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            className={
              RENDERING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_OVERLAY_ACTION_BUTTON_CLASS_NAME
            }
            onClick={() => {
              dumpingWorldPlazaPerformanceDiagnosticsToConsole();
            }}
          >
            Dump console
          </button>
          <button
            type="button"
            className={
              RENDERING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_OVERLAY_ACTION_BUTTON_CLASS_NAME
            }
            onClick={() => {
              const exportedSnapshot =
                buildingWorldPlazaPerformanceDiagnosticsSnapshot();
              void navigator.clipboard.writeText(
                JSON.stringify(exportedSnapshot, null, 2)
              );
            }}
          >
            Copy JSON
          </button>
        </div>
        <div className="mt-1 text-amber-100/70">
          Console: window.__WORLD_PLAZA_PERF__.dump()
        </div>
      </div>
    </div>,
    document.body
  );
}
