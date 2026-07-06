import { clearingPlazaSinglePlayerSaveSlotLocalStorage } from '@/components/home/domains/clearingPlazaSinglePlayerSaveSlotLocalStorage';
import { deletingPlazaSinglePlayerSaveSlotData } from '@/components/home/repositories/callingPlazaSinglePlayerSavesDevvitApi';
import {
  resolvingPlazaSinglePlayerSessionOwnerId,
  type PlazaSaveSlotIndex,
} from '../../../../shared/plazaGameSession';

/**
 * Deletes one single-player save slot from local storage and Devvit Redis.
 *
 * @param saveSlotIndex - Save slot (1–3).
 * @param shouldDeleteRemote - When true, also clears the signed-in Reddit save.
 */
export async function deletingPlazaSinglePlayerSaveSlot(
  saveSlotIndex: PlazaSaveSlotIndex,
  shouldDeleteRemote: boolean
): Promise<void> {
  clearingPlazaSinglePlayerSaveSlotLocalStorage(
    resolvingPlazaSinglePlayerSessionOwnerId(saveSlotIndex)
  );

  if (shouldDeleteRemote) {
    await deletingPlazaSinglePlayerSaveSlotData(saveSlotIndex);
  }
}
