'use client';

import { Icon } from '@/components/ui/icon';
import { DEFINING_WORLD_PLAZA_UI_DATA_ATTRIBUTE } from '@/components/world/domains/definingWorldPlazaClickMovementConstants';

export type RenderingPlazaSessionModeHudProps = {
  sessionLabel: string;
  onExitToHome?: () => void;
};

/**
 * Minimal top-left HUD control: a single round Home button. The session label
 * is desktop-only ambient info so the mobile HUD stays quiet.
 */
export function RenderingPlazaSessionModeHud({
  sessionLabel,
  onExitToHome,
}: RenderingPlazaSessionModeHudProps): React.JSX.Element {
  return (
    <div
      {...{ [DEFINING_WORLD_PLAZA_UI_DATA_ATTRIBUTE]: true }}
      className="pointer-events-auto absolute left-3 top-3 z-40 flex items-center gap-2"
    >
      {onExitToHome ? (
        <button
          type="button"
          onClick={onExitToHome}
          className="flex size-10 cursor-pointer items-center justify-center rounded-full border border-poster-gold/20 bg-poster-teal-deep/75 text-parchment/90 shadow-md shadow-black/30 backdrop-blur-sm transition-colors duration-150 hover:bg-poster-teal-deep/90 hover:text-parchment focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f4d35e]/70 active:bg-poster-gold/20"
          aria-label="Return to home screen"
        >
          <Icon icon="mdi:home" className="size-4.5" aria-hidden />
        </button>
      ) : null}
      <span className="hidden select-none text-[10px] font-semibold uppercase tracking-[0.12em] text-parchment/60 drop-shadow-[0_1px_1px_rgba(0,0,0,0.7)] md:inline">
        {sessionLabel}
      </span>
    </div>
  );
}
