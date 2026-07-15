import { computingPlazaCodexAggregateStudyProgress } from '@/components/home/domains/computingPlazaCodexAggregateStudyProgress';
import { describe, expect, it } from 'vitest';

describe('computingPlazaCodexAggregateStudyProgress', () => {
  it('sums current study points against mastery max per entry', () => {
    expect(
      computingPlazaCodexAggregateStudyProgress([
        { trackId: 'herbarium-flower', studyCount: 13 },
        { trackId: 'herbarium-berry', studyCount: 0 },
        { trackId: 'bestiary', studyCount: 150 },
      ])
    ).toEqual({ value: 113, max: 300 });
  });

  it('returns zeros for an empty list', () => {
    expect(computingPlazaCodexAggregateStudyProgress([])).toEqual({
      value: 0,
      max: 0,
    });
  });
});
