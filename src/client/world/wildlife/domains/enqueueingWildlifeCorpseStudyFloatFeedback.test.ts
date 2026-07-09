import { creatingWildlifeTestInstance } from '@/components/world/wildlife/domains/creatingWildlifeTestFixtures';
import { enqueueingWildlifeCorpseStudyFloatFeedback } from '@/components/world/wildlife/domains/enqueueingWildlifeCorpseStudyFloatFeedback';
import { describe, expect, it } from 'vitest';

describe('enqueueingWildlifeCorpseStudyFloatFeedback', () => {
  it('marks the corpse studied and enqueues a +N study float', () => {
    const instance = creatingWildlifeTestInstance({
      speciesId: 'deer',
      isDead: true,
      diedAtMs: 1_000,
    });

    const nextInstance = enqueueingWildlifeCorpseStudyFloatFeedback({
      instance,
      studyPoints: 3,
      nowMs: 2_000,
    });

    expect(nextInstance.hasBeenStudied).toBe(true);
    expect(nextInstance.floatingTexts).toHaveLength(1);
    expect(nextInstance.floatingTexts[0]?.kind).toBe('study');
    expect(nextInstance.floatingTexts[0]?.amount).toBe(3);
  });
});
