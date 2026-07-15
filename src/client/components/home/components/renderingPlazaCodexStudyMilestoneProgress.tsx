/**
 * Overall panel progress track with chest circles at milestones.
 *
 * @module components/home/components/renderingPlazaCodexStudyMilestoneProgress
 */

import { RenderingPlazaCodexMilestoneRewardClaimDialog } from '@/components/home/components/renderingPlazaCodexMilestoneRewardClaimDialog';
import { claimingPlazaCodexMilestoneReward } from '@/components/home/domains/claimingPlazaCodexMilestoneReward';
import type { PlazaCodexMilestoneRewardDefinition } from '@/components/home/domains/definingPlazaCodexMilestoneRewardRegistry';
import { showingReigncraftToast } from '@/components/ui/domains/showingReigncraftToast';
import { LABELING_WORLD_PLAZA_INVENTORY_STORAGE_EXPANSION_INVENTORY_FULL_TOAST } from '@/components/world/inventory/domains/definingWorldPlazaInventoryStorageExpansionConstants';
import {
  DEFINING_PLAZA_CODEX_STUDY_MILESTONE_PROGRESS_FILL_CLASS_NAME,
  DEFINING_PLAZA_CODEX_STUDY_MILESTONE_PROGRESS_MARKERS_CLASS_NAME,
  DEFINING_PLAZA_CODEX_STUDY_MILESTONE_PROGRESS_SHELL_CLASS_NAME,
  DEFINING_PLAZA_CODEX_STUDY_MILESTONE_PROGRESS_TRACK_CLASS_NAME,
  DEFINING_PLAZA_CODEX_STUDY_MILESTONE_REWARD_CHEST_ICON,
  DEFINING_PLAZA_CODEX_STUDY_MILESTONE_REWARD_CLAIMED_ICON,
  DEFINING_PLAZA_CODEX_STUDY_MILESTONE_REWARD_ICON_CLASS_NAME,
  DEFINING_PLAZA_CODEX_STUDY_MILESTONE_REWARD_NODE_CLAIMED_CLASS_NAME,
  DEFINING_PLAZA_CODEX_STUDY_MILESTONE_REWARD_NODE_LOCKED_CLASS_NAME,
  DEFINING_PLAZA_CODEX_STUDY_MILESTONE_REWARD_NODE_REACHED_CLASS_NAME,
  DEFINING_PLAZA_CODEX_STUDY_MILESTONE_REWARD_NOTIFICATION_BADGE_CLASS_NAME,
  DEFINING_PLAZA_CODEX_STUDY_MILESTONE_REWARD_POPOVER_CLASS_NAME,
  DEFINING_PLAZA_CODEX_STUDY_MILESTONE_REWARD_POPOVER_ICON_CLASS_NAME,
  DEFINING_PLAZA_CODEX_STUDY_MILESTONE_REWARD_POPOVER_LABEL_CLASS_NAME,
} from '@/components/home/domains/definingPlazaCodexStudyMilestoneRewardConstants';
import {
  resolvingPlazaCodexStudyMilestoneRewardPopoverLabel,
  type PlazaCodexOverallMilestoneRewardMarker,
} from '@/components/home/domains/resolvingPlazaCodexStudyMilestoneRewardMarkers';
import { usingPlazaCodexStudyMilestoneRewardPopoverOpenState } from '@/components/home/hooks/usingPlazaCodexStudyMilestoneRewardPopoverOpenState';
import { Icon } from '@/components/ui/icon';
import { RenderingWorldPlazaCraftModeRecipeSpriteSheetPreview } from '@/components/world/building/components/renderingWorldPlazaCraftModeRecipeSpriteSheetPreview';
import { resolvingWorldPlazaCraftModeRecipeDefinition } from '@/components/world/crafting/domains/definingWorldPlazaCraftModeRecipeRegistry';
import type { DefiningWorldPlazaCraftModeRecipeVisual } from '@/components/world/crafting/domains/definingWorldPlazaCraftModeRecipeTypes';
import { usingWorldPlazaAnchoredPopoverViewportShiftX } from '@/components/world/hooks/usingWorldPlazaAnchoredPopoverViewportShiftX';
import type { DefiningWorldPlazaInventorySpriteSheetIcon } from '@/components/world/inventory/domains/definingWorldPlazaInventoryItemTypeDefinition';
import { resolvingWorldPlazaInventoryStorageExpansionPageSpriteSheetIcon } from '@/components/world/inventory/domains/definingWorldPlazaInventoryStorageExpansionPageSpriteSheetConstants';
import { playingWildlifeStudySfx } from '@/components/world/wildlife/domains/playingWildlifeStudySfx';
import { useCallback, useRef, useState } from 'react';

export type RenderingPlazaCodexStudyMilestoneProgressProps = {
  value: number;
  max: number;
  markers: readonly PlazaCodexOverallMilestoneRewardMarker[];
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

function RenderingPlazaCodexStudyMilestoneRewardPopoverIcon({
  recipeVisual,
  itemSpriteSheet,
}: {
  readonly recipeVisual: DefiningWorldPlazaCraftModeRecipeVisual | null;
  readonly itemSpriteSheet: DefiningWorldPlazaInventorySpriteSheetIcon | null;
}): React.JSX.Element | null {
  if (itemSpriteSheet) {
    return (
      <RenderingWorldPlazaCraftModeRecipeSpriteSheetPreview
        spriteSheetIcon={itemSpriteSheet}
        className={
          DEFINING_PLAZA_CODEX_STUDY_MILESTONE_REWARD_POPOVER_ICON_CLASS_NAME
        }
      />
    );
  }

  if (recipeVisual?.visualKind === 'sprite-sheet') {
    return (
      <RenderingWorldPlazaCraftModeRecipeSpriteSheetPreview
        spriteSheetIcon={recipeVisual.spriteSheetIcon}
        className={
          DEFINING_PLAZA_CODEX_STUDY_MILESTONE_REWARD_POPOVER_ICON_CLASS_NAME
        }
      />
    );
  }

  if (recipeVisual?.visualKind === 'iconify') {
    return (
      <Icon
        icon={recipeVisual.recipeEmblemIconifyIcon}
        className={
          DEFINING_PLAZA_CODEX_STUDY_MILESTONE_REWARD_POPOVER_ICON_CLASS_NAME
        }
      />
    );
  }

  if (recipeVisual?.visualKind === 'world-plaza-campfire') {
    return (
      <Icon
        icon="mdi:campfire"
        className={
          DEFINING_PLAZA_CODEX_STUDY_MILESTONE_REWARD_POPOVER_ICON_CLASS_NAME
        }
      />
    );
  }

  return null;
}

function RenderingPlazaCodexStudyMilestoneRewardMarker({
  marker,
  isPopoverOpen,
  onTogglePopover,
  onRewardClaimed,
}: {
  readonly marker: PlazaCodexOverallMilestoneRewardMarker;
  readonly isPopoverOpen: boolean;
  readonly onTogglePopover: () => void;
  readonly onRewardClaimed: (
    definition: PlazaCodexMilestoneRewardDefinition
  ) => void;
}): React.JSX.Element {
  const nodeClassName = marker.isClaimed
    ? DEFINING_PLAZA_CODEX_STUDY_MILESTONE_REWARD_NODE_CLAIMED_CLASS_NAME
    : marker.isReached
      ? DEFINING_PLAZA_CODEX_STUDY_MILESTONE_REWARD_NODE_REACHED_CLASS_NAME
      : DEFINING_PLAZA_CODEX_STUDY_MILESTONE_REWARD_NODE_LOCKED_CLASS_NAME;
  const nodeIcon = marker.isClaimed
    ? DEFINING_PLAZA_CODEX_STUDY_MILESTONE_REWARD_CLAIMED_ICON
    : DEFINING_PLAZA_CODEX_STUDY_MILESTONE_REWARD_CHEST_ICON;
  const rewardLabel = marker.rewardDefinition?.reward.label ?? null;
  const popoverLabel = resolvingPlazaCodexStudyMilestoneRewardPopoverLabel(
    marker.remainingNeeded,
    marker.isReached,
    {
      rewardLabel,
      isClaimed: marker.isClaimed,
      hasUnclaimedReward: marker.hasUnclaimedReward,
    }
  );
  const rewardRecipeVisual =
    marker.rewardDefinition?.reward.kind === 'attach-recipe'
      ? (resolvingWorldPlazaCraftModeRecipeDefinition(
          marker.rewardDefinition.reward.recipeId
        )?.recipeVisual ?? null)
      : null;
  const rewardItemSpriteSheet =
    marker.rewardDefinition?.reward.kind === 'unlock-storage-row'
      ? resolvingWorldPlazaInventoryStorageExpansionPageSpriteSheetIcon(
          marker.rewardDefinition.reward.pageTier
        )
      : null;
  const { popoverRef, popoverShiftStyle } =
    usingWorldPlazaAnchoredPopoverViewportShiftX(
      isPopoverOpen ? `${marker.id}:${popoverLabel}` : null
    );

  return (
    <>
      <button
        type="button"
        className={nodeClassName}
        style={{ left: `${marker.percent}%` }}
        aria-label={popoverLabel}
        aria-expanded={isPopoverOpen}
        onClick={() => {
          if (marker.hasUnclaimedReward && marker.rewardDefinition) {
            const claimResult = claimingPlazaCodexMilestoneReward(
              marker.rewardDefinition,
              marker.isReached
            );
            if (claimResult === 'inventory-full') {
              showingReigncraftToast(
                LABELING_WORLD_PLAZA_INVENTORY_STORAGE_EXPANSION_INVENTORY_FULL_TOAST
              );
              return;
            }
            if (claimResult === 'attached' || claimResult === 'granted') {
              playingWildlifeStudySfx({ sectionId: 'codex' });
              onRewardClaimed(marker.rewardDefinition);
              return;
            }
          }
          onTogglePopover();
        }}
      >
        <Icon
          icon={nodeIcon}
          className={
            DEFINING_PLAZA_CODEX_STUDY_MILESTONE_REWARD_ICON_CLASS_NAME
          }
        />
        {marker.hasUnclaimedReward ? (
          <span
            className={
              DEFINING_PLAZA_CODEX_STUDY_MILESTONE_REWARD_NOTIFICATION_BADGE_CLASS_NAME
            }
            aria-hidden
          />
        ) : null}
      </button>
      {isPopoverOpen ? (
        <div
          ref={popoverRef}
          role="tooltip"
          className={
            DEFINING_PLAZA_CODEX_STUDY_MILESTONE_REWARD_POPOVER_CLASS_NAME
          }
          style={{
            ...popoverShiftStyle,
            left: `${marker.percent}%`,
          }}
        >
          {rewardRecipeVisual || rewardItemSpriteSheet ? (
            <RenderingPlazaCodexStudyMilestoneRewardPopoverIcon
              recipeVisual={rewardRecipeVisual}
              itemSpriteSheet={rewardItemSpriteSheet}
            />
          ) : null}
          <span
            className={
              DEFINING_PLAZA_CODEX_STUDY_MILESTONE_REWARD_POPOVER_LABEL_CLASS_NAME
            }
          >
            {popoverLabel}
          </span>
        </div>
      ) : null}
    </>
  );
}

/** Progress bar with chest circles at overall collection milestones. */
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
  const markersRef = useRef<HTMLDivElement>(null);
  const { openMarkerId, togglingMarkerPopover } =
    usingPlazaCodexStudyMilestoneRewardPopoverOpenState(markersRef);
  const [claimedRewardDefinition, setClaimedRewardDefinition] =
    useState<PlazaCodexMilestoneRewardDefinition | null>(null);
  const dismissingClaimedRewardDialog = useCallback((): void => {
    setClaimedRewardDefinition(null);
  }, []);

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
        ref={markersRef}
        className={
          DEFINING_PLAZA_CODEX_STUDY_MILESTONE_PROGRESS_MARKERS_CLASS_NAME
        }
      >
        {markers.map((marker) => (
          <RenderingPlazaCodexStudyMilestoneRewardMarker
            key={marker.id}
            marker={marker}
            isPopoverOpen={openMarkerId === marker.id}
            onTogglePopover={() => togglingMarkerPopover(marker.id)}
            onRewardClaimed={setClaimedRewardDefinition}
          />
        ))}
      </div>
      <RenderingPlazaCodexMilestoneRewardClaimDialog
        definition={claimedRewardDefinition}
        onDismiss={dismissingClaimedRewardDialog}
      />
    </div>
  );
}
