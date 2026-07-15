/**
 * Fishing cast duration unit tests.
 *
 * @module components/world/fishing/domains/computingWorldPlazaFishingCastDurationMs.test
 */

import { computingWorldPlazaFishingCastDurationMs } from '@/components/world/fishing/domains/computingWorldPlazaFishingCastDurationMs';
import { DEFINING_WORLD_PLAZA_FISHING_CAST_DURATION_RANGE_MS_BY_RARITY } from '@/components/world/fishing/domains/definingWorldPlazaFishingCatchConstants';
import { describe, expect, it } from 'vitest';

describe('computingWorldPlazaFishingCastDurationMs', () => {
  it('uses the rarity min when the roll is zero', () => {
    const durationMs = computingWorldPlazaFishingCastDurationMs(
      'common',
      'wood',
      1,
      0
    );

    expect(durationMs).toBe(
      DEFINING_WORLD_PLAZA_FISHING_CAST_DURATION_RANGE_MS_BY_RARITY.common.minMs
    );
  });

  it('uses the rarity max when the roll is one', () => {
    const durationMs = computingWorldPlazaFishingCastDurationMs(
      'rare',
      'wood',
      1,
      1
    );

    expect(durationMs).toBe(
      DEFINING_WORLD_PLAZA_FISHING_CAST_DURATION_RANGE_MS_BY_RARITY.rare.maxMs
    );
  });

  it('applies rod tier and harvest speed multipliers after the rarity roll', () => {
    const durationMs = computingWorldPlazaFishingCastDurationMs(
      'common',
      'gold',
      2,
      0
    );

    expect(durationMs).toBe(320);
  });
});
