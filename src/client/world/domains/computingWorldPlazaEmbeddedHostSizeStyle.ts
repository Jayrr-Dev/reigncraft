import type { CSSProperties } from "react";

/** 16:9 aspect ratio for the embedded plaza host. */
export const COMPUTING_WORLD_PLAZA_EMBEDDED_HOST_ASPECT_RATIO = "16 / 9" as const;

/**
 * Vertical space reserved above the embedded plaza host on desktop
 * (site chrome, page title, and padding).
 */
export const COMPUTING_WORLD_PLAZA_EMBEDDED_HOST_VIEWPORT_HEIGHT_OFFSET_REM = 11;

/**
 * Inline size styles that maximize embedded plaza width within the viewport
 * while preserving a 16:9 frame.
 *
 * @returns CSS properties for the plaza host element.
 */
export function computingWorldPlazaEmbeddedHostSizeStyle(): CSSProperties {
  return {
    aspectRatio: COMPUTING_WORLD_PLAZA_EMBEDDED_HOST_ASPECT_RATIO,
    width: `min(100%, calc((100svh - ${COMPUTING_WORLD_PLAZA_EMBEDDED_HOST_VIEWPORT_HEIGHT_OFFSET_REM}rem) * 16 / 9))`,
    maxWidth: "100%",
    marginInline: "auto",
  };
}

/** Fills the Devvit expanded game iframe (no Next.js page chrome offset). */
export function computingWorldPlazaExpandedHostSizeStyle(): CSSProperties {
  return {
    width: "100%",
    height: "100%",
    minHeight: 0,
  };
}
