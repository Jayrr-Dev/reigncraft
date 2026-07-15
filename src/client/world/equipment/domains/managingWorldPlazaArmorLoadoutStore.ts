import type { DefiningWorldPlazaArmorLoadoutState } from '@/components/world/equipment/domains/definingWorldPlazaArmorLoadoutTypes';
import type { PlazaSaveSlotIndex } from '../../../../shared/plazaGameSession';

export const DEFINING_WORLD_PLAZA_ARMOR_LOADOUT_STORAGE_KEY_ROOT =
  'world-plaza-armor-loadout' as const;

export function resolvingWorldPlazaArmorLoadoutStorageKey(
  ownerId: string,
  saveSlotIndex?: PlazaSaveSlotIndex | null
): string {
  const slotSuffix =
    saveSlotIndex === null || saveSlotIndex === undefined
      ? 'default'
      : `slot-${saveSlotIndex}`;

  return `${DEFINING_WORLD_PLAZA_ARMOR_LOADOUT_STORAGE_KEY_ROOT}:${ownerId}:${slotSuffix}`;
}

export function readingWorldPlazaArmorLoadoutFromStorage(
  storageKey: string
): DefiningWorldPlazaArmorLoadoutState | null {
  if (typeof window === 'undefined') {
    return null;
  }

  const rawJson = window.localStorage.getItem(storageKey);

  if (!rawJson) {
    return null;
  }

  try {
    const parsed: unknown = JSON.parse(rawJson);

    if (!parsed || typeof parsed !== 'object') {
      return null;
    }

    return parsed as DefiningWorldPlazaArmorLoadoutState;
  } catch {
    return null;
  }
}

export function writingWorldPlazaArmorLoadoutToStorage(
  storageKey: string,
  loadout: DefiningWorldPlazaArmorLoadoutState
): void {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(storageKey, JSON.stringify(loadout));
}
