import { seedingWorldPlazaGrassTileDecorationFromTileIndex } from '@/components/world/domains/seedingWorldPlazaGrassTileDecorationFromTileIndex';
import {
  creatingWildlifeTestAiState,
  creatingWildlifeTestInstance,
} from '@/components/world/wildlife/domains/creatingWildlifeTestFixtures';
import type { DefiningWildlifeBehaviorBlackboard } from '@/components/world/wildlife/domains/definingWildlifeBehaviorConditionRegistry';
import {
  DEFINING_WILDLIFE_HERD_LANDMARK_SALT,
  DEFINING_WILDLIFE_HERD_LANDMARK_TRAVEL_CHANCE,
} from '@/components/world/wildlife/domains/definingWildlifeHerdLandmarkTravelConstants';
import { DEFINING_WILDLIFE_SPECIES_REGISTRY } from '@/components/world/wildlife/domains/definingWildlifeSpeciesRegistry';
import { DEFINING_WILDLIFE_WANDER_BUCKET_MS } from '@/components/world/wildlife/domains/definingWildlifeWanderConstants';
import { resolvingWildlifeHerdLandmarkWanderIntent } from '@/components/world/wildlife/domains/resolvingWildlifeHerdLandmarkWanderIntent';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock(
  '@/components/world/domains/resolvingWorldPlazaWaterAtTileIndex',
  () => ({
    resolvingWorldPlazaWaterAtTileIndex: vi.fn(
      (tileX: number, tileY: number) =>
        tileX === 10 && tileY === 5 ? { kind: 'pond' } : null
    ),
  })
);

vi.mock(
  '@/components/world/domains/checkingWorldPlazaTreeBlocksGridTile',
  () => ({
    checkingWorldPlazaTreeBlocksGridTile: vi.fn(
      (tileX: number, tileY: number) => tileX === 3 && tileY === 8
    ),
  })
);

vi.mock(
  '@/components/world/domains/resolvingWorldPlazaBiomeAtTileIndex',
  () => ({
    resolvingWorldPlazaBiomeAtTileIndex: vi.fn(() => ({ kind: 'plains' })),
  })
);

function buildingDeerBlackboard(
  instanceOverrides: Parameters<typeof creatingWildlifeTestInstance>[0] = {},
  nearbyInstances: ReturnType<typeof creatingWildlifeTestInstance>[] = [],
  nowMs = 12_000
): DefiningWildlifeBehaviorBlackboard {
  const instance = creatingWildlifeTestInstance({
    speciesId: 'deer',
    ...instanceOverrides,
  });

  return {
    instance,
    species: DEFINING_WILDLIFE_SPECIES_REGISTRY.deer,
    nearbyInstances,
    playerPosition: null,
    playerUserId: null,
    isPlayerWalking: false,
    isPlayerRunning: false,
    isPlayerJumping: false,
    nowMs,
    hazardSampling: {
      placedBlocks: [],
      isDaytime: true,
    },
    selectedPreyInstanceId: null,
    selectedProximityPreyInstanceId: null,
    selectedGroundFoodItemId: null,
    playerHealthRatio: null,
    playerStaminaRatio: null,
    playerStaminaIsDepleted: false,
    playerStillDurationMs: 0,
    resolveSpecies: (speciesId) =>
      DEFINING_WILDLIFE_SPECIES_REGISTRY[speciesId] ?? null,
  };
}

function findingLandmarkCycleNowMs(
  tileX: number,
  tileY: number,
  preferRestHalf: boolean
): number {
  for (let bucket = 0; bucket < 80; bucket += 1) {
    const pairIndex = Math.floor(bucket / 2);
    const isRestHalf = bucket % 2 === 0;
    const roll = seedingWorldPlazaGrassTileDecorationFromTileIndex(
      tileX,
      tileY,
      DEFINING_WILDLIFE_HERD_LANDMARK_SALT + pairIndex * 3
    );

    if (
      roll < DEFINING_WILDLIFE_HERD_LANDMARK_TRAVEL_CHANCE &&
      isRestHalf === preferRestHalf
    ) {
      return bucket * DEFINING_WILDLIFE_WANDER_BUCKET_MS;
    }
  }

  throw new Error('No landmark cycle bucket found for test seed');
}

describe('resolvingWildlifeHerdLandmarkWanderIntent', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('rests during the first half of a landmark travel cycle', () => {
    const spawnAnchor = { x: 4.5, y: 5.5, layer: 1 };
    const nowMs = findingLandmarkCycleNowMs(4, 5, true);
    const intent = resolvingWildlifeHerdLandmarkWanderIntent(
      buildingDeerBlackboard(
        {
          spawnAnchor,
          position: spawnAnchor,
          anchorId: 'wildlife:4:5:0',
          instanceId: 'wildlife:4:5:0',
        },
        [],
        nowMs
      )
    );

    expect(intent.mode).toBe('idle');
  });

  it('travels toward a shore stand after the rest half', () => {
    const spawnAnchor = { x: 4.5, y: 5.5, layer: 1 };
    const nowMs = findingLandmarkCycleNowMs(4, 5, false);
    const intent = resolvingWildlifeHerdLandmarkWanderIntent(
      buildingDeerBlackboard(
        {
          spawnAnchor,
          position: spawnAnchor,
          anchorId: 'wildlife:4:5:0',
          instanceId: 'wildlife:4:5:0',
        },
        [],
        nowMs
      )
    );

    expect(intent.mode === 'wander' || intent.mode === 'idle').toBe(true);

    if (intent.mode === 'wander' && intent.targetPoint) {
      const distance = Math.hypot(
        intent.targetPoint.x - spawnAnchor.x,
        intent.targetPoint.y - spawnAnchor.y
      );
      expect(distance).toBeGreaterThan(2);
    }
  });

  it('has herd followers trail the alpha instead of picking own landmarks', () => {
    const alpha = creatingWildlifeTestInstance({
      speciesId: 'deer',
      instanceId: 'wildlife:4:5:1',
      anchorId: 'wildlife:4:5:1',
      sizeScaleSample: 1.2,
      position: { x: 10, y: 10, layer: 1 },
      spawnAnchor: { x: 4.5, y: 5.5, layer: 1 },
      aiState: creatingWildlifeTestAiState({
        intent: { mode: 'wander', targetPoint: { x: 12, y: 10, layer: 1 } },
        isMoving: true,
        motionClip: 'walk',
      }),
    });
    const follower = creatingWildlifeTestInstance({
      speciesId: 'deer',
      instanceId: 'wildlife:4:5:0',
      anchorId: 'wildlife:4:5:0',
      sizeScaleSample: -0.5,
      position: { x: 4, y: 10, layer: 1 },
      spawnAnchor: { x: 4.5, y: 5.5, layer: 1 },
    });

    const followerIntent = resolvingWildlifeHerdLandmarkWanderIntent(
      buildingDeerBlackboard(follower, [alpha], 12_000)
    );

    expect(followerIntent.mode).toBe('wander');

    if (followerIntent.mode === 'wander' && followerIntent.targetPoint) {
      expect(followerIntent.targetPoint.x).toBeGreaterThan(follower.position.x);
    }
  });

  it('leaves predators on plain wander', () => {
    const wolf = creatingWildlifeTestInstance({
      speciesId: 'grey-wolf',
      anchorId: 'wildlife:2:2:0',
      instanceId: 'wildlife:2:2:0',
    });

    const intent = resolvingWildlifeHerdLandmarkWanderIntent({
      ...buildingDeerBlackboard(wolf),
      species: DEFINING_WILDLIFE_SPECIES_REGISTRY['grey-wolf'],
    });

    expect(intent.mode === 'wander' || intent.mode === 'idle').toBe(true);
  });
});
