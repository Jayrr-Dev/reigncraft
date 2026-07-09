import { checkingWildlifeHasSeparationAnxiety } from '@/components/world/wildlife/domains/checkingWildlifeHasSeparationAnxiety';
import { checkingWildlifeInstanceHasSeparationAnxiety } from '@/components/world/wildlife/domains/checkingWildlifeInstanceHasSeparationAnxiety';
import {
  creatingWildlifeTestAiState,
  creatingWildlifeTestInstance,
} from '@/components/world/wildlife/domains/creatingWildlifeTestFixtures';
import type { DefiningWildlifeBehaviorBlackboard } from '@/components/world/wildlife/domains/definingWildlifeBehaviorConditionRegistry';
import { DEFINING_WILDLIFE_SPECIES_REGISTRY } from '@/components/world/wildlife/domains/definingWildlifeSpeciesRegistry';
import { resolvingWildlifeSeparationAnxietyFollowIntent } from '@/components/world/wildlife/domains/resolvingWildlifeSeparationAnxietyFollowIntent';
import { resolvingWildlifeSeparationAnxietyGuardian } from '@/components/world/wildlife/domains/resolvingWildlifeSeparationAnxietyGuardian';
import { describe, expect, it } from 'vitest';

function buildingSheep(
  packIndex: number,
  sizeScaleSample: number,
  positionX = 4.5 + packIndex
) {
  const instanceId = `wildlife:4:7:${packIndex}`;

  return creatingWildlifeTestInstance({
    instanceId,
    speciesId: 'sheep',
    anchorId: instanceId,
    sizeScaleSample,
    spawnAnchor: { x: 4.5, y: 7.5, layer: 1 },
    position: { x: positionX, y: 7.5, layer: 1 },
  });
}

function buildingBlackboard(
  instance: ReturnType<typeof buildingSheep>,
  nearbyInstances: ReturnType<typeof buildingSheep>[]
): DefiningWildlifeBehaviorBlackboard {
  return {
    instance,
    species: DEFINING_WILDLIFE_SPECIES_REGISTRY.sheep,
    nearbyInstances,
    playerPosition: null,
    playerUserId: null,
    isPlayerWalking: false,
    isPlayerRunning: false,
    isPlayerJumping: false,
    nowMs: 1_000,
    hazardSampling: { placedBlocks: [], isDaytime: true },
    selectedPreyInstanceId: null,
    selectedProximityPreyInstanceId: null,
    selectedGroundFoodItemId: null,
    playerHealthRatio: null,
    playerStaminaRatio: null,
    playerStaminaIsDepleted: false,
    playerStillDurationMs: 0,
    resolveSpecies: (speciesId) =>
      DEFINING_WILDLIFE_SPECIES_REGISTRY[speciesId] ?? null,
  };
}

describe('checkingWildlifeInstanceHasSeparationAnxiety', () => {
  it('returns true for young and baby sheep', () => {
    expect(
      checkingWildlifeInstanceHasSeparationAnxiety(
        buildingSheep(0, -1),
        DEFINING_WILDLIFE_SPECIES_REGISTRY.sheep
      )
    ).toBe(true);
    expect(
      checkingWildlifeInstanceHasSeparationAnxiety(
        buildingSheep(0, -2),
        DEFINING_WILDLIFE_SPECIES_REGISTRY.sheep
      )
    ).toBe(true);
  });

  it('returns false for adult sheep', () => {
    expect(
      checkingWildlifeInstanceHasSeparationAnxiety(
        buildingSheep(0, 0),
        DEFINING_WILDLIFE_SPECIES_REGISTRY.sheep
      )
    ).toBe(false);
  });
});

describe('resolvingWildlifeSeparationAnxietyGuardian', () => {
  it('picks the nearest larger same-species animal when too far', () => {
    const young = buildingSheep(0, -1, 4.5);
    const adultNear = buildingSheep(1, 0, 10.5);
    const adultFar = buildingSheep(2, 1, 16.5);

    const result = resolvingWildlifeSeparationAnxietyGuardian({
      instance: young,
      species: DEFINING_WILDLIFE_SPECIES_REGISTRY.sheep,
      nearbyInstances: [adultNear, adultFar],
      resolveSpecies: (speciesId) =>
        DEFINING_WILDLIFE_SPECIES_REGISTRY[speciesId] ?? null,
    });

    expect(result?.guardian.instanceId).toBe(adultNear.instanceId);
    expect(result?.distanceGrid).toBeGreaterThan(4);
  });

  it('returns null when a larger ally is already within comfort range', () => {
    const young = buildingSheep(0, -1, 4.5);
    const adult = buildingSheep(1, 0, 5.5);

    expect(
      resolvingWildlifeSeparationAnxietyGuardian({
        instance: young,
        species: DEFINING_WILDLIFE_SPECIES_REGISTRY.sheep,
        nearbyInstances: [adult],
        resolveSpecies: (speciesId) =>
          DEFINING_WILDLIFE_SPECIES_REGISTRY[speciesId] ?? null,
      })
    ).toBeNull();
  });

  it('ignores same-size or smaller animals', () => {
    const young = buildingSheep(0, -1, 4.5);
    const otherYoung = buildingSheep(1, -1, 10.5);
    const baby = buildingSheep(2, -2, 10.5);

    expect(
      resolvingWildlifeSeparationAnxietyGuardian({
        instance: young,
        species: DEFINING_WILDLIFE_SPECIES_REGISTRY.sheep,
        nearbyInstances: [otherYoung, baby],
        resolveSpecies: (speciesId) =>
          DEFINING_WILDLIFE_SPECIES_REGISTRY[speciesId] ?? null,
      })
    ).toBeNull();
  });
});

describe('checkingWildlifeHasSeparationAnxiety / follow intent', () => {
  it('triggers a run follow when a young animal drifts from an adult', () => {
    const young = buildingSheep(0, -1, 4.5);
    const adult = buildingSheep(1, 0, 10.5);
    const blackboard = buildingBlackboard(young, [adult]);

    expect(checkingWildlifeHasSeparationAnxiety(blackboard)).toBe(true);

    const intent = resolvingWildlifeSeparationAnxietyFollowIntent(blackboard);

    expect(intent).toEqual({
      mode: 'followGuardian',
      targetInstanceId: adult.instanceId,
      targetPoint: adult.position,
    });
  });

  it('keeps following until comfort distance when already following', () => {
    const young = creatingWildlifeTestInstance({
      ...buildingSheep(0, -1, 4.5),
      aiState: creatingWildlifeTestAiState({
        intent: {
          mode: 'followGuardian',
          targetInstanceId: 'wildlife:4:7:1',
          targetPoint: { x: 8, y: 7.5, layer: 1 },
        },
      }),
    });
    const adult = buildingSheep(1, 0, 8);
    const blackboard = buildingBlackboard(young, [adult]);

    expect(checkingWildlifeHasSeparationAnxiety(blackboard)).toBe(true);
  });
});
