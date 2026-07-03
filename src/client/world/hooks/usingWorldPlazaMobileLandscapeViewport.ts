"use client";

import { useIsMobile } from "@/hooks/use-mobile";
import { useEffect, useState } from "react";

/** Media query for landscape orientation on touch devices. */
const USING_WORLD_PLAZA_MOBILE_LANDSCAPE_VIEWPORT_ORIENTATION_QUERY =
  "(orientation: landscape)" as const;

export interface UsingWorldPlazaMobileLandscapeViewportResult {
  /** True on narrow viewports. */
  isMobile: boolean;
  /** True while the device is in landscape orientation. */
  isLandscape: boolean;
  /** True when fullscreen mobile is portrait and should prompt a rotation. */
  shouldShowLandscapePrompt: boolean;
}

/**
 * Tracks mobile landscape state for fullscreen plaza play.
 *
 * @param isEnabled - When false, landscape tracking stays off.
 * @param isFullscreen - True while native fullscreen is active.
 */
export function usingWorldPlazaMobileLandscapeViewport(
  isEnabled: boolean,
  isFullscreen: boolean,
): UsingWorldPlazaMobileLandscapeViewportResult {
  const isMobile = useIsMobile();
  const [isLandscape, setIsLandscape] = useState(true);

  useEffect(() => {
    if (!isEnabled || !isMobile) {
      setIsLandscape(true);
      return;
    }

    const landscapeMediaQuery = window.matchMedia(
      USING_WORLD_PLAZA_MOBILE_LANDSCAPE_VIEWPORT_ORIENTATION_QUERY,
    );

    const updatingLandscapeOrientation = (): void => {
      setIsLandscape(landscapeMediaQuery.matches);
    };

    updatingLandscapeOrientation();
    landscapeMediaQuery.addEventListener("change", updatingLandscapeOrientation);

    return () => {
      landscapeMediaQuery.removeEventListener(
        "change",
        updatingLandscapeOrientation,
      );
    };
  }, [isEnabled, isMobile]);

  return {
    isMobile,
    isLandscape,
    shouldShowLandscapePrompt: isEnabled && isMobile && isFullscreen && !isLandscape,
  };
}
