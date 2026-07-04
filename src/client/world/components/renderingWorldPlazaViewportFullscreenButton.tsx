'use client';

import { DEFINING_WORLD_PLAZA_UI_DATA_ATTRIBUTE } from '@/components/world/domains/definingWorldPlazaClickMovementConstants';
import {
  DEFINING_WORLD_PLAZA_VIEWPORT_FULLSCREEN_ENTER_LABEL,
  DEFINING_WORLD_PLAZA_VIEWPORT_FULLSCREEN_EXIT_LABEL,
} from '@/components/world/domains/definingWorldPlazaViewportFullscreenConstants';
import { Maximize2, Minimize2 } from 'lucide-react';

/** Bottom-right placement above the coordinate HUD row. */
const RENDERING_WORLD_PLAZA_VIEWPORT_FULLSCREEN_BUTTON_CONTAINER_CLASS =
  'pointer-events-auto absolute bottom-3 z-30';

/** Offset when build mode sidebar is open (148px sidebar + 12px gap). */
const RENDERING_WORLD_PLAZA_VIEWPORT_FULLSCREEN_BUTTON_BUILD_MODE_OFFSET_CLASS_NAME =
  'right-[160px]' as const;

/** Default right inset when build mode is off. */
const RENDERING_WORLD_PLAZA_VIEWPORT_FULLSCREEN_BUTTON_DEFAULT_OFFSET_CLASS_NAME =
  'right-3' as const;

/** Matches other plaza HUD controls for contrast on grass and sky. */
const RENDERING_WORLD_PLAZA_VIEWPORT_FULLSCREEN_BUTTON_CLASS =
  'flex size-7 cursor-pointer items-center justify-center rounded-md border border-poster-gold/30 bg-poster-teal-deep/85 text-parchment/90 shadow-lg backdrop-blur-sm transition hover:bg-poster-teal/90 hover:text-parchment focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f4d35e]/70';

/** Lucide icon size inside the fullscreen toggle. */
const RENDERING_WORLD_PLAZA_VIEWPORT_FULLSCREEN_ICON_CLASS = 'size-3' as const;

export interface RenderingWorldPlazaViewportFullscreenButtonProps {
  /** True while the plaza viewport is fullscreen. */
  isFullscreen: boolean;
  /** Called when the player toggles fullscreen. */
  onToggleFullscreen: () => void;
  /** Shifts the button left so it stays visible beside the build sidebar. */
  isBuildModeActive?: boolean;
}

/**
 * Bottom-right control to expand the plaza viewport to the full screen.
 */
export function RenderingWorldPlazaViewportFullscreenButton({
  isFullscreen,
  onToggleFullscreen,
  isBuildModeActive = false,
}: RenderingWorldPlazaViewportFullscreenButtonProps): React.JSX.Element {
  const accessibleLabel = isFullscreen
    ? DEFINING_WORLD_PLAZA_VIEWPORT_FULLSCREEN_EXIT_LABEL
    : DEFINING_WORLD_PLAZA_VIEWPORT_FULLSCREEN_ENTER_LABEL;

  const horizontalOffsetClassName = isBuildModeActive
    ? RENDERING_WORLD_PLAZA_VIEWPORT_FULLSCREEN_BUTTON_BUILD_MODE_OFFSET_CLASS_NAME
    : RENDERING_WORLD_PLAZA_VIEWPORT_FULLSCREEN_BUTTON_DEFAULT_OFFSET_CLASS_NAME;

  return (
    <div
      className={`${RENDERING_WORLD_PLAZA_VIEWPORT_FULLSCREEN_BUTTON_CONTAINER_CLASS} ${horizontalOffsetClassName}`}
    >
      <button
        type="button"
        {...{ [DEFINING_WORLD_PLAZA_UI_DATA_ATTRIBUTE]: '' }}
        aria-label={accessibleLabel}
        aria-pressed={isFullscreen}
        onClick={() => {
          onToggleFullscreen();
        }}
        className={RENDERING_WORLD_PLAZA_VIEWPORT_FULLSCREEN_BUTTON_CLASS}
      >
        {isFullscreen ? (
          <Minimize2
            className={RENDERING_WORLD_PLAZA_VIEWPORT_FULLSCREEN_ICON_CLASS}
            aria-hidden
          />
        ) : (
          <Maximize2
            className={RENDERING_WORLD_PLAZA_VIEWPORT_FULLSCREEN_ICON_CLASS}
            aria-hidden
          />
        )}
      </button>
    </div>
  );
}
