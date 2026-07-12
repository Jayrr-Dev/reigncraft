'use client';

import { showingReigncraftToastSuccess } from '@/components/ui/domains/showingReigncraftToast';
import { RenderingWorldPlazaDevPanelCloseButton } from '@/components/world/components/renderingWorldPlazaDevPanelCloseButton';
import { RenderingWorldPlazaPerformanceDiagnosticsFlagBadges } from '@/components/world/components/renderingWorldPlazaPerformanceDiagnosticsFlagBadges';
import { RenderingWorldPlazaPerformanceDiagnosticsMetricNuanceBadges } from '@/components/world/components/renderingWorldPlazaPerformanceDiagnosticsMetricNuanceBadges';
import {
  RenderingWorldPlazaPerformanceDiagnosticsOverlayTabs,
  type RenderingWorldPlazaPerformanceDiagnosticsOverlayTabId,
} from '@/components/world/components/renderingWorldPlazaPerformanceDiagnosticsOverlayTabs';
import { RenderingWorldPlazaPerformanceDiagnosticsSampleNuanceBadges } from '@/components/world/components/renderingWorldPlazaPerformanceDiagnosticsSampleNuanceBadges';
import { RenderingWorldPlazaPerformanceDiagnosticsSummaryNuanceBadges } from '@/components/world/components/renderingWorldPlazaPerformanceDiagnosticsSummaryNuanceBadges';
import { copyingWorldPlazaTextToClipboard } from '@/components/world/domains/copyingWorldPlazaTextToClipboard';
import { LABELING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_OVERLAY_CLOSE } from '@/components/world/domains/definingWorldPlazaDevPanelCloseButtonConstants';
import { LABELING_WORLD_PLAZA_MOBILE_DEBUG_COPY_SUCCESS } from '@/components/world/domains/definingWorldPlazaMobileDebugConstants';
import { DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_OVERLAY_REFRESH_MS } from '@/components/world/domains/definingWorldPlazaPerformanceDiagnosticsConstants';
import {
  LABELING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_NUANCE_CRITICAL_SNAPSHOT_COPY_FAILURE,
  LABELING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_NUANCE_CRITICAL_SNAPSHOT_COPY_LATEST,
  LABELING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_NUANCE_CRITICAL_SNAPSHOT_COPY_SUCCESS,
} from '@/components/world/domains/definingWorldPlazaPerformanceDiagnosticsNuanceCriticalSnapshotConstants';
import {
  DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_OVERLAY_CLASS_NAME,
  DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_OVERLAY_TAB_BODY_CLASS_NAME,
} from '@/components/world/domains/definingWorldPlazaPerformanceDiagnosticsUiConstants';
import {
  DEFINING_WORLD_PLAZA_PERFORMANCE_TESTER_CANCEL_BUTTON_LABEL,
  DEFINING_WORLD_PLAZA_PERFORMANCE_TESTER_COPY_FAILURE_TOAST,
  DEFINING_WORLD_PLAZA_PERFORMANCE_TESTER_COPY_REPORT_BUTTON_LABEL,
  DEFINING_WORLD_PLAZA_PERFORMANCE_TESTER_COPY_SUCCESS_TOAST,
  DEFINING_WORLD_PLAZA_PERFORMANCE_TESTER_RUN_SUITE_BUTTON_LABEL,
  DEFINING_WORLD_PLAZA_PERFORMANCE_TESTER_WALK_PROMPT_BANNER,
} from '@/components/world/domains/definingWorldPlazaPerformanceTesterConstants';
import { formattingWorldPlazaPerformanceTesterReport } from '@/components/world/domains/formattingWorldPlazaPerformanceTesterReport';
import {
  listingWorldPlazaPerformanceDiagnosticsNuanceCriticalSnapshots,
  recordingWorldPlazaPerformanceDiagnosticsNuanceCriticalSnapshots,
  subscribingWorldPlazaPerformanceDiagnosticsNuanceCriticalSnapshots,
} from '@/components/world/domains/managingWorldPlazaPerformanceDiagnosticsNuanceCriticalSnapshotStore';
import {
  buildingWorldPlazaPerformanceDiagnosticsSnapshot,
  dumpingWorldPlazaPerformanceDiagnosticsToConsole,
  markingWorldPlazaPerformanceDiagnosticsFrame,
  type MeasuringWorldPlazaPerformanceDiagnosticsSnapshot,
} from '@/components/world/domains/measuringWorldPlazaPerformanceDiagnostics';
import { usingWorldPlazaPerformanceTester } from '@/components/world/hooks/usingWorldPlazaPerformanceTester';
import { showToast } from '@devvit/web/client';
import { useEffect, useState, useSyncExternalStore } from 'react';
import { createPortal } from 'react-dom';

/** Shared action button classes inside the overlay. */
const RENDERING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_OVERLAY_ACTION_BUTTON_CLASS_NAME =
  'rounded border border-amber-200/30 bg-amber-400/10 px-2 py-0.5 text-[10px] font-semibold text-amber-50 hover:bg-amber-400/20 disabled:cursor-not-allowed disabled:opacity-50';

export interface RenderingWorldPlazaPerformanceDiagnosticsOverlayProps {
  /** True when diagnostics are visible and recording. */
  isVisible: boolean;
  /** Hides the diagnostics overlay. */
  onClose: () => void;
}

/**
 * Live FPS and subsystem timing panel portaled outside the plaza viewport.
 */
export function RenderingWorldPlazaPerformanceDiagnosticsOverlay({
  isVisible,
  onClose,
}: RenderingWorldPlazaPerformanceDiagnosticsOverlayProps): React.JSX.Element | null {
  const {
    snapshot: perfTesterSnapshot,
    runningPerfTesterSuite,
    cancellingPerfTesterRun,
  } = usingWorldPlazaPerformanceTester();
  const [snapshot, setSnapshot] =
    useState<MeasuringWorldPlazaPerformanceDiagnosticsSnapshot | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [activeTabId, setActiveTabId] =
    useState<RenderingWorldPlazaPerformanceDiagnosticsOverlayTabId>('summary');
  const criticalCaptures = useSyncExternalStore(
    subscribingWorldPlazaPerformanceDiagnosticsNuanceCriticalSnapshots,
    listingWorldPlazaPerformanceDiagnosticsNuanceCriticalSnapshots,
    () => []
  );
  const latestCriticalCapture = criticalCaptures[0] ?? null;

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
      const nextSnapshot = buildingWorldPlazaPerformanceDiagnosticsSnapshot();
      recordingWorldPlazaPerformanceDiagnosticsNuanceCriticalSnapshots(
        nextSnapshot
      );
      setSnapshot(nextSnapshot);
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
      <div className="mb-1 flex shrink-0 items-center justify-between gap-2">
        <div className="font-semibold text-amber-200">
          Plaza perf ({snapshot.framesPerSecond.toFixed(0)} fps)
        </div>
        <RenderingWorldPlazaDevPanelCloseButton
          ariaLabel={LABELING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_OVERLAY_CLOSE}
          onClose={onClose}
          className="focus-visible:ring-amber-300/70"
        />
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
          <RenderingWorldPlazaPerformanceDiagnosticsSummaryNuanceBadges
            snapshot={snapshot}
          />
        ) : null}

        {activeTabId === 'samples' ? (
          <RenderingWorldPlazaPerformanceDiagnosticsSampleNuanceBadges
            samples={snapshot.samples}
          />
        ) : null}

        {activeTabId === 'metrics' ? (
          <RenderingWorldPlazaPerformanceDiagnosticsMetricNuanceBadges
            gauges={snapshot.gauges}
            countersPerSecond={snapshot.countersPerSecond}
          />
        ) : null}

        {activeTabId === 'flags' ? (
          <RenderingWorldPlazaPerformanceDiagnosticsFlagBadges />
        ) : null}
      </div>

      <div className="mt-2 shrink-0 border-t border-amber-300/20 pt-2">
        {perfTesterSnapshot.isPromptingWalk ? (
          <div className="mb-1 font-semibold text-lime-200">
            {DEFINING_WORLD_PLAZA_PERFORMANCE_TESTER_WALK_PROMPT_BANNER}
          </div>
        ) : null}
        {perfTesterSnapshot.isRunning ? (
          <div className="mb-1 text-amber-100/90">
            suite {perfTesterSnapshot.phase}{' '}
            {perfTesterSnapshot.currentStepIndex}/
            {perfTesterSnapshot.totalStepCount}
            {perfTesterSnapshot.currentStepId
              ? ` · ${perfTesterSnapshot.currentStepId}`
              : ''}
          </div>
        ) : null}
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            className={
              RENDERING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_OVERLAY_ACTION_BUTTON_CLASS_NAME
            }
            disabled={perfTesterSnapshot.isRunning}
            onClick={runningPerfTesterSuite}
          >
            {DEFINING_WORLD_PLAZA_PERFORMANCE_TESTER_RUN_SUITE_BUTTON_LABEL}
          </button>
          <button
            type="button"
            className={
              RENDERING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_OVERLAY_ACTION_BUTTON_CLASS_NAME
            }
            disabled={!perfTesterSnapshot.isRunning}
            onClick={cancellingPerfTesterRun}
          >
            {DEFINING_WORLD_PLAZA_PERFORMANCE_TESTER_CANCEL_BUTTON_LABEL}
          </button>
          <button
            type="button"
            className={
              RENDERING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_OVERLAY_ACTION_BUTTON_CLASS_NAME
            }
            disabled={perfTesterSnapshot.results.length === 0}
            onClick={() => {
              void copyingWorldPlazaTextToClipboard(
                formattingWorldPlazaPerformanceTesterReport(
                  perfTesterSnapshot.results
                )
              ).then((didCopy) => {
                showToast(
                  didCopy
                    ? DEFINING_WORLD_PLAZA_PERFORMANCE_TESTER_COPY_SUCCESS_TOAST
                    : DEFINING_WORLD_PLAZA_PERFORMANCE_TESTER_COPY_FAILURE_TOAST
                );
              });
            }}
          >
            {DEFINING_WORLD_PLAZA_PERFORMANCE_TESTER_COPY_REPORT_BUTTON_LABEL}
          </button>
          <button
            type="button"
            className={
              RENDERING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_OVERLAY_ACTION_BUTTON_CLASS_NAME
            }
            disabled={criticalCaptures.length === 0 || !latestCriticalCapture}
            onClick={() => {
              if (!latestCriticalCapture) {
                return;
              }
              void copyingWorldPlazaTextToClipboard(
                latestCriticalCapture.text
              ).then((didCopy) => {
                showToast(
                  didCopy
                    ? LABELING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_NUANCE_CRITICAL_SNAPSHOT_COPY_SUCCESS
                    : LABELING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_NUANCE_CRITICAL_SNAPSHOT_COPY_FAILURE
                );
              });
            }}
          >
            {
              LABELING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_NUANCE_CRITICAL_SNAPSHOT_COPY_LATEST
            }
          </button>
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
              void copyingWorldPlazaTextToClipboard(
                JSON.stringify(exportedSnapshot, null, 2)
              ).then((didCopy) => {
                if (didCopy) {
                  showingReigncraftToastSuccess(
                    LABELING_WORLD_PLAZA_MOBILE_DEBUG_COPY_SUCCESS
                  );
                }
              });
            }}
          >
            Copy JSON
          </button>
        </div>
        <div className="mt-1 text-amber-100/70">
          Console: window.__WORLD_PLAZA_PERF__.runPerfSuite()
        </div>
      </div>
    </div>,
    document.body
  );
}
