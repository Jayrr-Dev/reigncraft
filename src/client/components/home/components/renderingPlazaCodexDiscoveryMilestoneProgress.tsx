/**
 * Single discovery meter with four milestone chest placeholders (Biomes / Recipes).
 *
 * @module components/home/components/renderingPlazaCodexDiscoveryMilestoneProgress
 */

import { RenderingPlazaCodexStudyMilestoneProgress } from '@/components/home/components/renderingPlazaCodexStudyMilestoneProgress';
import {
  DEFINING_PLAZA_CODEX_DUAL_PROGRESS_COLUMN_CLASS_NAME,
  DEFINING_PLAZA_CODEX_DUAL_PROGRESS_COUNT_CLASS_NAME,
  DEFINING_PLAZA_CODEX_DUAL_PROGRESS_LABEL_CLASS_NAME,
  DEFINING_PLAZA_CODEX_DUAL_PROGRESS_SHELL_CLASS_NAME,
} from '@/components/home/domains/definingPlazaCodexDualProgressConstants';
import { resolvingPlazaCodexDiscoveryMilestoneRewardMarkers } from '@/components/home/domains/resolvingPlazaCodexStudyMilestoneRewardMarkers';

export type RenderingPlazaCodexDiscoveryMilestoneProgressProps = {
  label: string;
  value: number;
  max: number;
  ariaLabel: string;
};

/** Discovered/Attached progress bar with four reward chests. */
export function RenderingPlazaCodexDiscoveryMilestoneProgress({
  label,
  value,
  max,
  ariaLabel,
}: RenderingPlazaCodexDiscoveryMilestoneProgressProps): React.JSX.Element {
  const markers = resolvingPlazaCodexDiscoveryMilestoneRewardMarkers(
    value,
    max
  );

  return (
    <div className={DEFINING_PLAZA_CODEX_DUAL_PROGRESS_SHELL_CLASS_NAME}>
      <div className={DEFINING_PLAZA_CODEX_DUAL_PROGRESS_COLUMN_CLASS_NAME}>
        <div className={DEFINING_PLAZA_CODEX_DUAL_PROGRESS_LABEL_CLASS_NAME}>
          <span>{label}</span>
          <span className={DEFINING_PLAZA_CODEX_DUAL_PROGRESS_COUNT_CLASS_NAME}>
            {value}/{max}
          </span>
        </div>
        <RenderingPlazaCodexStudyMilestoneProgress
          value={value}
          max={max}
          markers={markers}
          ariaLabel={ariaLabel}
        />
      </div>
    </div>
  );
}
