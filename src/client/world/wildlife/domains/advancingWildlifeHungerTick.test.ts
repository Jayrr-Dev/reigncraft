import { advancingWildlifeHungerTick } from '@/components/world/wildlife/domains/advancingWildlifeHungerTick';
import { DEFINING_WILDLIFE_SPECIES_REGISTRY } from '@/components/world/wildlife/domains/definingWildlifeSpeciesRegistry';
import { describe, expect, it } from 'vitest';

describe('advancingWildlifeHungerTick', () => {
  it('transitions from sated to peckish as hunger drains', () => {
    const species = DEFINING_WILDLIFE_SPECIES_REGISTRY.cow;
    const result = advancingWildlifeHungerTick({
      state: { hungerRatio: 0.72, driveLevel: 'sated', lastFedAtMs: null },
      species,
      deltaSeconds: 60,
      isGrazing: false,
      nowMs: 1000,
    });

    expect(result.state.driveLevel).toBe('peckish');
  });

  it('refills hunger while grazing for herbivores', () => {
    const species = DEFINING_WILDLIFE_SPECIES_REGISTRY.sheep;
    const result = advancingWildlifeHungerTick({
      state: { hungerRatio: 0.5, driveLevel: 'hungry', lastFedAtMs: null },
      species,
      deltaSeconds: 5,
      isGrazing: true,
      nowMs: 2000,
    });

    expect(result.state.hungerRatio).toBeGreaterThan(0.5);
  });
});
