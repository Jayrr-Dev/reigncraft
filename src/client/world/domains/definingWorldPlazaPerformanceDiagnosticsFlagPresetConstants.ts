/**
 * Perf overlay FLAGS tab: saved preset limits and UI labels.
 *
 * @module components/world/domains/definingWorldPlazaPerformanceDiagnosticsFlagPresetConstants
 */

import type { DefiningWorldPlazaGenerationFeatureId } from '@/components/world/domains/definingWorldPlazaGenerationFeatureRegistry';

/** localStorage key for user-saved FLAGS presets. */
export const DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_FLAG_PRESET_STORAGE_KEY =
  'world-plaza-perf-flag-presets-v1' as const;

/** Maximum number of saved presets. */
export const DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_FLAG_PRESET_MAX_COUNT = 12;

/** One saved FLAGS preset (render layers + generation features). */
export type DefiningWorldPlazaPerformanceDiagnosticsFlagPreset = {
  readonly id: string;
  readonly name: string;
  readonly renderLayerFlags: Readonly<Record<string, boolean>>;
  readonly generationFeatureFlags: Readonly<
    Record<DefiningWorldPlazaGenerationFeatureId, boolean>
  >;
};

export const LABELING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_FLAG_PRESET_SECTION =
  'Presets' as const;

export const LABELING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_FLAG_PRESET_SELECT_PLACEHOLDER =
  'Select preset…' as const;

export const LABELING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_FLAG_PRESET_APPLY =
  'Apply' as const;

export const LABELING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_FLAG_PRESET_SAVE =
  'Save current' as const;

export const LABELING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_FLAG_PRESET_DELETE =
  'Delete' as const;

export const LABELING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_FLAG_PRESET_ACTIVE =
  'Active:' as const;

export const LABELING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_FLAG_PRESET_SAVE_PROMPT =
  'Preset name' as const;

export const LABELING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_FLAG_PRESET_COMPARE_SECTION =
  'Compare' as const;

export const LABELING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_FLAG_PRESET_CAPTURE_A =
  'Capture A' as const;

export const LABELING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_FLAG_PRESET_CAPTURE_B =
  'Capture B' as const;

export const LABELING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_FLAG_PRESET_CLEAR_AB =
  'Clear A/B' as const;

export const LABELING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_FLAG_PRESET_DELTA_FPS_SUFFIX =
  ' fps' as const;
