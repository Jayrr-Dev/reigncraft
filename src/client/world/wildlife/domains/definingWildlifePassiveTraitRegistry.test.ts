import { checkingWildlifeSpeciesHasPassiveTrait } from '@/components/world/wildlife/domains/checkingWildlifeSpeciesHasPassiveTrait';
import {
  DEFINING_WILDLIFE_PASSIVE_TRAIT_REGISTRY,
  listingWildlifePassiveTraitIds,
} from '@/components/world/wildlife/domains/definingWildlifePassiveTraitRegistry';
import { resolvingWildlifeSpeciesDefinition } from '@/components/world/wildlife/domains/definingWildlifeSpeciesRegistry';
import { describe, expect, it } from 'vitest';

describe('definingWildlifePassiveTraitRegistry', () => {
  it('lists every registered trait id', () => {
    expect(listingWildlifePassiveTraitIds()).toEqual(
      expect.arrayContaining([
        'adrenaline-rush',
        'immortal',
        'never-triggers-wildlife-aggro',
      ])
    );
  });

  it('opts grey wolves into adrenaline rush via passiveTraitIds', () => {
    const wolf = resolvingWildlifeSpeciesDefinition('grey-wolf');

    expect(wolf).not.toBeNull();
    expect(
      checkingWildlifeSpeciesHasPassiveTrait(wolf!, 'adrenaline-rush')
    ).toBe(true);
    expect(
      DEFINING_WILDLIFE_PASSIVE_TRAIT_REGISTRY['adrenaline-rush'].displayName
    ).toBe('Adrenaline Rush');
  });

  it('opts fairies into unnoticed and immortal via passiveTraitIds', () => {
    const fairy = resolvingWildlifeSpeciesDefinition('fairy');

    expect(fairy).not.toBeNull();
    expect(
      checkingWildlifeSpeciesHasPassiveTrait(
        fairy!,
        'never-triggers-wildlife-aggro'
      )
    ).toBe(true);
    expect(checkingWildlifeSpeciesHasPassiveTrait(fairy!, 'immortal')).toBe(
      true
    );
    expect(DEFINING_WILDLIFE_PASSIVE_TRAIT_REGISTRY.immortal.displayName).toBe(
      'Immortal'
    );
  });
});
