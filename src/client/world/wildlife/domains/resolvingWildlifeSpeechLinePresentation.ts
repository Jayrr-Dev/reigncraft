/**
 * Merges speech context defaults with per-line overrides for rendering.
 *
 * @module components/world/wildlife/domains/resolvingWildlifeSpeechLinePresentation
 */

import type { DefiningWildlifeSpeechContextKind } from '@/components/world/wildlife/domains/definingWildlifeSpeechConstants';
import {
  DEFINING_WILDLIFE_SPEECH_CONTEXT_PRESENTATION_DEFAULTS,
  STYLING_WILDLIFE_SPEECH_BUBBLE_ANIMATION_CLASS_NAMES,
  STYLING_WILDLIFE_SPEECH_CHAR_ANIMATION_CLASS_NAME,
  STYLING_WILDLIFE_SPEECH_FONT_BODY_CLASS,
  STYLING_WILDLIFE_SPEECH_FONT_DISPLAY_CLASS,
  type DefiningWildlifeSpeechAnimatedCharKind,
  type DefiningWildlifeSpeechLine,
  type DefiningWildlifeSpeechLineStyle,
  type DefiningWildlifeSpeechPresentation,
} from '@/components/world/wildlife/domains/definingWildlifeSpeechPresentationConstants';

/**
 * Returns the spoken text from a registry line entry.
 */
export function resolvingWildlifeSpeechLineText(
  line: DefiningWildlifeSpeechLine
): string {
  return typeof line === 'string' ? line : line.text;
}

/**
 * Returns optional per-line style overrides from a registry entry.
 */
export function resolvingWildlifeSpeechLineStyleOverrides(
  line: DefiningWildlifeSpeechLine
): DefiningWildlifeSpeechLineStyle | undefined {
  return typeof line === 'string' ? undefined : line.style;
}

function resolvingWildlifeSpeechFontClassName(
  font: NonNullable<DefiningWildlifeSpeechLineStyle['font']>
): string {
  return font === 'display'
    ? STYLING_WILDLIFE_SPEECH_FONT_DISPLAY_CLASS
    : STYLING_WILDLIFE_SPEECH_FONT_BODY_CLASS;
}

function resolvingWildlifeSpeechBubbleAnimationClassName(
  bubbleAnimation: DefiningWildlifeSpeechLineStyle['bubbleAnimation']
): string | null {
  if (bubbleAnimation === undefined || bubbleAnimation === 'none') {
    return null;
  }

  return STYLING_WILDLIFE_SPEECH_BUBBLE_ANIMATION_CLASS_NAMES[bubbleAnimation];
}

function resolvingWildlifeSpeechAnimatedCharIndex(
  message: string,
  animatedChar: DefiningWildlifeSpeechAnimatedCharKind | undefined
): number | null {
  if (animatedChar === undefined) {
    return null;
  }

  if (animatedChar === 'last') {
    return message.length > 0 ? message.length - 1 : null;
  }

  for (let index = message.length - 1; index >= 0; index -= 1) {
    const character = message[index];

    if (character === '?' || character === '!') {
      return index;
    }
  }

  return null;
}

/**
 * Builds the final DOM presentation for one vocalization line.
 */
export function resolvingWildlifeSpeechLinePresentation(
  line: DefiningWildlifeSpeechLine,
  context: DefiningWildlifeSpeechContextKind
): DefiningWildlifeSpeechPresentation {
  const message = resolvingWildlifeSpeechLineText(line);
  const overrides = resolvingWildlifeSpeechLineStyleOverrides(line) ?? {};
  const defaults = DEFINING_WILDLIFE_SPEECH_CONTEXT_PRESENTATION_DEFAULTS[context];
  const font = overrides.font ?? defaults.font ?? 'body';
  const fontSizePx = overrides.fontSizePx ?? defaults.fontSizePx ?? 10;
  const textColor = defaults.textColor;
  const bubbleAnimation =
    overrides.bubbleAnimation ?? defaults.bubbleAnimation ?? 'none';
  const animatedChar = overrides.animatedChar ?? defaults.animatedChar;
  const animatedCharIndex = resolvingWildlifeSpeechAnimatedCharIndex(
    message,
    animatedChar
  );

  return {
    fontClassName: resolvingWildlifeSpeechFontClassName(font),
    fontSizePx,
    textColor,
    bubbleAnimationClassName:
      resolvingWildlifeSpeechBubbleAnimationClassName(bubbleAnimation),
    animatedCharIndex,
    animatedCharClassName:
      animatedCharIndex === null
        ? null
        : STYLING_WILDLIFE_SPEECH_CHAR_ANIMATION_CLASS_NAME,
  };
}
