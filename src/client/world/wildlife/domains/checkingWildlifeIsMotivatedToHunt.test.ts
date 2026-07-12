import { describe, expect, it } from 'vitest';

import {
  checkingWildlifeIsMotivatedToForageGroundFood,
  checkingWildlifeIsMotivatedToHunt,
} from '@/components/world/wildlife/domains/checkingWildlifeIsMotivatedToHunt';
import { DEFINING_WILDLIFE_SPECIES_REGISTRY } from '@/components/world/wildlife/domains/definingWildlifeSpeciesRegistry';

describe('checkingWildlifeIsMotivatedToForageGroundFood', () => {
  it('motivates every diet to forage ground food while sated', () => {
    expect(
      checkingWildlifeIsMotivatedToForageGroundFood(
        DEFINING_WILDLIFE_SPECIES_REGISTRY.deer,
        'sated'
      )
    ).toBe(true);
    expect(
      checkingWildlifeIsMotivatedToForageGroundFood(
        DEFINING_WILDLIFE_SPECIES_REGISTRY.boar,
        'sated'
      )
    ).toBe(true);
    expect(
      checkingWildlifeIsMotivatedToForageGroundFood(
        DEFINING_WILDLIFE_SPECIES_REGISTRY.chimp,
        'sated'
      )
    ).toBe(true);
    expect(
      checkingWildlifeIsMotivatedToForageGroundFood(
        DEFINING_WILDLIFE_SPECIES_REGISTRY['grey-wolf'],
        'sated'
      )
    ).toBe(true);
  });
});

describe('checkingWildlifeIsMotivatedToHunt', () => {
  it('lets carnivore chimps hunt when peckish', () => {
    expect(DEFINING_WILDLIFE_SPECIES_REGISTRY.chimp.diet).toBe('carnivore');
    expect(
      checkingWildlifeIsMotivatedToHunt(
        DEFINING_WILDLIFE_SPECIES_REGISTRY.chimp,
        'peckish'
      )
    ).toBe(true);
  });
});
