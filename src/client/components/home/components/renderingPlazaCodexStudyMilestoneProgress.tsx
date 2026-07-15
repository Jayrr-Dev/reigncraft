/**
 * Progress track with placeholder chest circles at study milestones.
 *
 * @module components/home/components/renderingPlazaCodexStudyMilestoneProgress
 */

import {
  DEFINING_PLAZA_CODEX_STUDY_MILESTONE_PROGRESS_FILL_CLASS_NAME,
  DEFINING_PLAZA_CODEX_STUDY_MILESTONE_PROGRESS_MARKERS_CLASS_NAME,
  DEFINING_PLAZA_CODEX_STUDY_MILESTONE_PROGRESS_SHELL_CLASS_NAME,
  DEFINING_PLAZA_CODEX_STUDY_MILESTONE_PROGRESS_TRACK_CLASS_NAME,
  DEFINING_PLAZA_CODEX_STUDY_MILESTONE_REWARD_CHEST_ICON,
  DEFINING_PLAZA_CODEX_STUDY_MILESTONE_REWARD_ICON_CLASS_NAME,
  DEFINING_PLAZA_CODEX_STUDY_MILESTONE_REWARD_NODE_LOCKED_CLASS_NAME,
  DEFINING_PLAZA_CODEX_STUDY_MILESTONE_REWARD_NODE_REACHED_CLASS_NAME,
} from '@/components/home/domains/definingPlazaCodexStudyMilestoneRewardConstants';
import { LABELING_PLAZA_CODEX_STUDY_AWARENESS } from '@/components/home/domains/definingPlazaCodexStudyTier';
import type { PlazaCodexStudyMilestoneRewardMarker } from '@/components/home/domains/resolvingPlazaCodexStudyMilestoneRewardMarkers';
import { Icon } from '@/components/ui/icon';

export type RenderingPlazaCodexStudyMilestoneProgressProps = {
  value: number;
  max: number;
  markers: readonly PlazaCodexStudyMilestoneRewardMarker[];
  ariaLabel: string;
  className?: string;
};

function computingPlazaCodexStudyMilestoneProgressPercent(
  value: number,
  max: number
): number {
  if (max <= 0) {
    return 0;
  }
  return Math.min(100, Math.round((value / max) * 100));
}

/** Progress bar with chest-circle placeholders at study reward milestones. */
export function RenderingPlazaCodexStudyMilestoneProgress({
  value,
  max,
  markers,
  ariaLabel,
  className = '',
}: RenderingPlazaCodexStudyMilestoneProgressProps): React.JSX.Element {
  const progressPercent = computingPlazaCodexStudyMilestoneProgressPercent(
    value,
    max
  );

  return (
    <div
      className={`${DEFINING_PLAZA_CODEX_STUDY_MILESTONE_PROGRESS_SHELL_CLASS_NAME} ${className}`.trim()}
    >
      <div
        className={
          DEFINING_PLAZA_CODEX_STUDY_MILESTONE_PROGRESS_TRACK_CLASS_NAME
        }
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={max}
        aria-valuenow={value}
        aria-label={ariaLabel}
      >
        <div
          className={
            DEFINING_PLAZA_CODEX_STUDY_MILESTONE_PROGRESS_FILL_CLASS_NAME
          }
          style={{ width: `${progressPercent}%` }}
        />
      </div>
      <div
        className={
          DEFINING_PLAZA_CODEX_STUDY_MILESTONE_PROGRESS_MARKERS_CLASS_NAME
        }
        aria-hidden
      >
        {markers.map((marker) => {
          const nodeClassName = marker.isReached
            ? DEFINING_PLAZA_CODEX_STUDY_MILESTONE_REWARD_NODE_REACHED_CLASS_NAME
            : DEFINING_PLAZA_CODEX_STUDY_MILESTONE_REWARD_NODE_LOCKED_CLASS_NAME;
          const tierLabel = LABELING_PLAZA_CODEX_STUDY_AWARENESS[marker.tierId];

          return (
            <div
              key={marker.tierId}
              className={nodeClassName}
              style={{ left: `${marker.percent}%` }}
              title={`${tierLabel} reward · ${marker.threshold} study`}
            >
              <Icon
                icon={DEFINING_PLAZA_CODEX_STUDY_MILESTONE_REWARD_CHEST_ICON}
                className={
                  DEFINING_PLAZA_CODEX_STUDY_MILESTONE_REWARD_ICON_CLASS_NAME
                }
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
