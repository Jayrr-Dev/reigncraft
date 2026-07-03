"use client";

import { checkingWorldPlazaPixiApplicationIsReady } from "@/components/world/domains/checkingWorldPlazaPixiApplicationIsReady";
import { DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_SAMPLE } from "@/components/world/domains/definingWorldPlazaPerformanceDiagnosticsConstants";
import {
  checkingWorldPlazaPerformanceDiagnosticsIsEnabled,
  recordingWorldPlazaPerformanceSampleDuration,
} from "@/components/world/domains/measuringWorldPlazaPerformanceDiagnostics";
import { useApplication } from "@pixi/react";
import type { Renderer } from "pixi.js";
import { useEffect } from "react";

/**
 * Records Pixi GPU render time each frame for performance diagnostics.
 *
 * Patches {@link Renderer.render} because the application ticker binds
 * `app.render` at init time and would bypass a later `app.render` swap.
 */
export function MeasuringWorldPlazaPixiRenderDiagnostics(): null {
  const applicationContext = useApplication();

  useEffect(() => {
    if (!checkingWorldPlazaPixiApplicationIsReady(applicationContext)) {
      return;
    }

    const pixiRenderer = applicationContext.app.renderer;
    const originalRendererRender = pixiRenderer.render.bind(pixiRenderer);

    pixiRenderer.render = ((...renderArgs: Parameters<Renderer["render"]>) => {
      if (!checkingWorldPlazaPerformanceDiagnosticsIsEnabled()) {
        originalRendererRender(...renderArgs);
        return;
      }

      const renderStartedAtMs = performance.now();
      originalRendererRender(...renderArgs);
      recordingWorldPlazaPerformanceSampleDuration(
        DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_SAMPLE.PIXI_RENDER,
        performance.now() - renderStartedAtMs,
      );
    }) as Renderer["render"];

    return () => {
      pixiRenderer.render = originalRendererRender;
    };
  }, [applicationContext]);

  return null;
}
