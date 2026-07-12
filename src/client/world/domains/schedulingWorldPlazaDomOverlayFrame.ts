/**
 * Single shared animation frame loop for DOM overlay position updates.
 *
 * @module components/world/domains/schedulingWorldPlazaDomOverlayFrame
 */

import { DEFINING_WORLD_PLAZA_GENERATION_FEATURE } from '@/components/world/domains/definingWorldPlazaGenerationFeatureRegistry';
import {
  DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_GAUGE,
  DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_SAMPLE,
} from '@/components/world/domains/definingWorldPlazaPerformanceDiagnosticsConstants';
import {
  formattingWorldPlazaClientCapturedError,
  loggingWorldPlazaClientError,
} from '@/components/world/domains/loggingWorldPlazaClientErrors';
import { checkingWorldPlazaDevQaLoadEnabled } from '@/components/world/domains/managingWorldPlazaDevQaLoadStore';
import { checkingWorldPlazaGenerationFeatureEnabled } from '@/components/world/domains/managingWorldPlazaGenerationFeatureStore';
import {
  beginningWorldPlazaPerformanceSample,
  settingWorldPlazaPerformanceDiagnosticsGauge,
} from '@/components/world/domains/measuringWorldPlazaPerformanceDiagnostics';

export type SchedulingWorldPlazaDomOverlayFrameCallback = (
  deltaMs: number,
  frameTimeMs: number
) => void;

const SCHEDULING_WORLD_PLAZA_DOM_OVERLAY_FRAME_CALLBACKS =
  new Set<SchedulingWorldPlazaDomOverlayFrameCallback>();

let schedulingWorldPlazaDomOverlayFrameAnimationId = 0;
let schedulingWorldPlazaDomOverlayFrameLastTimeMs = 0;

function tickingWorldPlazaDomOverlayFrame(frameTimeMs: number): void {
  if (
    typeof document !== 'undefined' &&
    document.visibilityState !== 'visible'
  ) {
    schedulingWorldPlazaDomOverlayFrameAnimationId =
      window.requestAnimationFrame(tickingWorldPlazaDomOverlayFrame);
    return;
  }

  const areDomOverlaysEnabled = checkingWorldPlazaGenerationFeatureEnabled(
    DEFINING_WORLD_PLAZA_GENERATION_FEATURE.DOM_OVERLAYS
  );

  settingWorldPlazaPerformanceDiagnosticsGauge(
    DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_GAUGE.DOM_OVERLAYS_FEATURE_ENABLED,
    areDomOverlaysEnabled ? 1 : 0
  );
  settingWorldPlazaPerformanceDiagnosticsGauge(
    DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_GAUGE.DEV_QA_LOAD_ENABLED,
    checkingWorldPlazaDevQaLoadEnabled() ? 1 : 0
  );
  settingWorldPlazaPerformanceDiagnosticsGauge(
    DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_GAUGE.DOM_OVERLAY_SUBSCRIBER_COUNT,
    areDomOverlaysEnabled
      ? SCHEDULING_WORLD_PLAZA_DOM_OVERLAY_FRAME_CALLBACKS.size
      : 0
  );

  if (!areDomOverlaysEnabled) {
    schedulingWorldPlazaDomOverlayFrameLastTimeMs = frameTimeMs;
    // Keep a cheap rAF pump while subscribers exist so turning Features
    // `dom-overlays` back on resumes without remount. Callbacks stay skipped.
    if (SCHEDULING_WORLD_PLAZA_DOM_OVERLAY_FRAME_CALLBACKS.size > 0) {
      schedulingWorldPlazaDomOverlayFrameAnimationId =
        window.requestAnimationFrame(tickingWorldPlazaDomOverlayFrame);
    } else {
      schedulingWorldPlazaDomOverlayFrameAnimationId = 0;
    }

    return;
  }

  const finishDomOverlaySample = beginningWorldPlazaPerformanceSample(
    DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_SAMPLE.DOM_OVERLAY
  );
  const deltaMs = frameTimeMs - schedulingWorldPlazaDomOverlayFrameLastTimeMs;
  schedulingWorldPlazaDomOverlayFrameLastTimeMs = frameTimeMs;

  for (const callback of SCHEDULING_WORLD_PLAZA_DOM_OVERLAY_FRAME_CALLBACKS) {
    try {
      callback(deltaMs, frameTimeMs);
    } catch (error) {
      loggingWorldPlazaClientError(
        `[dom-overlay] ${formattingWorldPlazaClientCapturedError(error)}`
      );
    }
  }

  finishDomOverlaySample();

  if (SCHEDULING_WORLD_PLAZA_DOM_OVERLAY_FRAME_CALLBACKS.size > 0) {
    schedulingWorldPlazaDomOverlayFrameAnimationId =
      window.requestAnimationFrame(tickingWorldPlazaDomOverlayFrame);
  } else {
    schedulingWorldPlazaDomOverlayFrameAnimationId = 0;
  }
}

function startingWorldPlazaDomOverlayFrameLoopIfNeeded(): void {
  if (schedulingWorldPlazaDomOverlayFrameAnimationId !== 0) {
    return;
  }

  schedulingWorldPlazaDomOverlayFrameLastTimeMs = performance.now();
  schedulingWorldPlazaDomOverlayFrameAnimationId = window.requestAnimationFrame(
    tickingWorldPlazaDomOverlayFrame
  );
}

function stoppingWorldPlazaDomOverlayFrameLoopIfIdle(): void {
  if (SCHEDULING_WORLD_PLAZA_DOM_OVERLAY_FRAME_CALLBACKS.size > 0) {
    return;
  }

  window.cancelAnimationFrame(schedulingWorldPlazaDomOverlayFrameAnimationId);
  schedulingWorldPlazaDomOverlayFrameAnimationId = 0;
}

/**
 * Returns how many callbacks are subscribed to the shared DOM overlay loop.
 */
export function listingWorldPlazaDomOverlaySubscriberCount(): number {
  return SCHEDULING_WORLD_PLAZA_DOM_OVERLAY_FRAME_CALLBACKS.size;
}

/**
 * Registers a callback on the shared DOM overlay frame loop.
 *
 * @param callback - Invoked once per animation frame while subscribed.
 */
export function subscribingWorldPlazaDomOverlayFrame(
  callback: SchedulingWorldPlazaDomOverlayFrameCallback
): () => void {
  const wasEmpty =
    SCHEDULING_WORLD_PLAZA_DOM_OVERLAY_FRAME_CALLBACKS.size === 0;

  SCHEDULING_WORLD_PLAZA_DOM_OVERLAY_FRAME_CALLBACKS.add(callback);

  if (wasEmpty) {
    startingWorldPlazaDomOverlayFrameLoopIfNeeded();
  }

  return () => {
    SCHEDULING_WORLD_PLAZA_DOM_OVERLAY_FRAME_CALLBACKS.delete(callback);
    stoppingWorldPlazaDomOverlayFrameLoopIfIdle();
  };
}

/** Minimum interval between idle-throttled overlay updates (30 Hz). */
export const SCHEDULING_WORLD_PLAZA_DOM_OVERLAY_IDLE_FRAME_INTERVAL_MS =
  1000 / 30;

/**
 * Returns true when an idle overlay callback should run this frame.
 *
 * @param deltaMs - Milliseconds since the previous shared frame tick.
 * @param lastUpdateTimeMs - Timestamp of the last successful update.
 * @param isActive - True when the overlay target is moving or animating.
 */
export function checkingWorldPlazaDomOverlayFrameShouldUpdate(
  deltaMs: number,
  lastUpdateTimeMs: number,
  frameTimeMs: number,
  isActive: boolean
): boolean {
  if (isActive) {
    return true;
  }

  return (
    frameTimeMs - lastUpdateTimeMs >=
    SCHEDULING_WORLD_PLAZA_DOM_OVERLAY_IDLE_FRAME_INTERVAL_MS
  );
}
