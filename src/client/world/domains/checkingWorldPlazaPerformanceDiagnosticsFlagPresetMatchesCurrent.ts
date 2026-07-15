/**
 * Checks whether a saved FLAGS preset matches the current live toggles.
 *
 * @module components/world/domains/checkingWorldPlazaPerformanceDiagnosticsFlagPresetMatchesCurrent
 */

import { DEFINING_WORLD_PLAZA_GENERATION_FEATURE_REGISTRY } from '@/components/world/domains/definingWorldPlazaGenerationFeatureRegistry';
import type { DefiningWorldPlazaPerformanceDiagnosticsFlagPreset } from '@/components/world/domains/definingWorldPlazaPerformanceDiagnosticsFlagPresetConstants';
import { DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_RENDER_LAYER_DEFINITIONS } from '@/components/world/domains/definingWorldPlazaPerformanceDiagnosticsRenderLayerConstants';
import { gettingWorldPlazaGenerationFeatureFlagsSnapshot } from '@/components/world/domains/managingWorldPlazaGenerationFeatureStore';
import { copyingWorldPlazaPerformanceDiagnosticsRenderLayerFlagsSnapshot } from '@/components/world/domains/measuringWorldPlazaPerformanceDiagnostics';

/**
 * Returns true when both render layers and generation features match `preset`.
 *
 * @param preset - Saved FLAGS preset.
 */
export function checkingWorldPlazaPerformanceDiagnosticsFlagPresetMatchesCurrent(
  preset: DefiningWorldPlazaPerformanceDiagnosticsFlagPreset
): boolean {
  const currentRenderLayerFlags =
    copyingWorldPlazaPerformanceDiagnosticsRenderLayerFlagsSnapshot();
  const currentGenerationFeatureFlags =
    gettingWorldPlazaGenerationFeatureFlagsSnapshot();

  for (const layerDefinition of DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_RENDER_LAYER_DEFINITIONS) {
    const presetValue =
      preset.renderLayerFlags[layerDefinition.layerId] ?? true;
    const currentValue =
      currentRenderLayerFlags[layerDefinition.layerId] ?? true;

    if (presetValue !== currentValue) {
      return false;
    }
  }

  for (const definition of DEFINING_WORLD_PLAZA_GENERATION_FEATURE_REGISTRY) {
    const presetValue =
      preset.generationFeatureFlags[definition.featureId] ?? true;
    const currentValue =
      currentGenerationFeatureFlags[definition.featureId] ?? true;

    if (presetValue !== currentValue) {
      return false;
    }
  }

  return true;
}
