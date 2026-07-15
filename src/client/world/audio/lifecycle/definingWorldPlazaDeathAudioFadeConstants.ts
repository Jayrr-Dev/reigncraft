/**
 * Timing for global Howler volume fade when the player dies or respawns.
 *
 * @module components/world/audio/lifecycle/definingWorldPlazaDeathAudioFadeConstants
 */

/**
 * Fade all plaza audio to silence when death begins (ms).
 * Matches the death-screen blackout so music and SFX die with the picture.
 */
export const DEFINING_WORLD_PLAZA_DEATH_AUDIO_FADE_OUT_MS = 2800 as const;

/**
 * Restore global Howler volume after Remake / Origin (ms).
 * Slightly shorter than the wake blackout so sound returns before vision clears.
 */
export const DEFINING_WORLD_PLAZA_DEATH_AUDIO_FADE_IN_MS = 2400 as const;

/** Interval between Howler.volume steps during a death fade (ms). */
export const DEFINING_WORLD_PLAZA_DEATH_AUDIO_FADE_TICK_MS = 50 as const;

/** Restored Howler global volume after death fades (user music slider is separate). */
export const DEFINING_WORLD_PLAZA_DEATH_AUDIO_FULL_VOLUME = 1 as const;
