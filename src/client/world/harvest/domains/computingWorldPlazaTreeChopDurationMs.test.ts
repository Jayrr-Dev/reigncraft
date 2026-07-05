import type { DefiningWorldPlazaTreeInstance } from '@/components/world/domains/resolvingWorldPlazaTreeAtTileIndex';
import { computingWorldPlazaTreeChoppableLayerCount } from '@/components/world/harvest/domains/applyingWorldPlazaTreeChopStateToInstance';
import { computingWorldPlazaTreeChopDurationMs } from '@/components/world/harvest/domains/computingWorldPlazaTreeChopDurationMs';
import { describe, expect, it } from 'vitest';

function creatingTree(
  overrides: Partial<DefiningWorldPlazaTreeInstance> = {}
): DefiningWorldPlazaTreeInstance {
  return {
    tileX: 0,
    tileY: 0,
    variant: 'oak',
    trunkColor: 0,
    canopyColors: [0, 0, 0],
    scale: 1,
    collisionRadiusGrid: 0.68,
    offsetXPx: 0,
    offsetYPx: 0,
    seed: 1,
    standingSurfaceLayer: 1,
    visualSurfaceLayer: 16,
    ...overrides,
  };
}

describe('computingWorldPlazaTreeChoppableLayerCount', () => {
  it('counts world layers between trunk foot and canopy top', () => {
    expect(computingWorldPlazaTreeChoppableLayerCount(creatingTree())).toBe(15);
  });

  it('returns zero for saplings at ground height', () => {
    expect(
      computingWorldPlazaTreeChoppableLayerCount(
        creatingTree({ visualSurfaceLayer: 1 })
      )
    ).toBe(0);
  });
});

describe('computingWorldPlazaTreeChopDurationMs', () => {
  it('scales longer for trees with more remaining layers', () => {
    const shortTree = computingWorldPlazaTreeChopDurationMs(3);
    const tallTree = computingWorldPlazaTreeChopDurationMs(20);

    expect(tallTree).toBeGreaterThan(shortTree);
  });

  it('respects harvest speed multipliers', () => {
    const normal = computingWorldPlazaTreeChopDurationMs(10, 1);
    const fast = computingWorldPlazaTreeChopDurationMs(10, 2);

    expect(fast).toBeLessThan(normal);
  });
});
