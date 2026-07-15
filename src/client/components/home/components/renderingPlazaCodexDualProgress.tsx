/**
 * Side-by-side codex progress meters (Sighted + Studied, or Logged + Studied).
 * Both meters show placeholder chest circles at overall collection milestones.
 *
 * @module components/home/components/renderingPlazaCodexDualProgress
 */

import { RenderingPlazaCodexStudyMilestoneProgress } from '@/components/home/components/renderingPlazaCodexStudyMilestoneProgress';
import {
  DEFINING_PLAZA_CODEX_DUAL_PROGRESS_COLUMN_CLASS_NAME,
  DEFINING_PLAZA_CODEX_DUAL_PROGRESS_COUNT_CLASS_NAME,
  DEFINING_PLAZA_CODEX_DUAL_PROGRESS_LABEL_CLASS_NAME,
  DEFINING_PLAZA_CODEX_DUAL_PROGRESS_ROW_CLASS_NAME,
  DEFINING_PLAZA_CODEX_DUAL_PROGRESS_SEPARATOR_CLASS_NAME,
  DEFINING_PLAZA_CODEX_DUAL_PROGRESS_SHELL_CLASS_NAME,
} from '@/components/home/domains/definingPlazaCodexDualProgressConstants';
import { resolvingPlazaCodexOverallProgressMilestoneRewardMarkers } from '@/components/home/domains/resolvingPlazaCodexStudyMilestoneRewardMarkers';

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

function RenderingPlazaCodexDualProgressMeter({
  metric,
}: {
  metric: PlazaCodexDualProgressMetric;
}) {
  const markers = resolvingPlazaCodexOverallProgressMilestoneRewardMarkers(
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
        <div
          aria-hidden
          className={DEFINING_PLAZA_CODEX_DUAL_PROGRESS_SEPARATOR_CLASS_NAME}
        />
        <RenderingPlazaCodexDualProgressMeter metric={right} />
      </div>
    </div>
  );
}
