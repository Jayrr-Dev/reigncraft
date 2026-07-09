import { checkingWorldPlazaPlayerMobileAutoJumpWaterGapAhead } from '@/components/world/domains/checkingWorldPlazaPlayerMobileAutoJumpWaterGapAhead';
import { resolvingWorldPlazaJumpLandingGridPointAlongPath } from '@/components/world/domains/resolvingWorldPlazaJumpLandingGridPointAlongPath';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock(
  '@/components/world/domains/resolvingWorldPlazaWaterAtTileIndex',
  () => ({
    resolvingWorldPlazaWaterAtTileIndex: vi.fn((tileX: number) =>
      tileX === 5 || tileX === 6 ? { kind: 'river' } : null
    ),
  })
);

vi.mock(
  '@/components/world/domains/checkingWorldPlazaWaterIsFrozenAtTileIndex',
  () => ({
    checkingWorldPlazaWaterIsFrozenAtTileIndex: vi.fn(() => false),
  })
);

vi.mock(
  '@/components/world/domains/resolvingWorldPlazaIsometricTileIndexAtGridPoint',
  () => ({
    resolvingWorldPlazaIsometricTileIndexAtGridPoint: vi.fn(
      (point: { x: number; y: number }) => ({
        tileX: Math.floor(point.x),
        tileY: Math.floor(point.y),
      })
    ),
  })
);

vi.mock(
  '@/components/world/domains/resolvingWorldPlazaSurfaceLayerAtTileIndex',
  () => ({
    resolvingWorldPlazaSurfaceLayerAtTileIndex: vi.fn(() => 1),
  })
);

vi.mock(
  '@/components/world/building/domains/resolvingWorldBuildingCollision',
  async (importOriginal) => {
    const actual =
      await importOriginal<
        typeof import('@/components/world/building/domains/resolvingWorldBuildingCollision')
      >();

    return {
      ...actual,
      checkingWorldBuildingPlacedNaturalWaterStreamAtTileIndex: vi.fn(
        () => false
      ),
      resolvingWorldBuildingJumpForwardGridDistanceClampedToWall: vi.fn(
        (_start: unknown, _direction: unknown, forwardGridDistance: number) =>
          forwardGridDistance
      ),
    };
  }
);

vi.mock(
  '@/components/world/domains/resolvingWorldPlazaJumpLandingGridPointAlongPath',
  () => ({
    resolvingWorldPlazaJumpLandingGridPointAlongPath: vi.fn(
      (
        startGridPoint: { x: number; y: number },
        gridDirection: { x: number; y: number },
        forwardGridDistance: number
      ) => ({
        landingGridPoint: {
          x: startGridPoint.x + gridDirection.x * forwardGridDistance,
          y: startGridPoint.y + gridDirection.y * forwardGridDistance,
        },
        landingSurfaceLayer: 1,
        forwardGridDistance,
      })
    ),
  })
);

describe('checkingWorldPlazaPlayerMobileAutoJumpWaterGapAhead', () => {
  beforeEach(() => {
    vi.mocked(resolvingWorldPlazaJumpLandingGridPointAlongPath).mockClear();
  });

  it('returns true when a river gap is ahead and a run jump clears it', () => {
    const shouldAutoJump = checkingWorldPlazaPlayerMobileAutoJumpWaterGapAhead({
      playerPosition: { x: 4.5, y: 4.5, layer: 1 },
      gridDirection: { x: 1, y: 0 },
      placedBlocks: [],
      jumpStartLayer: 1,
      jumpLayerReachMax: 4,
      jumpDistanceMultiplier: 1,
    });

    expect(shouldAutoJump).toBe(true);
  });

  it('returns false when no water is ahead', () => {
    const shouldAutoJump = checkingWorldPlazaPlayerMobileAutoJumpWaterGapAhead({
      playerPosition: { x: 4.5, y: 4.5, layer: 1 },
      gridDirection: { x: -1, y: 0 },
      placedBlocks: [],
      jumpStartLayer: 1,
      jumpLayerReachMax: 4,
      jumpDistanceMultiplier: 1,
    });

    expect(shouldAutoJump).toBe(false);
  });

  it('returns false when the resolved landing would not clear the gap', () => {
    vi.mocked(
      resolvingWorldPlazaJumpLandingGridPointAlongPath
    ).mockReturnValueOnce({
      landingGridPoint: { x: 4.8, y: 4.5 },
      landingSurfaceLayer: 1,
      forwardGridDistance: 0.3,
    });

    const shouldAutoJump = checkingWorldPlazaPlayerMobileAutoJumpWaterGapAhead({
      playerPosition: { x: 4.5, y: 4.5, layer: 1 },
      gridDirection: { x: 1, y: 0 },
      placedBlocks: [],
      jumpStartLayer: 1,
      jumpLayerReachMax: 4,
      jumpDistanceMultiplier: 1,
    });

    expect(shouldAutoJump).toBe(false);
  });
});
