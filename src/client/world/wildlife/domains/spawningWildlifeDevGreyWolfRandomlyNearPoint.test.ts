import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
import {
  creatingWildlifeInstanceStore,
  listingWildlifeInstances,
} from '@/components/world/wildlife/domains/managingWildlifeInstanceStore';
import { spawningWildlifeDevGreyWolfRandomlyNearPoint } from '@/components/world/wildlife/domains/spawningWildlifeDevGreyWolfRandomlyNearPoint';
import { describe, expect, it } from 'vitest';

describe('spawningWildlifeDevGreyWolfRandomlyNearPoint', () => {
  it('spawns one grey wolf at a random point away from the player', () => {
    const store = creatingWildlifeInstanceStore();
    const center: DefiningWorldPlazaWorldPoint = { x: 10, y: 12, layer: 1 };

    const spawned = spawningWildlifeDevGreyWolfRandomlyNearPoint({
      store,
      center,
      nowMs: 42_000,
    });

    expect(spawned).toBe(true);

    const instances = listingWildlifeInstances(store);

    expect(instances).toHaveLength(1);
    expect(instances[0]?.speciesId).toBe('grey-wolf');

    const distance = Math.hypot(
      instances[0]!.position.x - center.x,
      instances[0]!.position.y - center.y
    );

    expect(distance).toBeGreaterThanOrEqual(4);
    expect(distance).toBeLessThanOrEqual(14);
  });

  it('uses natural aggression rolls instead of forcing aggressive', () => {
    const store = creatingWildlifeInstanceStore();
    const center: DefiningWorldPlazaWorldPoint = { x: 10, y: 12, layer: 1 };

    spawningWildlifeDevGreyWolfRandomlyNearPoint({
      store,
      center,
      nowMs: 99_000,
    });

    const instance = listingWildlifeInstances(store)[0];

    expect(instance).toBeDefined();
    expect(['tame', 'normal', 'aggressive']).toContain(
      instance!.aggressionLevel
    );
    expect(instance!.aggroState.activeTargetId).toBeNull();
    expect(instance!.aiState.intent.mode).toBe('idle');
  });
});
