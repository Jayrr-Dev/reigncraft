/**
 * Side-by-side codex progress meters (Sighted + Studied, or Logged + Studied).
 * Studied meter shows placeholder chest circles at study reward milestones.
 *
 * @module components/home/components/renderingPlazaCodexDualProgress
 */

import { RenderingPlazaCodexStudyMilestoneProgress } from '@/components/home/components/renderingPlazaCodexStudyMilestoneProgress';
import {
  DEFINING_PLAZA_CODEX_DUAL_PROGRESS_COLUMN_CLASS_NAME,
  DEFINING_PLAZA_CODEX_DUAL_PROGRESS_COUNT_CLASS_NAME,
  DEFINING_PLAZA_CODEX_DUAL_PROGRESS_FILL_CLASS_NAME,
  DEFINING_PLAZA_CODEX_DUAL_PROGRESS_LABEL_CLASS_NAME,
  DEFINING_PLAZA_CODEX_DUAL_PROGRESS_ROW_CLASS_NAME,
  DEFINING_PLAZA_CODEX_DUAL_PROGRESS_SHELL_CLASS_NAME,
  DEFINING_PLAZA_CODEX_DUAL_PROGRESS_TRACK_CLASS_NAME,
} from '@/components/home/domains/definingPlazaCodexDualProgressConstants';
import { resolvingPlazaCodexAggregateStudyMilestoneRewardMarkers } from '@/components/home/domains/resolvingPlazaCodexStudyMilestoneRewardMarkers';

export type PlazaCodexDualProgressMetric = {
  label: string;
  value: number;
  max: number;
  ariaLabel: string;
};

export type RenderingPlazaCodexDualProgressProps = {
  left: PlazaCodexDualProgressMetric;
  right: PlazaCodexDualProgressMetric;
};

function computingPlazaCodexDualProgressPercent(
  value: number,
  max: number
): number {
  if (max <= 0) {
    return 0;
  }
  return Math.round((value / max) * 100);
}

function RenderingPlazaCodexDualProgressMeter({
  metric,
}: {
  metric: PlazaCodexDualProgressMetric;
}) {
  const progressPercent = computingPlazaCodexDualProgressPercent(
    metric.value,
    metric.max
  );

  return (
    <div className={DEFINING_PLAZA_CODEX_DUAL_PROGRESS_COLUMN_CLASS_NAME}>
      <div className={DEFINING_PLAZA_CODEX_DUAL_PROGRESS_LABEL_CLASS_NAME}>
        <span>{metric.label}</span>
        <span className={DEFINING_PLAZA_CODEX_DUAL_PROGRESS_COUNT_CLASS_NAME}>
          {metric.value}/{metric.max}
        </span>
      </div>
      <div
        className={DEFINING_PLAZA_CODEX_DUAL_PROGRESS_TRACK_CLASS_NAME}
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={metric.max}
        aria-valuenow={metric.value}
        aria-label={metric.ariaLabel}
      >
        <div
          className={DEFINING_PLAZA_CODEX_DUAL_PROGRESS_FILL_CLASS_NAME}
          style={{ width: `${progressPercent}%` }}
        />
      </div>
    </div>
  );
}

function RenderingPlazaCodexDualProgressStudiedMeter({
  metric,
}: {
  metric: PlazaCodexDualProgressMetric;
}) {
  const markers = resolvingPlazaCodexAggregateStudyMilestoneRewardMarkers(
    metric.value,
    metric.max
  );

  return (
    <div className={DEFINING_PLAZA_CODEX_DUAL_PROGRESS_COLUMN_CLASS_NAME}>
      <div className={DEFINING_PLAZA_CODEX_DUAL_PROGRESS_LABEL_CLASS_NAME}>
        <span>{metric.label}</span>
        <span className={DEFINING_PLAZA_CODEX_DUAL_PROGRESS_COUNT_CLASS_NAME}>
          {metric.value}/{metric.max}
        </span>
      </div>
      <RenderingPlazaCodexStudyMilestoneProgress
        value={metric.value}
        max={metric.max}
        markers={markers}
        ariaLabel={metric.ariaLabel}
      />
    </div>
  );
}

/** Two progress meters on one row for codex collection panels. */
export function RenderingPlazaCodexDualProgress({
  left,
  right,
}: RenderingPlazaCodexDualProgressProps) {
  return (
    <div className={DEFINING_PLAZA_CODEX_DUAL_PROGRESS_SHELL_CLASS_NAME}>
      <div className={DEFINING_PLAZA_CODEX_DUAL_PROGRESS_ROW_CLASS_NAME}>
        <RenderingPlazaCodexDualProgressMeter metric={left} />
        <RenderingPlazaCodexDualProgressStudiedMeter metric={right} />
      </div>
    </div>
  );
}
