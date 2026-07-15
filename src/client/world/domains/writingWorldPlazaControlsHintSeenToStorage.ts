import { DEFINING_WORLD_PLAZA_CONTROLS_HINT_SEEN_STORAGE_KEY } from '@/components/world/domains/definingWorldPlazaWorldNotificationsConstants';

/**
 * Marks the boot controls hint as shown so it does not replay on refresh.
 */
export function writingWorldPlazaControlsHintSeenToStorage(): void {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    localStorage.setItem(
      DEFINING_WORLD_PLAZA_CONTROLS_HINT_SEEN_STORAGE_KEY,
      'true'
    );
  } catch {
    // Private mode / quota: skip; hint may show again next boot.
  }
}
