'use client';

import { DEFINING_WORLD_PLAZA_UI_DATA_ATTRIBUTE } from '@/components/world/domains/definingWorldPlazaClickMovementConstants';
import { Home } from 'lucide-react';

export type RenderingPlazaSessionModeHudProps = {
  sessionLabel: string;
  onExitToHome?: () => void;
};

/**
 * Small HUD badge showing the active session mode with an optional home button.
 */
export function RenderingPlazaSessionModeHud({
  sessionLabel,
  onExitToHome,
}: RenderingPlazaSessionModeHudProps): React.JSX.Element {
  return (
    <div
      {...{ [DEFINING_WORLD_PLAZA_UI_DATA_ATTRIBUTE]: true }}
      className="pointer-events-auto absolute left-3 top-3 z-40 flex items-center gap-2 rounded-full border border-white/10 bg-gray-950/80 px-3 py-1.5 text-xs text-white shadow-lg backdrop-blur-sm"
    >
      <span>{sessionLabel}</span>
      {onExitToHome ? (
        <button
          type="button"
          onClick={onExitToHome}
          className="inline-flex items-center gap-1 rounded-full bg-white/10 px-2 py-1 text-[11px] font-medium transition-colors hover:bg-white/20"
          aria-label="Return to home screen"
        >
          <Home className="size-3.5" aria-hidden />
          Home
        </button>
      ) : null}
    </div>
  );
}
