/**
 * Applies one saved FLAGS preset to the live plaza toggles.
 *
 * @module components/world/domains/applyingWorldPlazaPerformanceDiagnosticsFlagPreset
 */

import { applyingWorldPlazaPerformanceTesterRenderLayerFlagsSnapshot } from '@/components/world/domains/applyingWorldPlazaPerformanceTesterStepConfig';
import { DEFINING_WORLD_PLAZA_GENERATION_FEATURE_REGISTRY } from '@/components/world/domains/definingWorldPlazaGenerationFeatureRegistry';
import type { DefiningWorldPlazaPerformanceDiagnosticsFlagPreset } from '@/components/world/domains/definingWorldPlazaPerformanceDiagnosticsFlagPresetConstants';
import { settingWorldPlazaGenerationFeatureEnabled } from '@/components/world/domains/managingWorldPlazaGenerationFeatureStore';

/**
 * Restores render layers and generation features from a saved preset.
 *
 * @param preset - Saved FLAGS preset.
 */
export function applyingWorldPlazaPerformanceDiagnosticsFlagPreset(
  preset: DefiningWorldPlazaPerformanceDiagnosticsFlagPreset
): void {
  applyingWorldPlazaPerformanceTesterRenderLayerFlagsSnapshot(
    preset.renderLayerFlags
  );

  for (const definition of DEFINING_WORLD_PLAZA_GENERATION_FEATURE_REGISTRY) {
    const isEnabled =
      preset.generationFeatureFlags[definition.featureId] ?? true;

    settingWorldPlazaGenerationFeatureEnabled(definition.featureId, isEnabled);
  }
}
