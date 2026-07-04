'use client';

import {
  formattingPlazaSinglePlayerSaveSlotLastPlayedLabel,
  readingPlazaSinglePlayerSaveSlotSummary,
} from '@/components/home/domains/readingPlazaSinglePlayerSaveSlotSummary';
import { Icon } from '@/components/ui/icon';
import { useMemo } from 'react';
import {
  checkingPlazaSaveSlotIndex,
  PLAZA_SINGLE_PLAYER_SAVE_SLOT_COUNT,
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
  const saveSlotSummaries = useMemo(
    () =>
      Array.from({ length: PLAZA_SINGLE_PLAYER_SAVE_SLOT_COUNT }, (_, index) =>
        readingPlazaSinglePlayerSaveSlotSummary(
          (index + 1) as PlazaSaveSlotIndex
        )
      ),
    []
  );

  return (
    <div className="plaza-panel plaza-pop-in flex w-full max-w-md flex-col gap-5 rounded-3xl p-5 sm:p-6">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onBack}
          aria-label="Back to mode select"
          className="plaza-btn-3d flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-xl border-2 border-sky-300/40 bg-gradient-to-b from-sky-500 to-sky-700 text-white shadow-[0_4px_0_0_#0c4a6e] [--plaza-edge:#0c4a6e]"
        >
          <Icon icon="mdi:arrow-left" className="size-5" aria-hidden />
        </button>
        <div className="min-w-0">
          <h2 className="font-display text-2xl text-white [text-shadow:0_2px_0_rgba(12,74,110,0.9)]">
            Single Player
          </h2>
          <p className="text-sm font-semibold text-sky-100/85">
            Pick a save slot to start
          </p>
        </div>
      </div>

      <ul className="flex flex-col gap-4">
        {saveSlotSummaries.map((saveSlotSummary, slotOrderIndex) => {
          const saveSlotIndex = saveSlotSummary.saveSlotIndex;

          if (!checkingPlazaSaveSlotIndex(saveSlotIndex)) {
            return null;
          }

          return (
            <li key={saveSlotIndex}>
              <button
                type="button"
                onClick={() => onSelectSaveSlot(saveSlotIndex)}
                className="plaza-btn-3d plaza-pop-in flex w-full cursor-pointer items-center gap-4 rounded-2xl border-2 border-sky-300/30 bg-gradient-to-b from-sky-700/90 to-sky-900/90 px-4 py-4 text-left shadow-[0_4px_0_0_#082f49,0_8px_16px_rgba(0,0,0,0.3)] [--plaza-edge:#082f49]"
                style={{ animationDelay: `${80 + slotOrderIndex * 70}ms` }}
              >
                <span className="flex size-12 shrink-0 items-center justify-center rounded-xl border border-orange-300/30 bg-gradient-to-b from-orange-400/30 to-orange-600/30 text-orange-300">
                  <Icon
                    icon="mdi:content-save"
                    className="size-6"
                    aria-hidden
                  />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-display text-lg text-white [text-shadow:0_1px_0_rgba(0,0,0,0.4)]">
                    Slot {saveSlotIndex}
                  </span>
                  <span className="block text-sm font-semibold text-sky-100/75">
                    {formattingPlazaSinglePlayerSaveSlotLastPlayedLabel(
                      saveSlotSummary.lastPlayedAtMs
                    )}
                  </span>
                </span>
                <span
                  className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-extrabold uppercase tracking-wide text-white ${
                    saveSlotSummary.hasSaveData
                      ? 'bg-gradient-to-b from-orange-400 to-orange-600 shadow-[0_2px_0_0_#9a3412]'
                      : 'bg-gradient-to-b from-emerald-400 to-emerald-600 shadow-[0_2px_0_0_#065f46]'
                  }`}
                >
                  <Icon icon="mdi:play" className="size-3.5" aria-hidden />
                  {saveSlotSummary.hasSaveData ? 'Continue' : 'New Game'}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
