import { describe, expect, it } from 'vitest';

import { computingWorldPlazaGirlSampleDeathCombatSpritePresentationLayout } from '@/components/world/domains/computingWorldPlazaGirlSampleDeathCombatSpritePresentationLayout';
import {
  DEFINING_WORLD_PLAZA_GIRL_SAMPLE_DEATH_SPRITE_PRESENTATION_COLLAPSED_LAYOUT,
  DEFINING_WORLD_PLAZA_GIRL_SAMPLE_DEATH_SPRITE_PRESENTATION_STANDING_LAYOUT,
} from '@/components/world/domains/definingWorldPlazaGirlSampleCombatSpritePresentationConstants';

describe('computingWorldPlazaGirlSampleDeathCombatSpritePresentationLayout', () => {
  it('keeps the upright death pose before collapse begins', () => {
    expect(
      computingWorldPlazaGirlSampleDeathCombatSpritePresentationLayout(0)
    ).toEqual(
      DEFINING_WORLD_PLAZA_GIRL_SAMPLE_DEATH_SPRITE_PRESENTATION_STANDING_LAYOUT
    );
  });

  it('reaches the collapsed floor pose on the final frame', () => {
    expect(
      computingWorldPlazaGirlSampleDeathCombatSpritePresentationLayout(26)
    ).toEqual(
      DEFINING_WORLD_PLAZA_GIRL_SAMPLE_DEATH_SPRITE_PRESENTATION_COLLAPSED_LAYOUT
    );
  });

  it('lowers the sprite as collapse progresses', () => {
    const earlyLayout =
      computingWorldPlazaGirlSampleDeathCombatSpritePresentationLayout(18);
    const lateLayout =
      computingWorldPlazaGirlSampleDeathCombatSpritePresentationLayout(24);

    expect(lateLayout.offsetBelowGridAnchorPx).toBeGreaterThan(
      earlyLayout.offsetBelowGridAnchorPx
    );
    expect(lateLayout.anchorYNormalized).toBeGreaterThan(
      earlyLayout.anchorYNormalized
    );
  });
});
