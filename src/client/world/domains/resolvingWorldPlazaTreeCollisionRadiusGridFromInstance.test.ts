import { resolvingWorldPlazaTreeSpeciesForVariant } from '@/components/world/domains/definingWorldPlazaTreeConstants';
import type { DefiningWorldPlazaTreeInstance } from '@/components/world/domains/resolvingWorldPlazaTreeAtTileIndex';
import { resolvingWorldPlazaTreeCollisionRadiusGridFromInstance } from '@/components/world/domains/resolvingWorldPlazaTreeCollisionRadiusGridFromInstance';
import { describe, expect, it } from 'vitest';

function creatingTreeCollisionRadiusTestInstance(
  overrides: Partial<DefiningWorldPlazaTreeInstance> = {}
): DefiningWorldPlazaTreeInstance {
  const species = resolvingWorldPlazaTreeSpeciesForVariant('oak');

  return {
    tileX: 0,
    tileY: 0,
    variant: 'oak',
    trunkColor: species.trunkColor,
    canopyColors: species.canopyColors,
    scale: 1,
    collisionRadiusGrid: species.collisionRadiusGrid,
    offsetXPx: 0,
    offsetYPx: 0,
    seed: 1,
    ...overrides,
  };
}

describe('resolvingWorldPlazaTreeCollisionRadiusGridFromInstance', () => {
  it('scales trunk collision radius with tree visual scale', () => {
    const smallTree = creatingTreeCollisionRadiusTestInstance({ scale: 1 });
    const largeTree = creatingTreeCollisionRadiusTestInstance({ scale: 1.5 });

    const smallRadius =
      resolvingWorldPlazaTreeCollisionRadiusGridFromInstance(smallTree);
    const largeRadius =
      resolvingWorldPlazaTreeCollisionRadiusGridFromInstance(largeTree);

    expect(largeRadius).toBeGreaterThan(smallRadius);
    expect(largeRadius / smallRadius).toBeCloseTo(1.5, 5);
  });

  it('uses a smaller birch trunk than oak at the same scale', () => {
    const oakRadius = resolvingWorldPlazaTreeCollisionRadiusGridFromInstance(
      creatingTreeCollisionRadiusTestInstance({ variant: 'oak', scale: 1.2 })
    );
    const birchRadius = resolvingWorldPlazaTreeCollisionRadiusGridFromInstance(
      creatingTreeCollisionRadiusTestInstance({ variant: 'birch', scale: 1.2 })
    );

    expect(birchRadius).toBeLessThan(oakRadius);
  });

  it('is much smaller than the legacy fixed species collision radius', () => {
    const species = resolvingWorldPlazaTreeSpeciesForVariant('oak');
    const radius = resolvingWorldPlazaTreeCollisionRadiusGridFromInstance(
      creatingTreeCollisionRadiusTestInstance({ scale: species.maxScale })
    );

    expect(radius).toBeLessThan(species.collisionRadiusGrid);
    expect(radius).toBeGreaterThan(0.05);
  });
});
