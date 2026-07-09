import { checkingWildlifeMayMeleeWildlifeTarget } from '@/components/world/wildlife/domains/checkingWildlifeMayMeleeWildlifeTarget';
import { DEFINING_WILDLIFE_SPECIES_REGISTRY } from '@/components/world/wildlife/domains/definingWildlifeSpeciesRegistry';
import { describe, expect, it } from 'vitest';

describe('checkingWildlifeMayMeleeWildlifeTarget', () => {
  it('allows retaliators to melee an active threat they cannot hunt', () => {
    expect(
      checkingWildlifeMayMeleeWildlifeTarget({
        attackerSpecies: DEFINING_WILDLIFE_SPECIES_REGISTRY.boar,
        targetSpecies: DEFINING_WILDLIFE_SPECIES_REGISTRY.lion,
        targetInstanceId: 'wildlife:lion:1',
        activeTargetId: 'wildlife:lion:1',
      })
    ).toBe(true);
  });

  it('blocks opportunistic melee on higher-tier prey without aggro', () => {
    expect(
      checkingWildlifeMayMeleeWildlifeTarget({
        attackerSpecies: DEFINING_WILDLIFE_SPECIES_REGISTRY.boar,
        targetSpecies: DEFINING_WILDLIFE_SPECIES_REGISTRY.lion,
        targetInstanceId: 'wildlife:lion:1',
        activeTargetId: null,
      })
    ).toBe(false);
  });

  it('allows predators to melee huntable prey without prior aggro', () => {
    expect(
      checkingWildlifeMayMeleeWildlifeTarget({
        attackerSpecies: DEFINING_WILDLIFE_SPECIES_REGISTRY.lion,
        targetSpecies: DEFINING_WILDLIFE_SPECIES_REGISTRY.boar,
        targetInstanceId: 'wildlife:boar:1',
        activeTargetId: null,
      })
    ).toBe(true);
  });
});
