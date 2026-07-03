"use client";

import { checkingWorldPlazaPixiApplicationIsReady } from "@/components/world/domains/checkingWorldPlazaPixiApplicationIsReady";
import { settingWorldPlazaClientDebugStatus } from "@/components/world/domains/loggingWorldPlazaClientErrors";
import { useApplication, useTick } from "@pixi/react";
import { useRef } from "react";

export interface ReportingWorldPlazaPixiViewportDebugStatusProps {
  /** Plaza viewport frame passed to Pixi `resizeTo`. */
  viewportFrameRef: React.RefObject<HTMLElement | null>;
}

/**
 * Publishes Pixi viewport and renderer dimensions to the on-screen debug log.
 */
export function ReportingWorldPlazaPixiViewportDebugStatus({
  viewportFrameRef,
}: ReportingWorldPlazaPixiViewportDebugStatusProps): null {
  const applicationContext = useApplication();
  const lastReportAtMsRef = useRef(0);

  useTick(() => {
    const nowMs = performance.now();

    if (nowMs - lastReportAtMsRef.current < 500) {
      return;
    }

    lastReportAtMsRef.current = nowMs;

    const viewportFrame = viewportFrameRef.current;
    const frameWidth = viewportFrame?.clientWidth ?? 0;
    const frameHeight = viewportFrame?.clientHeight ?? 0;

    settingWorldPlazaClientDebugStatus(
      "viewport-frame",
      `frame ${frameWidth}×${frameHeight}`,
    );

    const isPixiReady =
      checkingWorldPlazaPixiApplicationIsReady(applicationContext);
    const renderer = applicationContext.app?.renderer;
    const screenWidth = isPixiReady ? renderer.screen.width : 0;
    const screenHeight = isPixiReady ? renderer.screen.height : 0;

    settingWorldPlazaClientDebugStatus(
      "pixi-screen",
      `pixi ${screenWidth}×${screenHeight} ready=${isPixiReady ? "yes" : "no"}`,
    );
  });

  return null;
}
