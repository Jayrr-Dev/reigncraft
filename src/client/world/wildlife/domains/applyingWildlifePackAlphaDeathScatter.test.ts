import { applyingWildlifePackAlphaDeathScatter } from '@/components/world/wildlife/domains/applyingWildlifePackAlphaDeathScatter';
import { creatingWildlifeTestInstance } from '@/components/world/wildlife/domains/creatingWildlifeTestFixtures';
import { DEFINING_WILDLIFE_PACK_ALPHA_DEATH_REGROUP_DURATION_MS } from '@/components/world/wildlife/domains/definingWildlifePackConstants';
import { DEFINING_WILDLIFE_SPECIES_REGISTRY } from '@/components/world/wildlife/domains/definingWildlifeSpeciesRegistry';
import { listingWildlifeSpawnPackmates } from '@/components/world/wildlife/domains/listingWildlifeSpawnPackmates';
import {
  creatingWildlifeInstanceStore,
  listingWildlifeInstances,
  replacingWildlifeInstance,
} from '@/components/world/wildlife/domains/managingWildlifeInstanceStore';
import { resolvingWildlifePackAlphaInstanceId } from '@/components/world/wildlife/domains/resolvingWildlifePackAlphaInstanceId';
import { describe, expect, it } from 'vitest';

function buildingPackWolf(
  packIndex: number,
  sizeScaleSample: number,
  instanceId = `wildlife:4:7:${packIndex}`
) {
  return creatingWildlifeTestInstance({
    instanceId,
    anchorId: instanceId,
    sizeScaleSample,
    spawnAnchor: { x: 4.5, y: 7.5, layer: 1 },
    position: { x: 4.5 + packIndex, y: 7.5, layer: 1 },
    aggroState: {
      threats: [{ targetId: 'player-1', threat: 2, lastUpdatedAtMs: 1 }],
      activeTargetId: 'player-1',
      lastDamagedAtMs: null,
      stalkingPreySinceMs: 1_000,
      stalkAttackingPreySinceMs: null,
    },
    aiState: {
      ...creatingWildlifeTestInstance().aiState,
      intent: {
        mode: 'stalk',
        targetInstanceId: 'player-1',
        targetPoint: { x: 8, y: 7.5, layer: 1 },
      },
      hasUsedBluffCharge: false,
      bluffChargePlayerExitedTerritory: false,
      bluffReturnPoint: null,
      docileFollowUntilMs: null,
      docileLastReactAtMs: null,
    },
  });
}

describe('resolvingWildlifePackAlphaInstanceId', () => {
  it('picks the largest pack member as alpha when unlocked', () => {
    const packmates = [
      buildingPackWolf(0, -0.5),
      buildingPackWolf(1, 1.2),
      buildingPackWolf(2, 0.1),
    ];

    expect(
      resolvingWildlifePackAlphaInstanceId({
        packmates,
        resolveSpecies: (speciesId) =>
          DEFINING_WILDLIFE_SPECIES_REGISTRY[speciesId] ?? null,
      })
    ).toBe('wildlife:4:7:1');
  });

  it('keeps a sticky locked alpha even when a larger packmate appears', () => {
    const lockedAlpha = buildingPackWolf(0, 0.2, 'wildlife:4:7:0');
    const largerNewcomer = buildingPackWolf(1, 1.8, 'wildlife:4:7:1');
    const packmates = [
      {
        ...lockedAlpha,
        packAlphaInstanceId: lockedAlpha.instanceId,
      },
      {
        ...largerNewcomer,
        packAlphaInstanceId: lockedAlpha.instanceId,
      },
    ];

    expect(
      resolvingWildlifePackAlphaInstanceId({
        packmates,
        resolveSpecies: (speciesId) =>
          DEFINING_WILDLIFE_SPECIES_REGISTRY[speciesId] ?? null,
      })
    ).toBe(lockedAlpha.instanceId);
  });
});

describe('applyingWildlifePackAlphaDeathScatter', () => {
  it('makes survivors flee when the alpha dies', () => {
    const store = creatingWildlifeInstanceStore();
    const alpha = {
      ...buildingPackWolf(0, 1.4),
      isDead: true,
      diedAtMs: 5_000,
    };
    const beta = buildingPackWolf(1, -0.4);
    const gamma = buildingPackWolf(2, 0.2);

    replacingWildlifeInstance(store, alpha);
    replacingWildlifeInstance(store, beta);
    replacingWildlifeInstance(store, gamma);

    const scattered = applyingWildlifePackAlphaDeathScatter({
      store,
      deadInstance: alpha,
      species: DEFINING_WILDLIFE_SPECIES_REGISTRY['grey-wolf'],
      threatPoint: { x: 10, y: 7.5, layer: 1 },
      hazardSampling: { placedBlocks: [], isDaytime: true },
      resolveSpecies: (speciesId) =>
        DEFINING_WILDLIFE_SPECIES_REGISTRY[speciesId] ?? null,
      nowMs: 5_000,
    });

    expect(scattered).toBe(true);

    const survivors = listingWildlifeInstances(store).filter(
      (instance) => !instance.isDead
    );

    expect(survivors).toHaveLength(2);
    const fleeTargets = new Set<string>();
    for (const survivor of survivors) {
      expect(survivor.aggroState.activeTargetId).toBeNull();
      expect(survivor.aggroState.stalkPhase).toBe('fleeing');
      expect(survivor.aiState.intent.mode).toBe('flee');
      expect(survivor.packAlphaInstanceId).toBeNull();
      expect(survivor.packAlphaDeathScatterUntilMs).toBe(
        5_000 + DEFINING_WILDLIFE_PACK_ALPHA_DEATH_REGROUP_DURATION_MS
      );
      if (
        survivor.aiState.intent.mode === 'flee' &&
        survivor.aiState.intent.targetPoint
      ) {
        fleeTargets.add(
          `${survivor.aiState.intent.targetPoint.x},${survivor.aiState.intent.targetPoint.y}`
        );
      }
    }
    expect(fleeTargets.size).toBe(1);
  });

  it('does nothing when a smaller packmate dies', () => {
    const store = creatingWildlifeInstanceStore();
    const alpha = buildingPackWolf(0, 1.4);
    const beta = {
      ...buildingPackWolf(1, -0.4),
      isDead: true,
      diedAtMs: 5_000,
    };

    replacingWildlifeInstance(store, alpha);
    replacingWildlifeInstance(store, beta);

    const scattered = applyingWildlifePackAlphaDeathScatter({
      store,
      deadInstance: beta,
      species: DEFINING_WILDLIFE_SPECIES_REGISTRY['grey-wolf'],
      threatPoint: { x: 10, y: 7.5, layer: 1 },
      hazardSampling: { placedBlocks: [], isDaytime: true },
      resolveSpecies: (speciesId) =>
        DEFINING_WILDLIFE_SPECIES_REGISTRY[speciesId] ?? null,
      nowMs: 5_000,
    });

    expect(scattered).toBe(false);
    expect(alpha.aggroState.activeTargetId).toBe('player-1');
  });

  it('makes monkey survivors flee when any troop member dies', () => {
    const store = creatingWildlifeInstanceStore();
    const deadMonkey = {
      ...creatingWildlifeTestInstance({
        instanceId: 'wildlife:4:7:0',
        speciesId: 'monkey',
        anchorId: 'wildlife:4:7:0',
        sizeScaleSample: -0.4,
        spawnAnchor: { x: 4.5, y: 7.5, layer: 1 },
        position: { x: 4.5, y: 7.5, layer: 1 },
      }),
      isDead: true,
      diedAtMs: 5_000,
    };
    const survivorA = creatingWildlifeTestInstance({
      instanceId: 'wildlife:4:7:1',
      speciesId: 'monkey',
      anchorId: 'wildlife:4:7:1',
      sizeScaleSample: 1.2,
      spawnAnchor: { x: 4.5, y: 7.5, layer: 1 },
      position: { x: 5.5, y: 7.5, layer: 1 },
    });
    const survivorB = creatingWildlifeTestInstance({
      instanceId: 'wildlife:4:7:2',
      speciesId: 'monkey',
      anchorId: 'wildlife:4:7:2',
      sizeScaleSample: 0.2,
      spawnAnchor: { x: 4.5, y: 7.5, layer: 1 },
      position: { x: 6.5, y: 7.5, layer: 1 },
    });

    replacingWildlifeInstance(store, deadMonkey);
    replacingWildlifeInstance(store, survivorA);
    replacingWildlifeInstance(store, survivorB);

    const scattered = applyingWildlifePackAlphaDeathScatter({
      store,
      deadInstance: deadMonkey,
      species: DEFINING_WILDLIFE_SPECIES_REGISTRY.monkey,
      threatPoint: { x: 10, y: 7.5, layer: 1 },
      hazardSampling: { placedBlocks: [], isDaytime: true },
      resolveSpecies: (speciesId) =>
        DEFINING_WILDLIFE_SPECIES_REGISTRY[speciesId] ?? null,
      nowMs: 5_000,
    });

    expect(scattered).toBe(true);

    const survivors = listingWildlifeInstances(store).filter(
      (instance) => !instance.isDead
    );

    expect(survivors).toHaveLength(2);
    for (const survivor of survivors) {
      expect(survivor.aiState.intent.mode).toBe('flee');
      expect(survivor.packAlphaDeathScatterUntilMs).toBe(
        5_000 + DEFINING_WILDLIFE_PACK_ALPHA_DEATH_REGROUP_DURATION_MS
      );
    }
  });
});

describe('listingWildlifeSpawnPackmates', () => {
  it('groups same-tile spawn anchors into one pack', () => {
    const instances = [
      buildingPackWolf(0, 0),
      buildingPackWolf(1, 0),
      creatingWildlifeTestInstance({
        instanceId: 'wildlife:9:9:0',
        anchorId: 'wildlife:9:9:0',
      }),
    ];

    expect(
      listingWildlifeSpawnPackmates({
        instance: instances[0],
        instances,
      })
    ).toHaveLength(2);
  });
});
