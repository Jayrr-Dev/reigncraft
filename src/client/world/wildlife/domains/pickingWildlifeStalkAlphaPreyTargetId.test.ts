import { creatingWildlifeTestInstance } from '@/components/world/wildlife/domains/creatingWildlifeTestFixtures';
import { checkingWildlifePredatorMayHuntPrey } from '@/components/world/wildlife/domains/definingWildlifeFoodChain';
import { DEFINING_WILDLIFE_SPECIES_REGISTRY } from '@/components/world/wildlife/domains/definingWildlifeSpeciesRegistry';
import { listingWildlifeStalkerPreyTargetCandidates } from '@/components/world/wildlife/domains/listingWildlifeStalkerPreyTargetCandidates';
import { pickingWildlifeStalkAlphaPreyTargetId } from '@/components/world/wildlife/domains/pickingWildlifeStalkAlphaPreyTargetId';
import { describe, expect, it } from 'vitest';

describe('pickingWildlifeStalkAlphaPreyTargetId', () => {
  it('returns one of the listed candidates', () => {
    const candidates = ['deer-1', 'boar-1', 'player-1'];
    const picked = pickingWildlifeStalkAlphaPreyTargetId(
      'wildlife:1:1:0',
      candidates,
      30_000
    );

    expect(candidates).toContain(picked);
  });
});

describe('listingWildlifeStalkerPreyTargetCandidates', () => {
  it('includes boar and excludes rival wolves', () => {
    const species = DEFINING_WILDLIFE_SPECIES_REGISTRY['grey-wolf'];
    const instance = creatingWildlifeTestInstance({
      position: { x: 1, y: 1, layer: 1 },
      hungerState: {
        hungerRatio: 0.2,
        driveLevel: 'hungry',
        lastFedAtMs: null,
      },
    });
    const boar = creatingWildlifeTestInstance({
      instanceId: 'wildlife:2:2:0',
      speciesId: 'boar',
      position: { x: 4, y: 1, layer: 1 },
    });
    const rivalWolf = creatingWildlifeTestInstance({
      instanceId: 'wildlife:3:3:0',
      anchorId: 'wildlife:3:3:0',
      position: { x: 5, y: 1, layer: 1 },
    });

    const candidates = listingWildlifeStalkerPreyTargetCandidates({
      instance,
      species,
      nearbyInstances: [boar, rivalWolf],
      playerPosition: null,
      playerUserId: null,
      resolveSpecies: (speciesId) =>
        DEFINING_WILDLIFE_SPECIES_REGISTRY[speciesId] ?? null,
    });

    expect(candidates).toContain(boar.instanceId);
    expect(candidates).not.toContain(rivalWolf.instanceId);
    expect(
      checkingWildlifePredatorMayHuntPrey(
        species,
        DEFINING_WILDLIFE_SPECIES_REGISTRY.boar
      )
    ).toBe(true);
  });
});
