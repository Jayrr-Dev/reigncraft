/**
 * Captures the current FLAGS state into a preset payload.
 *
 * @module components/world/domains/capturingWorldPlazaPerformanceDiagnosticsFlagPresetFromCurrent
 */

import type { DefiningWorldPlazaPerformanceDiagnosticsFlagPreset } from '@/components/world/domains/definingWorldPlazaPerformanceDiagnosticsFlagPresetConstants';
import { gettingWorldPlazaGenerationFeatureFlagsSnapshot } from '@/components/world/domains/managingWorldPlazaGenerationFeatureStore';
import { creatingWorldPlazaPerformanceDiagnosticsFlagPresetId } from '@/components/world/domains/managingWorldPlazaPerformanceDiagnosticsFlagPresetStore';
import { copyingWorldPlazaPerformanceDiagnosticsRenderLayerFlagsSnapshot } from '@/components/world/domains/measuringWorldPlazaPerformanceDiagnostics';

/**
 * Builds a preset from the live render-layer and generation-feature snapshots.
 *
 * @param name - Display name for the preset.
 */
export function capturingWorldPlazaPerformanceDiagnosticsFlagPresetFromCurrent(
  name: string
): DefiningWorldPlazaPerformanceDiagnosticsFlagPreset {
  return {
    id: creatingWorldPlazaPerformanceDiagnosticsFlagPresetId(),
    name,
    renderLayerFlags:
      copyingWorldPlazaPerformanceDiagnosticsRenderLayerFlagsSnapshot(),
    generationFeatureFlags: {
      ...gettingWorldPlazaGenerationFeatureFlagsSnapshot(),
    },
  };
}
