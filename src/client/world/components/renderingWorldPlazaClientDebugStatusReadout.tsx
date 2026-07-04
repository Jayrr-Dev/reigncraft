'use client';

import {
  DEFINING_WORLD_PLAZA_CLIENT_DEBUG_OVERLAY_ERROR_TEXT_CLASS_NAME,
  DEFINING_WORLD_PLAZA_CLIENT_DEBUG_OVERLAY_MAX_LINES,
  DEFINING_WORLD_PLAZA_CLIENT_DEBUG_OVERLAY_STATUS_TEXT_CLASS_NAME,
} from '@/components/world/domains/definingWorldPlazaClientDebugOverlayConstants';
import { STYLING_WORLD_PLAZA_DEV_MODE_PANEL_STATUS_READOUT_CLASS_NAME } from '@/components/world/domains/definingWorldPlazaDevModePanelConstants';
import {
  gettingWorldPlazaClientLogSnapshot,
  subscribingWorldPlazaClientLog,
} from '@/components/world/domains/loggingWorldPlazaClientErrors';
import { useSyncExternalStore } from 'react';

export interface RenderingWorldPlazaClientDebugStatusReadoutProps {
  /** Optional wrapper class when embedded in another panel. */
  className?: string;
}

/**
 * Inline Pixi status and client error readout for the dev tools panel.
 */
export function RenderingWorldPlazaClientDebugStatusReadout({
  className = STYLING_WORLD_PLAZA_DEV_MODE_PANEL_STATUS_READOUT_CLASS_NAME,
}: RenderingWorldPlazaClientDebugStatusReadoutProps): React.JSX.Element | null {
  const logSnapshot = useSyncExternalStore(
    subscribingWorldPlazaClientLog,
    gettingWorldPlazaClientLogSnapshot,
    gettingWorldPlazaClientLogSnapshot
  );

  const statusLines = logSnapshot.statusLines.slice(
    -DEFINING_WORLD_PLAZA_CLIENT_DEBUG_OVERLAY_MAX_LINES
  );
  const errorLines = logSnapshot.errorLines.slice(
    -DEFINING_WORLD_PLAZA_CLIENT_DEBUG_OVERLAY_MAX_LINES
  );
  const remainingLineBudget =
    DEFINING_WORLD_PLAZA_CLIENT_DEBUG_OVERLAY_MAX_LINES - statusLines.length;
  const visibleErrorLines =
    remainingLineBudget > 0 ? errorLines.slice(-remainingLineBudget) : [];

  if (statusLines.length === 0 && visibleErrorLines.length === 0) {
    return null;
  }

  return (
    <div className={className} aria-live="polite" role="status">
      {statusLines.length > 0 ? (
        <div
          className={
            DEFINING_WORLD_PLAZA_CLIENT_DEBUG_OVERLAY_STATUS_TEXT_CLASS_NAME
          }
        >
          {statusLines.join(' · ')}
        </div>
      ) : null}
      {visibleErrorLines.map((errorLine, errorLineIndex) => (
        <div
          key={`${errorLineIndex}-${errorLine}`}
          className={
            statusLines.length > 0 && errorLineIndex === 0
              ? `${DEFINING_WORLD_PLAZA_CLIENT_DEBUG_OVERLAY_ERROR_TEXT_CLASS_NAME} mt-0.5`
              : DEFINING_WORLD_PLAZA_CLIENT_DEBUG_OVERLAY_ERROR_TEXT_CLASS_NAME
          }
        >
          {errorLine}
        </div>
      ))}
    </div>
  );
}
