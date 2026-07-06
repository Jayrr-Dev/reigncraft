import { creatingWorldPlazaEntityHealthInitialState } from '@/components/world/health/domains/managingWorldPlazaEntityHealthState';
import { creatingWildlifeInitialStaminaState } from '@/components/world/wildlife/domains/advancingWildlifeStaminaTick';
import { DEFINING_WILDLIFE_SPECIES_REGISTRY } from '@/components/world/wildlife/domains/definingWildlifeSpeciesRegistry';
import type { DefiningWildlifeInstance } from '@/components/world/wildlife/domains/definingWildlifeTypes';
import {
  resolvingWildlifeInstanceStandingLayerAtPoint,
  syncingWildlifeInstanceStandingLayer,
} from '@/components/world/wildlife/domains/syncingWildlifeInstanceStandingLayer';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const {
  resolvingWorldPlazaSurfaceLayerAtTileIndexMock,
  findingWorldBuildingPlacedBlockAtTileLayerIndexMock,
} = vi.hoisted(() => ({
  resolvingWorldPlazaSurfaceLayerAtTileIndexMock: vi.fn(),
  findingWorldBuildingPlacedBlockAtTileLayerIndexMock: vi.fn(),
}));

vi.mock(
  '@/components/world/domains/resolvingWorldPlazaSurfaceLayerAtTileIndex',
  () => ({
    resolvingWorldPlazaSurfaceLayerAtTileIndex:
      resolvingWorldPlazaSurfaceLayerAtTileIndexMock,
  })
);

vi.mock(
  '@/components/world/building/domains/resolvingWorldBuildingSurfaceLayerAtTileIndex',
  () => ({
    findingWorldBuildingPlacedBlockAtTileLayerIndex:
      findingWorldBuildingPlacedBlockAtTileLayerIndexMock,
  })
);

function buildingInstance(
  overrides: Partial<DefiningWildlifeInstance> = {}
): DefiningWildlifeInstance {
  const species = DEFINING_WILDLIFE_SPECIES_REGISTRY.deer;

  return {
    instanceId: 'wildlife:1:1:0',
    speciesId: species.speciesId,
    anchorId: 'wildlife:1:1:0',
    aggressionLevel: 'normal',
    spawnAnchor: { x: 1.5, y: 1.5, layer: 1 },
    position: { x: 1.5, y: 1.5, layer: 1 },
    facingDirection: 'Down',
    healthState: {
      ...creatingWorldPlazaEntityHealthInitialState(),
      baseMaxHealth: species.vitals.baseMaxHealth,
      currentHealth: species.vitals.baseMaxHealth,
    },
    hungerState: {
      hungerRatio: 0.9,
      driveLevel: 'sated',
      lastFedAtMs: null,
    },
    staminaState: creatingWildlifeInitialStaminaState(),
    aiState: {
      intent: { mode: 'idle' },
      facingDirection: 'Down',
      motionClip: 'idle',
      isMoving: false,
      lastThinkAtMs: 0,
      wanderTarget: null,
      steeringCache: null,
      lastAttackAtMs: null,
      jumpState: null,
      lastJumpEndedAtMs: null,
      startledUntilMs: null,
      chargeWindupStartedAtMs: null,
      fleeTargetPoint: null,
    },
    aggroState: {
      threats: [],
      activeTargetId: null,
      lastDamagedAtMs: null,
    },
    floatingTexts: [],
    speechState: {
      activeBubble: null,
      lastEmittedAtMs: null,
      lastContextKey: null,
    },
    environmentalDamageLastTickAtMs: null,
    isDead: false,
    diedAtMs: null,
    hasDroppedLoot: false,
    ...overrides,
  };
}

describe('resolvingWildlifeInstanceStandingLayerAtPoint', () => {
  beforeEach(() => {
    resolvingWorldPlazaSurfaceLayerAtTileIndexMock.mockReset();
    findingWorldBuildingPlacedBlockAtTileLayerIndexMock.mockReset();
    findingWorldBuildingPlacedBlockAtTileLayerIndexMock.mockReturnValue(null);
  });

  it('snaps up one layer to the tile surface without player stair checks', () => {
    resolvingWorldPlazaSurfaceLayerAtTileIndexMock.mockReturnValue(2);

    expect(
      resolvingWildlifeInstanceStandingLayerAtPoint(
        { x: 1.5, y: 1.5, layer: 1 },
        []
      )
    ).toBe(2);
  });

  it('keeps the current layer on a platform edge above a lower tile', () => {
    resolvingWorldPlazaSurfaceLayerAtTileIndexMock.mockReturnValue(1);
    findingWorldBuildingPlacedBlockAtTileLayerIndexMock.mockReturnValue({
      id: 'block:1',
    });

    expect(
      resolvingWildlifeInstanceStandingLayerAtPoint(
        { x: 1.5, y: 1.5, layer: 2 },
        []
      )
    ).toBe(2);
  });

  it('does not snap up more than one walk step', () => {
    resolvingWorldPlazaSurfaceLayerAtTileIndexMock.mockReturnValue(4);

    expect(
      resolvingWildlifeInstanceStandingLayerAtPoint(
        { x: 1.5, y: 1.5, layer: 1 },
        []
      )
    ).toBe(1);
  });
});

describe('syncingWildlifeInstanceStandingLayer', () => {
  beforeEach(() => {
    resolvingWorldPlazaSurfaceLayerAtTileIndexMock.mockReset();
    findingWorldBuildingPlacedBlockAtTileLayerIndexMock.mockReset();
    findingWorldBuildingPlacedBlockAtTileLayerIndexMock.mockReturnValue(null);
    resolvingWorldPlazaSurfaceLayerAtTileIndexMock.mockReturnValue(2);
  });

  it('updates position.layer from the terrain surface underfoot', () => {
    const instance = buildingInstance();
    const synced = syncingWildlifeInstanceStandingLayer(instance, []);

    expect(synced.position.layer).toBe(2);
  });

  it('keeps the standing layer unchanged while jumping', () => {
    const instance = buildingInstance({
      aiState: {
        ...buildingInstance().aiState,
        jumpState: {
          fromPoint: { x: 1.5, y: 1.5, layer: 1 },
          toPoint: { x: 2.5, y: 1.5, layer: 1 },
          startedAtMs: 0,
          durationMs: 400,
          progress: 0.25,
        },
      },
    });

    const synced = syncingWildlifeInstanceStandingLayer(instance, []);

    expect(
      resolvingWorldPlazaSurfaceLayerAtTileIndexMock
    ).not.toHaveBeenCalled();
    expect(synced).toBe(instance);
    expect(synced.position.layer).toBe(1);
  });

  it('returns the same instance when the standing layer does not change', () => {
    resolvingWorldPlazaSurfaceLayerAtTileIndexMock.mockReturnValue(1);

    const instance = buildingInstance();
    const synced = syncingWildlifeInstanceStandingLayer(instance, []);

    expect(synced).toBe(instance);
  });
});
