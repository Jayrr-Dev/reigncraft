import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import { DEFINING_WILDLIFE_AI_THINK_INTERVAL_NEAR_MS } from '@/components/world/wildlife/domains/definingWildlifeAiLodConstants';
import { checkingWildlifeShouldThink } from '@/components/world/wildlife/domains/resolvingWildlifeThinkSchedule';
import { DEFINING_WILDLIFE_SPECIES_REGISTRY } from '@/components/world/wildlife/domains/definingWildlifeSpeciesRegistry';
import {
  creatingWildlifeInstanceStore,
  listingWildlifeInstances,
} from '@/components/world/wildlife/domains/managingWildlifeInstanceStore';
import { spawningWildlifeDevAggressiveChickensNearPoint } from '@/components/world/wildlife/domains/spawningWildlifeDevAggressiveChickensNearPoint';
import { describe, expect, it } from 'vitest';

describe('spawningWildlifeDevAggressiveChickensNearPoint', () => {
  it('spawns aggressive chickens with cucco buffs near the player', () => {
    const store = creatingWildlifeInstanceStore();
    const center: DefiningWorldPlazaWorldPoint = { x: 10, y: 12, layer: 1 };

    const spawnedCount = spawningWildlifeDevAggressiveChickensNearPoint({
      store,
      center,
      count: 2,
      nowMs: 42_000,
      playerUserId: 'player-1',
    });

    expect(spawnedCount).toBe(2);

    const instances = listingWildlifeInstances(store);
    const chickenSpecies = DEFINING_WILDLIFE_SPECIES_REGISTRY.chicken;

    expect(instances).toHaveLength(2);
    expect(
      instances.every((instance) => instance.speciesId === 'chicken')
    ).toBe(true);
    expect(
      instances.every((instance) => instance.aggressionLevel === 'aggressive')
    ).toBe(true);
    expect(instances[0]?.healthState.baseMaxHealth).toBe(
      chickenSpecies.vitals.baseMaxHealth * 10
    );
    expect(instances[0]?.aggroState.activeTargetId).toBe('player-1');
    expect(instances[0]?.aiState.intent.mode).toBe('chase');
  });

  it('uses the Pixi simulation clock so dev chickens can think immediately', () => {
    const store = creatingWildlifeInstanceStore();
    const center: DefiningWorldPlazaWorldPoint = { x: 10, y: 12, layer: 1 };
    const nowMs = 12_500;

    spawningWildlifeDevAggressiveChickensNearPoint({
      store,
      center,
      count: 1,
      nowMs,
      playerUserId: 'player-1',
    });

    const instance = listingWildlifeInstances(store)[0];

    expect(instance).toBeDefined();
    expect(
      checkingWildlifeShouldThink({
        lastThinkAtMs: instance.aiState.lastThinkAtMs,
        position: instance.position,
        playerPosition: center,
        nowMs,
      })
    ).toBe(true);
    expect(instance.aiState.lastThinkAtMs).toBe(
      nowMs - DEFINING_WILDLIFE_AI_THINK_INTERVAL_NEAR_MS
    );
  });
});
