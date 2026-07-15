/**
 * Single discovery meter with milestone chests (Biomes: 4, Recipes: 8).
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
import {
  gettingWorldPlazaInventoryStorageExpansionClaimedSnapshot,
  subscribingWorldPlazaInventoryStorageExpansion,
} from '@/components/world/inventory/domains/managingWorldPlazaInventoryStorageExpansionStore';
import { useMemo, useSyncExternalStore } from 'react';

const RENDERING_PLAZA_CODEX_DISCOVERY_MILESTONE_EMPTY_CLAIMED_SNAPSHOT: readonly string[] =
  [];

export type RenderingPlazaCodexDiscoveryMilestoneProgressProps = {
  label: string;
  value: number;
  max: number;
  ariaLabel: string;
  /** When set, chests resolve / claim registry grants for this section. */
  sectionId?: WorldPlazaCodexSectionId;
  meterKind?: PlazaCodexMilestoneRewardMeterKind;
};

/** Discovered/Attached progress bar with section-scoped reward chests. */
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
  // Re-render when packing-ledger Codex claims change claimed-chest state.
  useSyncExternalStore(
    subscribingWorldPlazaInventoryStorageExpansion,
    gettingWorldPlazaInventoryStorageExpansionClaimedSnapshot,
    () => RENDERING_PLAZA_CODEX_DISCOVERY_MILESTONE_EMPTY_CLAIMED_SNAPSHOT
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
