'use client';

import { RenderingPlazaSinglePlayerSaveSlotDeleteConfirmDialog } from '@/components/home/components/renderingPlazaSinglePlayerSaveSlotDeleteConfirmDialog';
import { checkingPlazaSinglePlayerSaveSlotIsTemporarilyLocked } from '@/components/home/domains/checkingPlazaSinglePlayerSaveSlotIsTemporarilyLocked';
import {
  LABELING_PLAZA_SINGLE_PLAYER_SAVE_SLOT_COMING_SOON,
  STYLING_PLAZA_SINGLE_PLAYER_SAVE_SLOT_LOCKED_PILL_CLASS_NAME,
  STYLING_PLAZA_SINGLE_PLAYER_SAVE_SLOT_LOCKED_ROW_CLASS_NAME,
  STYLING_PLAZA_SINGLE_PLAYER_SAVE_SLOT_LOCKED_SELECT_BUTTON_CLASS_NAME,
} from '@/components/home/domains/definingPlazaSinglePlayerSaveSlotConstants';
import {
  LABELING_PLAZA_SINGLE_PLAYER_SAVE_SLOT_DELETE_BUTTON,
  STYLING_PLAZA_SINGLE_PLAYER_SAVE_SLOT_ACTION_PILL_BASE_CLASS_NAME,
  STYLING_PLAZA_SINGLE_PLAYER_SAVE_SLOT_CONTINUE_PILL_CLASS_NAME,
  STYLING_PLAZA_SINGLE_PLAYER_SAVE_SLOT_DELETE_BUTTON_CLASS_NAME,
  STYLING_PLAZA_SINGLE_PLAYER_SAVE_SLOT_DELETE_ICON_CLASS_NAME,
  STYLING_PLAZA_SINGLE_PLAYER_SAVE_SLOT_NEW_GAME_PILL_CLASS_NAME,
  STYLING_PLAZA_SINGLE_PLAYER_SAVE_SLOT_ROW_CLASS_NAME,
  STYLING_PLAZA_SINGLE_PLAYER_SAVE_SLOT_SELECT_BUTTON_CLASS_NAME,
  STYLING_PLAZA_SINGLE_PLAYER_SAVE_SLOT_SUBTITLE_CLASS_NAME,
  STYLING_PLAZA_SINGLE_PLAYER_SAVE_SLOT_TITLE_CLASS_NAME,
} from '@/components/home/domains/definingPlazaSinglePlayerSaveSlotDeleteUiConstants';
import { notifyingPlazaHomeScreenButtonClicked } from '@/components/home/domains/notifyingPlazaHomeScreenButtonClicked';
import { formattingPlazaSinglePlayerSaveSlotLastPlayedLabel } from '@/components/home/domains/readingPlazaSinglePlayerSaveSlotSummary';
import { usingPlazaSinglePlayerSaveSlotDeleteMutation } from '@/components/home/hooks/usingPlazaSinglePlayerSaveSlotDeleteMutation';
import { usingPlazaSinglePlayerSaveSlotsQuery } from '@/components/home/hooks/usingPlazaSinglePlayerSaveSlotsQuery';
import { Icon } from '@/components/ui/icon';
import { useCallback, useState } from 'react';
import {
  checkingPlazaSaveSlotIndex,
  type PlazaSaveSlotIndex,
} from '../../../../shared/plazaGameSession';

export type RenderingPlazaSinglePlayerSaveSlotsPanelProps = {
  onBack: () => void;
  onSelectSaveSlot: (saveSlotIndex: PlazaSaveSlotIndex) => void;
};

/**
 * Save slot picker for offline single-player mode.
 */
export function RenderingPlazaSinglePlayerSaveSlotsPanel({
  onBack,
  onSelectSaveSlot,
}: RenderingPlazaSinglePlayerSaveSlotsPanelProps): React.JSX.Element {
  const { saveSlotSummaries } = usingPlazaSinglePlayerSaveSlotsQuery();
  const { deleteSaveSlotAsync, isDeletingSaveSlot } =
    usingPlazaSinglePlayerSaveSlotDeleteMutation();
  const [confirmingDeleteSaveSlotIndex, setConfirmingDeleteSaveSlotIndex] =
    useState<PlazaSaveSlotIndex | null>(null);

  const handlingRequestDeleteSaveSlot = useCallback(
    (saveSlotIndex: PlazaSaveSlotIndex): void => {
      notifyingPlazaHomeScreenButtonClicked();
      setConfirmingDeleteSaveSlotIndex(saveSlotIndex);
    },
    []
  );

  const handlingCancelDeleteSaveSlot = useCallback((): void => {
    setConfirmingDeleteSaveSlotIndex(null);
  }, []);

  const handlingConfirmDeleteSaveSlot = useCallback((): void => {
    if (confirmingDeleteSaveSlotIndex === null || isDeletingSaveSlot) {
      return;
    }

    void deleteSaveSlotAsync(confirmingDeleteSaveSlotIndex)
      .then(() => {
        setConfirmingDeleteSaveSlotIndex(null);
      })
      .catch(() => {
        // Keep the dialog open when deletion fails.
      });
  }, [confirmingDeleteSaveSlotIndex, deleteSaveSlotAsync, isDeletingSaveSlot]);

  return (
    <div className="plaza-panel plaza-pop-in flex w-full max-w-md flex-col gap-5 rounded-md p-5 font-body sm:p-6">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => {
            notifyingPlazaHomeScreenButtonClicked();
            onBack();
          }}
          aria-label="Back to mode select"
          className="plaza-btn-3d flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-md border-2 border-poster-gold/60 bg-[linear-gradient(180deg,#2c4a52_0%,#223a42_100%)] text-parchment shadow-[0_4px_0_0_#14252b] [--plaza-edge:#14252b]"
        >
          <Icon icon="mdi:arrow-left" className="size-5" aria-hidden />
        </button>
        <div className="min-w-0">
          <h2 className="font-display text-xl font-bold tracking-wide text-poster-teal-deep">
            Single Player
          </h2>
          <p className="text-sm font-medium italic text-ink-soft">
            Choose a save slot for your journey
          </p>
        </div>
      </div>

      <div
        aria-hidden
        className="h-px bg-[linear-gradient(90deg,transparent,rgba(44,74,82,0.5),transparent)]"
      />

      <ul className="flex flex-col gap-4">
        {saveSlotSummaries.map((saveSlotSummary, slotOrderIndex) => {
          const saveSlotIndex = saveSlotSummary.saveSlotIndex;

          if (!checkingPlazaSaveSlotIndex(saveSlotIndex)) {
            return null;
          }

          const isTemporarilyLocked =
            checkingPlazaSinglePlayerSaveSlotIsTemporarilyLocked(saveSlotIndex);

          return (
            <li
              key={saveSlotIndex}
              className={
                isTemporarilyLocked
                  ? STYLING_PLAZA_SINGLE_PLAYER_SAVE_SLOT_LOCKED_ROW_CLASS_NAME
                  : STYLING_PLAZA_SINGLE_PLAYER_SAVE_SLOT_ROW_CLASS_NAME
              }
              style={{ animationDelay: `${80 + slotOrderIndex * 70}ms` }}
            >
              <button
                type="button"
                disabled={isTemporarilyLocked}
                onClick={() => {
                  if (!isTemporarilyLocked) {
                    notifyingPlazaHomeScreenButtonClicked();
                    onSelectSaveSlot(saveSlotIndex);
                  }
                }}
                className={
                  isTemporarilyLocked
                    ? STYLING_PLAZA_SINGLE_PLAYER_SAVE_SLOT_LOCKED_SELECT_BUTTON_CLASS_NAME
                    : STYLING_PLAZA_SINGLE_PLAYER_SAVE_SLOT_SELECT_BUTTON_CLASS_NAME
                }
              >
                <span className="min-w-0 flex-1">
                  <span
                    className={
                      STYLING_PLAZA_SINGLE_PLAYER_SAVE_SLOT_TITLE_CLASS_NAME
                    }
                  >
                    Slot {saveSlotIndex}
                  </span>
                  <span
                    className={
                      STYLING_PLAZA_SINGLE_PLAYER_SAVE_SLOT_SUBTITLE_CLASS_NAME
                    }
                  >
                    {isTemporarilyLocked
                      ? LABELING_PLAZA_SINGLE_PLAYER_SAVE_SLOT_COMING_SOON
                      : formattingPlazaSinglePlayerSaveSlotLastPlayedLabel(
                          saveSlotSummary.lastPlayedAtMs
                        )}
                  </span>
                </span>
                {isTemporarilyLocked ? (
                  <span
                    className={
                      STYLING_PLAZA_SINGLE_PLAYER_SAVE_SLOT_LOCKED_PILL_CLASS_NAME
                    }
                  >
                    <Icon icon="mdi:lock" className="size-3.5" aria-hidden />
                    <span className="hidden sm:inline">
                      {LABELING_PLAZA_SINGLE_PLAYER_SAVE_SLOT_COMING_SOON}
                    </span>
                  </span>
                ) : (
                  <span
                    className={`${STYLING_PLAZA_SINGLE_PLAYER_SAVE_SLOT_ACTION_PILL_BASE_CLASS_NAME} ${
                      saveSlotSummary.hasSaveData
                        ? STYLING_PLAZA_SINGLE_PLAYER_SAVE_SLOT_CONTINUE_PILL_CLASS_NAME
                        : STYLING_PLAZA_SINGLE_PLAYER_SAVE_SLOT_NEW_GAME_PILL_CLASS_NAME
                    }`}
                  >
                    <Icon icon="mdi:play" className="size-3.5" aria-hidden />
                    <span className="hidden sm:inline">
                      {saveSlotSummary.hasSaveData ? 'Continue' : 'New Game'}
                    </span>
                  </span>
                )}
              </button>
              {!isTemporarilyLocked && saveSlotSummary.hasSaveData ? (
                <button
                  type="button"
                  aria-label={`${LABELING_PLAZA_SINGLE_PLAYER_SAVE_SLOT_DELETE_BUTTON} slot ${saveSlotIndex}`}
                  title={`${LABELING_PLAZA_SINGLE_PLAYER_SAVE_SLOT_DELETE_BUTTON} slot ${saveSlotIndex}`}
                  disabled={isDeletingSaveSlot}
                  onClick={() => {
                    handlingRequestDeleteSaveSlot(saveSlotIndex);
                  }}
                  className={
                    STYLING_PLAZA_SINGLE_PLAYER_SAVE_SLOT_DELETE_BUTTON_CLASS_NAME
                  }
                >
                  <Icon
                    icon="mdi:delete-outline"
                    className={
                      STYLING_PLAZA_SINGLE_PLAYER_SAVE_SLOT_DELETE_ICON_CLASS_NAME
                    }
                    aria-hidden
                  />
                </button>
              ) : null}
            </li>
          );
        })}
      </ul>

      <RenderingPlazaSinglePlayerSaveSlotDeleteConfirmDialog
        saveSlotIndex={confirmingDeleteSaveSlotIndex}
        isDeleting={isDeletingSaveSlot}
        onCancel={handlingCancelDeleteSaveSlot}
        onConfirmDelete={handlingConfirmDeleteSaveSlot}
      />
    </div>
  );
}
