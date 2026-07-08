import { seedingWorldPlazaGrassTileDecorationFromTileIndex } from '@/components/world/domains/seedingWorldPlazaGrassTileDecorationFromTileIndex';
import {
  creatingWildlifeTestInstance,
} from '@/components/world/wildlife/domains/creatingWildlifeTestFixtures';
import type { DefiningWildlifeBehaviorBlackboard } from '@/components/world/wildlife/domains/definingWildlifeBehaviorConditionRegistry';
import { DEFINING_WILDLIFE_BOAR_TERRITORY_CONFIG } from '@/components/world/wildlife/domains/definingWildlifeTerritoryConstants';
import { DEFINING_WILDLIFE_SPECIES_REGISTRY } from '@/components/world/wildlife/domains/definingWildlifeSpeciesRegistry';
import {
  DEFINING_WILDLIFE_WANDER_BUCKET_MS,
  DEFINING_WILDLIFE_WANDER_FALLBACK_HALF_EXTENT_GRID,
  DEFINING_WILDLIFE_WANDER_IDLE_CHANCE,
  DEFINING_WILDLIFE_WANDER_SALT,
} from '@/components/world/wildlife/domains/definingWildlifeWanderConstants';
import { resolvingWildlifeWanderIntent } from '@/components/world/wildlife/domains/resolvingWildlifeWanderIntent';
import { describe, expect, it } from 'vitest';

function buildingWanderBlackboard(
  speciesId: keyof typeof DEFINING_WILDLIFE_SPECIES_REGISTRY,
  instanceOverrides: Parameters<typeof creatingWildlifeTestInstance>[0] = {},
  nowMs = 12_000
): DefiningWildlifeBehaviorBlackboard {
  const instance = creatingWildlifeTestInstance({
    speciesId,
    ...instanceOverrides,
  });

  return {
    instance,
    species: DEFINING_WILDLIFE_SPECIES_REGISTRY[speciesId],
    nearbyInstances: [],
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
    resolveSpecies: (id) => DEFINING_WILDLIFE_SPECIES_REGISTRY[id] ?? null,
  };
}

describe('resolvingWildlifeWanderIntent', () => {
  it('returns the same wander target for the same bucket and anchor', () => {
    const blackboard = buildingWanderBlackboard('deer', {
      spawnAnchor: { x: 4.5, y: 7.5, layer: 1 },
      position: { x: 4.5, y: 7.5, layer: 1 },
    });

    const firstIntent = resolvingWildlifeWanderIntent(blackboard);
    const secondIntent = resolvingWildlifeWanderIntent({
      ...blackboard,
      nowMs: blackboard.nowMs + 1_000,
    });

    expect(firstIntent).toEqual(secondIntent);
  });

  it('keeps territorial boar targets inside the anchor territory circle', () => {
    const spawnAnchor = { x: 10, y: 10, layer: 1 };
    const blackboard = buildingWanderBlackboard('boar', {
      spawnAnchor,
      position: spawnAnchor,
    });

    const intent = resolvingWildlifeWanderIntent(blackboard);

    expect(intent.mode).toBe('wander');

    if (intent.mode !== 'wander' || !intent.targetPoint) {
      return;
    }

    const distanceFromAnchor = Math.hypot(
      intent.targetPoint.x - spawnAnchor.x,
      intent.targetPoint.y - spawnAnchor.y
    );

    expect(distanceFromAnchor).toBeLessThanOrEqual(
      DEFINING_WILDLIFE_BOAR_TERRITORY_CONFIG.anchorRadiusGrid + 0.001
    );
  });

  it('keeps passive chicken targets inside the legacy fallback roam box', () => {
    const spawnAnchor = { x: 6, y: 6, layer: 1 };
    const blackboard = buildingWanderBlackboard('chicken', {
      spawnAnchor,
      position: spawnAnchor,
    });

    const intent = resolvingWildlifeWanderIntent(blackboard);

    expect(intent.mode).toBe('wander');

    if (intent.mode !== 'wander' || !intent.targetPoint) {
      return;
    }

    expect(intent.targetPoint.x).toBeGreaterThanOrEqual(
      spawnAnchor.x - DEFINING_WILDLIFE_WANDER_FALLBACK_HALF_EXTENT_GRID
    );
    expect(intent.targetPoint.x).toBeLessThanOrEqual(
      spawnAnchor.x + DEFINING_WILDLIFE_WANDER_FALLBACK_HALF_EXTENT_GRID
    );
    expect(intent.targetPoint.y).toBeGreaterThanOrEqual(
      spawnAnchor.y - DEFINING_WILDLIFE_WANDER_FALLBACK_HALF_EXTENT_GRID
    );
    expect(intent.targetPoint.y).toBeLessThanOrEqual(
      spawnAnchor.y + DEFINING_WILDLIFE_WANDER_FALLBACK_HALF_EXTENT_GRID
    );
  });

  it('idles when already at the wander target', () => {
    const spawnAnchor = { x: 5, y: 5, layer: 1 };
    const blackboard = buildingWanderBlackboard('deer', {
      spawnAnchor,
      position: spawnAnchor,
    });
    const wanderIntent = resolvingWildlifeWanderIntent(blackboard);

    if (wanderIntent.mode !== 'wander' || !wanderIntent.targetPoint) {
      return;
    }

    const arrivedBlackboard = {
      ...blackboard,
      instance: {
        ...blackboard.instance,
        position: wanderIntent.targetPoint,
      },
    };

    expect(resolvingWildlifeWanderIntent(arrivedBlackboard)).toEqual({
      mode: 'idle',
    });
  });

  it('idles on buckets that roll below the idle chance threshold', () => {
    const spawnAnchor = { x: 0.5, y: 0.5, layer: 1 };
    let idleBucket: number | null = null;

    for (let bucket = 0; bucket < 100; bucket += 1) {
      const idleRoll = seedingWorldPlazaGrassTileDecorationFromTileIndex(
        0,
        0,
        DEFINING_WILDLIFE_WANDER_SALT + bucket * 3 + 2
      );

      if (idleRoll < DEFINING_WILDLIFE_WANDER_IDLE_CHANCE) {
        idleBucket = bucket;
        break;
      }
    }

    expect(idleBucket).not.toBeNull();

    const blackboard = buildingWanderBlackboard(
      'deer',
      {
        spawnAnchor,
        position: spawnAnchor,
      },
      idleBucket! * DEFINING_WILDLIFE_WANDER_BUCKET_MS + 1
    );

    expect(resolvingWildlifeWanderIntent(blackboard)).toEqual({ mode: 'idle' });
  });
});
