'use client';

import { checkingWorldPlazaPixiApplicationIsReady } from '@/components/world/domains/checkingWorldPlazaPixiApplicationIsReady';
import { settingWorldPlazaClientDebugStatus } from '@/components/world/domains/loggingWorldPlazaClientErrors';
import { usingWorldPlazaSafeTick } from '@/components/world/hooks/usingWorldPlazaSafeTick';
import { useApplication } from '@pixi/react';
import { useRef } from 'react';

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

  usingWorldPlazaSafeTick(() => {
    const nowMs = performance.now();

    if (nowMs - lastReportAtMsRef.current < 500) {
      return;
    }

    lastReportAtMsRef.current = nowMs;

    const viewportFrame = viewportFrameRef.current;
    const frameWidth = viewportFrame?.clientWidth ?? 0;
    const frameHeight = viewportFrame?.clientHeight ?? 0;

    const isPixiReady =
      checkingWorldPlazaPixiApplicationIsReady(applicationContext);
    const renderer = applicationContext.app?.renderer;
    const screenWidth = isPixiReady ? renderer.screen.width : 0;
    const screenHeight = isPixiReady ? renderer.screen.height : 0;

    const dimensionsMatchFrame =
      screenWidth === frameWidth && screenHeight === frameHeight;
    const sizeLabel = dimensionsMatchFrame
      ? `${frameWidth}×${frameHeight}`
      : `${frameWidth}×${frameHeight}/${screenWidth}×${screenHeight}`;

    settingWorldPlazaClientDebugStatus(
      'viewport-pixi',
      `${sizeLabel} pixi=${isPixiReady ? 'ok' : 'no'}`
    );
  }, 'tick:viewport-debug');

  return null;
}
