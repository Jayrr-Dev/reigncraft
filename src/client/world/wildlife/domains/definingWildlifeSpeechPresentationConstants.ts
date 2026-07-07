/**
 * Wildlife speech bubble typography, color, and animation config.
 *
 * @module components/world/wildlife/domains/definingWildlifeSpeechPresentationConstants
 */

import {
  DEFINING_WILDLIFE_SPEECH_TONE_TEXT_COLORS,
  type DefiningWildlifeSpeechContextKind,
} from '@/components/world/wildlife/domains/definingWildlifeSpeechConstants';
import { STYLING_WORLD_PLAZA_HUD_LABEL_CLASS } from '@/components/world/domains/definingWorldPlazaHudThemeConstants';

/** Whole-bubble motion applied to the text wrapper. */
export type DefiningWildlifeSpeechBubbleAnimationKind =
  | 'none'
  | 'shake'
  | 'bounce'
  | 'pulse';

/** Which character gets a secondary motion pass. */
export type DefiningWildlifeSpeechAnimatedCharKind = 'last' | 'lastPunctuation';

/** Per-line style overrides merged on top of context defaults (not text color). */
export type DefiningWildlifeSpeechLineStyle = {
  font?: 'body' | 'display';
  fontSizePx?: number;
  bubbleAnimation?: DefiningWildlifeSpeechBubbleAnimationKind;
  animatedChar?: DefiningWildlifeSpeechAnimatedCharKind;
};

/** Registry entry: plain text or text plus optional overrides. */
export type DefiningWildlifeSpeechLine =
  | string
  | {
      text: string;
      style?: DefiningWildlifeSpeechLineStyle;
    };

/** Resolved presentation ready for DOM rendering. */
export type DefiningWildlifeSpeechPresentation = {
  fontClassName: string;
  fontSizePx: number;
  textColor: string;
  bubbleAnimationClassName: string | null;
  animatedCharIndex: number | null;
  animatedCharClassName: string | null;
};

/** Tailwind font treatment for speech lines. */
export const STYLING_WILDLIFE_SPEECH_FONT_BODY_CLASS = 'font-body' as const;

/** Display font for loud or aggressive vocalizations. */
export const STYLING_WILDLIFE_SPEECH_FONT_DISPLAY_CLASS =
  STYLING_WORLD_PLAZA_HUD_LABEL_CLASS;

/** CSS classes for whole-bubble motion (authored in index.css). */
export const STYLING_WILDLIFE_SPEECH_BUBBLE_ANIMATION_CLASS_NAMES: Record<
  Exclude<DefiningWildlifeSpeechBubbleAnimationKind, 'none'>,
  string
> = {
  shake: 'wildlife-speech-bubble--shake',
  bounce: 'wildlife-speech-bubble--bounce',
  pulse: 'wildlife-speech-bubble--pulse',
};

/** CSS classes for single-character motion (authored in index.css). */
export const STYLING_WILDLIFE_SPEECH_CHAR_ANIMATION_CLASS_NAME =
  'wildlife-speech-char--bounce' as const;

/** Default line styling per speech context before per-line overrides. */
export const DEFINING_WILDLIFE_SPEECH_CONTEXT_PRESENTATION_DEFAULTS: Record<
  DefiningWildlifeSpeechContextKind,
  DefiningWildlifeSpeechLineStyle & { textColor: string }
> = {
  neutral: {
    font: 'body',
    fontSizePx: 10,
    textColor: DEFINING_WILDLIFE_SPEECH_TONE_TEXT_COLORS.neutral,
    bubbleAnimation: 'none',
  },
  friendly: {
    font: 'body',
    fontSizePx: 10,
    textColor: DEFINING_WILDLIFE_SPEECH_TONE_TEXT_COLORS.friendly,
    bubbleAnimation: 'none',
  },
  eating: {
    font: 'body',
    fontSizePx: 10,
    textColor: DEFINING_WILDLIFE_SPEECH_TONE_TEXT_COLORS.eating,
    bubbleAnimation: 'pulse',
    animatedChar: 'lastPunctuation',
  },
  flee: {
    font: 'display',
    fontSizePx: 11,
    textColor: DEFINING_WILDLIFE_SPEECH_TONE_TEXT_COLORS.flee,
    bubbleAnimation: 'shake',
    animatedChar: 'lastPunctuation',
  },
  chase: {
    font: 'display',
    fontSizePx: 12,
    textColor: DEFINING_WILDLIFE_SPEECH_TONE_TEXT_COLORS.chase,
    bubbleAnimation: 'shake',
    animatedChar: 'lastPunctuation',
  },
  attack: {
    font: 'display',
    fontSizePx: 12,
    textColor: DEFINING_WILDLIFE_SPEECH_TONE_TEXT_COLORS.attack,
    bubbleAnimation: 'shake',
    animatedChar: 'lastPunctuation',
  },
  warn: {
    font: 'display',
    fontSizePx: 11,
    textColor: DEFINING_WILDLIFE_SPEECH_TONE_TEXT_COLORS.warn,
    bubbleAnimation: 'shake',
    animatedChar: 'lastPunctuation',
  },
  eatingAggressive: {
    font: 'display',
    fontSizePx: 11,
    textColor: DEFINING_WILDLIFE_SPEECH_TONE_TEXT_COLORS.eatingAggressive,
    bubbleAnimation: 'shake',
    animatedChar: 'lastPunctuation',
  },
  sleep: {
    font: 'body',
    fontSizePx: 11,
    textColor: DEFINING_WILDLIFE_SPEECH_TONE_TEXT_COLORS.sleep,
    bubbleAnimation: 'pulse',
    animatedChar: 'last',
  },
};
