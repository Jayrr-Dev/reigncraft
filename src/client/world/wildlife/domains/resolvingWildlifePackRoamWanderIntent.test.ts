import { creatingWildlifeTestInstance } from '@/components/world/wildlife/domains/creatingWildlifeTestFixtures';
import type { DefiningWildlifeBehaviorBlackboard } from '@/components/world/wildlife/domains/definingWildlifeBehaviorConditionRegistry';
import { DEFINING_WILDLIFE_SPECIES_REGISTRY } from '@/components/world/wildlife/domains/definingWildlifeSpeciesRegistry';
import { resolvingWildlifePackRoamWanderIntent } from '@/components/world/wildlife/domains/resolvingWildlifePackRoamWanderIntent';
import { resolvingWildlifeSpawnPackRoamFormation } from '@/components/world/wildlife/domains/resolvingWildlifeSpawnPackRoamFormation';
import { describe, expect, it } from 'vitest';

function buildingWolfBlackboard(
  instanceOverrides: Parameters<typeof creatingWildlifeTestInstance>[0],
  nearbyInstances: ReturnType<typeof creatingWildlifeTestInstance>[] = []
): DefiningWildlifeBehaviorBlackboard {
  const instance = creatingWildlifeTestInstance(instanceOverrides);

  return {
    instance,
    species: DEFINING_WILDLIFE_SPECIES_REGISTRY['grey-wolf'],
    nearbyInstances,
    playerPosition: null,
    playerUserId: null,
    isPlayerRunning: false,
    isPlayerJumping: false,
    nowMs: 12_000,
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

describe('resolvingWildlifeSpawnPackRoamFormation', () => {
  it('marks the largest wolf as alpha and ranks followers by pack index', () => {
    const alpha = creatingWildlifeTestInstance({
      instanceId: 'wildlife:4:7:1',
      anchorId: 'wildlife:4:7:1',
      sizeScaleSample: 1.2,
    });
    const follower = creatingWildlifeTestInstance({
      instanceId: 'wildlife:4:7:0',
      anchorId: 'wildlife:4:7:0',
      sizeScaleSample: -0.5,
    });

    expect(
      resolvingWildlifeSpawnPackRoamFormation({
        instance: alpha,
        nearbyInstances: [follower],
        resolveSpecies: (speciesId) =>
          DEFINING_WILDLIFE_SPECIES_REGISTRY[speciesId] ?? null,
      })
    ).toEqual({ isAlpha: true, followerRank: 0 });

    expect(
      resolvingWildlifeSpawnPackRoamFormation({
        instance: follower,
        nearbyInstances: [alpha],
        resolveSpecies: (speciesId) =>
          DEFINING_WILDLIFE_SPECIES_REGISTRY[speciesId] ?? null,
      })
    ).toEqual({ isAlpha: false, followerRank: 1 });
  });
});

describe('resolvingWildlifePackRoamWanderIntent', () => {
  it('has the alpha pick a shared roam leg from the spawn tile center', () => {
    const alpha = creatingWildlifeTestInstance({
      instanceId: 'wildlife:4:7:1',
      anchorId: 'wildlife:4:7:1',
      sizeScaleSample: 1.2,
      spawnAnchor: { x: 5.1, y: 8.2, layer: 1 },
      position: { x: 5.1, y: 8.2, layer: 1 },
    });
    const follower = creatingWildlifeTestInstance({
      instanceId: 'wildlife:4:7:0',
      anchorId: 'wildlife:4:7:0',
      sizeScaleSample: -0.5,
      spawnAnchor: { x: 4.2, y: 7.4, layer: 1 },
      position: { x: 4.2, y: 7.4, layer: 1 },
    });

    const alphaIntent = resolvingWildlifePackRoamWanderIntent(
      buildingWolfBlackboard(alpha, [follower])
    );

    expect(alphaIntent.mode === 'wander' || alphaIntent.mode === 'idle').toBe(
      true
    );

    if (alphaIntent.mode === 'wander') {
      expect(alphaIntent.targetPoint.x).toBeGreaterThan(1);
      expect(alphaIntent.targetPoint.x).toBeLessThan(8);
      expect(alphaIntent.targetPoint.y).toBeGreaterThan(1);
      expect(alphaIntent.targetPoint.y).toBeLessThan(8);
    }
  });

  it('has followers trail the alpha instead of picking their own roam legs', () => {
    const alpha = creatingWildlifeTestInstance({
      instanceId: 'wildlife:4:7:1',
      anchorId: 'wildlife:4:7:1',
      sizeScaleSample: 1.2,
      position: { x: 10, y: 10, layer: 1 },
      aiState: {
        intent: { mode: 'wander', targetPoint: { x: 12, y: 10, layer: 1 } },
        isMoving: true,
        motionClip: 'walk',
      },
    });
    const follower = creatingWildlifeTestInstance({
      instanceId: 'wildlife:4:7:0',
      anchorId: 'wildlife:4:7:0',
      sizeScaleSample: -0.5,
      position: { x: 4, y: 10, layer: 1 },
    });

    const followerIntent = resolvingWildlifePackRoamWanderIntent(
      buildingWolfBlackboard(follower, [alpha])
    );

    expect(followerIntent.mode).toBe('wander');

    if (followerIntent.mode === 'wander') {
      expect(followerIntent.targetPoint.x).toBeGreaterThan(follower.position.x);
    }
  });

  it('falls back to solo wander for non-stalker species', () => {
    const deer = creatingWildlifeTestInstance({
      speciesId: 'deer',
      anchorId: 'wildlife:2:2:0',
      instanceId: 'wildlife:2:2:0',
    });

    const intent = resolvingWildlifePackRoamWanderIntent(
      buildingWolfBlackboard(deer)
    );

    expect(intent.mode === 'wander' || intent.mode === 'idle').toBe(true);
  });
});
