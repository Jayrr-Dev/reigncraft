"use client";

import {
  buildingWorldPlazaPerformanceDiagnosticsRenderLayerFlagsSnapshot,
  checkingWorldPlazaPerformanceDiagnosticsIsEnabled,
  subscribingWorldPlazaPerformanceDiagnosticsRenderLayerFlags,
} from "@/components/world/domains/measuringWorldPlazaPerformanceDiagnostics";
import type { DefiningWorldPlazaPerformanceDiagnosticsRenderLayerId } from "@/components/world/domains/definingWorldPlazaPerformanceDiagnosticsRenderLayerConstants";
import { useSyncExternalStore } from "react";

/**
 * Subscribes to perf render-layer flag changes for React DOM layers.
 */
export function usingWorldPlazaPerformanceDiagnosticsRenderLayerFlags(): Readonly<
  Record<string, boolean>
> {
  return useSyncExternalStore(
    subscribingWorldPlazaPerformanceDiagnosticsRenderLayerFlags,
    buildingWorldPlazaPerformanceDiagnosticsRenderLayerFlagsSnapshot,
    buildingWorldPlazaPerformanceDiagnosticsRenderLayerFlagsSnapshot,
  );
}

/**
 * Returns whether one render layer is enabled for React DOM consumers.
 *
 * @param layerId - Render layer identifier.
 */
export function checkingWorldPlazaPerformanceDiagnosticsRenderLayerIsEnabledFromStore(
  layerId: DefiningWorldPlazaPerformanceDiagnosticsRenderLayerId,
  renderLayerFlags: Readonly<Record<string, boolean>>,
): boolean {
  if (!checkingWorldPlazaPerformanceDiagnosticsIsEnabled()) {
    return true;
  }

  return renderLayerFlags[layerId] ?? true;
}
