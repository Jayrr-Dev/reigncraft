'use client';

import { RenderingWorldPlazaPerformanceDiagnosticsFlagPresetBar } from '@/components/world/components/renderingWorldPlazaPerformanceDiagnosticsFlagPresetBar';
import { DEFINING_WORLD_PLAZA_UI_DATA_ATTRIBUTE } from '@/components/world/domains/definingWorldPlazaClickMovementConstants';
import {
  DEFINING_WORLD_PLAZA_GENERATION_FEATURE,
  DEFINING_WORLD_PLAZA_GENERATION_FEATURE_GROUP_LABELS,
  DEFINING_WORLD_PLAZA_GENERATION_FEATURE_GROUP_ORDER,
  DEFINING_WORLD_PLAZA_GENERATION_FEATURE_REGISTRY,
  type DefiningWorldPlazaGenerationFeatureDefinition,
  type DefiningWorldPlazaGenerationFeatureGroupId,
  type DefiningWorldPlazaGenerationFeatureId,
} from '@/components/world/domains/definingWorldPlazaGenerationFeatureRegistry';
import {
  DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_FLAG_ACTION_CHIP_CLASS_NAME,
  DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_FLAG_BADGE_OFF_CLASS_NAME,
  DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_FLAG_BADGE_ON_CLASS_NAME,
  DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_FLAG_PRIORITY_ORDER,
} from '@/components/world/domains/definingWorldPlazaPerformanceDiagnosticsFlagBadgeConstants';
import { DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_RENDER_LAYER_DEFINITIONS } from '@/components/world/domains/definingWorldPlazaPerformanceDiagnosticsRenderLayerConstants';
import {
  checkingWorldPlazaDevQaLoadEnabled,
  subscribingWorldPlazaDevQaLoad,
} from '@/components/world/domains/managingWorldPlazaDevQaLoadStore';
import {
  resettingWorldPlazaPerformanceDiagnosticsRenderLayerFlags,
  togglingWorldPlazaPerformanceDiagnosticsRenderLayer,
} from '@/components/world/domains/measuringWorldPlazaPerformanceDiagnostics';
import { usingWorldPlazaGenerationFeaturesState } from '@/components/world/hooks/usingWorldPlazaGenerationFeaturesState';
import { usingWorldPlazaPerformanceDiagnosticsRenderLayerFlags } from '@/components/world/hooks/usingWorldPlazaPerformanceDiagnosticsRenderLayerFlags';
import { useSyncExternalStore } from 'react';

function sortingWorldPlazaPerformanceDiagnosticsFlagDefinitions(
  definitions: readonly DefiningWorldPlazaGenerationFeatureDefinition[]
): DefiningWorldPlazaGenerationFeatureDefinition[] {
  const priorityIndexByFeatureId = new Map<
    DefiningWorldPlazaGenerationFeatureId,
    number
  >(
    DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_FLAG_PRIORITY_ORDER.map(
      (featureId, index) => [featureId, index]
    )
  );

  return [...definitions].sort((left, right) => {
    const leftPriority =
      priorityIndexByFeatureId.get(left.featureId) ?? Number.MAX_SAFE_INTEGER;
    const rightPriority =
      priorityIndexByFeatureId.get(right.featureId) ?? Number.MAX_SAFE_INTEGER;

    if (leftPriority !== rightPriority) {
      return leftPriority - rightPriority;
    }

    return left.label.localeCompare(right.label);
  });
}

const RENDERING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_FLAG_GROUPS: ReadonlyArray<{
  groupId: DefiningWorldPlazaGenerationFeatureGroupId;
  definitions: readonly DefiningWorldPlazaGenerationFeatureDefinition[];
}> = DEFINING_WORLD_PLAZA_GENERATION_FEATURE_GROUP_ORDER.map((groupId) => ({
  groupId,
  definitions: sortingWorldPlazaPerformanceDiagnosticsFlagDefinitions(
    DEFINING_WORLD_PLAZA_GENERATION_FEATURE_REGISTRY.filter(
      (definition) => definition.groupId === groupId
    )
  ),
})).filter((group) => group.definitions.length > 0);

/**
 * Toggleable badge buttons for render layers + generation / system flags.
 */
export function RenderingWorldPlazaPerformanceDiagnosticsFlagBadges(): React.JSX.Element {
  const { flags, settingFeatureEnabled } =
    usingWorldPlazaGenerationFeaturesState();
  const renderLayerFlags =
    usingWorldPlazaPerformanceDiagnosticsRenderLayerFlags();
  const isDevQaLoadEnabled = useSyncExternalStore(
    subscribingWorldPlazaDevQaLoad,
    checkingWorldPlazaDevQaLoadEnabled,
    () => false
  );

  const enabledSystemCount =
    DEFINING_WORLD_PLAZA_GENERATION_FEATURE_REGISTRY.filter(
      (definition) => flags[definition.featureId]
    ).length;
  const totalSystemCount =
    DEFINING_WORLD_PLAZA_GENERATION_FEATURE_REGISTRY.length;
  const enabledLayerCount =
    DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_RENDER_LAYER_DEFINITIONS.filter(
      (layerDefinition) => renderLayerFlags[layerDefinition.layerId] ?? true
    ).length;
  const totalLayerCount =
    DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_RENDER_LAYER_DEFINITIONS.length;

  const settingAllFeaturesEnabled = (isEnabled: boolean): void => {
    for (const definition of DEFINING_WORLD_PLAZA_GENERATION_FEATURE_REGISTRY) {
      // Keep Audio SFX on during "All off" so perf bisects stay audible and
      // localStorage does not trap the mixer silent after profiling.
      if (
        !isEnabled &&
        definition.featureId ===
          DEFINING_WORLD_PLAZA_GENERATION_FEATURE.AUDIO_SFX
      ) {
        settingFeatureEnabled(definition.featureId, true);
        continue;
      }
      settingFeatureEnabled(definition.featureId, isEnabled);
    }
  };

  return (
    <div>
      {isDevQaLoadEnabled ? (
        <div className="mb-1.5 rounded border border-lime-300/30 bg-lime-500/10 px-1.5 py-1 text-[9px] text-lime-100/90">
          Creative session: system toggles write session override only (no
          localStorage).
        </div>
      ) : null}

      <RenderingWorldPlazaPerformanceDiagnosticsFlagPresetBar />

      <div className="mb-1.5 text-amber-100/65">
        Tap badges to isolate. Lime = on, muted = off.
      </div>

      <div className="mb-2 border-b border-amber-300/15 pb-2">
        <div className="mb-1 flex flex-wrap items-center justify-between gap-1.5">
          <div className="font-semibold text-amber-200">
            Render layers{' '}
            <span className="font-normal text-amber-100/60">
              {enabledLayerCount}/{totalLayerCount} on
            </span>
          </div>
          <button
            type="button"
            {...{ [DEFINING_WORLD_PLAZA_UI_DATA_ATTRIBUTE]: true }}
            className={
              DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_FLAG_ACTION_CHIP_CLASS_NAME
            }
            onClick={() => {
              resettingWorldPlazaPerformanceDiagnosticsRenderLayerFlags();
            }}
          >
            Reset layers
          </button>
        </div>
        <div className="mb-1 text-[9px] text-amber-100/55">
          Hide draw work / skip that layer sync.
        </div>
        <div className="flex flex-wrap gap-1">
          {DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_RENDER_LAYER_DEFINITIONS.map(
            (layerDefinition) => {
              const isEnabled =
                renderLayerFlags[layerDefinition.layerId] ?? true;

              return (
                <button
                  key={layerDefinition.layerId}
                  type="button"
                  {...{ [DEFINING_WORLD_PLAZA_UI_DATA_ATTRIBUTE]: true }}
                  aria-pressed={isEnabled}
                  className={
                    isEnabled
                      ? DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_FLAG_BADGE_ON_CLASS_NAME
                      : DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_FLAG_BADGE_OFF_CLASS_NAME
                  }
                  onClick={() => {
                    togglingWorldPlazaPerformanceDiagnosticsRenderLayer(
                      layerDefinition.layerId
                    );
                  }}
                >
                  {layerDefinition.label}
                </button>
              );
            }
          )}
        </div>
      </div>

      <div className="mb-1.5 flex flex-wrap items-center justify-between gap-1.5">
        <div className="font-semibold text-amber-200">
          Systems{' '}
          <span className="font-normal text-amber-100/60">
            {enabledSystemCount}/{totalSystemCount} on
          </span>
        </div>
        <div className="flex flex-wrap gap-1">
          <button
            type="button"
            {...{ [DEFINING_WORLD_PLAZA_UI_DATA_ATTRIBUTE]: true }}
            className={
              DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_FLAG_ACTION_CHIP_CLASS_NAME
            }
            onClick={() => {
              settingAllFeaturesEnabled(true);
            }}
          >
            All on
          </button>
          <button
            type="button"
            {...{ [DEFINING_WORLD_PLAZA_UI_DATA_ATTRIBUTE]: true }}
            className={
              DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_FLAG_ACTION_CHIP_CLASS_NAME
            }
            onClick={() => {
              settingAllFeaturesEnabled(false);
            }}
          >
            All off
          </button>
        </div>
      </div>

      <div className="space-y-2">
        {RENDERING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_FLAG_GROUPS.map(
          (group) => (
            <div key={group.groupId}>
              <div className="mb-1 text-[9px] font-semibold uppercase tracking-wide text-amber-200/80">
                {
                  DEFINING_WORLD_PLAZA_GENERATION_FEATURE_GROUP_LABELS[
                    group.groupId
                  ]
                }
              </div>
              <div className="flex flex-wrap gap-1">
                {group.definitions.map((definition) => {
                  const isEnabled = flags[definition.featureId];

                  return (
                    <button
                      key={definition.featureId}
                      type="button"
                      {...{ [DEFINING_WORLD_PLAZA_UI_DATA_ATTRIBUTE]: true }}
                      title={definition.description}
                      aria-pressed={isEnabled}
                      className={
                        isEnabled
                          ? DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_FLAG_BADGE_ON_CLASS_NAME
                          : DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_FLAG_BADGE_OFF_CLASS_NAME
                      }
                      onClick={() => {
                        settingFeatureEnabled(definition.featureId, !isEnabled);
                      }}
                    >
                      {definition.label}
                    </button>
                  );
                })}
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
}
