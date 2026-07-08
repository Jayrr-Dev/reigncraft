import { applyingWildlifeHerbivoreHerdFleeResponse } from '@/components/world/wildlife/domains/applyingWildlifeHerbivoreHerdFleeResponse';
import { creatingWildlifeTestInstance } from '@/components/world/wildlife/domains/creatingWildlifeTestFixtures';
import { DEFINING_WILDLIFE_SPECIES_REGISTRY } from '@/components/world/wildlife/domains/definingWildlifeSpeciesRegistry';
import {
  creatingWildlifeInstanceStore,
  listingWildlifeInstances,
  replacingWildlifeInstance,
} from '@/components/world/wildlife/domains/managingWildlifeInstanceStore';
import { describe, expect, it } from 'vitest';

function buildingSheep(
  packIndex: number,
  instanceId = `wildlife:4:7:${packIndex}`
) {
  return creatingWildlifeTestInstance({
    instanceId,
    speciesId: 'sheep',
    anchorId: instanceId,
    spawnAnchor: { x: 4.5, y: 7.5, layer: 1 },
    position: { x: 4.5 + packIndex, y: 7.5, layer: 1 },
  });
}

function resolvingFleeHeading(instance: ReturnType<typeof buildingSheep>) {
  const targetPoint = instance.aiState.intent.targetPoint;

  if (!targetPoint || instance.aiState.intent.mode !== 'flee') {
    return null;
  }

  const deltaX = targetPoint.x - instance.position.x;
  const deltaY = targetPoint.y - instance.position.y;
  const length = Math.hypot(deltaX, deltaY);

  if (length <= 0) {
    return null;
  }

  return {
    x: deltaX / length,
    y: deltaY / length,
  };
}

describe('applyingWildlifeHerbivoreHerdFleeResponse', () => {
  it('makes nearby sheep flee in roughly the same direction when one is attacked', () => {
    const store = creatingWildlifeInstanceStore();
    const victim = buildingSheep(0);
    const nearbyA = buildingSheep(1);
    const nearbyB = buildingSheep(2);
    const farSheep = creatingWildlifeTestInstance({
      instanceId: 'wildlife:20:20:0',
      speciesId: 'sheep',
      anchorId: 'wildlife:20:20:0',
      spawnAnchor: { x: 20.5, y: 20.5, layer: 1 },
      position: { x: 20.5, y: 20.5, layer: 1 },
    });

    replacingWildlifeInstance(store, victim);
    replacingWildlifeInstance(store, nearbyA);
    replacingWildlifeInstance(store, nearbyB);
    replacingWildlifeInstance(store, farSheep);

    const affectedCount = applyingWildlifeHerbivoreHerdFleeResponse({
      store,
      damagedInstance: victim,
      species: DEFINING_WILDLIFE_SPECIES_REGISTRY.sheep,
      attackerTargetId: 'player-1',
      threatPoint: { x: 10, y: 7.5, layer: 1 },
      hazardSampling: { placedBlocks: [], isDaytime: true },
      sharedThreat: 4,
      nowMs: 1_000,
      resolveSpecies: (speciesId) =>
        DEFINING_WILDLIFE_SPECIES_REGISTRY[speciesId] ?? null,
    });

    expect(affectedCount).toBe(3);

    const updatedNearby = listingWildlifeInstances(store).filter(
      (instance) => instance.instanceId !== farSheep.instanceId
    );
    const headings = updatedNearby
      .map((instance) => resolvingFleeHeading(instance))
      .filter((heading) => heading !== null);

    expect(headings).toHaveLength(3);

    for (const instance of updatedNearby) {
      expect(instance.aiState.intent.mode).toBe('flee');
      expect(instance.aiState.fleeTargetPoint).not.toBeNull();
      expect(instance.aggroState.activeTargetId).toBe('player-1');
    }

    const referenceHeading = headings[0]!;

    for (const heading of headings.slice(1)) {
      const alignment =
        heading!.x * referenceHeading.x + heading!.y * referenceHeading.y;

      expect(alignment).toBeGreaterThan(0.75);
      expect(alignment).toBeLessThan(1);
    }
  });

  it('does not pull in sheep outside the herd radius', () => {
    const store = creatingWildlifeInstanceStore();
    const victim = buildingSheep(0);
    const farSheep = creatingWildlifeTestInstance({
      instanceId: 'wildlife:20:20:0',
      speciesId: 'sheep',
      anchorId: 'wildlife:20:20:0',
      spawnAnchor: { x: 20.5, y: 20.5, layer: 1 },
      position: { x: 20.5, y: 20.5, layer: 1 },
    });

    replacingWildlifeInstance(store, victim);
    replacingWildlifeInstance(store, farSheep);

    const affectedCount = applyingWildlifeHerbivoreHerdFleeResponse({
      store,
      damagedInstance: victim,
      species: DEFINING_WILDLIFE_SPECIES_REGISTRY.sheep,
      attackerTargetId: 'player-1',
      threatPoint: { x: 10, y: 7.5, layer: 1 },
      hazardSampling: { placedBlocks: [], isDaytime: true },
      sharedThreat: 4,
      nowMs: 1_000,
      resolveSpecies: (speciesId) =>
        DEFINING_WILDLIFE_SPECIES_REGISTRY[speciesId] ?? null,
    });

    expect(affectedCount).toBe(1);
    expect(store.instances.get(farSheep.instanceId)?.aiState.intent.mode).toBe(
      'idle'
    );
  });
});
