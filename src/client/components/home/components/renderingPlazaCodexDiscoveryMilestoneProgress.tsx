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
import type { PlazaCodexMilestoneRewardMeterKind } from '@/components/home/domains/definingPlazaCodexMilestoneRewardRegistry';
import { resolvingPlazaCodexDiscoveryMilestoneRewardMarkers } from '@/components/home/domains/resolvingPlazaCodexStudyMilestoneRewardMarkers';
import type { WorldPlazaCodexSectionId } from '@/components/world/domains/definingWorldPlazaCodexConstants';
import {
  gettingWorldPlazaRecipeAttachedSnapshot,
  subscribingWorldPlazaRecipeDiscovery,
} from '@/components/world/domains/managingWorldPlazaRecipeDiscoveryStore';
import { useMemo, useSyncExternalStore } from 'react';

export type RenderingPlazaCodexDiscoveryMilestoneProgressProps = {
  label: string;
  value: number;
  max: number;
  ariaLabel: string;
  /** When set, chests resolve / claim registry grants for this section. */
  sectionId?: WorldPlazaCodexSectionId;
  meterKind?: PlazaCodexMilestoneRewardMeterKind;
};

/** Discovered/Attached progress bar with four reward chests. */
export function RenderingPlazaCodexDiscoveryMilestoneProgress({
  label,
  value,
  max,
  ariaLabel,
  sectionId,
  meterKind = 'discovered',
}: RenderingPlazaCodexDiscoveryMilestoneProgressProps): React.JSX.Element {
  const attachedRecipeIds = useSyncExternalStore(
    subscribingWorldPlazaRecipeDiscovery,
    gettingWorldPlazaRecipeAttachedSnapshot,
    () => [] as const
  );
  const attachedRecipeIdSet = useMemo(
    () => new Set(attachedRecipeIds),
    [attachedRecipeIds]
  );

  const markers = resolvingPlazaCodexDiscoveryMilestoneRewardMarkers(
    value,
    max,
    sectionId
      ? {
          sectionId,
          meterKind,
          attachedRecipeIds: attachedRecipeIdSet,
        }
      : undefined
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
