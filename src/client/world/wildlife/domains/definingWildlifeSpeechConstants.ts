/**
 * Wildlife speech bubble timing, trigger chances, and visual classes.
 *
 * @module components/world/wildlife/domains/definingWildlifeSpeechConstants
 */

/** Speech context keyed to behavior intent and tone. */
export type DefiningWildlifeSpeechContextKind =
  | 'neutral'
  | 'friendly'
  | 'eating'
  | 'flee'
  | 'chase'
  | 'attack'
  | 'warn'
  | 'eatingAggressive'
  | 'sleep';

/** Strict text colors per vocal tone (line overrides cannot change these). */
export const DEFINING_WILDLIFE_SPEECH_TONE_TEXT_COLORS = {
  neutral: '#ffffff',
  friendly: '#93c5fd',
  eating: '#93c5fd',
  flee: '#ffffff',
  chase: '#ef4444',
  attack: '#ef4444',
  warn: '#ef4444',
  eatingAggressive: '#ef4444',
  sleep: '#c4b5fd',
} as const;

/** How long a speech bubble stays visible (ms). */
export const DEFINING_WILDLIFE_SPEECH_BUBBLE_DURATION_MS = 2500;

/** Minimum gap between vocalizations on one instance (ms). */
export const DEFINING_WILDLIFE_SPEECH_COOLDOWN_MS = 6000;

/** Chance to speak when entering neutral or friendly context. */
export const DEFINING_WILDLIFE_SPEECH_NEUTRAL_ENTER_CHANCE = 0.18;

/** Chance to speak when entering eating context. */
export const DEFINING_WILDLIFE_SPEECH_EATING_ENTER_CHANCE = 0.35;

/** Chance to speak when entering flee context. */
export const DEFINING_WILDLIFE_SPEECH_FLEE_ENTER_CHANCE = 0.55;

/** Chance to speak when entering chase context. */
export const DEFINING_WILDLIFE_SPEECH_CHASE_ENTER_CHANCE = 0.5;

/** Chance to speak when entering attack context. */
export const DEFINING_WILDLIFE_SPEECH_ATTACK_ENTER_CHANCE = 0.72;

/** Chance to speak when entering territory warn context. */
export const DEFINING_WILDLIFE_SPEECH_WARN_ENTER_CHANCE = 0.62;

/** Chance to speak when entering aggressive eating context. */
export const DEFINING_WILDLIFE_SPEECH_EATING_AGGRESSIVE_ENTER_CHANCE = 0.58;

/** Time bucket for sustained neutral ambient rolls (ms). */
export const DEFINING_WILDLIFE_SPEECH_NEUTRAL_SUSTAINED_BUCKET_MS = 8000;

/** Chance per neutral bucket while staying calm. */
export const DEFINING_WILDLIFE_SPEECH_NEUTRAL_SUSTAINED_CHANCE = 0.04;

/** Time bucket for sustained eating rolls (ms). */
export const DEFINING_WILDLIFE_SPEECH_EATING_SUSTAINED_BUCKET_MS = 3500;

/** Chance per eating bucket while chewing. */
export const DEFINING_WILDLIFE_SPEECH_EATING_SUSTAINED_CHANCE = 0.22;

/** Time bucket for sustained flee mid-run rolls (ms). */
export const DEFINING_WILDLIFE_SPEECH_FLEE_SUSTAINED_BUCKET_MS = 4000;

/** Chance per flee bucket while still fleeing. */
export const DEFINING_WILDLIFE_SPEECH_FLEE_SUSTAINED_CHANCE = 0.12;

/** Time bucket for sustained attack biting rolls (ms). */
export const DEFINING_WILDLIFE_SPEECH_ATTACK_SUSTAINED_BUCKET_MS = 1800;

/** Chance per attack bucket while still biting. */
export const DEFINING_WILDLIFE_SPEECH_ATTACK_SUSTAINED_CHANCE = 0.28;

/** Time bucket for sustained aggressive eating rolls (ms). */
export const DEFINING_WILDLIFE_SPEECH_EATING_AGGRESSIVE_SUSTAINED_BUCKET_MS =
  3000;

/** Chance per aggressive eating bucket. */
export const DEFINING_WILDLIFE_SPEECH_EATING_AGGRESSIVE_SUSTAINED_CHANCE = 0.2;

/** Salt for seeding speech trigger rolls. */
export const DEFINING_WILDLIFE_SPEECH_ROLL_SALT = 4427;

/** Salt for seeding which line index to pick. */
export const DEFINING_WILDLIFE_SPEECH_LINE_PICK_SALT = 5513;

/** Tailwind classes for wildlife speech bubble content. */
export const STYLING_WILDLIFE_SPEECH_BUBBLE_CONTENT_CLASS_NAME =
  'origin-bottom animate-in fade-in duration-150 whitespace-nowrap text-center leading-tight' as const;

/** Black outline on wildlife speech text (no background pill). */
export const STYLING_WILDLIFE_SPEECH_BUBBLE_TEXT_STYLE = {
  WebkitTextStroke: '0.75px rgba(0, 0, 0, 0.9)',
  paintOrder: 'stroke fill',
  textShadow:
    '0 1px 0 rgba(0,0,0,0.95), 1px 0 0 rgba(0,0,0,0.7), -1px 0 0 rgba(0,0,0,0.7), 0 -1px 0 rgba(0,0,0,0.7)',
} as const;
