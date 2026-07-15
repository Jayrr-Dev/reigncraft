/**
 * True when the active skin store owner is a dedicated special load slot.
 *
 * Random Animal (slot 2) and Perma Death (slot 3) keep their form across leave
 * / remount races even when session flags have already been cleared.
 *
 * @module components/world/domains/checkingWorldPlazaSpecialLoadSlotAvatarSkinShouldPersist
 */

import { gettingWorldPlazaAvatarSkinSelectionStorageOwnerId } from '@/components/world/domains/managingWorldPlazaAvatarSkinSelectionStore';
import {
  PLAZA_SINGLE_PLAYER_PERMA_DEATH_SAVE_SLOT_INDEX,
  PLAZA_SINGLE_PLAYER_RANDOM_ANIMAL_SAVE_SLOT_INDEX,
  resolvingPlazaSinglePlayerSessionOwnerId,
} from '../../../shared/plazaGameSession';

const DEFINING_WORLD_PLAZA_SPECIAL_LOAD_SLOT_OWNER_IDS = new Set([
  resolvingPlazaSinglePlayerSessionOwnerId(
    PLAZA_SINGLE_PLAYER_RANDOM_ANIMAL_SAVE_SLOT_INDEX
  ),
  resolvingPlazaSinglePlayerSessionOwnerId(
    PLAZA_SINGLE_PLAYER_PERMA_DEATH_SAVE_SLOT_INDEX
  ),
]);

/**
 * Returns true when study-lock skin guard must leave the selected form alone.
 */
export function checkingWorldPlazaSpecialLoadSlotAvatarSkinShouldPersist(): boolean {
  const storageOwnerId = gettingWorldPlazaAvatarSkinSelectionStorageOwnerId();

  if (!storageOwnerId) {
    return false;
  }

  return DEFINING_WORLD_PLAZA_SPECIAL_LOAD_SLOT_OWNER_IDS.has(storageOwnerId);
}
