"use client";

import {
  DEFINING_WORLD_PLAZA_SANDBOX_DEFAULT_HEIGHT_PX,
  DEFINING_WORLD_PLAZA_SANDBOX_DEFAULT_WIDTH_PX,
} from "@/components/world/domains/definingWorldPlazaSandboxConstants";
import type { DefiningWorldPlazaPixiViewportSize } from "@/components/world/domains/resolvingWorldPlazaPixiViewportSize";
import type { UsingWorldPlazaViewportFullscreenOptions } from "@/components/world/hooks/usingWorldPlazaViewportFullscreen";
import { usingWorldPlazaViewportFullscreen } from "@/components/world/hooks/usingWorldPlazaViewportFullscreen";
import { useEffect, useState } from "react";

export interface UsingWorldPlazaViewportFullscreenLetterboxParams {
  /** Native fullscreen target (outer host). */
  hostRef: React.RefObject<HTMLElement | null>;
  /** Live internal Pixi viewport captured when entering fullscreen. */
  pixiViewportSizeRef: React.RefObject<DefiningWorldPlazaPixiViewportSize>;
}

export interface UsingWorldPlazaViewportFullscreenLetterboxResult {
  isFullscreen: boolean;
  isFullscreenSupported: boolean;
  togglingViewportFullscreen: (
    options?: UsingWorldPlazaViewportFullscreenOptions,
  ) => Promise<void>;
  enteringViewportFullscreen: (
    options?: UsingWorldPlazaViewportFullscreenOptions,
  ) => Promise<void>;
  /** Embedded viewport locked when fullscreen starts; null when embedded. */
  fullscreenLogicalViewport: DefiningWorldPlazaPixiViewportSize | null;
}

/**
 * Fullscreen that renders the plaza at native host resolution with camera zoom
 * compensation instead of CSS upscaling.
 */
export function usingWorldPlazaViewportFullscreenLetterbox({
  hostRef,
  pixiViewportSizeRef,
}: UsingWorldPlazaViewportFullscreenLetterboxParams): UsingWorldPlazaViewportFullscreenLetterboxResult {
  const {
    isFullscreen,
    isFullscreenSupported,
    togglingViewportFullscreen,
    enteringViewportFullscreen,
  } = usingWorldPlazaViewportFullscreen(hostRef);
  const [fullscreenLogicalViewport, setFullscreenLogicalViewport] =
    useState<DefiningWorldPlazaPixiViewportSize | null>(null);

  useEffect(() => {
    if (!isFullscreen) {
      setFullscreenLogicalViewport(null);
      return;
    }

    const lockedLogicalViewport: DefiningWorldPlazaPixiViewportSize = {
      width:
        pixiViewportSizeRef.current.width ||
        DEFINING_WORLD_PLAZA_SANDBOX_DEFAULT_WIDTH_PX,
      height:
        pixiViewportSizeRef.current.height ||
        DEFINING_WORLD_PLAZA_SANDBOX_DEFAULT_HEIGHT_PX,
    };

    setFullscreenLogicalViewport(lockedLogicalViewport);
  }, [isFullscreen, pixiViewportSizeRef]);

  return {
    isFullscreen,
    isFullscreenSupported,
    togglingViewportFullscreen,
    enteringViewportFullscreen,
    fullscreenLogicalViewport,
  };
}
