/**
 * Dialog shown after claiming a Codex milestone chest reward.
 *
 * @module components/home/components/renderingPlazaCodexMilestoneRewardClaimDialog
 */

import {
  LABELING_PLAZA_CODEX_MILESTONE_REWARD_CLAIM_DIALOG_ARIA,
  LABELING_PLAZA_CODEX_MILESTONE_REWARD_CLAIM_DIALOG_DISMISS,
  LABELING_PLAZA_CODEX_MILESTONE_REWARD_CLAIM_DIALOG_EYEBROW,
  STYLING_PLAZA_CODEX_MILESTONE_REWARD_CLAIM_DIALOG_ACTIONS_CLASS_NAME,
  STYLING_PLAZA_CODEX_MILESTONE_REWARD_CLAIM_DIALOG_ART_ICON_CLASS_NAME,
  STYLING_PLAZA_CODEX_MILESTONE_REWARD_CLAIM_DIALOG_ART_SHELL_CLASS_NAME,
  STYLING_PLAZA_CODEX_MILESTONE_REWARD_CLAIM_DIALOG_BODY_CLASS_NAME,
  STYLING_PLAZA_CODEX_MILESTONE_REWARD_CLAIM_DIALOG_DESCRIPTION_CLASS_NAME,
  STYLING_PLAZA_CODEX_MILESTONE_REWARD_CLAIM_DIALOG_DISMISS_BUTTON_CLASS_NAME,
  STYLING_PLAZA_CODEX_MILESTONE_REWARD_CLAIM_DIALOG_EYEBROW_CLASS_NAME,
  STYLING_PLAZA_CODEX_MILESTONE_REWARD_CLAIM_DIALOG_OVERLAY_CLASS_NAME,
  STYLING_PLAZA_CODEX_MILESTONE_REWARD_CLAIM_DIALOG_PANEL_CLASS_NAME,
  STYLING_PLAZA_CODEX_MILESTONE_REWARD_CLAIM_DIALOG_TITLE_CLASS_NAME,
} from '@/components/home/domains/definingPlazaCodexMilestoneRewardClaimDialogConstants';
import type { PlazaCodexMilestoneRewardDefinition } from '@/components/home/domains/definingPlazaCodexMilestoneRewardRegistry';
import { resolvingPlazaCodexMilestoneRewardClaimDialogModel } from '@/components/home/domains/resolvingPlazaCodexMilestoneRewardClaimDialogModel';
import { Icon } from '@/components/ui/icon';
import { RenderingWorldPlazaCraftModeRecipeSpriteSheetPreview } from '@/components/world/building/components/renderingWorldPlazaCraftModeRecipeSpriteSheetPreview';
import type { DefiningWorldPlazaCraftModeRecipeVisual } from '@/components/world/crafting/domains/definingWorldPlazaCraftModeRecipeTypes';
import { createPortal } from 'react-dom';

export type RenderingPlazaCodexMilestoneRewardClaimDialogProps = {
  readonly definition: PlazaCodexMilestoneRewardDefinition | null;
  readonly onDismiss: () => void;
};

function RenderingPlazaCodexMilestoneRewardClaimDialogArt({
  recipeVisual,
}: {
  readonly recipeVisual: DefiningWorldPlazaCraftModeRecipeVisual | null;
}): React.JSX.Element {
  if (recipeVisual?.visualKind === 'sprite-sheet') {
    return (
      <RenderingWorldPlazaCraftModeRecipeSpriteSheetPreview
        spriteSheetIcon={recipeVisual.spriteSheetIcon}
        className={
          STYLING_PLAZA_CODEX_MILESTONE_REWARD_CLAIM_DIALOG_ART_ICON_CLASS_NAME
        }
      />
    );
  }

  if (recipeVisual?.visualKind === 'iconify') {
    return (
      <Icon
        icon={recipeVisual.recipeEmblemIconifyIcon}
        className={
          STYLING_PLAZA_CODEX_MILESTONE_REWARD_CLAIM_DIALOG_ART_ICON_CLASS_NAME
        }
      />
    );
  }

  return (
    <Icon
      icon="mdi:treasure-chest"
      className={
        STYLING_PLAZA_CODEX_MILESTONE_REWARD_CLAIM_DIALOG_ART_ICON_CLASS_NAME
      }
    />
  );
}

/** Full-screen claim celebration after a milestone chest grant. */
export function RenderingPlazaCodexMilestoneRewardClaimDialog({
  definition,
  onDismiss,
}: RenderingPlazaCodexMilestoneRewardClaimDialogProps): React.JSX.Element | null {
  if (definition === null || typeof document === 'undefined') {
    return null;
  }

  const model = resolvingPlazaCodexMilestoneRewardClaimDialogModel(definition);

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={LABELING_PLAZA_CODEX_MILESTONE_REWARD_CLAIM_DIALOG_ARIA}
      className={
        STYLING_PLAZA_CODEX_MILESTONE_REWARD_CLAIM_DIALOG_OVERLAY_CLASS_NAME
      }
      onClick={onDismiss}
    >
      <div
        className={
          STYLING_PLAZA_CODEX_MILESTONE_REWARD_CLAIM_DIALOG_PANEL_CLASS_NAME
        }
        onClick={(event) => {
          event.stopPropagation();
        }}
      >
        <div
          className={
            STYLING_PLAZA_CODEX_MILESTONE_REWARD_CLAIM_DIALOG_BODY_CLASS_NAME
          }
        >
          <p
            className={
              STYLING_PLAZA_CODEX_MILESTONE_REWARD_CLAIM_DIALOG_EYEBROW_CLASS_NAME
            }
          >
            {LABELING_PLAZA_CODEX_MILESTONE_REWARD_CLAIM_DIALOG_EYEBROW}
          </p>
          <div
            className={
              STYLING_PLAZA_CODEX_MILESTONE_REWARD_CLAIM_DIALOG_ART_SHELL_CLASS_NAME
            }
            aria-hidden
          >
            <RenderingPlazaCodexMilestoneRewardClaimDialogArt
              recipeVisual={model.recipeVisual}
            />
          </div>
          <p
            className={
              STYLING_PLAZA_CODEX_MILESTONE_REWARD_CLAIM_DIALOG_TITLE_CLASS_NAME
            }
          >
            {model.title}
          </p>
          {model.description ? (
            <p
              className={
                STYLING_PLAZA_CODEX_MILESTONE_REWARD_CLAIM_DIALOG_DESCRIPTION_CLASS_NAME
              }
            >
              {model.description}
            </p>
          ) : null}
        </div>

        <div
          className={
            STYLING_PLAZA_CODEX_MILESTONE_REWARD_CLAIM_DIALOG_ACTIONS_CLASS_NAME
          }
        >
          <button
            type="button"
            autoFocus
            onClick={onDismiss}
            className={
              STYLING_PLAZA_CODEX_MILESTONE_REWARD_CLAIM_DIALOG_DISMISS_BUTTON_CLASS_NAME
            }
          >
            {LABELING_PLAZA_CODEX_MILESTONE_REWARD_CLAIM_DIALOG_DISMISS}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
