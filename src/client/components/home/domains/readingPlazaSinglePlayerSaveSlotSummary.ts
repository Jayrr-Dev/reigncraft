import type { PlazaSaveSlotIndex } from '../../../shared/plazaGameSession';
import { resolvingPlazaSinglePlayerSessionOwnerId } from '../../../shared/plazaGameSession';
import { readingWorldPlazaLastPositionFromStorage } from '@/components/world/domains/readingWorldPlazaLastPositionFromStorage';

/** Summary shown on the home screen for one save slot. */
export type PlazaSinglePlayerSaveSlotSummary = {
  saveSlotIndex: PlazaSaveSlotIndex;
  hasSaveData: boolean;
  lastPlayedAtMs: number | null;
};

/**
 * Reads local save metadata for one single-player slot.
 *
 * @param saveSlotIndex - Save slot (1–3).
 */
export function readingPlazaSinglePlayerSaveSlotSummary(
  saveSlotIndex: PlazaSaveSlotIndex,
): PlazaSinglePlayerSaveSlotSummary {
  const lastPosition = readingWorldPlazaLastPositionFromStorage(
    resolvingPlazaSinglePlayerSessionOwnerId(saveSlotIndex),
  );

  return {
    saveSlotIndex,
    hasSaveData: lastPosition !== null,
    lastPlayedAtMs: lastPosition?.updatedAtMs ?? null,
  };
}

/**
 * Formats a save slot last-played timestamp for display.
 *
 * @param lastPlayedAtMs - Epoch ms, or null when empty.
 */
export function formattingPlazaSinglePlayerSaveSlotLastPlayedLabel(
  lastPlayedAtMs: number | null,
): string {
  if (lastPlayedAtMs === null) {
    return 'Empty slot';
  }

  return `Last played ${new Date(lastPlayedAtMs).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })}`;
}
