/**
 * Resolves whether eager star-audio preload should be skipped (debug only).
 *
 * @module components/world/domains/checkingWorldPlazaStarAudioPreloadIsDisabled
 */

import {
  DEFINING_WORLD_PLAZA_STAR_AUDIO_PRELOAD_DEBUG_ENV_SKIP,
  DEFINING_WORLD_PLAZA_STAR_AUDIO_PRELOAD_DEBUG_STORAGE_KEY,
  DEFINING_WORLD_PLAZA_STAR_AUDIO_PRELOAD_DEBUG_URL_QUERY_KEY,
  DEFINING_WORLD_PLAZA_STAR_AUDIO_PRELOAD_DEBUG_URL_QUERY_VALUE,
} from '@/components/world/domains/definingWorldPlazaStarAudioPreloadDebugConstants';

/**
 * Returns true when the URL query requests skip-audio-preload this load.
 */
export function checkingWorldPlazaStarAudioPreloadUrlQueryIsEnabled(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }

  const queryValue = new URLSearchParams(window.location.search).get(
    DEFINING_WORLD_PLAZA_STAR_AUDIO_PRELOAD_DEBUG_URL_QUERY_KEY
  );

  return (
    queryValue === DEFINING_WORLD_PLAZA_STAR_AUDIO_PRELOAD_DEBUG_URL_QUERY_VALUE
  );
}

/**
 * Returns true when sessionStorage has the skip flag set by console API.
 */
export function checkingWorldPlazaStarAudioPreloadSessionSkipIsEnabled(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }

  return (
    window.sessionStorage.getItem(
      DEFINING_WORLD_PLAZA_STAR_AUDIO_PRELOAD_DEBUG_STORAGE_KEY
    ) === '1'
  );
}

/**
 * Returns true when boot and runtime should skip eager star-audio preload.
 *
 * Checked live on each preload call so a mid-session console toggle stops
 * further warm fetches and Howler loads immediately.
 */
export function checkingWorldPlazaStarAudioPreloadIsDisabled(): boolean {
  if (DEFINING_WORLD_PLAZA_STAR_AUDIO_PRELOAD_DEBUG_ENV_SKIP) {
    return true;
  }

  if (typeof window === 'undefined') {
    return false;
  }

  return (
    checkingWorldPlazaStarAudioPreloadUrlQueryIsEnabled() ||
    checkingWorldPlazaStarAudioPreloadSessionSkipIsEnabled()
  );
}

/**
 * Persists the console skip toggle for the current browser tab session.
 *
 * Does not unload already-decoded Howls. Call before reload to skip boot.
 */
export function settingWorldPlazaStarAudioPreloadDisabled(
  isDisabled: boolean
): void {
  if (typeof window === 'undefined') {
    return;
  }

  if (isDisabled) {
    window.sessionStorage.setItem(
      DEFINING_WORLD_PLAZA_STAR_AUDIO_PRELOAD_DEBUG_STORAGE_KEY,
      '1'
    );
    return;
  }

  window.sessionStorage.removeItem(
    DEFINING_WORLD_PLAZA_STAR_AUDIO_PRELOAD_DEBUG_STORAGE_KEY
  );
}
