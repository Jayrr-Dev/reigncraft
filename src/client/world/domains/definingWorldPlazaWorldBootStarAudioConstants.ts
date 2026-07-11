/**
 * Tuning for world-boot star-audio warm-up.
 *
 * Mobile Reddit webviews have a tiny HTML5 Audio / WebMediaPlayer pool.
 * Unbounded parallel Howler loads (and duplicate loads of the same title
 * track from home + boot) can stall forever with neither `onload` nor
 * `onloaderror`, freezing the loading bar at the start of the audio step
 * (~79% after fire-sprites).
 *
 * @module components/world/domains/definingWorldPlazaWorldBootStarAudioConstants
 */

/**
 * Max time one priority manifest slice may block the loading bar.
 * Slow or hung Howler loads continue in the background; boot moves on.
 */
export const DEFINING_WORLD_PLAZA_WORLD_BOOT_STAR_AUDIO_MANIFEST_TIMEOUT_MS = 8_000;

/**
 * How many distinct star-audio keys decode at once on mobile viewports.
 * Desktop keeps a higher cap so boot stays short on fast networks.
 */
export const DEFINING_WORLD_PLAZA_STAR_AUDIO_PRELOAD_CONCURRENCY_MOBILE = 2;

/** Desktop / wide-viewport parallel key decode cap during preload. */
export const DEFINING_WORLD_PLAZA_STAR_AUDIO_PRELOAD_CONCURRENCY_DESKTOP = 8;

/**
 * How many HTTP-cache warm fetches run at once on mobile viewports.
 * Warm fetches consume no WebMediaPlayers, but unbounded parallel downloads
 * saturate the radio and thrash memory/GC on phones, which lags frames worse
 * than slow serial Howler loads.
 */
export const DEFINING_WORLD_PLAZA_STAR_AUDIO_WARM_FETCH_CONCURRENCY_MOBILE = 3;

/** Desktop / wide-viewport parallel HTTP-cache warm fetch cap. */
export const DEFINING_WORLD_PLAZA_STAR_AUDIO_WARM_FETCH_CONCURRENCY_DESKTOP = 10;
