import { checkingWildlifeDirectionHasJumpableGapAhead } from '@/components/world/wildlife/domains/checkingWildlifeDirectionHasJumpableGapAhead';
import {
  checkingWildlifeSpeciesCanSeekSafeTerrain,
  checkingWildlifeSpeciesUsesSafeTerrainSeeking,
} from '@/components/world/wildlife/domains/checkingWildlifeSpeciesUsesSafeTerrainSeeking';
import { DEFINING_WILDLIFE_SPECIES_REGISTRY } from '@/components/world/wildlife/domains/definingWildlifeSpeciesRegistry';
import { resolvingWildlifeNearestSafeTerrainDirection } from '@/components/world/wildlife/domains/resolvingWildlifeNearestSafeTerrainDirection';
import { resolvingWildlifeSafeTerrainSeekingDirection } from '@/components/world/wildlife/domains/resolvingWildlifeSafeTerrainSeekingDirection';
import { describe, expect, it, vi } from 'vitest';

const {
  checkingWorldCollisionBlockedAtPointMock,
  resolvingWorldPlazaSurfaceLayerAtTileIndexMock,
} = vi.hoisted(() => ({
  checkingWorldCollisionBlockedAtPointMock: vi.fn(
    (
      _point: { x: number; y: number },
      _options?: { playerLayer?: number }
    ): boolean => false
  ),
  resolvingWorldPlazaSurfaceLayerAtTileIndexMock: vi.fn(
    (_tileX: number, _tileY?: number): number => 1
  ),
}));

vi.mock(
  '@/components/world/health/domains/resolvingWorldPlazaEnvironmentalHazardAtTileIndex',
  () => ({
    resolvingWorldPlazaEnvironmentalHazardAtTileIndex: vi.fn(() => null),
  })
);

vi.mock('@/components/world/domains/checkingWorldPlazaLavaAtTileIndex', () => ({
  checkingWorldPlazaLavaAtTileIndex: vi.fn(() => false),
}));

// River covers tile x = 5 and x = 6.
vi.mock(
  '@/components/world/domains/resolvingWorldPlazaWaterAtTileIndex',
  () => ({
    resolvingWorldPlazaWaterAtTileIndex: vi.fn((tileX: number) =>
      tileX === 5 || tileX === 6 ? 'river' : null
    ),
  })
);

vi.mock(
  '@/components/world/domains/resolvingWorldPlazaBiomeAtTileIndex',
  () => ({
    resolvingWorldPlazaBiomeAtTileIndex: vi.fn(() => ({ kind: 'plains' })),
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
    resolvingWorldPlazaSurfaceLayerAtTileIndex:
      resolvingWorldPlazaSurfaceLayerAtTileIndexMock,
  })
);

vi.mock('@/components/world/collision', () => ({
  checkingWorldCollisionBlockedAtPoint:
    checkingWorldCollisionBlockedAtPointMock,
}));

const hazardSampling = {
  placedBlocks: [],
  placedBlocksByTile: new Map(),
  isDaytime: true,
};

describe('checkingWildlifeSpeciesUsesSafeTerrainSeeking', () => {
  it('includes jump-capable fleet prey and excludes ostrich', () => {
    expect(checkingWildlifeSpeciesUsesSafeTerrainSeeking('deer')).toBe(true);
    expect(checkingWildlifeSpeciesUsesSafeTerrainSeeking('antilope')).toBe(
      true
    );
    expect(checkingWildlifeSpeciesUsesSafeTerrainSeeking('ostrich')).toBe(
      false
    );
    expect(checkingWildlifeSpeciesUsesSafeTerrainSeeking('cow')).toBe(false);
  });

  it('requires canJump for seeking', () => {
    expect(
      checkingWildlifeSpeciesCanSeekSafeTerrain(
        DEFINING_WILDLIFE_SPECIES_REGISTRY.deer
      )
    ).toBe(true);
    expect(
      checkingWildlifeSpeciesCanSeekSafeTerrain(
        DEFINING_WILDLIFE_SPECIES_REGISTRY.ostrich
      )
    ).toBe(false);
  });
});

describe('checkingWildlifeDirectionHasJumpableGapAhead', () => {
  it('finds a river gap along +x', () => {
    const result = checkingWildlifeDirectionHasJumpableGapAhead({
      origin: { x: 3.5, y: 10.5, layer: 1 },
      direction: { x: 1, y: 0 },
      species: DEFINING_WILDLIFE_SPECIES_REGISTRY.deer,
      hazardSampling,
      detectMaxGrid: 8,
      scanStepGrid: 0.5,
    });

    expect(result).not.toBeNull();
    expect(result?.gapKind).toBe('water');
    expect(result?.gapStartDistanceGrid).toBeGreaterThan(0);
  });

  it('returns null when heading away from the river', () => {
    const result = checkingWildlifeDirectionHasJumpableGapAhead({
      origin: { x: 3.5, y: 10.5, layer: 1 },
      direction: { x: -1, y: 0 },
      species: DEFINING_WILDLIFE_SPECIES_REGISTRY.deer,
      hazardSampling,
      detectMaxGrid: 8,
      scanStepGrid: 0.5,
    });

    expect(result).toBeNull();
  });
});

describe('resolvingWildlifeNearestSafeTerrainDirection', () => {
  it('biases toward the river when fleeing away from a threat', () => {
    const result = resolvingWildlifeNearestSafeTerrainDirection({
      position: { x: 3.5, y: 10.5, layer: 1 },
      species: DEFINING_WILDLIFE_SPECIES_REGISTRY.deer,
      hazardSampling,
      preferredDirection: { x: 1, y: 0 },
    });

    expect(result).not.toBeNull();
    expect(result?.gapKind).toBe('water');
    expect(result?.direction.x ?? 0).toBeGreaterThan(0.5);
  });

  it('returns null for ostrich', () => {
    expect(
      resolvingWildlifeNearestSafeTerrainDirection({
        position: { x: 3.5, y: 10.5, layer: 1 },
        species: DEFINING_WILDLIFE_SPECIES_REGISTRY.ostrich,
        hazardSampling,
        preferredDirection: { x: 1, y: 0 },
      })
    ).toBeNull();
  });
});

describe('resolvingWildlifeSafeTerrainSeekingDirection', () => {
  it('blends base heading toward the river for deer', () => {
    const result = resolvingWildlifeSafeTerrainSeekingDirection({
      position: { x: 3.5, y: 10.5, layer: 1 },
      species: DEFINING_WILDLIFE_SPECIES_REGISTRY.deer,
      hazardSampling,
      baseDirection: { x: 0.7, y: 0.7 },
    });

    expect(result.x).toBeGreaterThan(0.5);
  });

  it('leaves cow heading unchanged when no seek applies', () => {
    const result = resolvingWildlifeSafeTerrainSeekingDirection({
      position: { x: 3.5, y: 10.5, layer: 1 },
      species: DEFINING_WILDLIFE_SPECIES_REGISTRY.cow,
      hazardSampling,
      baseDirection: { x: 0, y: 1 },
    });

    expect(result.x).toBeCloseTo(0);
    expect(result.y).toBeCloseTo(1);
  });
});
