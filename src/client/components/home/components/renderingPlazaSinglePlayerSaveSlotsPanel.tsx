'use client';

import { formattingPlazaSinglePlayerSaveSlotLastPlayedLabel } from '@/components/home/domains/readingPlazaSinglePlayerSaveSlotSummary';
import { usingPlazaSinglePlayerSaveSlotsQuery } from '@/components/home/hooks/usingPlazaSinglePlayerSaveSlotsQuery';
import { Icon } from '@/components/ui/icon';
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
            <li key={saveSlotIndex}>
              <button
                type="button"
                onClick={() => onSelectSaveSlot(saveSlotIndex)}
                className="plaza-btn-3d plaza-pop-in flex w-full cursor-pointer items-center gap-4 rounded-md border-2 border-poster-teal/50 bg-[linear-gradient(180deg,rgba(255,250,230,0.65)_0%,rgba(227,209,168,0.65)_100%)] px-4 py-4 text-left shadow-[0_4px_0_0_rgba(44,74,82,0.7),0_8px_16px_rgba(20,28,26,0.2)] [--plaza-edge:rgba(44,74,82,0.7)]"
                style={{ animationDelay: `${80 + slotOrderIndex * 70}ms` }}
              >
                <span className="flex size-12 shrink-0 items-center justify-center rounded-full border border-poster-orange/50 bg-poster-orange/15 text-poster-orange-deep">
                  <Icon
                    icon="mdi:content-save"
                    className="size-6"
                    aria-hidden
                  />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-display text-base font-bold tracking-wide text-ink">
                    Slot {saveSlotIndex}
                  </span>
                  <span className="block text-sm font-medium italic text-ink-soft">
                    {formattingPlazaSinglePlayerSaveSlotLastPlayedLabel(
                      saveSlotSummary.lastPlayedAtMs
                    )}
                  </span>
                </span>
                <span
                  className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-extrabold uppercase tracking-wider text-parchment ${
                    saveSlotSummary.hasSaveData
                      ? 'bg-[linear-gradient(180deg,#c1592f_0%,#a2481f_100%)] shadow-[0_2px_0_0_#6d2c12]'
                      : 'bg-[linear-gradient(180deg,#7a8c5c_0%,#5f7046_100%)] shadow-[0_2px_0_0_#3d4a2c]'
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
