'use client';

import { showingReigncraftToastSuccess } from '@/components/ui/domains/showingReigncraftToast';
import { usingWorldPlazaPerformanceProfile } from '@/components/world/components/providingWorldPlazaPerformanceProfile';
import { RenderingWorldPlazaDevPanelCloseButton } from '@/components/world/components/renderingWorldPlazaDevPanelCloseButton';
import { RenderingWorldPlazaPerformanceDiagnosticsFlagBadges } from '@/components/world/components/renderingWorldPlazaPerformanceDiagnosticsFlagBadges';
import {
  RenderingWorldPlazaPerformanceDiagnosticsOverlayTabs,
  type RenderingWorldPlazaPerformanceDiagnosticsOverlayTabId,
} from '@/components/world/components/renderingWorldPlazaPerformanceDiagnosticsOverlayTabs';
import { copyingWorldPlazaTextToClipboard } from '@/components/world/domains/copyingWorldPlazaTextToClipboard';
import { LABELING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_OVERLAY_CLOSE } from '@/components/world/domains/definingWorldPlazaDevPanelCloseButtonConstants';
import { LABELING_WORLD_PLAZA_MOBILE_DEBUG_COPY_SUCCESS } from '@/components/world/domains/definingWorldPlazaMobileDebugConstants';
import {
  DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_GAUGE,
  DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_OVERLAY_REFRESH_MS,
} from '@/components/world/domains/definingWorldPlazaPerformanceDiagnosticsConstants';
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
  buildingWorldPlazaPerformanceDiagnosticsSnapshot,
  dumpingWorldPlazaPerformanceDiagnosticsToConsole,
  markingWorldPlazaPerformanceDiagnosticsFrame,
  type MeasuringWorldPlazaPerformanceDiagnosticsSnapshot,
} from '@/components/world/domains/measuringWorldPlazaPerformanceDiagnostics';
import { usingWorldPlazaPerformanceTester } from '@/components/world/hooks/usingWorldPlazaPerformanceTester';
import { listingWildlifeSpeciesTexturesCacheIds } from '@/components/world/wildlife/domains/loadingWildlifeSpeciesTextures';
import { showToast } from '@devvit/web/client';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

/** Shared action button classes inside the overlay. */
const RENDERING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_OVERLAY_ACTION_BUTTON_CLASS_NAME =
  'rounded border border-amber-200/30 bg-amber-400/10 px-2 py-0.5 text-[10px] font-semibold text-amber-50 hover:bg-amber-400/20 disabled:cursor-not-allowed disabled:opacity-50';

const RENDERING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_OVERLAY_SECTION_LABEL_CLASS_NAME =
  'font-semibold text-amber-200' as const;

function resolvingWorldPlazaPerformanceDiagnosticsMemoryLines(): readonly string[] {
  if (typeof performance === 'undefined') {
    return [];
  }

  const memory = (
    performance as Performance & {
      memory?: {
        usedJSHeapSize: number;
        jsHeapSizeLimit: number;
        totalJSHeapSize: number;
      };
    }
  ).memory;

  if (!memory) {
    return ['jsHeap: unavailable'];
  }

  const toMb = (bytes: number): number =>
    Math.round((bytes / (1024 * 1024)) * 10) / 10;

  return [
    `jsHeap used ${toMb(memory.usedJSHeapSize)}mb / limit ${toMb(memory.jsHeapSizeLimit)}mb`,
  ];
}

function resolvingWorldPlazaPerformanceDiagnosticsSessionLines(
  snapshot: MeasuringWorldPlazaPerformanceDiagnosticsSnapshot,
  performanceTier: string
): readonly string[] {
  const wildlifeCacheCount = listingWildlifeSpeciesTexturesCacheIds().length;
  const floorChunkCount =
    snapshot.gauges[
      DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_GAUGE.FLOOR_CHUNK_COUNT
    ] ?? 'n/a';
  const elevationChunkCount =
    snapshot.gauges[
      DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_GAUGE
        .TERRAIN_ELEVATION_CHUNK_COUNT
    ] ?? 'n/a';
  const playerSpeed =
    snapshot.gauges[
      DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_GAUGE
        .PLAYER_SPEED_GRID_PER_SECOND
    ];
  const playerAttemptedSpeed =
    snapshot.gauges[
      DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_GAUGE
        .PLAYER_ATTEMPTED_SPEED_GRID_PER_SECOND
    ];
  const playerWaypointCount =
    snapshot.gauges[
      DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_GAUGE
        .PLAYER_NAVIGATION_WAYPOINT_COUNT
    ] ?? 'n/a';
  const activeSfxCount =
    snapshot.gauges[
      DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_GAUGE.AUDIO_ACTIVE_SFX_COUNT
    ] ?? 'n/a';
  const musicVoiceCount =
    snapshot.gauges[
      DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_GAUGE
        .AUDIO_MUSIC_ACTIVE_VOICE_COUNT
    ] ?? 'n/a';
  const audioInflightLoadCount =
    snapshot.gauges[
      DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_GAUGE
        .AUDIO_INFLIGHT_LOAD_COUNT
    ] ?? 'n/a';
  const projectileCount =
    snapshot.gauges[
      DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_GAUGE
        .PROJECTILE_INSTANCE_COUNT
    ] ?? 'n/a';
  const projectileSubstepCount =
    snapshot.gauges[
      DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_GAUGE
        .PROJECTILE_SUBSTEPS_THIS_FRAME
    ] ?? 'n/a';
  const onlineParticipantCount =
    snapshot.gauges[
      DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_GAUGE
        .ONLINE_PARTICIPANT_COUNT
    ] ?? 'n/a';
  const onlineRemotePlayerCount =
    snapshot.gauges[
      DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_GAUGE
        .ONLINE_REMOTE_PLAYER_COUNT
    ] ?? 'n/a';

  return [
    `tier: ${performanceTier}`,
    `wildlifeTextures: ${wildlifeCacheCount}`,
    `floorChunks: ${floorChunkCount}`,
    `elevationChunks: ${elevationChunkCount}`,
    `player: speed ${typeof playerSpeed === 'number' ? playerSpeed.toFixed(2) : 'n/a'} / attempted ${typeof playerAttemptedSpeed === 'number' ? playerAttemptedSpeed.toFixed(2) : 'n/a'} grid/s | waypoints ${playerWaypointCount}`,
    `audio: sfx ${activeSfxCount} | music voices ${musicVoiceCount} | loading ${audioInflightLoadCount}`,
    `projectiles: active ${projectileCount} | substeps ${projectileSubstepCount}`,
    `online: participants ${onlineParticipantCount} | remote ${onlineRemotePlayerCount}`,
    ...resolvingWorldPlazaPerformanceDiagnosticsMemoryLines(),
  ];
}

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
  const performanceProfile = usingWorldPlazaPerformanceProfile();
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
          <div>
            <div className="mb-2 flex flex-wrap gap-1">
              <button
                type="button"
                className="rounded border border-lime-300/60 bg-lime-500/25 px-2 py-1 text-[11px] font-bold uppercase tracking-wide text-lime-50 hover:bg-lime-500/40 disabled:cursor-not-allowed disabled:opacity-50"
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
                {
                  DEFINING_WORLD_PLAZA_PERFORMANCE_TESTER_COPY_REPORT_BUTTON_LABEL
                }
              </button>
            </div>
            {perfTesterSnapshot.isPromptingWalk ? (
              <div className="mb-2 font-semibold text-lime-200">
                {DEFINING_WORLD_PLAZA_PERFORMANCE_TESTER_WALK_PROMPT_BANNER}
              </div>
            ) : null}
            {perfTesterSnapshot.isRunning ? (
              <div className="mb-2 text-amber-100/90">
                suite {perfTesterSnapshot.phase}{' '}
                {perfTesterSnapshot.currentStepIndex}/
                {perfTesterSnapshot.totalStepCount}
                {perfTesterSnapshot.currentStepId
                  ? ` · ${perfTesterSnapshot.currentStepId}`
                  : ''}
              </div>
            ) : null}
            <div
              className={
                RENDERING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_OVERLAY_SECTION_LABEL_CLASS_NAME
              }
            >
              Session
            </div>
            {resolvingWorldPlazaPerformanceDiagnosticsSessionLines(
              snapshot,
              performanceProfile.tier
            ).map((sessionLine) => (
              <div key={sessionLine}>{sessionLine}</div>
            ))}
            <div
              className={`mt-2 ${RENDERING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_OVERLAY_SECTION_LABEL_CLASS_NAME}`}
            >
              Frame time
            </div>
            <div>
              frame avg {snapshot.frameAverageMs.toFixed(1)}ms | p95{' '}
              {snapshot.framePercentile95Ms.toFixed(1)}ms | p99{' '}
              {snapshot.framePercentile99Ms.toFixed(1)}ms | max{' '}
              {snapshot.frameMaxMs.toFixed(1)}ms
            </div>
            <div className="mb-1 text-amber-100/90">
              slow frames {snapshot.slowFrameCount} | very slow{' '}
              {snapshot.verySlowFrameCount}
              {snapshot.jsHeapUsedMb !== null
                ? ` | heap ${snapshot.jsHeapUsedMb.toFixed(1)}mb`
                : ''}
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
                  | p95 {sampleStats.percentile95Ms.toFixed(1)} | p99{' '}
                  {sampleStats.percentile99Ms.toFixed(1)} | max{' '}
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
