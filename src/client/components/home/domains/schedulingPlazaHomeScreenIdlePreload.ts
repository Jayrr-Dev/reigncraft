/** Latest point idle preloads may start when the main thread never goes idle. */
const SCHEDULING_PLAZA_HOME_SCREEN_IDLE_PRELOAD_TIMEOUT_MS = 3000;

/**
 * Runs a preload task after first paint, once the main thread is idle.
 *
 * Keeps large audio fetches and decode work from competing with JS parse and
 * the home screen's first render on slow mobile devices.
 */
export function schedulingPlazaHomeScreenIdlePreload(task: () => void): void {
  if (typeof window === 'undefined') {
    return;
  }

  if (typeof window.requestIdleCallback === 'function') {
    window.requestIdleCallback(task, {
      timeout: SCHEDULING_PLAZA_HOME_SCREEN_IDLE_PRELOAD_TIMEOUT_MS,
    });
    return;
  }

  window.setTimeout(task, SCHEDULING_PLAZA_HOME_SCREEN_IDLE_PRELOAD_TIMEOUT_MS);
}
