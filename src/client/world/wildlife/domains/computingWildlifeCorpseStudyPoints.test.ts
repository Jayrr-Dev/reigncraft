import { computingWildlifeCorpseStudyPoints } from '@/components/world/wildlife/domains/computingWildlifeCorpseStudyPoints';
import {
  DEFINING_WILDLIFE_CORPSE_STUDY_MASS_MAX_KG,
  DEFINING_WILDLIFE_CORPSE_STUDY_MASS_MIN_KG,
  DEFINING_WILDLIFE_CORPSE_STUDY_POINTS_MAX,
  DEFINING_WILDLIFE_CORPSE_STUDY_POINTS_MIN,
} from '@/components/world/wildlife/domains/definingWildlifeCorpseStudyConstants';
import { describe, expect, it } from 'vitest';

describe('computingWildlifeCorpseStudyPoints', () => {
  it('awards the minimum points for small animals', () => {
    expect(
      computingWildlifeCorpseStudyPoints(
        DEFINING_WILDLIFE_CORPSE_STUDY_MASS_MIN_KG
      )
    ).toBe(DEFINING_WILDLIFE_CORPSE_STUDY_POINTS_MIN);
    expect(computingWildlifeCorpseStudyPoints(1)).toBe(
      DEFINING_WILDLIFE_CORPSE_STUDY_POINTS_MIN
    );
  });

  it('awards the maximum points for megafauna', () => {
    expect(
      computingWildlifeCorpseStudyPoints(
        DEFINING_WILDLIFE_CORPSE_STUDY_MASS_MAX_KG
      )
    ).toBe(DEFINING_WILDLIFE_CORPSE_STUDY_POINTS_MAX);
    expect(computingWildlifeCorpseStudyPoints(50_000)).toBe(
      DEFINING_WILDLIFE_CORPSE_STUDY_POINTS_MAX
    );
  });

  it('awards mid-tier points near the middle of the mass range', () => {
    const midMassKg =
      (DEFINING_WILDLIFE_CORPSE_STUDY_MASS_MIN_KG +
        DEFINING_WILDLIFE_CORPSE_STUDY_MASS_MAX_KG) /
      2;

    expect(computingWildlifeCorpseStudyPoints(midMassKg)).toBe(2);
  });
});
