"use client";

import { usingWorldPlazaDayNightSunState } from "@/components/world/hooks/usingWorldPlazaDayNightSunState";

/**
 * Full-viewport tint that follows the day/night cycle.
 *
 * Sits above the Pixi stage so the whole world darkens toward deep blue at
 * night and warms through orange bands at sunrise and sunset. Pointer events
 * pass through to the stage beneath.
 *
 * @module components/world/components/renderingWorldPlazaDayNightOverlay
 */

/** Above the Pixi stage (z-10), below the HUD overlay layer (z-20). */
const DEFINING_WORLD_PLAZA_DAY_NIGHT_OVERLAY_CLASS_NAME =
  "pointer-events-none absolute inset-0 z-[15] transition-colors duration-1000 ease-linear";

export function RenderingWorldPlazaDayNightOverlay(): React.JSX.Element {
  const sunState = usingWorldPlazaDayNightSunState();

  return (
    <div
      className={DEFINING_WORLD_PLAZA_DAY_NIGHT_OVERLAY_CLASS_NAME}
      style={{ backgroundColor: sunState.skyTintCssColor }}
      aria-hidden
    />
  );
}
