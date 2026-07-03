"use client";

import {
  DEFINING_WORLD_PLAZA_CLIENT_DEBUG_OVERLAY_CLASS_NAME,
  DEFINING_WORLD_PLAZA_CLIENT_DEBUG_OVERLAY_ERROR_TEXT_CLASS_NAME,
  DEFINING_WORLD_PLAZA_CLIENT_DEBUG_OVERLAY_FULLSCREEN_CLASS_NAME,
  DEFINING_WORLD_PLAZA_CLIENT_DEBUG_OVERLAY_MAX_LINES,
  DEFINING_WORLD_PLAZA_CLIENT_DEBUG_OVERLAY_STATUS_TEXT_CLASS_NAME,
} from "@/components/world/domains/definingWorldPlazaClientDebugOverlayConstants";
import {
  gettingWorldPlazaClientLogSnapshot,
  subscribingWorldPlazaClientLog,
} from "@/components/world/domains/loggingWorldPlazaClientErrors";
import { useSyncExternalStore } from "react";
import { createPortal } from "react-dom";

export interface RenderingWorldPlazaClientDebugOverlayProps {
  /** True when the plaza uses the larger fullscreen minimap anchor. */
  isFullscreen: boolean;
}

/**
 * Always-on error and Pixi status panel for Reddit playtest iframes without DevTools.
 */
export function RenderingWorldPlazaClientDebugOverlay({
  isFullscreen,
}: RenderingWorldPlazaClientDebugOverlayProps): React.JSX.Element | null {
  const logSnapshot = useSyncExternalStore(
    subscribingWorldPlazaClientLog,
    gettingWorldPlazaClientLogSnapshot,
    gettingWorldPlazaClientLogSnapshot,
  );

  const statusLines = logSnapshot.statusLines.slice(
    -DEFINING_WORLD_PLAZA_CLIENT_DEBUG_OVERLAY_MAX_LINES,
  );
  const errorLines = logSnapshot.errorLines.slice(
    -DEFINING_WORLD_PLAZA_CLIENT_DEBUG_OVERLAY_MAX_LINES,
  );
  const remainingLineBudget =
    DEFINING_WORLD_PLAZA_CLIENT_DEBUG_OVERLAY_MAX_LINES - statusLines.length;
  const visibleErrorLines =
    remainingLineBudget > 0 ? errorLines.slice(-remainingLineBudget) : [];

  if (statusLines.length === 0 && visibleErrorLines.length === 0) {
    return null;
  }

  const overlayClassName = isFullscreen
    ? DEFINING_WORLD_PLAZA_CLIENT_DEBUG_OVERLAY_FULLSCREEN_CLASS_NAME
    : DEFINING_WORLD_PLAZA_CLIENT_DEBUG_OVERLAY_CLASS_NAME;

  return createPortal(
    <div className={overlayClassName} aria-live="polite" role="status">
      <div className="mb-1 font-semibold text-red-300">Debug log</div>
      {statusLines.map((statusLine, statusLineIndex) => (
        <div
          key={`status-${statusLineIndex}-${statusLine}`}
          className={DEFINING_WORLD_PLAZA_CLIENT_DEBUG_OVERLAY_STATUS_TEXT_CLASS_NAME}
        >
          {statusLine}
        </div>
      ))}
      {visibleErrorLines.map((errorLine, errorLineIndex) => (
        <div
          key={`${errorLineIndex}-${errorLine}`}
          className={DEFINING_WORLD_PLAZA_CLIENT_DEBUG_OVERLAY_ERROR_TEXT_CLASS_NAME}
        >
          {errorLine}
        </div>
      ))}
    </div>,
    document.body,
  );
}
