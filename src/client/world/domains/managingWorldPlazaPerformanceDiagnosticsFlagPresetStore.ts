/**
 * Persistent store for user-saved perf FLAGS presets.
 *
 * @module components/world/domains/managingWorldPlazaPerformanceDiagnosticsFlagPresetStore
 */

import {
  DEFINING_WORLD_PLAZA_GENERATION_FEATURE_DEFAULTS,
  DEFINING_WORLD_PLAZA_GENERATION_FEATURE_REGISTRY,
  type DefiningWorldPlazaGenerationFeatureId,
} from '@/components/world/domains/definingWorldPlazaGenerationFeatureRegistry';
import {
  DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_FLAG_PRESET_MAX_COUNT,
  DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_FLAG_PRESET_STORAGE_KEY,
  type DefiningWorldPlazaPerformanceDiagnosticsFlagPreset,
} from '@/components/world/domains/definingWorldPlazaPerformanceDiagnosticsFlagPresetConstants';
import { DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_RENDER_LAYER_DEFINITIONS } from '@/components/world/domains/definingWorldPlazaPerformanceDiagnosticsRenderLayerConstants';

type ManagingWorldPlazaPerformanceDiagnosticsFlagPresetState = {
  presets: DefiningWorldPlazaPerformanceDiagnosticsFlagPreset[];
  revision: number;
  isInitializedFromStorage: boolean;
};

const managingWorldPlazaPerformanceDiagnosticsFlagPresetState: ManagingWorldPlazaPerformanceDiagnosticsFlagPresetState =
  {
    presets: [],
    revision: 0,
    isInitializedFromStorage: false,
  };

const managingWorldPlazaPerformanceDiagnosticsFlagPresetSubscribers = new Set<
  () => void
>();

function notifyingWorldPlazaPerformanceDiagnosticsFlagPresetSubscribers(): void {
  for (const onStoreChange of managingWorldPlazaPerformanceDiagnosticsFlagPresetSubscribers) {
    onStoreChange();
  }
}

function sanitizingWorldPlazaPerformanceDiagnosticsFlagPreset(
  rawPreset: unknown
): DefiningWorldPlazaPerformanceDiagnosticsFlagPreset | null {
  if (
    typeof rawPreset !== 'object' ||
    rawPreset === null ||
    Array.isArray(rawPreset)
  ) {
    return null;
  }

  const candidate = rawPreset as Record<string, unknown>;
  const id = candidate.id;
  const name = candidate.name;
  const renderLayerFlags = candidate.renderLayerFlags;
  const generationFeatureFlags = candidate.generationFeatureFlags;

  if (typeof id !== 'string' || typeof name !== 'string' || !name.trim()) {
    return null;
  }

  if (
    typeof renderLayerFlags !== 'object' ||
    renderLayerFlags === null ||
    Array.isArray(renderLayerFlags) ||
    typeof generationFeatureFlags !== 'object' ||
    generationFeatureFlags === null ||
    Array.isArray(generationFeatureFlags)
  ) {
    return null;
  }

  const sanitizedRenderLayerFlags: Record<string, boolean> = {};

  for (const layerDefinition of DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_RENDER_LAYER_DEFINITIONS) {
    const storedValue = (renderLayerFlags as Record<string, unknown>)[
      layerDefinition.layerId
    ];

    if (typeof storedValue === 'boolean') {
      sanitizedRenderLayerFlags[layerDefinition.layerId] = storedValue;
    }
  }

  const sanitizedGenerationFeatureFlags = {
    ...DEFINING_WORLD_PLAZA_GENERATION_FEATURE_DEFAULTS,
  };

  for (const definition of DEFINING_WORLD_PLAZA_GENERATION_FEATURE_REGISTRY) {
    const storedValue = (generationFeatureFlags as Record<string, unknown>)[
      definition.featureId
    ];

    if (typeof storedValue === 'boolean') {
      sanitizedGenerationFeatureFlags[definition.featureId] = storedValue;
    }
  }

  return {
    id,
    name: name.trim(),
    renderLayerFlags: sanitizedRenderLayerFlags,
    generationFeatureFlags: sanitizedGenerationFeatureFlags,
  };
}

function readingWorldPlazaPerformanceDiagnosticsFlagPresetsFromStorage(): DefiningWorldPlazaPerformanceDiagnosticsFlagPreset[] {
  if (typeof window === 'undefined') {
    return [];
  }

  const storedValue = window.localStorage.getItem(
    DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_FLAG_PRESET_STORAGE_KEY
  );

  if (!storedValue) {
    return [];
  }

  try {
    const parsedValue: unknown = JSON.parse(storedValue);

    if (!Array.isArray(parsedValue)) {
      return [];
    }

    const presets: DefiningWorldPlazaPerformanceDiagnosticsFlagPreset[] = [];

    for (const rawPreset of parsedValue) {
      const preset =
        sanitizingWorldPlazaPerformanceDiagnosticsFlagPreset(rawPreset);

      if (preset) {
        presets.push(preset);
      }
    }

    return presets.slice(
      0,
      DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_FLAG_PRESET_MAX_COUNT
    );
  } catch {
    return [];
  }
}

function writingWorldPlazaPerformanceDiagnosticsFlagPresetsToStorage(): void {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(
    DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_FLAG_PRESET_STORAGE_KEY,
    JSON.stringify(
      managingWorldPlazaPerformanceDiagnosticsFlagPresetState.presets
    )
  );
}

export function subscribingWorldPlazaPerformanceDiagnosticsFlagPresets(
  onStoreChange: () => void
): () => void {
  managingWorldPlazaPerformanceDiagnosticsFlagPresetSubscribers.add(
    onStoreChange
  );
  return () => {
    managingWorldPlazaPerformanceDiagnosticsFlagPresetSubscribers.delete(
      onStoreChange
    );
  };
}

export function gettingWorldPlazaPerformanceDiagnosticsFlagPresetRevision(): number {
  return managingWorldPlazaPerformanceDiagnosticsFlagPresetState.revision;
}

export function listingWorldPlazaPerformanceDiagnosticsFlagPresets(): readonly DefiningWorldPlazaPerformanceDiagnosticsFlagPreset[] {
  return managingWorldPlazaPerformanceDiagnosticsFlagPresetState.presets;
}

export function initializingWorldPlazaPerformanceDiagnosticsFlagPresetStoreFromStorage(): void {
  if (
    managingWorldPlazaPerformanceDiagnosticsFlagPresetState.isInitializedFromStorage
  ) {
    return;
  }

  managingWorldPlazaPerformanceDiagnosticsFlagPresetState.presets =
    readingWorldPlazaPerformanceDiagnosticsFlagPresetsFromStorage();
  managingWorldPlazaPerformanceDiagnosticsFlagPresetState.isInitializedFromStorage = true;
  managingWorldPlazaPerformanceDiagnosticsFlagPresetState.revision += 1;
}

/**
 * Saves a new preset or overwrites an existing preset with the same name.
 */
export function savingWorldPlazaPerformanceDiagnosticsFlagPreset(
  preset: DefiningWorldPlazaPerformanceDiagnosticsFlagPreset
): void {
  initializingWorldPlazaPerformanceDiagnosticsFlagPresetStoreFromStorage();

  const normalizedName = preset.name.trim();
  const existingIndex =
    managingWorldPlazaPerformanceDiagnosticsFlagPresetState.presets.findIndex(
      (storedPreset) =>
        storedPreset.name.localeCompare(normalizedName, undefined, {
          sensitivity: 'accent',
        }) === 0
    );

  if (existingIndex >= 0) {
    const nextPresets = [
      ...managingWorldPlazaPerformanceDiagnosticsFlagPresetState.presets,
    ];
    nextPresets[existingIndex] = {
      ...preset,
      name: normalizedName,
    };
    managingWorldPlazaPerformanceDiagnosticsFlagPresetState.presets =
      nextPresets;
  } else {
    const nextPresets = [
      {
        ...preset,
        name: normalizedName,
      },
      ...managingWorldPlazaPerformanceDiagnosticsFlagPresetState.presets,
    ].slice(
      0,
      DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_FLAG_PRESET_MAX_COUNT
    );
    managingWorldPlazaPerformanceDiagnosticsFlagPresetState.presets =
      nextPresets;
  }

  managingWorldPlazaPerformanceDiagnosticsFlagPresetState.revision += 1;
  writingWorldPlazaPerformanceDiagnosticsFlagPresetsToStorage();
  notifyingWorldPlazaPerformanceDiagnosticsFlagPresetSubscribers();
}

export function deletingWorldPlazaPerformanceDiagnosticsFlagPreset(
  presetId: string
): void {
  initializingWorldPlazaPerformanceDiagnosticsFlagPresetStoreFromStorage();

  const nextPresets =
    managingWorldPlazaPerformanceDiagnosticsFlagPresetState.presets.filter(
      (preset) => preset.id !== presetId
    );

  if (
    nextPresets.length ===
    managingWorldPlazaPerformanceDiagnosticsFlagPresetState.presets.length
  ) {
    return;
  }

  managingWorldPlazaPerformanceDiagnosticsFlagPresetState.presets = nextPresets;
  managingWorldPlazaPerformanceDiagnosticsFlagPresetState.revision += 1;
  writingWorldPlazaPerformanceDiagnosticsFlagPresetsToStorage();
  notifyingWorldPlazaPerformanceDiagnosticsFlagPresetSubscribers();
}

/** Test helper. */
export function clearingWorldPlazaPerformanceDiagnosticsFlagPresetStoreForTests(): void {
  managingWorldPlazaPerformanceDiagnosticsFlagPresetState.presets = [];
  managingWorldPlazaPerformanceDiagnosticsFlagPresetState.revision = 0;
  managingWorldPlazaPerformanceDiagnosticsFlagPresetState.isInitializedFromStorage = false;

  if (typeof window !== 'undefined') {
    window.localStorage.removeItem(
      DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_FLAG_PRESET_STORAGE_KEY
    );
  }

  notifyingWorldPlazaPerformanceDiagnosticsFlagPresetSubscribers();
}

export function creatingWorldPlazaPerformanceDiagnosticsFlagPresetId(): string {
  return `perf-flag-preset-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export type { DefiningWorldPlazaGenerationFeatureId };
