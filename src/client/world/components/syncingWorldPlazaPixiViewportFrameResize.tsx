"use client";

import { checkingWorldPlazaPixiApplicationIsReady } from "@/components/world/domains/checkingWorldPlazaPixiApplicationIsReady";
import { invalidatingWorldPlazaPixiViewportSizeLastKnownGood } from "@/components/world/domains/resolvingWorldPlazaPixiViewportSize";
import { useApplication, useTick } from "@pixi/react";
import { useEffect } from "react";

/** Canvas classes so the Pixi surface fills the stage layer. */
const SYNCING_WORLD_PLAZA_PIXI_VIEWPORT_FRAME_CANVAS_CLASS_NAME =
  "block h-full w-full" as const;

export { SYNCING_WORLD_PLAZA_PIXI_VIEWPORT_FRAME_CANVAS_CLASS_NAME };

export interface SyncingWorldPlazaPixiViewportFrameResizeProps {
  /** Plaza viewport frame whose client size drives renderer.resize. */
  viewportFrameRef: React.RefObject<HTMLElement | null>;
}

/**
 * Keeps the Pixi renderer sized to the viewport frame.
 *
 * In Reddit iframes and flex layouts the frame can briefly report 0×0 between
 * layout passes. Never call renderer.resize with zero dimensions, and keep
 * re-syncing each tick until the renderer matches the frame so terrain sync and
 * the camera rig do not alternate between drawing and bailing every frame.
 *
 * Do not gate resize on {@link checkingWorldPlazaPixiApplicationIsReady}: that
 * helper requires a non-zero screen, which is exactly what we are trying to fix.
 */
export function SyncingWorldPlazaPixiViewportFrameResize({
  viewportFrameRef,
}: SyncingWorldPlazaPixiViewportFrameResizeProps): null {
  const applicationContext = useApplication();

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
      return checkingWorldPlazaPixiApplicationIsReady(applicationContext);
    }

    renderer.resize(clientWidth, clientHeight);

    return checkingWorldPlazaPixiApplicationIsReady(applicationContext);
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
      invalidatingWorldPlazaPixiViewportSizeLastKnownGood();
    };
  }, [applicationContext, viewportFrameRef]);

  useTick(() => {
    resizingRendererToViewportFrame();
  });

  return null;
}
