import { DEFINING_WILDLIFE_SPEECH_TONE_TEXT_COLORS } from '@/components/world/wildlife/domains/definingWildlifeSpeechConstants';
import { resolvingWildlifeSpeechLinePresentation } from '@/components/world/wildlife/domains/resolvingWildlifeSpeechLinePresentation';
import { describe, expect, it } from 'vitest';

describe('resolvingWildlifeSpeechLinePresentation', () => {
  it('uses red for attack lines regardless of line overrides', () => {
    const presentation = resolvingWildlifeSpeechLinePresentation(
      {
        text: 'CHOMP!',
        style: {
          fontSizePx: 13,
          bubbleAnimation: 'shake',
        },
      },
      'attack'
    );

    expect(presentation.fontSizePx).toBe(13);
    expect(presentation.textColor).toBe(
      DEFINING_WILDLIFE_SPEECH_TONE_TEXT_COLORS.attack
    );
    expect(presentation.bubbleAnimationClassName).toBe(
      'wildlife-speech-bubble--shake'
    );
    expect(presentation.animatedCharIndex).toBe(5);
  });

  it('uses light blue for friendly eating lines', () => {
    const presentation = resolvingWildlifeSpeechLinePresentation(
      'mmmMMMmm',
      'eating'
    );

    expect(presentation.textColor).toBe(
      DEFINING_WILDLIFE_SPEECH_TONE_TEXT_COLORS.eating
    );
    expect(presentation.bubbleAnimationClassName).toBe(
      'wildlife-speech-bubble--pulse'
    );
  });

  it('uses white for neutral calm lines', () => {
    const presentation = resolvingWildlifeSpeechLinePresentation('Moo', 'neutral');

    expect(presentation.textColor).toBe(
      DEFINING_WILDLIFE_SPEECH_TONE_TEXT_COLORS.neutral
    );
    expect(presentation.bubbleAnimationClassName).toBeNull();
  });
});
