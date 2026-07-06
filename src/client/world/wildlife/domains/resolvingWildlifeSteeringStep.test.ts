import { creatingWorldPlazaEntityHealthInitialState } from '@/components/world/health/domains/managingWorldPlazaEntityHealthState';
import { checkingWildlifeHazardAtPoint } from '@/components/world/wildlife/domains/checkingWildlifeHazardAtPoint';
import { DEFINING_WILDLIFE_SPECIES_REGISTRY } from '@/components/world/wildlife/domains/definingWildlifeSpeciesRegistry';
import type { DefiningWildlifeInstance } from '@/components/world/wildlife/domains/definingWildlifeTypes';
import { resolvingWildlifeSteeringStep } from '@/components/world/wildlife/domains/resolvingWildlifeSteeringStep';
import { describe, expect, it, vi } from 'vitest';

vi.mock('@/components/world/domains/checkingWorldPlazaLavaAtTileIndex', () => ({
  checkingWorldPlazaLavaAtTileIndex: vi.fn((tileX: number) => tileX === 5),
}));

vi.mock(
  '@/components/world/domains/resolvingWorldPlazaWaterAtTileIndex',
  () => ({
    resolvingWorldPlazaWaterAtTileIndex: vi.fn(() => null),
  })
);

vi.mock('@/components/world/collision', () => ({
  checkingWorldCollisionBlockedAtPoint: vi.fn(() => false),
}));

function buildingSteeringInstance(position: {
  x: number;
  y: number;
}): DefiningWildlifeInstance {
  return {
    instanceId: 'wildlife:4:4:0',
    speciesId: 'deer',
    anchorId: 'wildlife:4:4:0',
    spawnAnchor: { x: 4.5, y: 4.5, layer: 1 },
    position: { x: position.x, y: position.y, layer: 1 },
    facingDirection: 'Down',
    healthState: creatingWorldPlazaEntityHealthInitialState(),
    hungerState: {
      hungerRatio: 0.8,
      driveLevel: 'sated',
      lastFedAtMs: null,
    },
    aiState: {
      intent: { mode: 'wander', targetPoint: { x: 10, y: 4.5, layer: 1 } },
      facingDirection: 'Down',
      motionClip: 'walk',
      isMoving: true,
      lastThinkAtMs: 0,
      wanderTarget: null,
    },
    aggroState: {
      threats: [],
      activeTargetId: null,
      lastDamagedAtMs: null,
    },
    isDead: false,
    diedAtMs: null,
  };
}

describe('resolvingWildlifeSteeringStep', () => {
  it('avoids stepping into a lethal lava tile ahead', () => {
    const species = DEFINING_WILDLIFE_SPECIES_REGISTRY.deer;
    const instance = buildingSteeringInstance({ x: 4.5, y: 4.5 });

    const result = resolvingWildlifeSteeringStep({
      instance,
      species,
      desiredDirection: { x: 1, y: 0 },
      speedGridPerSecond: 2,
      deltaSeconds: 0.5,
      nearbyInstances: [],
    });

    expect(Math.floor(result.nextPosition.x)).not.toBe(5);
  });

  it('reports lava as lethal for standard species', () => {
    const species = DEFINING_WILDLIFE_SPECIES_REGISTRY.deer;

    expect(
      checkingWildlifeHazardAtPoint({
        point: { x: 5.5, y: 4.5, layer: 1 },
        species,
      })
    ).toBe('lethal');
  });
});
