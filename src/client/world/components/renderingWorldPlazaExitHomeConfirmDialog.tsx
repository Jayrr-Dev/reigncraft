'use client';

import { DEFINING_WORLD_PLAZA_UI_DATA_ATTRIBUTE } from '@/components/world/domains/definingWorldPlazaClickMovementConstants';
import {
  LABELING_WORLD_PLAZA_EXIT_HOME_CONFIRM_DIALOG_ARIA_LABEL,
  LABELING_WORLD_PLAZA_EXIT_HOME_CONFIRM_DIALOG_CONFIRM_LABEL,
  LABELING_WORLD_PLAZA_EXIT_HOME_CONFIRM_DIALOG_MESSAGE,
  LABELING_WORLD_PLAZA_EXIT_HOME_CONFIRM_DIALOG_STAY_LABEL,
  LABELING_WORLD_PLAZA_EXIT_HOME_CONFIRM_DIALOG_TITLE,
  STYLING_WORLD_PLAZA_EXIT_HOME_CONFIRM_DIALOG_ACTIONS_CLASS_NAME,
  STYLING_WORLD_PLAZA_EXIT_HOME_CONFIRM_DIALOG_BODY_CLASS_NAME,
  STYLING_WORLD_PLAZA_EXIT_HOME_CONFIRM_DIALOG_CONFIRM_BUTTON_CLASS_NAME,
  STYLING_WORLD_PLAZA_EXIT_HOME_CONFIRM_DIALOG_MESSAGE_CLASS_NAME,
  STYLING_WORLD_PLAZA_EXIT_HOME_CONFIRM_DIALOG_OVERLAY_CLASS_NAME,
  STYLING_WORLD_PLAZA_EXIT_HOME_CONFIRM_DIALOG_PANEL_CLASS_NAME,
  STYLING_WORLD_PLAZA_EXIT_HOME_CONFIRM_DIALOG_STAY_BUTTON_CLASS_NAME,
  STYLING_WORLD_PLAZA_EXIT_HOME_CONFIRM_DIALOG_TITLE_CLASS_NAME,
} from '@/components/world/domains/definingWorldPlazaExitHomeConfirmDialogConstants';

export type RenderingWorldPlazaExitHomeConfirmDialogProps = {
  isOpen: boolean;
  onStay: () => void;
  onConfirmExit: () => void;
};

/**
 * Simple confirmation before returning from the plaza to the home screen.
 */
export function RenderingWorldPlazaExitHomeConfirmDialog({
  isOpen,
  onStay,
  onConfirmExit,
}: RenderingWorldPlazaExitHomeConfirmDialogProps): React.JSX.Element | null {
  if (!isOpen) {
    return null;
  }

  return (
    <div
      {...{ [DEFINING_WORLD_PLAZA_UI_DATA_ATTRIBUTE]: true }}
      role="dialog"
      aria-modal="true"
      aria-label={LABELING_WORLD_PLAZA_EXIT_HOME_CONFIRM_DIALOG_ARIA_LABEL}
      className={
        STYLING_WORLD_PLAZA_EXIT_HOME_CONFIRM_DIALOG_OVERLAY_CLASS_NAME
      }
    >
      <div
        className={
          STYLING_WORLD_PLAZA_EXIT_HOME_CONFIRM_DIALOG_PANEL_CLASS_NAME
        }
      >
        <div
          className={
            STYLING_WORLD_PLAZA_EXIT_HOME_CONFIRM_DIALOG_BODY_CLASS_NAME
          }
        >
          <p
            className={
              STYLING_WORLD_PLAZA_EXIT_HOME_CONFIRM_DIALOG_TITLE_CLASS_NAME
            }
          >
            {LABELING_WORLD_PLAZA_EXIT_HOME_CONFIRM_DIALOG_TITLE}
          </p>
          <p
            className={
              STYLING_WORLD_PLAZA_EXIT_HOME_CONFIRM_DIALOG_MESSAGE_CLASS_NAME
            }
          >
            {LABELING_WORLD_PLAZA_EXIT_HOME_CONFIRM_DIALOG_MESSAGE}
          </p>
        </div>

        <div
          className={
            STYLING_WORLD_PLAZA_EXIT_HOME_CONFIRM_DIALOG_ACTIONS_CLASS_NAME
          }
        >
          <button
            type="button"
            autoFocus
            onClick={onStay}
            className={
              STYLING_WORLD_PLAZA_EXIT_HOME_CONFIRM_DIALOG_STAY_BUTTON_CLASS_NAME
            }
          >
            {LABELING_WORLD_PLAZA_EXIT_HOME_CONFIRM_DIALOG_STAY_LABEL}
          </button>
          <button
            type="button"
            onClick={onConfirmExit}
            className={
              STYLING_WORLD_PLAZA_EXIT_HOME_CONFIRM_DIALOG_CONFIRM_BUTTON_CLASS_NAME
            }
          >
            {LABELING_WORLD_PLAZA_EXIT_HOME_CONFIRM_DIALOG_CONFIRM_LABEL}
          </button>
        </div>
      </div>
    </div>
  );
}
