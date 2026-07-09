import { applyingWildlifeDefendYoungDamageResponse } from '@/components/world/wildlife/domains/applyingWildlifeDefendYoungDamageResponse';
import { checkingWildlifeInstanceIsDefendYoungVictim } from '@/components/world/wildlife/domains/checkingWildlifeInstanceIsDefendYoungVictim';
import { checkingWildlifeInstanceMayDefendYoung } from '@/components/world/wildlife/domains/checkingWildlifeInstanceMayDefendYoung';
import { creatingWildlifeTestInstance } from '@/components/world/wildlife/domains/creatingWildlifeTestFixtures';
import { DEFINING_WILDLIFE_SPECIES_REGISTRY } from '@/components/world/wildlife/domains/definingWildlifeSpeciesRegistry';
import {
  creatingWildlifeInstanceStore,
  listingWildlifeInstances,
  replacingWildlifeInstance,
} from '@/components/world/wildlife/domains/managingWildlifeInstanceStore';
import { describe, expect, it } from 'vitest';

function buildingSheep(
  packIndex: number,
  sizeScaleSample: number,
  instanceId = `wildlife:4:7:${packIndex}`
) {
  return creatingWildlifeTestInstance({
    instanceId,
    speciesId: 'sheep',
    anchorId: instanceId,
    sizeScaleSample,
    spawnAnchor: { x: 4.5, y: 7.5, layer: 1 },
    position: { x: 4.5 + packIndex, y: 7.5, layer: 1 },
  });
}

describe('checkingWildlifeInstanceIsDefendYoungVictim', () => {
  it('returns true for baby sheep (σ tier −2)', () => {
    const baby = buildingSheep(0, -2);
    expect(
      checkingWildlifeInstanceIsDefendYoungVictim(
        baby,
        DEFINING_WILDLIFE_SPECIES_REGISTRY.sheep
      )
    ).toBe(true);
  });

  it('returns false for adult sheep', () => {
    const adult = buildingSheep(0, 0);
    expect(
      checkingWildlifeInstanceIsDefendYoungVictim(
        adult,
        DEFINING_WILDLIFE_SPECIES_REGISTRY.sheep
      )
    ).toBe(false);
  });
});

describe('checkingWildlifeInstanceMayDefendYoung', () => {
  it('allows adults of the same species', () => {
    const baby = buildingSheep(0, -2);
    const adult = buildingSheep(1, 0);

    expect(
      checkingWildlifeInstanceMayDefendYoung({
        instance: adult,
        species: DEFINING_WILDLIFE_SPECIES_REGISTRY.sheep,
        victimInstanceId: baby.instanceId,
        victimSpeciesId: baby.speciesId,
      })
    ).toBe(true);
  });

  it('rejects young (−1) and babies', () => {
    const baby = buildingSheep(0, -2);
    const young = buildingSheep(1, -1);

    expect(
      checkingWildlifeInstanceMayDefendYoung({
        instance: young,
        species: DEFINING_WILDLIFE_SPECIES_REGISTRY.sheep,
        victimInstanceId: baby.instanceId,
        victimSpeciesId: baby.speciesId,
      })
    ).toBe(false);
  });
});

describe('applyingWildlifeDefendYoungDamageResponse', () => {
  it('makes nearby adults aggro the attacker when a baby is hurt', () => {
    const store = creatingWildlifeInstanceStore();
    const baby = buildingSheep(0, -2);
    const adultA = buildingSheep(1, 0);
    const adultB = buildingSheep(2, 1);
    const young = buildingSheep(3, -1);
    const farAdult = creatingWildlifeTestInstance({
      instanceId: 'wildlife:20:20:0',
      speciesId: 'sheep',
      anchorId: 'wildlife:20:20:0',
      sizeScaleSample: 0,
      spawnAnchor: { x: 20.5, y: 20.5, layer: 1 },
      position: { x: 20.5, y: 20.5, layer: 1 },
    });

    replacingWildlifeInstance(store, baby);
    replacingWildlifeInstance(store, adultA);
    replacingWildlifeInstance(store, adultB);
    replacingWildlifeInstance(store, young);
    replacingWildlifeInstance(store, farAdult);

    const affectedCount = applyingWildlifeDefendYoungDamageResponse({
      store,
      damagedInstance: baby,
      species: DEFINING_WILDLIFE_SPECIES_REGISTRY.sheep,
      attackerTargetId: 'player-1',
      sharedThreat: 4,
      nowMs: 1_000,
      resolveSpecies: (speciesId) =>
        DEFINING_WILDLIFE_SPECIES_REGISTRY[speciesId] ?? null,
    });

    expect(affectedCount).toBe(2);

    const updated = listingWildlifeInstances(store);
    const updatedAdultA = updated.find(
      (entry) => entry.instanceId === adultA.instanceId
    )!;
    const updatedAdultB = updated.find(
      (entry) => entry.instanceId === adultB.instanceId
    )!;
    const updatedYoung = updated.find(
      (entry) => entry.instanceId === young.instanceId
    )!;
    const updatedFar = updated.find(
      (entry) => entry.instanceId === farAdult.instanceId
    )!;

    expect(updatedAdultA.aggroState.activeTargetId).toBe('player-1');
    expect(updatedAdultA.aggroState.defendingYoungUntilMs).toBe(1_000);
    expect(updatedAdultB.aggroState.activeTargetId).toBe('player-1');
    expect(updatedYoung.aggroState.activeTargetId).toBeNull();
    expect(updatedFar.aggroState.activeTargetId).toBeNull();
  });

  it('ignores other species nearby', () => {
    const store = creatingWildlifeInstanceStore();
    const baby = buildingSheep(0, -2);
    const cow = creatingWildlifeTestInstance({
      instanceId: 'wildlife:4:7:1',
      speciesId: 'cow',
      anchorId: 'wildlife:4:7:1',
      sizeScaleSample: 0,
      spawnAnchor: { x: 5.5, y: 7.5, layer: 1 },
      position: { x: 5.5, y: 7.5, layer: 1 },
    });

    replacingWildlifeInstance(store, baby);
    replacingWildlifeInstance(store, cow);

    const affectedCount = applyingWildlifeDefendYoungDamageResponse({
      store,
      damagedInstance: baby,
      species: DEFINING_WILDLIFE_SPECIES_REGISTRY.sheep,
      attackerTargetId: 'player-1',
      sharedThreat: 4,
      nowMs: 1_000,
      resolveSpecies: (speciesId) =>
        DEFINING_WILDLIFE_SPECIES_REGISTRY[speciesId] ?? null,
    });

    expect(affectedCount).toBe(0);
    expect(
      listingWildlifeInstances(store).find(
        (entry) => entry.instanceId === cow.instanceId
      )?.aggroState.activeTargetId
    ).toBeNull();
  });
});
