'use client';

/**
 * One-shot parchment dialog to give a Familiar companion their permanent name.
 *
 * @module components/world/wildlife/pets/components/renderingWildlifePetNameDialog
 */

import { DEFINING_WORLD_PLAZA_UI_DATA_ATTRIBUTE } from '@/components/world/domains/definingWorldPlazaClickMovementConstants';
import { RenderingWildlifePetSpeciesPortrait } from '@/components/world/wildlife/pets/components/renderingWildlifePetSpeciesPortrait';
import {
  DEFINING_WILDLIFE_PET_NAME_DIALOG_MAX_LENGTH,
  DEFINING_WILDLIFE_PET_NAME_DIALOG_PORTRAIT_ZOOM,
  LABELING_WILDLIFE_PET_NAME_DIALOG_ARIA_LABEL,
  LABELING_WILDLIFE_PET_NAME_DIALOG_CANCEL_LABEL,
  LABELING_WILDLIFE_PET_NAME_DIALOG_CONFIRM_LABEL,
  LABELING_WILDLIFE_PET_NAME_DIALOG_MESSAGE,
  LABELING_WILDLIFE_PET_NAME_DIALOG_PLACEHOLDER,
  LABELING_WILDLIFE_PET_NAME_DIALOG_TITLE,
  STYLING_WILDLIFE_PET_NAME_DIALOG_ACTIONS_CLASS_NAME,
  STYLING_WILDLIFE_PET_NAME_DIALOG_BODY_CLASS_NAME,
  STYLING_WILDLIFE_PET_NAME_DIALOG_CANCEL_BUTTON_CLASS_NAME,
  STYLING_WILDLIFE_PET_NAME_DIALOG_CONFIRM_BUTTON_CLASS_NAME,
  STYLING_WILDLIFE_PET_NAME_DIALOG_INPUT_CLASS_NAME,
  STYLING_WILDLIFE_PET_NAME_DIALOG_MESSAGE_CLASS_NAME,
  STYLING_WILDLIFE_PET_NAME_DIALOG_OVERLAY_CLASS_NAME,
  STYLING_WILDLIFE_PET_NAME_DIALOG_PANEL_CLASS_NAME,
  STYLING_WILDLIFE_PET_NAME_DIALOG_PORTRAIT_FRAME_CLASS_NAME,
  STYLING_WILDLIFE_PET_NAME_DIALOG_TITLE_CLASS_NAME,
} from '@/components/world/wildlife/pets/domains/definingWildlifePetNameDialogConstants';
import { useEffect, useState, type SyntheticEvent } from 'react';
import { createPortal } from 'react-dom';

export type RenderingWildlifePetNameDialogProps = {
  readonly isOpen: boolean;
  /** Species whose idle sprite sits above the title. */
  readonly speciesId: string | null;
  readonly onCancel: () => void;
  readonly onConfirm: (name: string) => void;
};

/**
 * Simple name prompt. Confirm commits a permanent companion name.
 */
export function RenderingWildlifePetNameDialog({
  isOpen,
  speciesId,
  onCancel,
  onConfirm,
}: RenderingWildlifePetNameDialogProps): React.JSX.Element | null {
  const [nameDraft, setNameDraft] = useState('');

  useEffect(() => {
    if (isOpen) {
      setNameDraft('');
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const dismissingOnEscape = (event: KeyboardEvent): void => {
      if (event.key !== 'Escape') {
        return;
      }

      onCancel();
    };

    document.addEventListener('keydown', dismissingOnEscape);

    return () => document.removeEventListener('keydown', dismissingOnEscape);
  }, [isOpen, onCancel]);

  const stoppingPlazaWalkPointerPropagation = (
    event: SyntheticEvent<HTMLElement>
  ): void => {
    event.stopPropagation();
  };

  const committingName = (): void => {
    const trimmed = nameDraft.trim();

    if (trimmed.length === 0) {
      return;
    }

    onConfirm(trimmed);
  };

  if (!isOpen || typeof document === 'undefined') {
    return null;
  }

  return createPortal(
    <div
      {...{ [DEFINING_WORLD_PLAZA_UI_DATA_ATTRIBUTE]: 'pet-name-dialog' }}
      role="dialog"
      aria-modal="true"
      aria-label={LABELING_WILDLIFE_PET_NAME_DIALOG_ARIA_LABEL}
      className={STYLING_WILDLIFE_PET_NAME_DIALOG_OVERLAY_CLASS_NAME}
      onPointerDown={stoppingPlazaWalkPointerPropagation}
    >
      <div
        className={STYLING_WILDLIFE_PET_NAME_DIALOG_PANEL_CLASS_NAME}
        onPointerDown={stoppingPlazaWalkPointerPropagation}
      >
        <div className={STYLING_WILDLIFE_PET_NAME_DIALOG_BODY_CLASS_NAME}>
          {speciesId ? (
            <div
              className={
                STYLING_WILDLIFE_PET_NAME_DIALOG_PORTRAIT_FRAME_CLASS_NAME
              }
            >
              <RenderingWildlifePetSpeciesPortrait
                speciesId={speciesId}
                zoom={DEFINING_WILDLIFE_PET_NAME_DIALOG_PORTRAIT_ZOOM}
              />
            </div>
          ) : null}
          <p className={STYLING_WILDLIFE_PET_NAME_DIALOG_TITLE_CLASS_NAME}>
            {LABELING_WILDLIFE_PET_NAME_DIALOG_TITLE}
          </p>
          <p className={STYLING_WILDLIFE_PET_NAME_DIALOG_MESSAGE_CLASS_NAME}>
            {LABELING_WILDLIFE_PET_NAME_DIALOG_MESSAGE}
          </p>
          <input
            type="text"
            autoFocus
            value={nameDraft}
            maxLength={DEFINING_WILDLIFE_PET_NAME_DIALOG_MAX_LENGTH}
            placeholder={LABELING_WILDLIFE_PET_NAME_DIALOG_PLACEHOLDER}
            className={STYLING_WILDLIFE_PET_NAME_DIALOG_INPUT_CLASS_NAME}
            onChange={(event) => setNameDraft(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                event.preventDefault();
                committingName();
              }
            }}
          />
        </div>

        <div className={STYLING_WILDLIFE_PET_NAME_DIALOG_ACTIONS_CLASS_NAME}>
          <button
            type="button"
            className={
              STYLING_WILDLIFE_PET_NAME_DIALOG_CANCEL_BUTTON_CLASS_NAME
            }
            onClick={onCancel}
          >
            {LABELING_WILDLIFE_PET_NAME_DIALOG_CANCEL_LABEL}
          </button>
          <button
            type="button"
            className={
              STYLING_WILDLIFE_PET_NAME_DIALOG_CONFIRM_BUTTON_CLASS_NAME
            }
            disabled={nameDraft.trim().length === 0}
            onClick={committingName}
          >
            {LABELING_WILDLIFE_PET_NAME_DIALOG_CONFIRM_LABEL}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
