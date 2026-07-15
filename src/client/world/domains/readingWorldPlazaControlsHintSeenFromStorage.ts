import { DEFINING_WORLD_PLAZA_CONTROLS_HINT_SEEN_STORAGE_KEY } from '@/components/world/domains/definingWorldPlazaWorldNotificationsConstants';

/**
 * Returns true when the boot controls hint was already shown on this device.
 */
export function readingWorldPlazaControlsHintSeenFromStorage(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }

  try {
    return (
      localStorage.getItem(
        DEFINING_WORLD_PLAZA_CONTROLS_HINT_SEEN_STORAGE_KEY
      ) === 'true'
    );
  } catch {
    return false;
  }
}
