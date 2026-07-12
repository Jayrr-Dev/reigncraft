/**
 * Tests for boulder sight-line occlusion helpers.
 */

import type { DefiningWorldPlazaColumnRockBaseDiamond } from '@/components/world/domains/resolvingWorldPlazaColumnRockBaseDiamondFromMetadata';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const checkingWorldPlazaGenerationFeatureEnabledMock = vi.fn(() => true);

vi.mock(
  '@/components/world/domains/managingWorldPlazaGenerationFeatureStore',
  () => ({
    checkingWorldPlazaGenerationFeatureEnabled: () =>
      checkingWorldPlazaGenerationFeatureEnabledMock(),
  })
);

vi.mock(
  '@/components/world/domains/resolvingWorldPlazaColumnRockMetadataAtTileIndex',
  () => ({
    resolvingWorldPlazaColumnRockMetadataAtTileIndex: vi.fn(() => null),
  })
);

import {
  checkingWildlifePlayerOccludedByColumnRock,
  checkingWildlifeSightLineOccludedByDiamonds,
} from '@/components/world/wildlife/domains/checkingWildlifePlayerOccludedByColumnRock';

const COVER_DIAMOND: DefiningWorldPlazaColumnRockBaseDiamond = {
  centerGridX: 5,
  centerGridY: 5,
  scaleWidth: 1.2,
  scaleHeight: 1.2,
};

describe('checkingWildlifeSightLineOccludedByDiamonds', () => {
  it('returns false with no diamonds', () => {
    expect(
      checkingWildlifeSightLineOccludedByDiamonds({
        observerPosition: { x: 0, y: 5, layer: 1 },
        targetPosition: { x: 10, y: 5, layer: 1 },
        diamonds: [],
      })
    ).toBe(false);
  });

  it('returns true when a boulder sits between animal and player', () => {
    expect(
      checkingWildlifeSightLineOccludedByDiamonds({
        observerPosition: { x: 0, y: 5, layer: 1 },
        targetPosition: { x: 10, y: 5, layer: 1 },
        diamonds: [COVER_DIAMOND],
      })
    ).toBe(true);
  });

  it('returns false when the boulder is off the sight line', () => {
    expect(
      checkingWildlifeSightLineOccludedByDiamonds({
        observerPosition: { x: 0, y: 0, layer: 1 },
        targetPosition: { x: 10, y: 0, layer: 1 },
        diamonds: [COVER_DIAMOND],
      })
    ).toBe(false);
  });

  it('returns false when the player is too close for a sample to land in cover', () => {
    expect(
      checkingWildlifeSightLineOccludedByDiamonds({
        observerPosition: { x: 4.9, y: 5, layer: 1 },
        targetPosition: { x: 5.05, y: 5, layer: 1 },
        diamonds: [COVER_DIAMOND],
        sampleStepGrid: 0.35,
      })
    ).toBe(false);
  });
});

describe('checkingWildlifePlayerOccludedByColumnRock feature flag', () => {
  beforeEach(() => {
    checkingWorldPlazaGenerationFeatureEnabledMock.mockReset();
    checkingWorldPlazaGenerationFeatureEnabledMock.mockReturnValue(true);
  });

  it('returns false when wildlife boulder cover is disabled', () => {
    checkingWorldPlazaGenerationFeatureEnabledMock.mockReturnValue(false);

    expect(
      checkingWildlifePlayerOccludedByColumnRock(
        { x: 0, y: 5, layer: 1 },
        { x: 10, y: 5, layer: 1 }
      )
    ).toBe(false);
  });
});
