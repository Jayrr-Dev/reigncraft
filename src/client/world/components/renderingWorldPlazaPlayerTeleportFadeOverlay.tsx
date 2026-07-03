"use client";

import {
  DEFINING_WORLD_PLAZA_PLAYER_TELEPORT_FADE_EASING,
  DEFINING_WORLD_PLAZA_PLAYER_TELEPORT_FADE_OVERLAY_CLASS_NAME,
} from "@/components/world/domains/definingWorldPlazaPlayerTeleportFadeConstants";

export interface RenderingWorldPlazaPlayerTeleportFadeOverlayProps {
  /** When false, the overlay is not rendered. */
  isMounted: boolean;
  /** Blackout strength in [0, 1]. */
  opacity: number;
  /** CSS transition duration in milliseconds. */
  transitionDurationMs: number;
}

/**
 * Full-screen blackout overlay for plot teleports and other instant moves.
 */
export function RenderingWorldPlazaPlayerTeleportFadeOverlay({
  isMounted,
  opacity,
  transitionDurationMs,
}: RenderingWorldPlazaPlayerTeleportFadeOverlayProps): React.JSX.Element | null {
  if (!isMounted) {
    return null;
  }

  return (
    <div
      className={DEFINING_WORLD_PLAZA_PLAYER_TELEPORT_FADE_OVERLAY_CLASS_NAME}
      style={{
        opacity,
        transition: `opacity ${transitionDurationMs}ms ${DEFINING_WORLD_PLAZA_PLAYER_TELEPORT_FADE_EASING}`,
      }}
      aria-hidden={opacity <= 0}
    />
  );
}
