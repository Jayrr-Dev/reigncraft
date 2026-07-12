/**
 * Debug knobs for skipping *boot* star-audio preload.
 *
 * Use when isolating frame drops from audio decode / HTTP cache warming:
 * - URL: `?skipAudioPreload=1`
 * - Env: `NEXT_PUBLIC_WORLD_PLAZA_SKIP_AUDIO_PRELOAD=true` in `.env.local`
 * - Console: `window.__WORLD_PLAZA_PERF__.skipAudioPreload(true)`
 *
 * Boot warm only. Runtime plaza hooks still preload; play refuses cold keys.
 *
 * @module components/world/domains/definingWorldPlazaStarAudioPreloadDebugConstants
 */

/** Starts with boot audio preload skipped when set in `.env.local`. */
export const DEFINING_WORLD_PLAZA_STAR_AUDIO_PRELOAD_DEBUG_ENV_SKIP =
  import.meta.env.NEXT_PUBLIC_WORLD_PLAZA_SKIP_AUDIO_PRELOAD === 'true';

/** URL query flag that skips eager star-audio preload on load. */
export const DEFINING_WORLD_PLAZA_STAR_AUDIO_PRELOAD_DEBUG_URL_QUERY_KEY =
  'skipAudioPreload' as const;

/** URL query value that enables the skip. */
export const DEFINING_WORLD_PLAZA_STAR_AUDIO_PRELOAD_DEBUG_URL_QUERY_VALUE =
  '1' as const;

/**
 * sessionStorage key for console / mid-session toggle. Survives remounts in
 * the same tab so a reload after `skipAudioPreload(true)` still skips boot.
 */
export const DEFINING_WORLD_PLAZA_STAR_AUDIO_PRELOAD_DEBUG_STORAGE_KEY =
  'world-plaza-skip-audio-preload' as const;
