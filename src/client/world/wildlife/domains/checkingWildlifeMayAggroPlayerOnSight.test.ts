import { checkingWildlifeMayAggroPlayerOnSight } from '@/components/world/wildlife/domains/checkingWildlifeMayAggroPlayerOnSight';
import { DEFINING_WILDLIFE_SPECIES_REGISTRY } from '@/components/world/wildlife/domains/definingWildlifeSpeciesRegistry';
import { describe, expect, it } from 'vitest';

describe('checkingWildlifeMayAggroPlayerOnSight', () => {
  it('blocks aggressive passive farm herbivores from on-sight combat', () => {
    const cow = DEFINING_WILDLIFE_SPECIES_REGISTRY.cow;

    expect(
      checkingWildlifeMayAggroPlayerOnSight(cow, 'aggressive', 'sated')
    ).toBe(false);
  });

  it('allows aggressive chickens to aggro on sight', () => {
    const chicken = DEFINING_WILDLIFE_SPECIES_REGISTRY.chicken;

    expect(
      checkingWildlifeMayAggroPlayerOnSight(chicken, 'aggressive', 'sated')
    ).toBe(true);
  });

  it('allows aggressive predators to aggro on sight', () => {
    const wolf = DEFINING_WILDLIFE_SPECIES_REGISTRY['grey-wolf'];

    expect(
      checkingWildlifeMayAggroPlayerOnSight(wolf, 'aggressive', 'sated')
    ).toBe(true);
  });
});
