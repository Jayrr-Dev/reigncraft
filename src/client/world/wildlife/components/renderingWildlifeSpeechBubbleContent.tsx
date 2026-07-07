'use client';

import {
  STYLING_WILDLIFE_SPEECH_BUBBLE_CONTENT_CLASS_NAME,
  STYLING_WILDLIFE_SPEECH_BUBBLE_TEXT_STYLE,
} from '@/components/world/wildlife/domains/definingWildlifeSpeechConstants';
import type { DefiningWildlifeSpeechPresentation } from '@/components/world/wildlife/domains/definingWildlifeSpeechPresentationConstants';

export type RenderingWildlifeSpeechBubbleContentProps = {
  message: string;
  presentation: DefiningWildlifeSpeechPresentation;
};

/**
 * Speech bubble text with optional whole-bubble and single-character motion.
 */
export function RenderingWildlifeSpeechBubbleContent({
  message,
  presentation,
}: RenderingWildlifeSpeechBubbleContentProps): React.JSX.Element {
  const characters = [...message];

  return (
    <div
      className={[
        STYLING_WILDLIFE_SPEECH_BUBBLE_CONTENT_CLASS_NAME,
        presentation.fontClassName,
        presentation.bubbleAnimationClassName,
      ]
        .filter(Boolean)
        .join(' ')}
      style={{
        fontSize: `${presentation.fontSizePx}px`,
        color: presentation.textColor,
        ...STYLING_WILDLIFE_SPEECH_BUBBLE_TEXT_STYLE,
      }}
    >
      {characters.map((character, index) => {
        const isAnimated =
          index === presentation.animatedCharIndex &&
          presentation.animatedCharClassName !== null;

        if (!isAnimated) {
          return <span key={`${index}-${character}`}>{character}</span>;
        }

        return (
          <span
            key={`${index}-${character}`}
            className={presentation.animatedCharClassName ?? undefined}
            style={{ display: 'inline-block' }}
          >
            {character}
          </span>
        );
      })}
    </div>
  );
}
