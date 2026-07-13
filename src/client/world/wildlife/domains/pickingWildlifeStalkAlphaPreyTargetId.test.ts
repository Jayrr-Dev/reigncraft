import { creatingWildlifeTestInstance } from '@/components/world/wildlife/domains/creatingWildlifeTestFixtures';
import { checkingWildlifePredatorMayHuntPrey } from '@/components/world/wildlife/domains/definingWildlifeFoodChain';
import { DEFINING_WILDLIFE_SPECIES_REGISTRY } from '@/components/world/wildlife/domains/definingWildlifeSpeciesRegistry';
import { listingWildlifePackHunterPreyTargetCandidates } from '@/components/world/wildlife/domains/listingWildlifePackHunterPreyTargetCandidates';
import { pickingWildlifeStalkAlphaPreyTargetId } from '@/components/world/wildlife/domains/pickingWildlifeStalkAlphaPreyTargetId';
import { resolvingWildlifeStalkPreyPickWeight } from '@/components/world/wildlife/domains/resolvingWildlifeStalkPreyPickWeight';
import { describe, expect, it } from 'vitest';

describe('resolvingWildlifeStalkPreyPickWeight', () => {
  it('favors smaller mass over larger mass', () => {
    expect(resolvingWildlifeStalkPreyPickWeight({ massKg: 3 })).toBeGreaterThan(
      resolvingWildlifeStalkPreyPickWeight({ massKg: 450 })
    );
  });

  it('boosts favorite prey above the same mass alone', () => {
    expect(
      resolvingWildlifeStalkPreyPickWeight({
        massKg: 60,
        isFavoritePrey: true,
      })
    ).toBeGreaterThan(
      resolvingWildlifeStalkPreyPickWeight({
        massKg: 60,
        isFavoritePrey: false,
      })
    );
  });
});

describe('pickingWildlifeStalkAlphaPreyTargetId', () => {
  it('returns one of the listed candidates', () => {
    const candidates = [
      { targetId: 'deer-1', massKg: 90, isFavoritePrey: false },
      { targetId: 'boar-1', massKg: 80, isFavoritePrey: false },
      { targetId: 'player-1', massKg: 70, isFavoritePrey: false },
    ];
    const picked = pickingWildlifeStalkAlphaPreyTargetId(
      'wildlife:1:1:0',
      candidates,
      30_000
    );

    expect(candidates.map((candidate) => candidate.targetId)).toContain(picked);
  });

  it('prefers the lighter candidate across many pick buckets', () => {
    const candidates = [
      { targetId: 'chicken-1', massKg: 3, isFavoritePrey: false },
      { targetId: 'cow-1', massKg: 450, isFavoritePrey: false },
    ];
    let chickenPicks = 0;
    let cowPicks = 0;

    for (let bucket = 0; bucket < 200; bucket += 1) {
      const picked = pickingWildlifeStalkAlphaPreyTargetId(
        'wildlife:1:1:0',
        candidates,
        bucket * 15_000
      );

      if (picked === 'chicken-1') {
        chickenPicks += 1;
      } else if (picked === 'cow-1') {
        cowPicks += 1;
      }
    }

    expect(chickenPicks).toBeGreaterThan(cowPicks);
    expect(chickenPicks + cowPicks).toBe(200);
  });
});

describe('listingWildlifePackHunterPreyTargetCandidates', () => {
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

    const candidates = listingWildlifePackHunterPreyTargetCandidates({
      instance,
      species,
      nearbyInstances: [boar, rivalWolf],
      playerPosition: null,
      playerUserId: null,
      resolveSpecies: (speciesId) =>
        DEFINING_WILDLIFE_SPECIES_REGISTRY[speciesId] ?? null,
    });

    expect(
      candidates.some((candidate) => candidate.targetId === boar.instanceId)
    ).toBe(true);
    expect(
      candidates.some(
        (candidate) => candidate.targetId === rivalWolf.instanceId
      )
    ).toBe(false);
    expect(
      checkingWildlifePredatorMayHuntPrey(
        species,
        DEFINING_WILDLIFE_SPECIES_REGISTRY.boar
      )
    ).toBe(true);
  });

  it('attaches species mass and favorite flag to candidates', () => {
    const species = DEFINING_WILDLIFE_SPECIES_REGISTRY['grey-wolf'];
    const instance = creatingWildlifeTestInstance({
      position: { x: 1, y: 1, layer: 1 },
      hungerState: {
        hungerRatio: 0.2,
        driveLevel: 'hungry',
        lastFedAtMs: null,
      },
    });
    const sheep = creatingWildlifeTestInstance({
      instanceId: 'wildlife:sheep:1',
      speciesId: 'sheep',
      position: { x: 3, y: 1, layer: 1 },
      sizeScaleSample: 1,
    });

    const candidates = listingWildlifePackHunterPreyTargetCandidates({
      instance,
      species,
      nearbyInstances: [sheep],
      playerPosition: null,
      playerUserId: null,
      resolveSpecies: (speciesId) =>
        DEFINING_WILDLIFE_SPECIES_REGISTRY[speciesId] ?? null,
    });

    expect(candidates).toEqual([
      {
        targetId: sheep.instanceId,
        massKg: 60,
        isFavoritePrey: true,
      },
    ]);
  });
});
