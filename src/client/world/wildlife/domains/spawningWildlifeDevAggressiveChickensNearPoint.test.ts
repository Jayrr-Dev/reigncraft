import type { DefiningWorldPlazaWorldPoint } from '@/components/world/domains/definingWorldPlazaScreenPointToWorldPoint';
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

    const spawnedCount = spawningWildlifeDevAggressiveChickensNearPoint(
      store,
      center,
      2,
      42_000
    );

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
  });
});
