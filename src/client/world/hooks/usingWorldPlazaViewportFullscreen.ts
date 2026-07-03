"use client";

import { lockingWorldPlazaViewportLandscapeOrientation } from "@/components/world/domains/lockingWorldPlazaViewportLandscapeOrientation";
import { unlockingWorldPlazaViewportLandscapeOrientation } from "@/components/world/domains/lockingWorldPlazaViewportLandscapeOrientation";
import { useCallback, useEffect, useState } from "react";

export interface UsingWorldPlazaViewportFullscreenOptions {
  /** Attempts to lock landscape after native fullscreen starts. */
  shouldLockLandscapeOrientation?: boolean;
}

/**
 * Tracks and toggles native fullscreen for the plaza viewport host element.
 */
export function usingWorldPlazaViewportFullscreen(
  hostRef: React.RefObject<HTMLElement | null>,
): {
  /** True while the plaza host fills the screen. */
  isFullscreen: boolean;
  /** True when the browser supports element fullscreen. */
  isFullscreenSupported: boolean;
  /** Enters or exits fullscreen on the plaza host. */
  togglingViewportFullscreen: (
    options?: UsingWorldPlazaViewportFullscreenOptions,
  ) => Promise<void>;
  /** Enters native fullscreen on the plaza host. */
  enteringViewportFullscreen: (
    options?: UsingWorldPlazaViewportFullscreenOptions,
  ) => Promise<void>;
} {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isFullscreenSupported, setIsFullscreenSupported] = useState(false);

  useEffect(() => {
    setIsFullscreenSupported(document.fullscreenEnabled);

    const handlingFullscreenChange = (): void => {
      const hostElement = hostRef.current;
      const isHostFullscreen =
        hostElement !== null && document.fullscreenElement === hostElement;

      setIsFullscreen(isHostFullscreen);

      if (!isHostFullscreen) {
        unlockingWorldPlazaViewportLandscapeOrientation();
      }
    };

    document.addEventListener("fullscreenchange", handlingFullscreenChange);
    handlingFullscreenChange();

    return () => {
      document.removeEventListener("fullscreenchange", handlingFullscreenChange);
      unlockingWorldPlazaViewportLandscapeOrientation();
    };
  }, [hostRef]);

  const enteringViewportFullscreen = useCallback(
    async (
      options: UsingWorldPlazaViewportFullscreenOptions = {},
    ): Promise<void> => {
      const hostElement = hostRef.current;

      if (!hostElement || !document.fullscreenEnabled) {
        return;
      }

      if (document.fullscreenElement === hostElement) {
        return;
      }

      await hostElement.requestFullscreen();

      if (options.shouldLockLandscapeOrientation) {
        await lockingWorldPlazaViewportLandscapeOrientation();
      }
    },
    [hostRef],
  );

  const togglingViewportFullscreen = useCallback(
    async (
      options: UsingWorldPlazaViewportFullscreenOptions = {},
    ): Promise<void> => {
      const hostElement = hostRef.current;

      if (!hostElement || !document.fullscreenEnabled) {
        return;
      }

      if (document.fullscreenElement === hostElement) {
        unlockingWorldPlazaViewportLandscapeOrientation();
        await document.exitFullscreen();
        return;
      }

      await enteringViewportFullscreen(options);
    },
    [enteringViewportFullscreen, hostRef],
  );

  return {
    isFullscreen,
    isFullscreenSupported,
    togglingViewportFullscreen,
    enteringViewportFullscreen,
  };
}
