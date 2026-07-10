import type { DefiningWorldPlazaCozyTuneId } from '@/components/world/domains/definingWorldPlazaBiomeMusicConstants';

/**
 * Title screen background music (Cozy Tunes).
 *
 * @module components/home/domains/definingPlazaHomeScreenMusicConstants
 */

/** Cozy Tunes track looped on the home / title screen. */
export const DEFINING_PLAZA_HOME_SCREEN_MUSIC_TUNE_ID =
  'chickens_in_the_meadow' as const satisfies DefiningWorldPlazaCozyTuneId;

/** Target loop volume once playback is unlocked. */
export const DEFINING_PLAZA_HOME_SCREEN_MUSIC_TARGET_VOLUME = 0.4;

/** Crossfade duration when title music starts (ms). Kept short for a snappy menu. */
export const DEFINING_PLAZA_HOME_SCREEN_MUSIC_CROSSFADE_MS = 200;

/** Fade-out duration when leaving the title screen (ms). */
export const DEFINING_PLAZA_HOME_SCREEN_MUSIC_FADE_OUT_MS = 900;
