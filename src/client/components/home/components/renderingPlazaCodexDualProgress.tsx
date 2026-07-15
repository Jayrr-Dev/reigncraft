/**
 * Stacked codex progress meters (Sighted + Studied, or Logged + Studied).
 * Sighted/Logged uses five chests; Studied uses ten front-loaded chests.
 *
 * @module components/home/components/renderingPlazaCodexDualProgress
 */

import { RenderingPlazaCodexStudyMilestoneProgress } from '@/components/home/components/renderingPlazaCodexStudyMilestoneProgress';
import {
  DEFINING_PLAZA_CODEX_DUAL_PROGRESS_COLUMN_CLASS_NAME,
  DEFINING_PLAZA_CODEX_DUAL_PROGRESS_COUNT_CLASS_NAME,
  DEFINING_PLAZA_CODEX_DUAL_PROGRESS_LABEL_CLASS_NAME,
  DEFINING_PLAZA_CODEX_DUAL_PROGRESS_ROW_CLASS_NAME,
  DEFINING_PLAZA_CODEX_DUAL_PROGRESS_SHELL_CLASS_NAME,
} from '@/components/home/domains/definingPlazaCodexDualProgressConstants';
import type { PlazaCodexMilestoneRewardMeterKind } from '@/components/home/domains/definingPlazaCodexMilestoneRewardRegistry';
import {
  resolvingPlazaCodexDualMeterMilestoneRewardPercents,
  resolvingPlazaCodexOverallProgressMilestoneRewardMarkers,
} from '@/components/home/domains/resolvingPlazaCodexStudyMilestoneRewardMarkers';
import type { WorldPlazaCodexSectionId } from '@/components/world/domains/definingWorldPlazaCodexConstants';
import {
  gettingWorldPlazaRecipeAttachedSnapshot,
  subscribingWorldPlazaRecipeDiscovery,
} from '@/components/world/domains/managingWorldPlazaRecipeDiscoveryStore';
import {
  gettingWorldPlazaInventoryStorageExpansionClaimedSnapshot,
  subscribingWorldPlazaInventoryStorageExpansion,
} from '@/components/world/inventory/domains/managingWorldPlazaInventoryStorageExpansionStore';
import { useSyncExternalStore } from 'react';

const RENDERING_PLAZA_CODEX_DUAL_PROGRESS_EMPTY_CLAIMED_SNAPSHOT: readonly string[] =
  [];

export type PlazaCodexDualProgressMetric = {
  label: string;
  value: number;
  max: number;
  ariaLabel: string;
};

export type RenderingPlazaCodexDualProgressProps = {
  left: PlazaCodexDualProgressMetric;
  right: PlazaCodexDualProgressMetric;
  /** Codex section that owns these meters (keys milestone reward registry). */
  sectionId?: WorldPlazaCodexSectionId;
};

function RenderingPlazaCodexDualProgressMeter({
  metric,
  sectionId,
  meterKind,
  attachedRecipeIds,
}: {
  metric: PlazaCodexDualProgressMetric;
  sectionId?: WorldPlazaCodexSectionId;
  meterKind: PlazaCodexMilestoneRewardMeterKind;
  attachedRecipeIds: ReadonlySet<string>;
}) {
  const markers = resolvingPlazaCodexOverallProgressMilestoneRewardMarkers(
    metric.value,
    metric.max,
    resolvingPlazaCodexDualMeterMilestoneRewardPercents(meterKind),
    sectionId
      ? {
          sectionId,
          meterKind,
          attachedRecipeIds,
        }
      : undefined
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

/** Two stacked progress meters for codex collection panels. */
export function RenderingPlazaCodexDualProgress({
  left,
  right,
  sectionId,
}: RenderingPlazaCodexDualProgressProps) {
  const attachedRecipeIdsList = useSyncExternalStore(
    subscribingWorldPlazaRecipeDiscovery,
    gettingWorldPlazaRecipeAttachedSnapshot,
    () => []
  );
  const attachedRecipeIds = new Set(attachedRecipeIdsList);
  // Re-render when packing-ledger Codex claims change claimed-chest state.
  useSyncExternalStore(
    subscribingWorldPlazaInventoryStorageExpansion,
    gettingWorldPlazaInventoryStorageExpansionClaimedSnapshot,
    () => RENDERING_PLAZA_CODEX_DUAL_PROGRESS_EMPTY_CLAIMED_SNAPSHOT
  );

  return (
    <div className={DEFINING_PLAZA_CODEX_DUAL_PROGRESS_SHELL_CLASS_NAME}>
      <div className={DEFINING_PLAZA_CODEX_DUAL_PROGRESS_ROW_CLASS_NAME}>
        <RenderingPlazaCodexDualProgressMeter
          metric={left}
          sectionId={sectionId}
          meterKind="discovered"
          attachedRecipeIds={attachedRecipeIds}
        />
        <RenderingPlazaCodexDualProgressMeter
          metric={right}
          sectionId={sectionId}
          meterKind="studied"
          attachedRecipeIds={attachedRecipeIds}
        />
      </div>
    </div>
  );
}
