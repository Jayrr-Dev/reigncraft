/**
 * Mobile debug mode detection and session state.
 *
 * @module components/world/domains/checkingWorldPlazaMobileDebug
 */

import {
  DEFINING_WORLD_PLAZA_MOBILE_DEBUG_ENV_ENABLED,
  DEFINING_WORLD_PLAZA_MOBILE_DEBUG_HUD_OPEN_STORAGE_KEY,
  DEFINING_WORLD_PLAZA_MOBILE_DEBUG_URL_QUERY_KEY,
  DEFINING_WORLD_PLAZA_MOBILE_DEBUG_URL_QUERY_VALUE,
} from '@/components/world/domains/definingWorldPlazaMobileDebugConstants';

/**
 * Returns true when the URL query enables mobile debug on first load.
 */
export function checkingWorldPlazaMobileDebugUrlQueryIsEnabled(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }

  const queryValue = new URLSearchParams(window.location.search).get(
    DEFINING_WORLD_PLAZA_MOBILE_DEBUG_URL_QUERY_KEY
  );

  return queryValue === DEFINING_WORLD_PLAZA_MOBILE_DEBUG_URL_QUERY_VALUE;
}

/**
 * Returns true when mobile debug features should be available this session.
 */
export function checkingWorldPlazaMobileDebugFeatureIsAvailable(): boolean {
  if (typeof window === 'undefined') {
    return DEFINING_WORLD_PLAZA_MOBILE_DEBUG_ENV_ENABLED;
  }

  return (
    DEFINING_WORLD_PLAZA_MOBILE_DEBUG_ENV_ENABLED ||
    checkingWorldPlazaMobileDebugUrlQueryIsEnabled()
  );
}

/**
 * Reads persisted HUD visibility. Defaults open when debug was URL-enabled.
 */
export function resolvingWorldPlazaMobileDebugHudInitiallyOpen(): boolean {
  if (typeof window === 'undefined') {
    return DEFINING_WORLD_PLAZA_MOBILE_DEBUG_ENV_ENABLED;
  }

  const storedValue = window.sessionStorage.getItem(
    DEFINING_WORLD_PLAZA_MOBILE_DEBUG_HUD_OPEN_STORAGE_KEY
  );

  if (storedValue === '0') {
    return false;
  }

  if (storedValue === '1') {
    return true;
  }

  return (
    DEFINING_WORLD_PLAZA_MOBILE_DEBUG_ENV_ENABLED ||
    checkingWorldPlazaMobileDebugUrlQueryIsEnabled()
  );
}

/**
 * Persists HUD open state for the current browser session.
 */
export function settingWorldPlazaMobileDebugHudOpen(isOpen: boolean): void {
  if (typeof window === 'undefined') {
    return;
  }

  window.sessionStorage.setItem(
    DEFINING_WORLD_PLAZA_MOBILE_DEBUG_HUD_OPEN_STORAGE_KEY,
    isOpen ? '1' : '0'
  );
}
