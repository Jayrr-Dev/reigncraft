/** Screen Orientation API lock value for plaza mobile play. */
const DEFINING_WORLD_PLAZA_VIEWPORT_LANDSCAPE_ORIENTATION_LOCK = "landscape" as const;

/** `ScreenOrientation` with optional lock/unlock (not in all TS DOM libs). */
interface LockableWorldPlazaScreenOrientation extends ScreenOrientation {
  lock(orientation: typeof DEFINING_WORLD_PLAZA_VIEWPORT_LANDSCAPE_ORIENTATION_LOCK): Promise<void>;
  unlock(): void;
}

/**
 * Attempts to lock the device to landscape while the plaza is fullscreen.
 *
 * Browsers may reject this outside fullscreen or on iOS Safari.
 */
export async function lockingWorldPlazaViewportLandscapeOrientation(): Promise<void> {
  const orientation = screen.orientation as LockableWorldPlazaScreenOrientation | null;

  if (!orientation || typeof orientation.lock !== "function") {
    return;
  }

  try {
    await orientation.lock(DEFINING_WORLD_PLAZA_VIEWPORT_LANDSCAPE_ORIENTATION_LOCK);
  } catch {
    // Orientation lock is optional; physical rotation still works.
  }
}

/** Releases a landscape lock requested by the plaza viewport. */
export function unlockingWorldPlazaViewportLandscapeOrientation(): void {
  const orientation = screen.orientation as LockableWorldPlazaScreenOrientation | null;

  if (!orientation || typeof orientation.unlock !== "function") {
    return;
  }

  try {
    orientation.unlock();
  } catch {
    // Ignore unlock failures on browsers that never locked orientation.
  }
}
