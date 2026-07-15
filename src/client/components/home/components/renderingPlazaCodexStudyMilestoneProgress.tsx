/**
 * Overall panel progress track with chest circles at milestones.
 *
 * @module components/home/components/renderingPlazaCodexStudyMilestoneProgress
 */

import { claimingPlazaCodexMilestoneReward } from '@/components/home/domains/claimingPlazaCodexMilestoneReward';
import {
  DEFINING_PLAZA_CODEX_STUDY_MILESTONE_PROGRESS_FILL_CLASS_NAME,
  DEFINING_PLAZA_CODEX_STUDY_MILESTONE_PROGRESS_MARKERS_CLASS_NAME,
  DEFINING_PLAZA_CODEX_STUDY_MILESTONE_PROGRESS_SHELL_CLASS_NAME,
  DEFINING_PLAZA_CODEX_STUDY_MILESTONE_PROGRESS_TRACK_CLASS_NAME,
  DEFINING_PLAZA_CODEX_STUDY_MILESTONE_REWARD_CHEST_ICON,
  DEFINING_PLAZA_CODEX_STUDY_MILESTONE_REWARD_ICON_CLASS_NAME,
  DEFINING_PLAZA_CODEX_STUDY_MILESTONE_REWARD_NODE_LOCKED_CLASS_NAME,
  DEFINING_PLAZA_CODEX_STUDY_MILESTONE_REWARD_NODE_REACHED_CLASS_NAME,
  DEFINING_PLAZA_CODEX_STUDY_MILESTONE_REWARD_NOTIFICATION_BADGE_CLASS_NAME,
  DEFINING_PLAZA_CODEX_STUDY_MILESTONE_REWARD_POPOVER_ALIGN_CENTER_CLASS_NAME,
  DEFINING_PLAZA_CODEX_STUDY_MILESTONE_REWARD_POPOVER_ALIGN_END_CLASS_NAME,
  DEFINING_PLAZA_CODEX_STUDY_MILESTONE_REWARD_POPOVER_ALIGN_START_CLASS_NAME,
  DEFINING_PLAZA_CODEX_STUDY_MILESTONE_REWARD_POPOVER_CLASS_NAME,
  DEFINING_PLAZA_CODEX_STUDY_MILESTONE_REWARD_POPOVER_ICON_CLASS_NAME,
  DEFINING_PLAZA_CODEX_STUDY_MILESTONE_REWARD_POPOVER_LABEL_CLASS_NAME,
} from '@/components/home/domains/definingPlazaCodexStudyMilestoneRewardConstants';
import {
  resolvingPlazaCodexStudyMilestoneRewardPopoverAlign,
  resolvingPlazaCodexStudyMilestoneRewardPopoverLabel,
  type PlazaCodexOverallMilestoneRewardMarker,
  type PlazaCodexStudyMilestoneRewardPopoverAlign,
} from '@/components/home/domains/resolvingPlazaCodexStudyMilestoneRewardMarkers';
import { usingPlazaCodexStudyMilestoneRewardPopoverOpenState } from '@/components/home/hooks/usingPlazaCodexStudyMilestoneRewardPopoverOpenState';
import { Icon } from '@/components/ui/icon';
import { RenderingWorldPlazaCraftModeRecipeSpriteSheetPreview } from '@/components/world/building/components/renderingWorldPlazaCraftModeRecipeSpriteSheetPreview';
import { resolvingWorldPlazaCraftModeRecipeDefinition } from '@/components/world/crafting/domains/definingWorldPlazaCraftModeRecipeRegistry';
import type { DefiningWorldPlazaCraftModeRecipeVisual } from '@/components/world/crafting/domains/definingWorldPlazaCraftModeRecipeTypes';
import { Fragment, useRef } from 'react';

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

function resolvingPlazaCodexStudyMilestoneRewardPopoverClassName(
  align: PlazaCodexStudyMilestoneRewardPopoverAlign
): string {
  if (align === 'start') {
    return `${DEFINING_PLAZA_CODEX_STUDY_MILESTONE_REWARD_POPOVER_CLASS_NAME} ${DEFINING_PLAZA_CODEX_STUDY_MILESTONE_REWARD_POPOVER_ALIGN_START_CLASS_NAME}`;
  }

  if (align === 'end') {
    return `${DEFINING_PLAZA_CODEX_STUDY_MILESTONE_REWARD_POPOVER_CLASS_NAME} ${DEFINING_PLAZA_CODEX_STUDY_MILESTONE_REWARD_POPOVER_ALIGN_END_CLASS_NAME}`;
  }

  return `${DEFINING_PLAZA_CODEX_STUDY_MILESTONE_REWARD_POPOVER_CLASS_NAME} ${DEFINING_PLAZA_CODEX_STUDY_MILESTONE_REWARD_POPOVER_ALIGN_CENTER_CLASS_NAME}`;
}

function resolvingPlazaCodexStudyMilestoneRewardPopoverStyle(
  percent: number,
  align: PlazaCodexStudyMilestoneRewardPopoverAlign
): React.CSSProperties | undefined {
  if (align === 'center') {
    return { left: `${percent}%` };
  }

  return undefined;
}

function RenderingPlazaCodexStudyMilestoneRewardPopoverIcon({
  recipeVisual,
}: {
  readonly recipeVisual: DefiningWorldPlazaCraftModeRecipeVisual;
}): React.JSX.Element {
  if (recipeVisual.visualKind === 'sprite-sheet') {
    return (
      <RenderingWorldPlazaCraftModeRecipeSpriteSheetPreview
        spriteSheetIcon={recipeVisual.spriteSheetIcon}
        className={
          DEFINING_PLAZA_CODEX_STUDY_MILESTONE_REWARD_POPOVER_ICON_CLASS_NAME
        }
      />
    );
  }

  if (recipeVisual.visualKind === 'iconify') {
    return (
      <Icon
        icon={recipeVisual.recipeEmblemIconifyIcon}
        className={
          DEFINING_PLAZA_CODEX_STUDY_MILESTONE_REWARD_POPOVER_ICON_CLASS_NAME
        }
      />
    );
  }

  return (
    <Icon
      icon="mdi:campfire"
      className={
        DEFINING_PLAZA_CODEX_STUDY_MILESTONE_REWARD_POPOVER_ICON_CLASS_NAME
      }
    />
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
        {markers.map((marker) => {
          const showAsReached = marker.isReached && !marker.isClaimed;
          const nodeClassName = showAsReached
            ? DEFINING_PLAZA_CODEX_STUDY_MILESTONE_REWARD_NODE_REACHED_CLASS_NAME
            : DEFINING_PLAZA_CODEX_STUDY_MILESTONE_REWARD_NODE_LOCKED_CLASS_NAME;
          const rewardLabel = marker.rewardDefinition?.reward.label ?? null;
          const popoverLabel =
            resolvingPlazaCodexStudyMilestoneRewardPopoverLabel(
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
          const popoverAlign =
            resolvingPlazaCodexStudyMilestoneRewardPopoverAlign(marker.percent);
          const isPopoverOpen = openMarkerId === marker.id;

          return (
            <Fragment key={marker.id}>
              <button
                type="button"
                className={nodeClassName}
                style={{ left: `${marker.percent}%` }}
                aria-label={popoverLabel}
                aria-expanded={isPopoverOpen}
                onClick={() => {
                  if (marker.hasUnclaimedReward && marker.rewardDefinition) {
                    claimingPlazaCodexMilestoneReward(
                      marker.rewardDefinition,
                      marker.isReached
                    );
                  }
                  togglingMarkerPopover(marker.id);
                }}
              >
                <Icon
                  icon={DEFINING_PLAZA_CODEX_STUDY_MILESTONE_REWARD_CHEST_ICON}
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
              <span
                className={resolvingPlazaCodexStudyMilestoneRewardPopoverClassName(
                  popoverAlign
                )}
                style={resolvingPlazaCodexStudyMilestoneRewardPopoverStyle(
                  marker.percent,
                  popoverAlign
                )}
              >
                {rewardRecipeVisual ? (
                  <RenderingPlazaCodexStudyMilestoneRewardPopoverIcon
                    recipeVisual={rewardRecipeVisual}
                  />
                ) : null}
                <span
                  className={
                    DEFINING_PLAZA_CODEX_STUDY_MILESTONE_REWARD_POPOVER_LABEL_CLASS_NAME
                  }
                >
                  {popoverLabel}
                </span>
              </span>
            </Fragment>
          );
        })}
      </div>
    </div>
  );
}
