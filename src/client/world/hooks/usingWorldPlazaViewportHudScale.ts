"use client";

import { computingWorldPlazaViewportHudScale } from "@/components/world/domains/computingWorldPlazaViewportHudScale";
import { useEffect, useState, type RefObject } from "react";

/**
 * Tracks plaza HUD scale from the live viewport frame element.
 *
 * @param viewportFrameRef - Plaza game viewport frame (`resizeTo` target)
 */
export function usingWorldPlazaViewportHudScale(
  viewportFrameRef: RefObject<HTMLElement | null>,
): number {
  const [viewportHudScale, setViewportHudScale] = useState(1);

  useEffect(() => {
    const viewportFrame = viewportFrameRef.current;

    if (!viewportFrame) {
      return;
    }

    const updatingViewportHudScale = (): void => {
      const { width, height } = viewportFrame.getBoundingClientRect();
      setViewportHudScale(computingWorldPlazaViewportHudScale(width, height));
    };

    updatingViewportHudScale();

    const resizeObserver = new ResizeObserver(updatingViewportHudScale);
    resizeObserver.observe(viewportFrame);

    return () => {
      resizeObserver.disconnect();
    };
  }, [viewportFrameRef]);

  return viewportHudScale;
}
