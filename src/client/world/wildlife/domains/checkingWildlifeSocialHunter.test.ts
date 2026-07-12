import { checkingWildlifeHasSeekPack } from '@/components/world/wildlife/domains/checkingWildlifeHasSeekPack';
import { checkingWildlifeInstanceIsSocialHunter } from '@/components/world/wildlife/domains/checkingWildlifeInstanceIsSocialHunter';
import { checkingWildlifeSocialHunterMayHunt } from '@/components/world/wildlife/domains/checkingWildlifeSocialHunterMayHunt';
import {
  creatingWildlifeTestAiState,
  creatingWildlifeTestInstance,
} from '@/components/world/wildlife/domains/creatingWildlifeTestFixtures';
import type { DefiningWildlifeBehaviorBlackboard } from '@/components/world/wildlife/domains/definingWildlifeBehaviorConditionRegistry';
import { DEFINING_WILDLIFE_SPECIES_REGISTRY } from '@/components/world/wildlife/domains/definingWildlifeSpeciesRegistry';
import { resolvingWildlifeSocialHunterSeekPackIntent } from '@/components/world/wildlife/domains/resolvingWildlifeSocialHunterSeekPackIntent';
import { describe, expect, it } from 'vitest';

function buildingWolf(
  packIndex: number,
  positionX: number,
  speciesId: 'grey-wolf' | 'omega-wolf' = 'grey-wolf'
) {
  const instanceId = `wildlife:10:10:${packIndex}`;

  return creatingWildlifeTestInstance({
    instanceId,
    speciesId,
    anchorId: instanceId,
    sizeScaleSample: 0,
    spawnAnchor: { x: 10.5, y: 10.5, layer: 1 },
    position: { x: positionX, y: 10.5, layer: 1 },
    hungerState: {
      hungerRatio: 0.3,
      driveLevel: 'hungry',
      lastFedAtMs: null,
    },
  });
}

function buildingBlackboard(
  instance: ReturnType<typeof buildingWolf>,
  nearbyInstances: ReturnType<typeof buildingWolf>[]
): DefiningWildlifeBehaviorBlackboard {
  return {
    instance,
    species: DEFINING_WILDLIFE_SPECIES_REGISTRY[instance.speciesId],
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

describe('checkingWildlifeInstanceIsSocialHunter', () => {
  it('is true for grey and omega wolves', () => {
    expect(
      checkingWildlifeInstanceIsSocialHunter(
        buildingWolf(0, 10.5),
        DEFINING_WILDLIFE_SPECIES_REGISTRY['grey-wolf']
      )
    ).toBe(true);
    expect(
      checkingWildlifeInstanceIsSocialHunter(
        buildingWolf(0, 10.5, 'omega-wolf'),
        DEFINING_WILDLIFE_SPECIES_REGISTRY['omega-wolf']
      )
    ).toBe(true);
  });

  it('is false for non-social-hunter species', () => {
    const lion = creatingWildlifeTestInstance({
      speciesId: 'lion',
      sizeScaleSample: 0,
    });

    expect(
      checkingWildlifeInstanceIsSocialHunter(
        lion,
        DEFINING_WILDLIFE_SPECIES_REGISTRY.lion
      )
    ).toBe(false);
  });
});

describe('checkingWildlifeSocialHunterMayHunt', () => {
  it('blocks hunt when fewer than 3 packmates are nearby', () => {
    const solo = buildingWolf(0, 10.5);
    const pair = [solo, buildingWolf(1, 11.5)];

    expect(
      checkingWildlifeSocialHunterMayHunt({
        instance: solo,
        species: DEFINING_WILDLIFE_SPECIES_REGISTRY['grey-wolf'],
        nearbyInstances: pair,
      })
    ).toBe(false);
  });

  it('allows hunt at pack size 3 within join radius', () => {
    const alpha = buildingWolf(0, 10.5);
    const pack = [alpha, buildingWolf(1, 11.5), buildingWolf(2, 12.5)];

    expect(
      checkingWildlifeSocialHunterMayHunt({
        instance: alpha,
        species: DEFINING_WILDLIFE_SPECIES_REGISTRY['grey-wolf'],
        nearbyInstances: pack,
      })
    ).toBe(true);
  });

  it('counts self when simulation nearby lists exclude the acting wolf', () => {
    const alpha = buildingWolf(0, 10.5);
    const packmatesOnly = [buildingWolf(1, 11.5), buildingWolf(2, 12.5)];

    expect(
      checkingWildlifeSocialHunterMayHunt({
        instance: alpha,
        species: DEFINING_WILDLIFE_SPECIES_REGISTRY['grey-wolf'],
        nearbyInstances: packmatesOnly,
      })
    ).toBe(true);
  });

  it('counts omega and grey wolves as one pack', () => {
    const omega = buildingWolf(0, 10.5, 'omega-wolf');
    const pack = [omega, buildingWolf(1, 11.5), buildingWolf(2, 12.5)];

    expect(
      checkingWildlifeSocialHunterMayHunt({
        instance: omega,
        species: DEFINING_WILDLIFE_SPECIES_REGISTRY['omega-wolf'],
        nearbyInstances: pack,
      })
    ).toBe(true);
  });
});

describe('checkingWildlifeHasSeekPack', () => {
  it('seeks a distant packmate when under strength', () => {
    const solo = buildingWolf(0, 10.5);
    const ally = buildingWolf(1, 20.5);
    const blackboard = buildingBlackboard(solo, [solo, ally]);

    expect(checkingWildlifeHasSeekPack(blackboard)).toBe(true);

    const intent = resolvingWildlifeSocialHunterSeekPackIntent(blackboard);
    expect(intent).toEqual({
      mode: 'seekPackmate',
      targetInstanceId: ally.instanceId,
      targetPoint: ally.position,
    });
  });

  it('does not seek when already hunting', () => {
    const solo = buildingWolf(0, 10.5);
    const ally = buildingWolf(1, 20.5);
    const hunting = {
      ...solo,
      aggroState: {
        ...solo.aggroState,
        activeTargetId: 'player:1',
      },
      aiState: creatingWildlifeTestAiState(),
    };
    const blackboard = buildingBlackboard(hunting, [hunting, ally]);

    expect(checkingWildlifeHasSeekPack(blackboard)).toBe(false);
  });

  it('does not seek while inheriting a pack stalk lock without active target yet', () => {
    const solo = buildingWolf(0, 10.5);
    const ally = buildingWolf(1, 20.5);
    const joining = {
      ...solo,
      aggroState: {
        ...solo.aggroState,
        activeTargetId: null,
        stalkLockedPreyTargetId: 'player:1',
      },
      aiState: creatingWildlifeTestAiState(),
    };
    const blackboard = buildingBlackboard(joining, [joining, ally]);

    expect(checkingWildlifeHasSeekPack(blackboard)).toBe(false);
  });

  it('does not seek when pack already meets min size', () => {
    const alpha = buildingWolf(0, 10.5);
    const pack = [alpha, buildingWolf(1, 11.5), buildingWolf(2, 12.5)];
    const blackboard = buildingBlackboard(alpha, pack);

    expect(checkingWildlifeHasSeekPack(blackboard)).toBe(false);
  });
});
