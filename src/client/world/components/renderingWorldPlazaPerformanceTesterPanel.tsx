'use client';

import { copyingWorldPlazaTextToClipboard } from '@/components/world/domains/copyingWorldPlazaTextToClipboard';
import { DEFINING_WORLD_PLAZA_UI_DATA_ATTRIBUTE } from '@/components/world/domains/definingWorldPlazaClickMovementConstants';
import {
  DEFINING_WORLD_PLAZA_FEATURES_DEBUG_OPTION_BUTTON_ACTIVE_CLASS_NAME,
  DEFINING_WORLD_PLAZA_FEATURES_DEBUG_OPTION_BUTTON_BASE_CLASS_NAME,
  DEFINING_WORLD_PLAZA_FEATURES_DEBUG_OPTION_BUTTON_INACTIVE_CLASS_NAME,
  DEFINING_WORLD_PLAZA_FEATURES_DEBUG_OPTION_DESCRIPTION_CLASS_NAME,
  DEFINING_WORLD_PLAZA_FEATURES_DEBUG_PANEL_HEADING_CLASS_NAME,
} from '@/components/world/domains/definingWorldPlazaFeaturesDebugUiConstants';
import {
  DEFINING_WORLD_PLAZA_PERFORMANCE_TESTER_CANCEL_BUTTON_LABEL,
  DEFINING_WORLD_PLAZA_PERFORMANCE_TESTER_CLEAR_BUTTON_LABEL,
  DEFINING_WORLD_PLAZA_PERFORMANCE_TESTER_COPY_FAILURE_TOAST,
  DEFINING_WORLD_PLAZA_PERFORMANCE_TESTER_COPY_REPORT_BUTTON_LABEL,
  DEFINING_WORLD_PLAZA_PERFORMANCE_TESTER_COPY_SUCCESS_TOAST,
  DEFINING_WORLD_PLAZA_PERFORMANCE_TESTER_RUN_STEP_BUTTON_LABEL,
  DEFINING_WORLD_PLAZA_PERFORMANCE_TESTER_RUN_SUITE_BUTTON_LABEL,
  DEFINING_WORLD_PLAZA_PERFORMANCE_TESTER_SECTION_HEADING,
  DEFINING_WORLD_PLAZA_PERFORMANCE_TESTER_WALK_PROMPT_BANNER,
} from '@/components/world/domains/definingWorldPlazaPerformanceTesterConstants';
import { DEFINING_WORLD_PLAZA_PERFORMANCE_TESTER_STEP_REGISTRY } from '@/components/world/domains/definingWorldPlazaPerformanceTesterStepRegistry';
import { formattingWorldPlazaPerformanceTesterReport } from '@/components/world/domains/formattingWorldPlazaPerformanceTesterReport';
import { usingWorldPlazaPerformanceTester } from '@/components/world/hooks/usingWorldPlazaPerformanceTester';
import { showToast } from '@devvit/web/client';

function formattingWorldPlazaPerformanceTesterProgressSeconds(
  elapsedMs: number
): string {
  return (elapsedMs / 1000).toFixed(1);
}

/**
 * Multistep performance tester controls for the Features debug panel.
 */
export function RenderingWorldPlazaPerformanceTesterPanel(): React.JSX.Element {
  const {
    snapshot,
    runningPerfTesterSuite,
    runningPerfTesterStep,
    cancellingPerfTesterRun,
    clearingPerfTesterResults,
  } = usingWorldPlazaPerformanceTester();

  const isRunning = snapshot.isRunning;
  const progressLabel = snapshot.phase;

  const copyingPerfTesterReport = async (): Promise<void> => {
    const reportText = formattingWorldPlazaPerformanceTesterReport(
      snapshot.results
    );
    const didCopy = await copyingWorldPlazaTextToClipboard(reportText);

    showToast(
      didCopy
        ? DEFINING_WORLD_PLAZA_PERFORMANCE_TESTER_COPY_SUCCESS_TOAST
        : DEFINING_WORLD_PLAZA_PERFORMANCE_TESTER_COPY_FAILURE_TOAST
    );
  };

  return (
    <div className="flex flex-col gap-2">
      <p
        className={DEFINING_WORLD_PLAZA_FEATURES_DEBUG_PANEL_HEADING_CLASS_NAME}
      >
        {DEFINING_WORLD_PLAZA_PERFORMANCE_TESTER_SECTION_HEADING}
      </p>

      <div className="flex flex-wrap gap-1">
        <button
          type="button"
          {...{ [DEFINING_WORLD_PLAZA_UI_DATA_ATTRIBUTE]: true }}
          disabled={isRunning}
          className={`${DEFINING_WORLD_PLAZA_FEATURES_DEBUG_OPTION_BUTTON_BASE_CLASS_NAME} ${
            isRunning
              ? DEFINING_WORLD_PLAZA_FEATURES_DEBUG_OPTION_BUTTON_INACTIVE_CLASS_NAME
              : DEFINING_WORLD_PLAZA_FEATURES_DEBUG_OPTION_BUTTON_ACTIVE_CLASS_NAME
          } disabled:cursor-not-allowed disabled:opacity-70`}
          onClick={runningPerfTesterSuite}
        >
          {DEFINING_WORLD_PLAZA_PERFORMANCE_TESTER_RUN_SUITE_BUTTON_LABEL}
        </button>
        <button
          type="button"
          {...{ [DEFINING_WORLD_PLAZA_UI_DATA_ATTRIBUTE]: true }}
          disabled={!isRunning}
          className={`${DEFINING_WORLD_PLAZA_FEATURES_DEBUG_OPTION_BUTTON_BASE_CLASS_NAME} ${
            isRunning
              ? DEFINING_WORLD_PLAZA_FEATURES_DEBUG_OPTION_BUTTON_ACTIVE_CLASS_NAME
              : DEFINING_WORLD_PLAZA_FEATURES_DEBUG_OPTION_BUTTON_INACTIVE_CLASS_NAME
          } disabled:cursor-not-allowed disabled:opacity-70`}
          onClick={cancellingPerfTesterRun}
        >
          {DEFINING_WORLD_PLAZA_PERFORMANCE_TESTER_CANCEL_BUTTON_LABEL}
        </button>
        <button
          type="button"
          {...{ [DEFINING_WORLD_PLAZA_UI_DATA_ATTRIBUTE]: true }}
          disabled={snapshot.results.length === 0}
          className={`${DEFINING_WORLD_PLAZA_FEATURES_DEBUG_OPTION_BUTTON_BASE_CLASS_NAME} ${
            snapshot.results.length > 0
              ? DEFINING_WORLD_PLAZA_FEATURES_DEBUG_OPTION_BUTTON_ACTIVE_CLASS_NAME
              : DEFINING_WORLD_PLAZA_FEATURES_DEBUG_OPTION_BUTTON_INACTIVE_CLASS_NAME
          } disabled:cursor-not-allowed disabled:opacity-70`}
          onClick={() => {
            void copyingPerfTesterReport();
          }}
        >
          {DEFINING_WORLD_PLAZA_PERFORMANCE_TESTER_COPY_REPORT_BUTTON_LABEL}
        </button>
        <button
          type="button"
          {...{ [DEFINING_WORLD_PLAZA_UI_DATA_ATTRIBUTE]: true }}
          disabled={isRunning || snapshot.results.length === 0}
          className={`${DEFINING_WORLD_PLAZA_FEATURES_DEBUG_OPTION_BUTTON_BASE_CLASS_NAME} ${
            snapshot.results.length > 0 && !isRunning
              ? DEFINING_WORLD_PLAZA_FEATURES_DEBUG_OPTION_BUTTON_ACTIVE_CLASS_NAME
              : DEFINING_WORLD_PLAZA_FEATURES_DEBUG_OPTION_BUTTON_INACTIVE_CLASS_NAME
          } disabled:cursor-not-allowed disabled:opacity-70`}
          onClick={clearingPerfTesterResults}
        >
          {DEFINING_WORLD_PLAZA_PERFORMANCE_TESTER_CLEAR_BUTTON_LABEL}
        </button>
      </div>

      {isRunning && snapshot.currentStepId ? (
        <p
          className={
            DEFINING_WORLD_PLAZA_FEATURES_DEBUG_OPTION_DESCRIPTION_CLASS_NAME
          }
        >
          Step {snapshot.currentStepIndex}/{snapshot.totalStepCount} —{' '}
          {snapshot.currentStepId} ({progressLabel}{' '}
          {formattingWorldPlazaPerformanceTesterProgressSeconds(
            snapshot.phaseElapsedMs
          )}
          s)
        </p>
      ) : null}

      {snapshot.isPromptingWalk ? (
        <p className="font-medium text-amber-200">
          {DEFINING_WORLD_PLAZA_PERFORMANCE_TESTER_WALK_PROMPT_BANNER}
        </p>
      ) : null}

      <div className="flex flex-col gap-1">
        {DEFINING_WORLD_PLAZA_PERFORMANCE_TESTER_STEP_REGISTRY.map((step) => (
          <div key={step.id} className="flex items-start justify-between gap-2">
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium text-slate-100">{step.label}</p>
              <p
                className={
                  DEFINING_WORLD_PLAZA_FEATURES_DEBUG_OPTION_DESCRIPTION_CLASS_NAME
                }
              >
                {step.description}
              </p>
            </div>
            <button
              type="button"
              {...{ [DEFINING_WORLD_PLAZA_UI_DATA_ATTRIBUTE]: true }}
              disabled={isRunning}
              className={`${DEFINING_WORLD_PLAZA_FEATURES_DEBUG_OPTION_BUTTON_BASE_CLASS_NAME} shrink-0 ${
                isRunning
                  ? DEFINING_WORLD_PLAZA_FEATURES_DEBUG_OPTION_BUTTON_INACTIVE_CLASS_NAME
                  : DEFINING_WORLD_PLAZA_FEATURES_DEBUG_OPTION_BUTTON_ACTIVE_CLASS_NAME
              } disabled:cursor-not-allowed disabled:opacity-70`}
              onClick={() => {
                runningPerfTesterStep(step.id);
              }}
            >
              {DEFINING_WORLD_PLAZA_PERFORMANCE_TESTER_RUN_STEP_BUTTON_LABEL}
            </button>
          </div>
        ))}
      </div>

      {snapshot.results.length > 0 ? (
        <div className="flex flex-col gap-1">
          <p
            className={
              DEFINING_WORLD_PLAZA_FEATURES_DEBUG_PANEL_HEADING_CLASS_NAME
            }
          >
            Results
          </p>
          {snapshot.results.map((result) => (
            <p
              key={`${result.stepId}-${result.capturedAtMs}`}
              className="font-mono text-[10px] leading-snug text-slate-200"
            >
              {result.stepId} | {result.framesPerSecond.toFixed(1)} fps | p95{' '}
              {result.framePercentile95Ms.toFixed(2)} | max{' '}
              {result.frameMaxMs.toFixed(2)} | terrain-sync{' '}
              {result.sampleAveragesMs.terrainSync?.toFixed(2) ?? '-'}
            </p>
          ))}
        </div>
      ) : null}
    </div>
  );
}
