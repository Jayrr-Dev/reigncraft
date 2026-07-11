import { DEFINING_PLAZA_SINGLE_PLAYER_SAVE_SLOT_TEMPORARILY_LOCKED_SLOT_INDICES } from '@/components/home/domains/definingPlazaSinglePlayerSaveSlotConstants';
import type { PlazaSaveSlotIndex } from '../../../../shared/plazaGameSession';

/**
 * Returns true when a save slot is shown but not yet playable.
 */
export function checkingPlazaSinglePlayerSaveSlotIsTemporarilyLocked(
  saveSlotIndex: PlazaSaveSlotIndex
): boolean {
  return (
    DEFINING_PLAZA_SINGLE_PLAYER_SAVE_SLOT_TEMPORARILY_LOCKED_SLOT_INDICES as readonly PlazaSaveSlotIndex[]
  ).includes(saveSlotIndex);
}
