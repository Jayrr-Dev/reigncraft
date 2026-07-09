import { checkingWildlifeSpeciesIsNightOnlySpawn } from '@/components/world/wildlife/domains/checkingWildlifeSpeciesIsNightOnlySpawn';
import { creatingWildlifeTestInstance } from '@/components/world/wildlife/domains/creatingWildlifeTestFixtures';
import { DEFINING_WILDLIFE_CORPSE_LIFETIME_MS } from '@/components/world/wildlife/domains/definingWildlifeDeathConstants';
import { advancingWildlifeCorpseLifecycle } from '@/components/world/wildlife/domains/advancingWildlifeCorpseLifecycle';
import { advancingWildlifePendingRespawns } from '@/components/world/wildlife/domains/advancingWildlifePendingRespawns';
import { despawningWildlifeNightOnlyInstancesDuringDaytime } from '@/components/world/wildlife/domains/despawningWildlifeNightOnlyInstancesDuringDaytime';
import {
  creatingWildlifeInstanceStore,
  queueingWildlifePendingRespawnFromDeadInstance,
} from '@/components/world/wildlife/domains/managingWildlifeInstanceStore';
import { resolvingWildlifeSpeciesDefinition } from '@/components/world/wildlife/domains/definingWildlifeSpeciesRegistry';
import { describe, expect, it } from 'vitest';

describe('night-only wildlife spawn lifecycle', () => {
  it('marks omega-wolf as night-only and grey-wolf as not', () => {
    expect(checkingWildlifeSpeciesIsNightOnlySpawn('omega-wolf')).toBe(true);
    expect(checkingWildlifeSpeciesIsNightOnlySpawn('grey-wolf')).toBe(false);
  });

  it('does not queue pending respawn for a dead omega wolf', () => {
    const store = creatingWildlifeInstanceStore();
    const omega = creatingWildlifeTestInstance({
      instanceId: 'wildlife:48:60:0',
      anchorId: 'wildlife:48:60:0',
      speciesId: 'omega-wolf',
      isDead: true,
      diedAtMs: 1_000,
      position: { x: 48.5, y: 60.5, layer: 1 },
    });

    queueingWildlifePendingRespawnFromDeadInstance(store, omega);

    expect(store.pendingRespawns.has(omega.anchorId)).toBe(false);
    expect(store.knownAnchorIds.has(omega.anchorId)).toBe(true);
  });

  it('still queues pending respawn for grey wolf', () => {
    const store = creatingWildlifeInstanceStore();
    const wolf = creatingWildlifeTestInstance({
      instanceId: 'wildlife:48:60:1',
      anchorId: 'wildlife:48:60:1',
      speciesId: 'grey-wolf',
      isDead: true,
      diedAtMs: 1_000,
      position: { x: 48.5, y: 60.5, layer: 1 },
    });

    queueingWildlifePendingRespawnFromDeadInstance(store, wolf);

    expect(store.pendingRespawns.has(wolf.anchorId)).toBe(true);
    expect(store.knownAnchorIds.has(wolf.anchorId)).toBe(false);
  });

  it('drops stale night-only pending entries without rematerializing', () => {
    const store = creatingWildlifeInstanceStore();
    store.pendingRespawns.set('wildlife:48:60:0', {
      anchorId: 'wildlife:48:60:0',
      speciesId: 'omega-wolf',
      aggressionLevel: 'aggressive',
      sleepScheduleSample: 0,
      sizeScaleSample: 3,
      largeSizeFrame: 'apex',
      spawnAnchor: { x: 48.5, y: 60.5, layer: 1 },
      thinkScheduleAnchor: {
        anchorId: 'wildlife:48:60:0',
        tileX: 48,
        tileY: 60,
        speciesId: 'omega-wolf',
        packIndex: 0,
        packSize: 5,
        seed: 0.1,
      },
      deathPosition: { x: 10, y: 10, layer: 1 },
      diedAtMs: 1_000,
      placementSeed: 1_000,
    });

    advancingWildlifePendingRespawns({
      store,
      playerCenter: { x: 40, y: 40, layer: 1 },
      resolveSpecies: resolvingWildlifeSpeciesDefinition,
      nowMs: 5_000,
      isDaytime: false,
    });

    expect(store.pendingRespawns.has('wildlife:48:60:0')).toBe(false);
    expect(store.instances.has('wildlife:48:60:0')).toBe(false);
    expect(store.knownAnchorIds.has('wildlife:48:60:0')).toBe(true);
  });

  it('despawns live omega wolves at daytime', () => {
    const store = creatingWildlifeInstanceStore();
    const omega = creatingWildlifeTestInstance({
      instanceId: 'wildlife:48:60:0',
      anchorId: 'wildlife:48:60:0',
      speciesId: 'omega-wolf',
    });
    store.instances.set(omega.instanceId, omega);
    store.knownAnchorIds.add(omega.anchorId);

    despawningWildlifeNightOnlyInstancesDuringDaytime(store, true);

    expect(store.instances.has(omega.instanceId)).toBe(false);
    expect(store.knownAnchorIds.has(omega.anchorId)).toBe(false);
  });

  it('keeps live omega wolves at night', () => {
    const store = creatingWildlifeInstanceStore();
    const omega = creatingWildlifeTestInstance({
      instanceId: 'wildlife:48:60:0',
      anchorId: 'wildlife:48:60:0',
      speciesId: 'omega-wolf',
    });
    store.instances.set(omega.instanceId, omega);
    store.knownAnchorIds.add(omega.anchorId);

    despawningWildlifeNightOnlyInstancesDuringDaytime(store, false);

    expect(store.instances.has(omega.instanceId)).toBe(true);
  });

  it('after corpse expiry, omega stays blocked from pending recycle', () => {
    const store = creatingWildlifeInstanceStore();
    const diedAtMs = 1_000;
    const omega = creatingWildlifeTestInstance({
      instanceId: 'wildlife:48:60:0',
      anchorId: 'wildlife:48:60:0',
      speciesId: 'omega-wolf',
      isDead: true,
      diedAtMs,
      position: { x: 48.5, y: 60.5, layer: 1 },
    });
    store.instances.set(omega.instanceId, omega);

    advancingWildlifeCorpseLifecycle(
      store,
      { x: 48.5, y: 60.5, layer: 1 },
      diedAtMs + DEFINING_WILDLIFE_CORPSE_LIFETIME_MS + 1
    );

    expect(store.instances.has(omega.instanceId)).toBe(false);
    expect(store.pendingRespawns.has(omega.anchorId)).toBe(false);
    expect(store.knownAnchorIds.has(omega.anchorId)).toBe(true);
  });
});
