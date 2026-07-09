import { creatingWildlifeTestInstance } from '@/components/world/wildlife/domains/creatingWildlifeTestFixtures';
import { emittingWildlifeForcedSpeech } from '@/components/world/wildlife/domains/emittingWildlifeForcedSpeech';
import { describe, expect, it } from 'vitest';

describe('emittingWildlifeForcedSpeech', () => {
  it('shows a friendly bark bubble for shepherd dogs', () => {
    const instance = creatingWildlifeTestInstance({
      speciesId: 'shepherd-dog',
      position: { x: 2.2, y: 3.4, layer: 1 },
    });

    const speechState = emittingWildlifeForcedSpeech({
      instance,
      nowMs: 5_000,
      context: 'friendly',
    });

    expect(speechState.activeBubble).not.toBeNull();
    expect(speechState.lastContextKey).toBe('friendly');
    expect(speechState.activeBubble?.message.toLowerCase()).toMatch(
      /bark|woof|arf|ruff/
    );
  });

  it('shows a friendly meow bubble for cats', () => {
    const instance = creatingWildlifeTestInstance({
      speciesId: 'cat-black',
      position: { x: 2.2, y: 3.4, layer: 1 },
    });

    const speechState = emittingWildlifeForcedSpeech({
      instance,
      nowMs: 5_000,
      context: 'friendly',
    });

    expect(speechState.activeBubble).not.toBeNull();
    expect(speechState.lastContextKey).toBe('friendly');
    expect(speechState.activeBubble?.message.toLowerCase()).toMatch(
      /meow|mrr|purr|mew/
    );
  });
});
