"use client";

import { usingWorldPlazaDayNightSunState } from "@/components/world/hooks/usingWorldPlazaDayNightSunState";

/**
 * Full-viewport tint that follows the day/night cycle.
 *
 * Sits above the Pixi stage so the whole world darkens toward deep blue at
 * night and warms through orange bands at sunrise and sunset. A soft radial
 * vignette fades in from the screen center toward the edges, strongest at night. Pointer events
 * pass through to the stage beneath.
 *
 * @module components/world/components/renderingWorldPlazaDayNightOverlay
 */

/** Above the Pixi stage (z-10), below the HUD overlay layer (z-20). */
const DEFINING_WORLD_PLAZA_DAY_NIGHT_OVERLAY_CLASS_NAME =
  "pointer-events-none absolute inset-0 z-[15] transition-[background-color,background-image] duration-1000 ease-linear";

/**
 * Builds a soft center-out vignette that fades only near the viewport edges.
 *
 * @param vignetteAlpha - Peak edge opacity (0..1).
 */
function buildingWorldPlazaDayNightEdgeVignetteBackgroundImage(
  vignetteAlpha: number,
): string {
  if (vignetteAlpha <= 0.001) {
    return "none";
  }

  const innerFadeAlpha = (vignetteAlpha * 0.18).toFixed(3);
  const edgeAlpha = (vignetteAlpha * 0.5).toFixed(3);

  return `radial-gradient(circle at 50% 50%, transparent 0%, transparent 62%, rgba(0, 0, 0, ${innerFadeAlpha}) 82%, rgba(0, 0, 0, ${edgeAlpha}) 100%)`;
}

export function RenderingWorldPlazaDayNightOverlay(): React.JSX.Element {
  const sunState = usingWorldPlazaDayNightSunState();

  return (
    <div
      className={DEFINING_WORLD_PLAZA_DAY_NIGHT_OVERLAY_CLASS_NAME}
      style={{
        backgroundColor: sunState.skyTintCssColor,
        backgroundImage: buildingWorldPlazaDayNightEdgeVignetteBackgroundImage(
          sunState.edgeVignetteAlpha,
        ),
      }}
      aria-hidden
    />
  );
}
