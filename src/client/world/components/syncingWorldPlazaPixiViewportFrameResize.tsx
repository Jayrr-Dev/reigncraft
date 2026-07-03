"use client";

import { checkingWorldPlazaPixiApplicationIsReady } from "@/components/world/domains/checkingWorldPlazaPixiApplicationIsReady";
import { useApplication, useTick } from "@pixi/react";
import { useEffect, useRef } from "react";

/** Canvas classes so the Pixi surface fills the stage layer. */
const SYNCING_WORLD_PLAZA_PIXI_VIEWPORT_FRAME_CANVAS_CLASS_NAME =
  "block h-full w-full" as const;

export { SYNCING_WORLD_PLAZA_PIXI_VIEWPORT_FRAME_CANVAS_CLASS_NAME };

export interface SyncingWorldPlazaPixiViewportFrameResizeProps {
  /** Plaza viewport frame passed to Pixi `resizeTo`. */
  viewportFrameRef: React.RefObject<HTMLElement | null>;
}

/**
 * Keeps the Pixi renderer sized to the viewport frame.
 *
 * Pixi's {@link ResizePlugin} only listens to `window` resize events. In flex
 * layouts the frame can still be 0×0 on first paint, leaving the renderer at
 * zero height until a window resize — which never comes — so terrain sync and
 * the camera rig bail out every tick.
 *
 * Do not gate resize on {@link checkingWorldPlazaPixiApplicationIsReady}: that
 * helper requires a non-zero screen, which is exactly what we are trying to fix.
 */
export function SyncingWorldPlazaPixiViewportFrameResize({
  viewportFrameRef,
}: SyncingWorldPlazaPixiViewportFrameResizeProps): null {
  const applicationContext = useApplication();
  const hasSyncedNonZeroViewportRef = useRef(false);

  const resizingRendererToViewportFrame = (): boolean => {
    const viewportFrame = viewportFrameRef.current;
    const app = applicationContext.app;
    const renderer = app?.renderer;

    if (!viewportFrame || !renderer) {
      return false;
    }

    const { clientWidth, clientHeight } = viewportFrame;

    if (clientWidth <= 0 || clientHeight <= 0) {
      return false;
    }

    const screen = renderer.screen;

    if (screen.width === clientWidth && screen.height === clientHeight) {
      hasSyncedNonZeroViewportRef.current = true;
      return true;
    }

    renderer.resize(clientWidth, clientHeight);

    hasSyncedNonZeroViewportRef.current =
      checkingWorldPlazaPixiApplicationIsReady(applicationContext);
    return hasSyncedNonZeroViewportRef.current;
  };

  useEffect(() => {
    const viewportFrame = viewportFrameRef.current;

    if (!viewportFrame) {
      return;
    }

    resizingRendererToViewportFrame();

    const resizeObserver = new ResizeObserver(() => {
      resizingRendererToViewportFrame();
    });
    resizeObserver.observe(viewportFrame);

    return () => {
      resizeObserver.disconnect();
    };
  }, [applicationContext, viewportFrameRef]);

  useTick(() => {
    if (hasSyncedNonZeroViewportRef.current) {
      return;
    }

    resizingRendererToViewportFrame();
  });

  return null;
}
