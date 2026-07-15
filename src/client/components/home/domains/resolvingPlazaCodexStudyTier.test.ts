import {
  DEFINING_PLAZA_CODEX_STUDY_TRACK_REGISTRY,
  type PlazaCodexStudyTrackId,
} from '@/components/home/domains/definingPlazaCodexStudyTrackRegistry';
import {
  resolvingPlazaCodexStudyFullCount,
  resolvingPlazaCodexStudyTierId,
} from '@/components/home/domains/resolvingPlazaCodexStudyTier';
import { describe, expect, it } from 'vitest';

const ALL_TRACK_IDS: readonly PlazaCodexStudyTrackId[] = [
  'herbarium-flower',
  'herbarium-tree',
  'herbarium-clover',
  'herbarium-berry',
  'bestiary',
  'lapidary',
  'pathology',
];

describe('resolvingPlazaCodexStudyTier', () => {
  it('maps 1x study counts onto the unified ladder', () => {
    expect(resolvingPlazaCodexStudyTierId('herbarium-flower', 0)).toBe(
      'awareness'
    );
    expect(resolvingPlazaCodexStudyTierId('herbarium-flower', 1)).toBe(
      'familiarity'
    );
    expect(resolvingPlazaCodexStudyTierId('herbarium-flower', 5)).toBe(
      'understanding'
    );
    expect(resolvingPlazaCodexStudyTierId('herbarium-flower', 20)).toBe(
      'application'
    );
    expect(resolvingPlazaCodexStudyTierId('herbarium-flower', 50)).toBe(
      'proficiency'
    );
    expect(resolvingPlazaCodexStudyTierId('herbarium-flower', 75)).toBe(
      'expertise'
    );
    expect(resolvingPlazaCodexStudyTierId('herbarium-flower', 100)).toBe(
      'mastery'
    );
  });

  it('scales mastery to 200 when entryScaleMultiplier is 2', () => {
    expect(resolvingPlazaCodexStudyTierId('bestiary', 199, 2)).toBe(
      'expertise'
    );
    expect(resolvingPlazaCodexStudyTierId('bestiary', 200, 2)).toBe('mastery');
    expect(resolvingPlazaCodexStudyFullCount('bestiary', 2)).toBe(200);
  });

  it('reports full count 100 for every track at 1x', () => {
    for (const trackId of ALL_TRACK_IDS) {
      expect(resolvingPlazaCodexStudyFullCount(trackId)).toBe(100);
      expect(
        DEFINING_PLAZA_CODEX_STUDY_TRACK_REGISTRY[trackId].studyScaleMultiplier
      ).toBe(1);
    }
  });
});
