'use client';

import { applyingWorldPlazaPerformanceDiagnosticsFlagPreset } from '@/components/world/domains/applyingWorldPlazaPerformanceDiagnosticsFlagPreset';
import { capturingWorldPlazaPerformanceDiagnosticsFlagPresetFromCurrent } from '@/components/world/domains/capturingWorldPlazaPerformanceDiagnosticsFlagPresetFromCurrent';
import { checkingWorldPlazaPerformanceDiagnosticsFlagPresetMatchesCurrent } from '@/components/world/domains/checkingWorldPlazaPerformanceDiagnosticsFlagPresetMatchesCurrent';
import { computingWorldPlazaPerformanceDiagnosticsAbDelta } from '@/components/world/domains/computingWorldPlazaPerformanceDiagnosticsAbDelta';
import { copyingWorldPlazaTextToClipboard } from '@/components/world/domains/copyingWorldPlazaTextToClipboard';
import { DEFINING_WORLD_PLAZA_UI_DATA_ATTRIBUTE } from '@/components/world/domains/definingWorldPlazaClickMovementConstants';
import {
  DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_FLAG_ACTION_CHIP_CLASS_NAME,
  DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_FLAG_BADGE_OFF_CLASS_NAME,
  DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_FLAG_BADGE_ON_CLASS_NAME,
} from '@/components/world/domains/definingWorldPlazaPerformanceDiagnosticsFlagBadgeConstants';
import {
  LABELING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_FLAG_PRESET_ACTIVE,
  LABELING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_FLAG_PRESET_APPLY,
  LABELING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_FLAG_PRESET_CAPTURE_A,
  LABELING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_FLAG_PRESET_CAPTURE_B,
  LABELING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_FLAG_PRESET_CLEAR_AB,
  LABELING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_FLAG_PRESET_COMPARE_HINT,
  LABELING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_FLAG_PRESET_COMPARE_SECTION,
  LABELING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_FLAG_PRESET_COPY_FINDINGS,
  LABELING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_FLAG_PRESET_COPY_FINDINGS_FAILURE,
  LABELING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_FLAG_PRESET_COPY_FINDINGS_SUCCESS,
  LABELING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_FLAG_PRESET_DELETE,
  LABELING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_FLAG_PRESET_SAVE,
  LABELING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_FLAG_PRESET_SAVE_PROMPT,
  LABELING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_FLAG_PRESET_SECTION,
  LABELING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_FLAG_PRESET_SELECT_PLACEHOLDER,
} from '@/components/world/domains/definingWorldPlazaPerformanceDiagnosticsFlagPresetConstants';
import { formattingWorldPlazaPerformanceDiagnosticsAbFindings } from '@/components/world/domains/formattingWorldPlazaPerformanceDiagnosticsAbFindings';
import {
  capturingWorldPlazaPerformanceDiagnosticsAbSlot,
  clearingWorldPlazaPerformanceDiagnosticsAbCaptures,
  gettingWorldPlazaPerformanceDiagnosticsAbCaptureA,
  gettingWorldPlazaPerformanceDiagnosticsAbCaptureB,
  gettingWorldPlazaPerformanceDiagnosticsAbCaptureRevision,
  subscribingWorldPlazaPerformanceDiagnosticsAbCaptures,
} from '@/components/world/domains/managingWorldPlazaPerformanceDiagnosticsAbCaptureStore';
import { buildingWorldPlazaPerformanceDiagnosticsSnapshot } from '@/components/world/domains/measuringWorldPlazaPerformanceDiagnostics';
import { usingWorldPlazaGenerationFeaturesState } from '@/components/world/hooks/usingWorldPlazaGenerationFeaturesState';
import { usingWorldPlazaPerformanceDiagnosticsFlagPresets } from '@/components/world/hooks/usingWorldPlazaPerformanceDiagnosticsFlagPresets';
import { usingWorldPlazaPerformanceDiagnosticsRenderLayerFlags } from '@/components/world/hooks/usingWorldPlazaPerformanceDiagnosticsRenderLayerFlags';
import { showToast } from '@devvit/web/client';
import { useMemo, useState, useSyncExternalStore } from 'react';

/**
 * Preset picker + manual Capture A/B compare strip for the FLAGS tab.
 */
export function RenderingWorldPlazaPerformanceDiagnosticsFlagPresetBar(): React.JSX.Element {
  const { presets, savingPreset, deletingPreset } =
    usingWorldPlazaPerformanceDiagnosticsFlagPresets();
  const { revision: generationFeatureRevision } =
    usingWorldPlazaGenerationFeaturesState();
  const renderLayerFlags =
    usingWorldPlazaPerformanceDiagnosticsRenderLayerFlags();
  const [selectedPresetId, setSelectedPresetId] = useState('');

  const abCaptureRevision = useSyncExternalStore(
    subscribingWorldPlazaPerformanceDiagnosticsAbCaptures,
    gettingWorldPlazaPerformanceDiagnosticsAbCaptureRevision,
    () => 0
  );
  const captureA = useSyncExternalStore(
    subscribingWorldPlazaPerformanceDiagnosticsAbCaptures,
    gettingWorldPlazaPerformanceDiagnosticsAbCaptureA,
    () => null
  );
  const captureB = useSyncExternalStore(
    subscribingWorldPlazaPerformanceDiagnosticsAbCaptures,
    gettingWorldPlazaPerformanceDiagnosticsAbCaptureB,
    () => null
  );

  const activePreset = useMemo(
    () =>
      presets.find((preset) =>
        checkingWorldPlazaPerformanceDiagnosticsFlagPresetMatchesCurrent(preset)
      ) ?? null,
    [presets, generationFeatureRevision, renderLayerFlags]
  );

  const selectedPreset =
    presets.find((preset) => preset.id === selectedPresetId) ?? null;

  const abDelta = useMemo(() => {
    void abCaptureRevision;

    if (!captureA || !captureB) {
      return null;
    }

    return computingWorldPlazaPerformanceDiagnosticsAbDelta(captureA, captureB);
  }, [abCaptureRevision, captureA, captureB]);

  const capturingSlot = (slot: 'A' | 'B', label: string): void => {
    const snapshot = buildingWorldPlazaPerformanceDiagnosticsSnapshot();

    capturingWorldPlazaPerformanceDiagnosticsAbSlot(
      slot,
      snapshot,
      label,
      activePreset?.name ?? null
    );
  };

  const savingCurrentPreset = (): void => {
    const presetName = window.prompt(
      LABELING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_FLAG_PRESET_SAVE_PROMPT
    );

    if (!presetName?.trim()) {
      return;
    }

    const preset =
      capturingWorldPlazaPerformanceDiagnosticsFlagPresetFromCurrent(
        presetName.trim()
      );
    savingPreset(preset);
    setSelectedPresetId(preset.id);
  };

  const applyingSelectedPreset = (): void => {
    if (!selectedPreset) {
      return;
    }

    applyingWorldPlazaPerformanceDiagnosticsFlagPreset(selectedPreset);
  };

  const deletingSelectedPreset = (): void => {
    if (!selectedPreset) {
      return;
    }

    deletingPreset(selectedPreset.id);

    if (selectedPresetId === selectedPreset.id) {
      setSelectedPresetId('');
    }
  };

  const copyingAbFindings = (): void => {
    const report = formattingWorldPlazaPerformanceDiagnosticsAbFindings({
      captureA,
      captureB,
      activePresetName: activePreset?.name ?? null,
      currentSnapshot: buildingWorldPlazaPerformanceDiagnosticsSnapshot(),
    });

    void copyingWorldPlazaTextToClipboard(report).then((didCopy) => {
      showToast(
        didCopy
          ? LABELING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_FLAG_PRESET_COPY_FINDINGS_SUCCESS
          : LABELING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_FLAG_PRESET_COPY_FINDINGS_FAILURE
      );
    });
  };

  return (
    <div className="mb-2 space-y-2 border-b border-amber-300/15 pb-2">
      <div>
        <div className="mb-1 font-semibold text-amber-200">
          {LABELING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_FLAG_PRESET_SECTION}
        </div>
        {activePreset ? (
          <div className="mb-1 text-[9px] text-lime-100/85">
            {LABELING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_FLAG_PRESET_ACTIVE}{' '}
            {activePreset.name}
          </div>
        ) : null}
        <div className="flex flex-wrap items-center gap-1">
          <select
            value={selectedPresetId}
            onChange={(event) => {
              setSelectedPresetId(event.target.value);
            }}
            className="min-w-0 flex-1 rounded border border-amber-200/30 bg-black/40 px-1.5 py-0.5 text-[9px] text-amber-50"
            {...{ [DEFINING_WORLD_PLAZA_UI_DATA_ATTRIBUTE]: true }}
          >
            <option value="">
              {
                LABELING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_FLAG_PRESET_SELECT_PLACEHOLDER
              }
            </option>
            {presets.map((preset) => (
              <option key={preset.id} value={preset.id}>
                {preset.name}
              </option>
            ))}
          </select>
          <button
            type="button"
            {...{ [DEFINING_WORLD_PLAZA_UI_DATA_ATTRIBUTE]: true }}
            className={
              DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_FLAG_ACTION_CHIP_CLASS_NAME
            }
            disabled={!selectedPreset}
            onClick={applyingSelectedPreset}
          >
            {LABELING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_FLAG_PRESET_APPLY}
          </button>
          <button
            type="button"
            {...{ [DEFINING_WORLD_PLAZA_UI_DATA_ATTRIBUTE]: true }}
            className={
              DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_FLAG_ACTION_CHIP_CLASS_NAME
            }
            onClick={savingCurrentPreset}
          >
            {LABELING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_FLAG_PRESET_SAVE}
          </button>
          <button
            type="button"
            {...{ [DEFINING_WORLD_PLAZA_UI_DATA_ATTRIBUTE]: true }}
            className={
              DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_FLAG_ACTION_CHIP_CLASS_NAME
            }
            disabled={!selectedPreset}
            onClick={deletingSelectedPreset}
          >
            {LABELING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_FLAG_PRESET_DELETE}
          </button>
        </div>
      </div>

      <div>
        <div className="mb-1 font-semibold text-amber-200">
          {
            LABELING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_FLAG_PRESET_COMPARE_SECTION
          }
        </div>
        <div className="mb-1 text-[9px] text-amber-100/60">
          {
            LABELING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_FLAG_PRESET_COMPARE_HINT
          }
        </div>
        <div className="mb-1 flex flex-wrap gap-1">
          <button
            type="button"
            {...{ [DEFINING_WORLD_PLAZA_UI_DATA_ATTRIBUTE]: true }}
            className={
              DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_FLAG_ACTION_CHIP_CLASS_NAME
            }
            onClick={() => {
              capturingSlot(
                'A',
                LABELING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_FLAG_PRESET_CAPTURE_A
              );
            }}
          >
            {LABELING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_FLAG_PRESET_CAPTURE_A}
          </button>
          <button
            type="button"
            {...{ [DEFINING_WORLD_PLAZA_UI_DATA_ATTRIBUTE]: true }}
            className={
              DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_FLAG_ACTION_CHIP_CLASS_NAME
            }
            onClick={() => {
              capturingSlot(
                'B',
                LABELING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_FLAG_PRESET_CAPTURE_B
              );
            }}
          >
            {LABELING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_FLAG_PRESET_CAPTURE_B}
          </button>
          <button
            type="button"
            {...{ [DEFINING_WORLD_PLAZA_UI_DATA_ATTRIBUTE]: true }}
            className={
              DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_FLAG_ACTION_CHIP_CLASS_NAME
            }
            disabled={!captureA && !captureB}
            onClick={copyingAbFindings}
          >
            {
              LABELING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_FLAG_PRESET_COPY_FINDINGS
            }
          </button>
          <button
            type="button"
            {...{ [DEFINING_WORLD_PLAZA_UI_DATA_ATTRIBUTE]: true }}
            className={
              DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_FLAG_ACTION_CHIP_CLASS_NAME
            }
            disabled={!captureA && !captureB}
            onClick={clearingWorldPlazaPerformanceDiagnosticsAbCaptures}
          >
            {LABELING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_FLAG_PRESET_CLEAR_AB}
          </button>
        </div>

        {captureA ? (
          <div className="mb-0.5 text-[9px] text-amber-100/70">
            A: {captureA.framesPerSecond.toFixed(1)} fps · avg{' '}
            {captureA.sessionFramesPerSecond.toFixed(1)} · min{' '}
            {captureA.sessionMinimumFramesPerSecond.toFixed(1)}
            {captureA.presetName ? ` (${captureA.presetName})` : ''}
          </div>
        ) : null}
        {captureB ? (
          <div className="mb-0.5 text-[9px] text-amber-100/70">
            B: {captureB.framesPerSecond.toFixed(1)} fps · avg{' '}
            {captureB.sessionFramesPerSecond.toFixed(1)} · min{' '}
            {captureB.sessionMinimumFramesPerSecond.toFixed(1)}
            {captureB.presetName ? ` (${captureB.presetName})` : ''}
          </div>
        ) : null}

        {abDelta ? (
          <div
            className={
              abDelta.isBFaster
                ? DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_FLAG_BADGE_ON_CLASS_NAME
                : DEFINING_WORLD_PLAZA_PERFORMANCE_DIAGNOSTICS_FLAG_BADGE_OFF_CLASS_NAME
            }
          >
            {abDelta.summaryLabel}
          </div>
        ) : null}
      </div>
    </div>
  );
}
