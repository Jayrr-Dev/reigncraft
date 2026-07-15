import { applyingWorldPlazaPerformanceDiagnosticsFlagPreset } from '@/components/world/domains/applyingWorldPlazaPerformanceDiagnosticsFlagPreset';
import { capturingWorldPlazaPerformanceDiagnosticsFlagPresetFromCurrent } from '@/components/world/domains/capturingWorldPlazaPerformanceDiagnosticsFlagPresetFromCurrent';
import { checkingWorldPlazaPerformanceDiagnosticsFlagPresetMatchesCurrent } from '@/components/world/domains/checkingWorldPlazaPerformanceDiagnosticsFlagPresetMatchesCurrent';
import {
  DEFINING_WORLD_PLAZA_GENERATION_FEATURE,
  DEFINING_WORLD_PLAZA_GENERATION_FEATURE_DEFAULTS,
} from '@/components/world/domains/definingWorldPlazaGenerationFeatureRegistry';
import { DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_RENDER_LAYER } from '@/components/world/domains/definingWorldPlazaPerformanceDiagnosticsRenderLayerConstants';
import {
  resettingWorldPlazaGenerationFeatureStoreForTests,
  settingWorldPlazaGenerationFeatureEnabled,
} from '@/components/world/domains/managingWorldPlazaGenerationFeatureStore';
import {
  clearingWorldPlazaPerformanceDiagnosticsFlagPresetStoreForTests,
  savingWorldPlazaPerformanceDiagnosticsFlagPreset,
} from '@/components/world/domains/managingWorldPlazaPerformanceDiagnosticsFlagPresetStore';
import {
  resettingWorldPlazaPerformanceDiagnostics,
  settingWorldPlazaPerformanceDiagnosticsEnabled,
  settingWorldPlazaPerformanceDiagnosticsRenderLayer,
} from '@/components/world/domains/measuringWorldPlazaPerformanceDiagnostics';
import { afterEach, describe, expect, it } from 'vitest';

describe('world plaza perf flag presets', () => {
  afterEach(() => {
    settingWorldPlazaPerformanceDiagnosticsEnabled(false);
    resettingWorldPlazaGenerationFeatureStoreForTests();
    clearingWorldPlazaPerformanceDiagnosticsFlagPresetStoreForTests();
  });

  it('captures, applies, and matches the current FLAGS state', () => {
    settingWorldPlazaPerformanceDiagnosticsEnabled(true);
    resettingWorldPlazaPerformanceDiagnostics();
    settingWorldPlazaPerformanceDiagnosticsRenderLayer(
      DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_RENDER_LAYER.TREE_CANOPIES,
      false
    );
    settingWorldPlazaGenerationFeatureEnabled(
      DEFINING_WORLD_PLAZA_GENERATION_FEATURE.MUSHROOMS,
      false
    );

    const preset =
      capturingWorldPlazaPerformanceDiagnosticsFlagPresetFromCurrent(
        'No canopies'
      );
    savingWorldPlazaPerformanceDiagnosticsFlagPreset(preset);

    expect(
      checkingWorldPlazaPerformanceDiagnosticsFlagPresetMatchesCurrent(preset)
    ).toBe(true);

    settingWorldPlazaPerformanceDiagnosticsRenderLayer(
      DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_RENDER_LAYER.TREE_CANOPIES,
      true
    );
    settingWorldPlazaGenerationFeatureEnabled(
      DEFINING_WORLD_PLAZA_GENERATION_FEATURE.MUSHROOMS,
      true
    );
    expect(
      checkingWorldPlazaPerformanceDiagnosticsFlagPresetMatchesCurrent(preset)
    ).toBe(false);

    applyingWorldPlazaPerformanceDiagnosticsFlagPreset(preset);
    expect(
      checkingWorldPlazaPerformanceDiagnosticsFlagPresetMatchesCurrent(preset)
    ).toBe(true);
  });

  it('fills missing generation feature keys from defaults when loading', () => {
    const preset =
      capturingWorldPlazaPerformanceDiagnosticsFlagPresetFromCurrent(
        'Defaults check'
      );

    expect(preset.generationFeatureFlags).toEqual(
      DEFINING_WORLD_PLAZA_GENERATION_FEATURE_DEFAULTS
    );
  });
});
