import { checkingWildlifeRecentlyAggroed } from '@/components/world/wildlife/domains/checkingWildlifeRecentlyAggroed';
import { DEFINING_WILDLIFE_POST_AGGRO_SLEEP_BLOCK_MS } from '@/components/world/wildlife/domains/definingWildlifeSleepConstants';
import { describe, expect, it } from 'vitest';

describe('checkingWildlifeRecentlyAggroed', () => {
  it('returns false when the animal has never aggroed', () => {
    expect(checkingWildlifeRecentlyAggroed(null, 10_000)).toBe(false);
    expect(checkingWildlifeRecentlyAggroed(undefined, 10_000)).toBe(false);
  });

  it('returns true inside the post-aggro sleep block window', () => {
    const lastAggroedAtMs = 10_000;

    expect(
      checkingWildlifeRecentlyAggroed(
        lastAggroedAtMs,
        lastAggroedAtMs + DEFINING_WILDLIFE_POST_AGGRO_SLEEP_BLOCK_MS - 1
      )
    ).toBe(true);
  });

  it('returns false once the post-aggro sleep block window expires', () => {
    const lastAggroedAtMs = 10_000;

    expect(
      checkingWildlifeRecentlyAggroed(
        lastAggroedAtMs,
        lastAggroedAtMs + DEFINING_WILDLIFE_POST_AGGRO_SLEEP_BLOCK_MS
      )
    ).toBe(false);
  });
});
