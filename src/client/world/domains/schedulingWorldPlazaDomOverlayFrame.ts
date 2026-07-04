/**
 * Single shared animation frame loop for DOM overlay position updates.
 *
 * @module components/world/domains/schedulingWorldPlazaDomOverlayFrame
 */

export type SchedulingWorldPlazaDomOverlayFrameCallback = (
  deltaMs: number,
  frameTimeMs: number
) => void;

const SCHEDULING_WORLD_PLAZA_DOM_OVERLAY_FRAME_CALLBACKS =
  new Set<SchedulingWorldPlazaDomOverlayFrameCallback>();

let schedulingWorldPlazaDomOverlayFrameAnimationId = 0;
let schedulingWorldPlazaDomOverlayFrameLastTimeMs = 0;

function tickingWorldPlazaDomOverlayFrame(frameTimeMs: number): void {
  const deltaMs = frameTimeMs - schedulingWorldPlazaDomOverlayFrameLastTimeMs;
  schedulingWorldPlazaDomOverlayFrameLastTimeMs = frameTimeMs;

  for (const callback of SCHEDULING_WORLD_PLAZA_DOM_OVERLAY_FRAME_CALLBACKS) {
    callback(deltaMs, frameTimeMs);
  }

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
