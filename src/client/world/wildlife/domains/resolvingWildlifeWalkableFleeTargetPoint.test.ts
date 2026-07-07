import { checkingWildlifeFleeTargetHasMeaningfulLegDistance } from '@/components/world/wildlife/domains/checkingWildlifeFleeTargetHasMeaningfulLegDistance';
import { DEFINING_WILDLIFE_SPECIES_REGISTRY } from '@/components/world/wildlife/domains/definingWildlifeSpeciesRegistry';
import {
  resolvingWildlifeOverlapThreatEscapeStep,
  resolvingWildlifeReachableWalkableFleeTargetPoint,
  resolvingWildlifeWalkableFleeTargetPoint,
} from '@/components/world/wildlife/domains/resolvingWildlifeWalkableFleeTargetPoint';
import { describe, expect, it, vi } from 'vitest';

vi.mock(
  '@/components/world/health/domains/resolvingWorldPlazaEnvironmentalHazardAtTileIndex',
  () => ({
    resolvingWorldPlazaEnvironmentalHazardAtTileIndex: vi.fn(() => null),
  })
);

vi.mock('@/components/world/domains/checkingWorldPlazaLavaAtTileIndex', () => ({
  checkingWorldPlazaLavaAtTileIndex: vi.fn(() => false),
}));

vi.mock('@/components/world/collision', () => ({
  checkingWorldCollisionBlockedAtPoint: vi.fn(() => false),
}));

const { resolvingWorldPlazaWaterAtTileIndex } = vi.hoisted(() => ({
  resolvingWorldPlazaWaterAtTileIndex: vi.fn(() => null),
}));

vi.mock(
  '@/components/world/domains/resolvingWorldPlazaWaterAtTileIndex',
  () => ({
    resolvingWorldPlazaWaterAtTileIndex,
  })
);

describe('resolvingWildlifeWalkableFleeTargetPoint', () => {
  it('picks a shoreline direction when the straight flee leg lands in water', () => {
    resolvingWorldPlazaWaterAtTileIndex.mockImplementation(
      (tileX: number, tileY: number) => {
        if (tileX >= 10 || tileY >= 10) {
          return { kind: 'ocean' };
        }

        return null;
      }
    );

    const target = resolvingWildlifeWalkableFleeTargetPoint({
      position: { x: 9.5, y: 9.5, layer: 1 },
      threatPoint: { x: 7.5, y: 7.5, layer: 1 },
      fleeDistanceGrid: 6,
      species: DEFINING_WILDLIFE_SPECIES_REGISTRY.deer,
      hazardSampling: {
        placedBlocks: [],
        isDaytime: true,
      },
    });

    expect(target.x).toBeLessThan(10);
    expect(target.y).toBeLessThan(10);
    expect(Math.hypot(target.x - 7.5, target.y - 7.5)).toBeGreaterThan(
      Math.hypot(9.5 - 7.5, 9.5 - 7.5)
    );
  });

  it('picks a real flee leg when the player is standing on the animal', () => {
    const position = { x: -176.5, y: -291.5, layer: 1 };
    const threatPoint = { x: -176.5, y: -291.5, layer: 1 };
    const species = DEFINING_WILDLIFE_SPECIES_REGISTRY.zebra;
    const hazardSampling = {
      placedBlocks: [],
      isDaytime: true,
    } as const;

    const target = resolvingWildlifeReachableWalkableFleeTargetPoint({
      position,
      threatPoint,
      fleeDistanceGrid: 6,
      species,
      hazardSampling,
    });

    expect(
      checkingWildlifeFleeTargetHasMeaningfulLegDistance({
        position,
        fleeTargetPoint: target,
      })
    ).toBe(true);

    const escapeStep = resolvingWildlifeOverlapThreatEscapeStep({
      position,
      threatPoint,
      species,
      hazardSampling,
    });

    expect(escapeStep).not.toBeNull();
  });

  it('flees away from the player even when centers are still inside body overlap', () => {
    const position = { x: 5, y: 5, layer: 1 };
    const threatPoint = { x: 4.7, y: 5, layer: 1 };
    const species = DEFINING_WILDLIFE_SPECIES_REGISTRY.zebra;
    const hazardSampling = {
      placedBlocks: [],
      isDaytime: true,
    } as const;

    const target = resolvingWildlifeReachableWalkableFleeTargetPoint({
      position,
      threatPoint,
      fleeDistanceGrid: 6,
      species,
      hazardSampling,
    });

    expect(target.x).toBeGreaterThan(position.x);
    expect(Math.hypot(target.x - threatPoint.x, target.y - threatPoint.y)).toBeGreaterThan(
      Math.hypot(position.x - threatPoint.x, position.y - threatPoint.y)
    );
  });
});
