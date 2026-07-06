'use client';

import {
  LABELING_PLAZA_SINGLE_PLAYER_SAVE_SLOT_DELETE_CONFIRM_ARIA_LABEL,
  LABELING_PLAZA_SINGLE_PLAYER_SAVE_SLOT_DELETE_CONFIRM_CANCEL_LABEL,
  LABELING_PLAZA_SINGLE_PLAYER_SAVE_SLOT_DELETE_CONFIRM_CONFIRM_LABEL,
  LABELING_PLAZA_SINGLE_PLAYER_SAVE_SLOT_DELETE_CONFIRM_MESSAGE,
  LABELING_PLAZA_SINGLE_PLAYER_SAVE_SLOT_DELETE_CONFIRM_TITLE,
  STYLING_PLAZA_SINGLE_PLAYER_SAVE_SLOT_DELETE_CONFIRM_ACTIONS_CLASS_NAME,
  STYLING_PLAZA_SINGLE_PLAYER_SAVE_SLOT_DELETE_CONFIRM_BODY_CLASS_NAME,
  STYLING_PLAZA_SINGLE_PLAYER_SAVE_SLOT_DELETE_CONFIRM_CANCEL_BUTTON_CLASS_NAME,
  STYLING_PLAZA_SINGLE_PLAYER_SAVE_SLOT_DELETE_CONFIRM_CONFIRM_BUTTON_CLASS_NAME,
  STYLING_PLAZA_SINGLE_PLAYER_SAVE_SLOT_DELETE_CONFIRM_MESSAGE_CLASS_NAME,
  STYLING_PLAZA_SINGLE_PLAYER_SAVE_SLOT_DELETE_CONFIRM_OVERLAY_CLASS_NAME,
  STYLING_PLAZA_SINGLE_PLAYER_SAVE_SLOT_DELETE_CONFIRM_PANEL_CLASS_NAME,
  STYLING_PLAZA_SINGLE_PLAYER_SAVE_SLOT_DELETE_CONFIRM_TITLE_CLASS_NAME,
} from '@/components/home/domains/definingPlazaSinglePlayerSaveSlotDeleteUiConstants';
import type { PlazaSaveSlotIndex } from '../../../../shared/plazaGameSession';

export type RenderingPlazaSinglePlayerSaveSlotDeleteConfirmDialogProps = {
  saveSlotIndex: PlazaSaveSlotIndex | null;
  isDeleting: boolean;
  onCancel: () => void;
  onConfirmDelete: () => void;
};

/**
 * Confirmation before permanently deleting one single-player save slot.
 */
export function RenderingPlazaSinglePlayerSaveSlotDeleteConfirmDialog({
  saveSlotIndex,
  isDeleting,
  onCancel,
  onConfirmDelete,
}: RenderingPlazaSinglePlayerSaveSlotDeleteConfirmDialogProps): React.JSX.Element | null {
  if (saveSlotIndex === null) {
    return null;
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={
        LABELING_PLAZA_SINGLE_PLAYER_SAVE_SLOT_DELETE_CONFIRM_ARIA_LABEL
      }
      className={
        STYLING_PLAZA_SINGLE_PLAYER_SAVE_SLOT_DELETE_CONFIRM_OVERLAY_CLASS_NAME
      }
    >
      <div
        className={
          STYLING_PLAZA_SINGLE_PLAYER_SAVE_SLOT_DELETE_CONFIRM_PANEL_CLASS_NAME
        }
      >
        <div
          className={
            STYLING_PLAZA_SINGLE_PLAYER_SAVE_SLOT_DELETE_CONFIRM_BODY_CLASS_NAME
          }
        >
          <p
            className={
              STYLING_PLAZA_SINGLE_PLAYER_SAVE_SLOT_DELETE_CONFIRM_TITLE_CLASS_NAME
            }
          >
            {LABELING_PLAZA_SINGLE_PLAYER_SAVE_SLOT_DELETE_CONFIRM_TITLE}
          </p>
          <p
            className={
              STYLING_PLAZA_SINGLE_PLAYER_SAVE_SLOT_DELETE_CONFIRM_MESSAGE_CLASS_NAME
            }
          >
            {LABELING_PLAZA_SINGLE_PLAYER_SAVE_SLOT_DELETE_CONFIRM_MESSAGE}
          </p>
          <p
            className={
              STYLING_PLAZA_SINGLE_PLAYER_SAVE_SLOT_DELETE_CONFIRM_MESSAGE_CLASS_NAME
            }
          >
            Slot {saveSlotIndex} will be reset to empty.
          </p>
        </div>

        <div
          className={
            STYLING_PLAZA_SINGLE_PLAYER_SAVE_SLOT_DELETE_CONFIRM_ACTIONS_CLASS_NAME
          }
        >
          <button
            type="button"
            autoFocus
            disabled={isDeleting}
            onClick={onCancel}
            className={
              STYLING_PLAZA_SINGLE_PLAYER_SAVE_SLOT_DELETE_CONFIRM_CANCEL_BUTTON_CLASS_NAME
            }
          >
            {LABELING_PLAZA_SINGLE_PLAYER_SAVE_SLOT_DELETE_CONFIRM_CANCEL_LABEL}
          </button>
          <button
            type="button"
            disabled={isDeleting}
            onClick={onConfirmDelete}
            className={
              STYLING_PLAZA_SINGLE_PLAYER_SAVE_SLOT_DELETE_CONFIRM_CONFIRM_BUTTON_CLASS_NAME
            }
          >
            {
              LABELING_PLAZA_SINGLE_PLAYER_SAVE_SLOT_DELETE_CONFIRM_CONFIRM_LABEL
            }
          </button>
        </div>
      </div>
    </div>
  );
}
