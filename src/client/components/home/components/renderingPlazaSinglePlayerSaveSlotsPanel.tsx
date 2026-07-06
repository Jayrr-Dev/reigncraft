'use client';

import { RenderingPlazaSinglePlayerSaveSlotDeleteConfirmDialog } from '@/components/home/components/renderingPlazaSinglePlayerSaveSlotDeleteConfirmDialog';
import {
  LABELING_PLAZA_SINGLE_PLAYER_SAVE_SLOT_DELETE_BUTTON,
  STYLING_PLAZA_SINGLE_PLAYER_SAVE_SLOT_DELETE_BUTTON_CLASS_NAME,
  STYLING_PLAZA_SINGLE_PLAYER_SAVE_SLOT_DELETE_ICON_CLASS_NAME,
} from '@/components/home/domains/definingPlazaSinglePlayerSaveSlotDeleteUiConstants';
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
          onClick={onBack}
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

          return (
            <li
              key={saveSlotIndex}
              className="plaza-pop-in flex items-stretch gap-2"
              style={{ animationDelay: `${80 + slotOrderIndex * 70}ms` }}
            >
              <button
                type="button"
                onClick={() => onSelectSaveSlot(saveSlotIndex)}
                className="plaza-btn-3d flex min-w-0 flex-1 cursor-pointer items-center gap-3 rounded-md border-2 border-poster-teal/50 bg-[linear-gradient(180deg,rgba(255,250,230,0.65)_0%,rgba(227,209,168,0.65)_100%)] px-3 py-4 text-left shadow-[0_4px_0_0_rgba(44,74,82,0.7),0_8px_16px_rgba(20,28,26,0.2)] [--plaza-edge:rgba(44,74,82,0.7)] sm:gap-4 sm:px-4"
              >
                <span className="hidden size-12 shrink-0 items-center justify-center rounded-full border border-poster-orange/50 bg-poster-orange/15 text-poster-orange-deep sm:flex">
                  <Icon
                    icon="mdi:content-save"
                    className="size-6"
                    aria-hidden
                  />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-display text-base font-bold tracking-wide text-ink">
                    Slot {saveSlotIndex}
                  </span>
                  <span className="block truncate text-sm font-medium italic text-ink-soft">
                    {formattingPlazaSinglePlayerSaveSlotLastPlayedLabel(
                      saveSlotSummary.lastPlayedAtMs
                    )}
                  </span>
                </span>
                <span
                  className={`inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1.5 text-xs font-extrabold uppercase tracking-wider text-parchment sm:px-3.5 ${
                    saveSlotSummary.hasSaveData
                      ? 'bg-[linear-gradient(180deg,#c1592f_0%,#a2481f_100%)] shadow-[0_2px_0_0_#6d2c12]'
                      : 'bg-[linear-gradient(180deg,#7a8c5c_0%,#5f7046_100%)] shadow-[0_2px_0_0_#3d4a2c]'
                  }`}
                >
                  <Icon icon="mdi:play" className="size-3.5" aria-hidden />
                  <span className="hidden sm:inline">
                    {saveSlotSummary.hasSaveData ? 'Continue' : 'New Game'}
                  </span>
                </span>
              </button>
              {saveSlotSummary.hasSaveData ? (
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
