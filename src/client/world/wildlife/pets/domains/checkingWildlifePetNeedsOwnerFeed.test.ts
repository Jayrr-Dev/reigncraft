import { checkingWildlifePetNeedsOwnerFeed } from '@/components/world/wildlife/pets/domains/checkingWildlifePetNeedsOwnerFeed';
import { DEFINING_WILDLIFE_PET_FEED_HUNGER_RATIO_THRESHOLD } from '@/components/world/wildlife/pets/domains/definingWildlifePetCompanionCareActionConstants';
import { describe, expect, it } from 'vitest';

describe('checkingWildlifePetNeedsOwnerFeed', () => {
  it('is true below the 75% hunger threshold', () => {
    expect(checkingWildlifePetNeedsOwnerFeed(0.74)).toBe(true);
    expect(
      checkingWildlifePetNeedsOwnerFeed(
        DEFINING_WILDLIFE_PET_FEED_HUNGER_RATIO_THRESHOLD
      )
    ).toBe(false);
    expect(checkingWildlifePetNeedsOwnerFeed(1)).toBe(false);
  });
});
