import { computingWildlifeCorpseFadeAlpha } from '@/components/world/wildlife/domains/computingWildlifeCorpseFadeAlpha';
import {
  DEFINING_WILDLIFE_CORPSE_FADE_DURATION_MS,
  DEFINING_WILDLIFE_CORPSE_LIFETIME_MS,
} from '@/components/world/wildlife/domains/definingWildlifeDeathConstants';
import { describe, expect, it } from 'vitest';

describe('computingWildlifeCorpseFadeAlpha', () => {
  it('returns full opacity before death timestamp', () => {
    expect(computingWildlifeCorpseFadeAlpha(1000, 500)).toBe(1);
  });

  it('stays fully opaque until the final fade window', () => {
    const fadeStartMs =
      DEFINING_WILDLIFE_CORPSE_LIFETIME_MS -
      DEFINING_WILDLIFE_CORPSE_FADE_DURATION_MS;

    expect(computingWildlifeCorpseFadeAlpha(1000, 1000 + fadeStartMs)).toBe(1);
  });

  it('returns zero after the corpse lifetime ends', () => {
    expect(
      computingWildlifeCorpseFadeAlpha(
        1000,
        1000 + DEFINING_WILDLIFE_CORPSE_LIFETIME_MS
      )
    ).toBe(0);
  });

  it('linearly fades during the final fade window', () => {
    const fadeStartMs =
      DEFINING_WILDLIFE_CORPSE_LIFETIME_MS -
      DEFINING_WILDLIFE_CORPSE_FADE_DURATION_MS;

    expect(
      computingWildlifeCorpseFadeAlpha(
        1000,
        1000 + fadeStartMs + DEFINING_WILDLIFE_CORPSE_FADE_DURATION_MS / 2
      )
    ).toBeCloseTo(0.5);
  });
});
