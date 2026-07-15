'use client';

import {
  DEFINING_WORLD_PLAZA_MOBILE_DEBUG_HUD_REFRESH_MS,
  LABELING_WORLD_PLAZA_MOBILE_DEBUG_COPY_REPORT_BUTTON,
  STYLING_WORLD_PLAZA_MOBILE_DEBUG_COPY_BUTTON_CLASS_NAME,
  STYLING_WORLD_PLAZA_MOBILE_DEBUG_HIDE_BUTTON_CLASS_NAME,
  STYLING_WORLD_PLAZA_MOBILE_DEBUG_PANEL_CLASS_NAME,
} from '@/components/world/domains/definingWorldPlazaMobileDebugConstants';
import type { DefiningWorldPlazaPerformanceProfile } from '@/components/world/domains/definingWorldPlazaPerformanceProfileConstants';
import {
  gettingWorldPlazaClientLogSnapshot,
  subscribingWorldPlazaClientLog,
} from '@/components/world/domains/loggingWorldPlazaClientErrors';
import type { ManagingWorldPlazaMobileDebugFrameStats } from '@/components/world/domains/managingWorldPlazaMobileDebugSampler';
import type { RefObject } from 'react';
import { useEffect, useRef, useSyncExternalStore } from 'react';
import { createPortal } from 'react-dom';

export type RenderingWorldPlazaMobileDebugPanelProps = {
  readonly isVisible: boolean;
  readonly performanceProfile: DefiningWorldPlazaPerformanceProfile;
  readonly frameStatsRef: RefObject<ManagingWorldPlazaMobileDebugFrameStats | null>;
  readonly uptimeSecRef: RefObject<number>;
  readonly onCopyReport: () => void;
  readonly onHide: () => void;
};

function formattingWorldPlazaMobileDebugLiveStatsLine(params: {
  readonly frameStats: ManagingWorldPlazaMobileDebugFrameStats | null;
  readonly uptimeSec: number;
}): string {
  const { frameStats, uptimeSec } = params;

  if (!frameStats) {
    return `uptime ${uptimeSec}s`;
  }

  return `fps ${frameStats.framesPerSecond.toFixed(0)} · p95 ${frameStats.framePercentile95Ms.toFixed(0)}ms · ${uptimeSec}s`;
}

/**
 * Compact mobile debug HUD with live stats and a one-tap copy button.
 *
 * Live fps/uptime text updates imperatively so the sampler never re-renders
 * the plaza tree.
 */
export function RenderingWorldPlazaMobileDebugPanel({
  isVisible,
  performanceProfile,
  frameStatsRef,
  uptimeSecRef,
  onCopyReport,
  onHide,
}: RenderingWorldPlazaMobileDebugPanelProps): React.JSX.Element | null {
  const liveStatsLineRef = useRef<HTMLDivElement>(null);
  const logSnapshot = useSyncExternalStore(
    subscribingWorldPlazaClientLog,
    gettingWorldPlazaClientLogSnapshot,
    gettingWorldPlazaClientLogSnapshot
  );

  useEffect(() => {
    if (!isVisible) {
      return;
    }

    const liveStatsLineElement = liveStatsLineRef.current;
    if (!liveStatsLineElement) {
      return;
    }

    const publishingLiveStatsLine = (): void => {
      liveStatsLineElement.textContent =
        formattingWorldPlazaMobileDebugLiveStatsLine({
          frameStats: frameStatsRef.current,
          uptimeSec: uptimeSecRef.current,
        });
    };

    publishingLiveStatsLine();
    const intervalId = window.setInterval(
      publishingLiveStatsLine,
      DEFINING_WORLD_PLAZA_MOBILE_DEBUG_HUD_REFRESH_MS
    );

    return () => {
      window.clearInterval(intervalId);
    };
  }, [frameStatsRef, isVisible, uptimeSecRef]);

  if (!isVisible) {
    return null;
  }

  const summaryLines = [
    `tier ${performanceProfile.tier} · res ${performanceProfile.renderResolutionMax}x`,
    ...logSnapshot.statusLines.slice(-2),
    ...logSnapshot.errorLines.slice(-1),
  ].filter((line) => line.length > 0);

  return createPortal(
    <div className={STYLING_WORLD_PLAZA_MOBILE_DEBUG_PANEL_CLASS_NAME}>
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <div className="text-[9px] font-bold uppercase tracking-[0.14em] text-cyan-200/90">
            Mobile debug
          </div>
          {summaryLines.map((line) => (
            <div key={line} className="truncate text-cyan-50/95">
              {line}
            </div>
          ))}
          <div
            ref={liveStatsLineRef}
            className="truncate text-cyan-50/95"
            aria-live="polite"
          >
            uptime 0s
          </div>
        </div>
        <button
          type="button"
          className={STYLING_WORLD_PLAZA_MOBILE_DEBUG_HIDE_BUTTON_CLASS_NAME}
          onClick={onHide}
        >
          Hide
        </button>
      </div>
      <button
        type="button"
        className={STYLING_WORLD_PLAZA_MOBILE_DEBUG_COPY_BUTTON_CLASS_NAME}
        onClick={onCopyReport}
      >
        {LABELING_WORLD_PLAZA_MOBILE_DEBUG_COPY_REPORT_BUTTON}
      </button>
    </div>,
    document.body
  );
}
