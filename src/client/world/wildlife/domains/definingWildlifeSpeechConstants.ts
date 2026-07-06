/**
 * Wildlife speech bubble timing, trigger chances, and visual classes.
 *
 * @module components/world/wildlife/domains/definingWildlifeSpeechConstants
 */

/** Speech context keyed to behavior intent groups. */
export type DefiningWildlifeSpeechContextKind = 'passive' | 'flee' | 'aggro';

/** How long a speech bubble stays visible (ms). */
export const DEFINING_WILDLIFE_SPEECH_BUBBLE_DURATION_MS = 2500;

/** Minimum gap between vocalizations on one instance (ms). */
export const DEFINING_WILDLIFE_SPEECH_COOLDOWN_MS = 6000;

/** Chance to speak when entering a passive context (idle/wander/graze). */
export const DEFINING_WILDLIFE_SPEECH_PASSIVE_ENTER_CHANCE = 0.2;

/** Chance to speak when entering flee context. */
export const DEFINING_WILDLIFE_SPEECH_FLEE_ENTER_CHANCE = 0.55;

/** Chance to speak when entering aggro context. */
export const DEFINING_WILDLIFE_SPEECH_AGGRO_ENTER_CHANCE = 0.5;

/** Time bucket for sustained passive ambient rolls (ms). */
export const DEFINING_WILDLIFE_SPEECH_PASSIVE_SUSTAINED_BUCKET_MS = 8000;

/** Chance per passive bucket while staying in passive context. */
export const DEFINING_WILDLIFE_SPEECH_PASSIVE_SUSTAINED_CHANCE = 0.04;

/** Time bucket for sustained flee mid-run rolls (ms). */
export const DEFINING_WILDLIFE_SPEECH_FLEE_SUSTAINED_BUCKET_MS = 4000;

/** Chance per flee bucket while still fleeing. */
export const DEFINING_WILDLIFE_SPEECH_FLEE_SUSTAINED_CHANCE = 0.12;

/** Salt for seeding speech trigger rolls. */
export const DEFINING_WILDLIFE_SPEECH_ROLL_SALT = 4427;

/** Salt for seeding which line index to pick. */
export const DEFINING_WILDLIFE_SPEECH_LINE_PICK_SALT = 5513;

/** Tailwind classes for wildlife speech bubble content. */
export const STYLING_WILDLIFE_SPEECH_BUBBLE_CONTENT_CLASS_NAME =
  'origin-bottom animate-in fade-in duration-150 whitespace-nowrap text-center text-[10px] leading-tight text-white' as const;

/** Black outline on white wildlife speech text (no background pill). */
export const STYLING_WILDLIFE_SPEECH_BUBBLE_TEXT_STYLE = {
  WebkitTextStroke: '0.75px rgba(0, 0, 0, 0.9)',
  paintOrder: 'stroke fill',
  textShadow:
    '0 1px 0 rgba(0,0,0,0.95), 1px 0 0 rgba(0,0,0,0.7), -1px 0 0 rgba(0,0,0,0.7), 0 -1px 0 rgba(0,0,0,0.7)',
} as const;
