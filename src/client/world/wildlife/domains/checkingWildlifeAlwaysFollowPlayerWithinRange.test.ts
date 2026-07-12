import { checkingWildlifeAlwaysFollowPlayerWithinRange } from '@/components/world/wildlife/domains/checkingWildlifeAlwaysFollowPlayerWithinRange';
import { DEFINING_WILDLIFE_FAIRY_ALWAYS_FOLLOW_MAX_DISTANCE_GRID } from '@/components/world/wildlife/domains/definingWildlifeFairyConstants';
import { resolvingWildlifeSpeciesDefinition } from '@/components/world/wildlife/domains/definingWildlifeSpeciesRegistry';
import { describe, expect, it } from 'vitest';

describe('checkingWildlifeAlwaysFollowPlayerWithinRange', () => {
  it('follows inside the fairy leash and drops beyond it', () => {
    const fairy = resolvingWildlifeSpeciesDefinition('fairy')!;
    const origin = { x: 0, y: 0 };

    expect(
      checkingWildlifeAlwaysFollowPlayerWithinRange(fairy, origin, {
        x: DEFINING_WILDLIFE_FAIRY_ALWAYS_FOLLOW_MAX_DISTANCE_GRID,
        y: 0,
      })
    ).toBe(true);

    expect(
      checkingWildlifeAlwaysFollowPlayerWithinRange(fairy, origin, {
        x: DEFINING_WILDLIFE_FAIRY_ALWAYS_FOLLOW_MAX_DISTANCE_GRID + 0.1,
        y: 0,
      })
    ).toBe(false);
  });

  it('returns false when no player position is available', () => {
    const fairy = resolvingWildlifeSpeciesDefinition('fairy')!;

    expect(
      checkingWildlifeAlwaysFollowPlayerWithinRange(fairy, { x: 0, y: 0 }, null)
    ).toBe(false);
  });
});
