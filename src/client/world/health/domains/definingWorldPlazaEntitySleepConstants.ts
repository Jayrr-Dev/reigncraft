import type { DefiningWildlifeSpeechLine } from '@/components/world/wildlife/domains/definingWildlifeSpeechPresentationConstants';
import { DEFINING_WORLD_PLAZA_GIRL_SAMPLE_DEATH_MOTION_SHEET_LAYOUT } from '@/components/world/domains/definingWorldPlazaGirlSampleCombatMotionConstants';

/** Default sleep duration on the sleep-debuff registry entry (ms). */
export const DEFINING_WORLD_PLAZA_SLEEP_DEFAULT_DURATION_MS = 8_000;

/** Flat bonus damage added to the hit that wakes a sleeping player. */
export const DEFINING_WORLD_PLAZA_SLEEP_WAKE_BONUS_DAMAGE = 30;

/**
 * Playback rate for the reused death strip while falling asleep.
 * Lower than death fps (10) so the collapse reads as a slow sink to the ground.
 */
export const DEFINING_WORLD_PLAZA_SLEEP_FALL_ANIMATION_FPS = 6;

/**
 * How long the sleep fall strip takes to reach the floor pose (ms).
 * Uses GirlSample death {@link DEFINING_WORLD_PLAZA_GIRL_SAMPLE_DEATH_MOTION_SHEET_LAYOUT.frameCount}
 * at {@link DEFINING_WORLD_PLAZA_SLEEP_FALL_ANIMATION_FPS}.
 */
export const DEFINING_WORLD_PLAZA_SLEEP_FALL_DURATION_MS =
  (DEFINING_WORLD_PLAZA_GIRL_SAMPLE_DEATH_MOTION_SHEET_LAYOUT.frameCount /
    DEFINING_WORLD_PLAZA_SLEEP_FALL_ANIMATION_FPS) *
  1000;

/** How long one player sleep Zzz bubble stays visible before refresh (ms). */
export const DEFINING_WORLD_PLAZA_SLEEP_SPEECH_BUBBLE_DURATION_MS = 3200;

/** Extra lift above the avatar head for the sleep Zzz bubble (px at zoom 1). */
export const DEFINING_WORLD_PLAZA_SLEEP_SPEECH_BUBBLE_OFFSET_ABOVE_AVATAR_PX = 8;

/** Shared Zzz lines shown above a sleeping player (wildlife speech style). */
export const DEFINING_WORLD_PLAZA_SLEEP_SPEECH_LINES: readonly DefiningWildlifeSpeechLine[] =
  [
    {
      text: 'Zzz...',
      style: { bubbleAnimation: 'pulse', animatedChar: 'last' },
    },
    {
      text: 'Zzzzz',
      style: { bubbleAnimation: 'pulse', animatedChar: 'last' },
    },
    { text: 'zzZ', style: { fontSizePx: 10, bubbleAnimation: 'pulse' } },
    {
      text: 'zzzZZZ',
      style: { fontSizePx: 12, bubbleAnimation: 'pulse', animatedChar: 'last' },
    },
  ];
