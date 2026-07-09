import { creatingWorldPlazaEntityHealthInitialState } from '@/components/world/health/domains/managingWorldPlazaEntityHealthState';
import {
  advancingWildlifeAggroTick,
  applyingWildlifeDamageThreat,
} from '@/components/world/wildlife/domains/advancingWildlifeAggroTick';
import { creatingWildlifeInitialStaminaState } from '@/components/world/wildlife/domains/advancingWildlifeStaminaTick';
import { DEFINING_WILDLIFE_SPECIES_REGISTRY } from '@/components/world/wildlife/domains/definingWildlifeSpeciesRegistry';
import type { DefiningWildlifeInstance } from '@/components/world/wildlife/domains/definingWildlifeTypes';
import { describe, expect, it } from 'vitest';

function buildingTestWildlifeInstance(
  overrides: Partial<DefiningWildlifeInstance> = {}
): DefiningWildlifeInstance {
  return {
    instanceId: 'wildlife:0:0:0',
    speciesId: 'grey-wolf',
    anchorId: 'wildlife:0:0:0',
    aggressionLevel: 'normal',
    sleepScheduleSample: 0,
    sizeScaleSample: 1,
    spawnAnchor: { x: 0.5, y: 0.5, layer: 1 },
    position: { x: 0.5, y: 0.5, layer: 1 },
    facingDirection: 'Down',
    healthState: creatingWorldPlazaEntityHealthInitialState(),
    hungerState: {
      hungerRatio: 0.1,
      driveLevel: 'starving',
      lastFedAtMs: null,
    },
    staminaState: creatingWildlifeInitialStaminaState(),
    aiState: {
      intent: { mode: 'idle' },
      facingDirection: 'Down',
      motionClip: 'idle',
      isMoving: false,
      lastThinkAtMs: 0,
      wanderTarget: null,
      steeringCache: null,
      lastAttackAtMs: null,
      attackComboIndex: 0,
      howlingUntilMs: null,
      lastHowlAtMs: null,
      jumpState: null,
      lastJumpEndedAtMs: null,
      startledUntilMs: null,
      chargeWindupStartedAtMs: null,
      fleeTargetPoint: null,
      feedingOnKillUntilMs: null,
      feedingOnKillGroundItemId: null,
      isSleeping: false,
      hasSleepBeenDisturbed: false,
    hasPlayerSleepBumpContact: false,
    },
    aggroState: {
      threats: [],
      activeTargetId: null,
      lastDamagedAtMs: null,
    },
    isDead: false,
    diedAtMs: null,
    hasDroppedLoot: false,
    hasBeenStudied: false,
    floatingTexts: [],

    speechState: {
      activeBubble: null,

      lastEmittedAtMs: null,

      lastContextKey: null,
    },
    environmentalDamageLastTickAtMs: null,
    ...overrides,
  };
}

describe('advancingWildlifeAggroTick', () => {
  it('decays threat over time', () => {
    const species = DEFINING_WILDLIFE_SPECIES_REGISTRY['grey-wolf'];
    const instance = buildingTestWildlifeInstance({
      aggroState: {
        threats: [{ targetId: 'player-1', threat: 3, lastUpdatedAtMs: 0 }],
        activeTargetId: 'player-1',
        lastDamagedAtMs: null,
      },
    });

    const nextAggro = advancingWildlifeAggroTick({
      instance,
      species,
      nearbyInstances: [],
      playerPosition: null,
      playerUserId: null,
      deltaSeconds: 5,
      nowMs: 5000,
    });

    expect(nextAggro.threats[0]?.threat ?? 0).toBeLessThan(3);
  });

  it('builds on-sight player threat for aggressive spawns while sated', () => {
    const species = DEFINING_WILDLIFE_SPECIES_REGISTRY['grey-wolf'];
    const instance = buildingTestWildlifeInstance({
      aggressionLevel: 'aggressive',
      hungerState: {
        hungerRatio: 0.9,
        driveLevel: 'sated',
        lastFedAtMs: null,
      },
      position: { x: 1, y: 1, layer: 1 },
    });

    const nextAggro = advancingWildlifeAggroTick({
      instance,
      species,
      nearbyInstances: [],
      playerPosition: { x: 1.5, y: 1.5, layer: 1 },
      playerUserId: 'player-1',
      deltaSeconds: 1,
      nowMs: 1000,
    });

    expect(nextAggro.threats[0]?.targetId).toBe('player-1');
    expect(nextAggro.threats[0]?.threat ?? 0).toBeGreaterThan(0);
  });

  it('builds on-sight player threat for aggressive chickens beyond tiny species radius', () => {
    const species = DEFINING_WILDLIFE_SPECIES_REGISTRY.chicken;
    const instance = buildingTestWildlifeInstance({
      speciesId: 'chicken',
      aggressionLevel: 'aggressive',
      hungerState: {
        hungerRatio: 0.9,
        driveLevel: 'sated',
        lastFedAtMs: null,
      },
      position: { x: 10, y: 10, layer: 1 },
    });

    const nextAggro = advancingWildlifeAggroTick({
      instance,
      species,
      nearbyInstances: [],
      playerPosition: { x: 13.5, y: 10, layer: 1 },
      playerUserId: 'player-1',
      deltaSeconds: 1,
      nowMs: 1000,
    });

    expect(nextAggro.threats[0]?.targetId).toBe('player-1');
  });

  it('does not build on-sight threat for aggressive passive farm herbivores', () => {
    const species = DEFINING_WILDLIFE_SPECIES_REGISTRY.cow;
    const instance = buildingTestWildlifeInstance({
      speciesId: 'cow',
      aggressionLevel: 'aggressive',
      hungerState: {
        hungerRatio: 0.9,
        driveLevel: 'sated',
        lastFedAtMs: null,
      },
      position: { x: 10, y: 10, layer: 1 },
    });

    const nextAggro = advancingWildlifeAggroTick({
      instance,
      species,
      nearbyInstances: [],
      playerPosition: { x: 10.5, y: 10.5, layer: 1 },
      playerUserId: 'player-1',
      deltaSeconds: 1,
      nowMs: 1000,
    });

    expect(nextAggro.threats).toHaveLength(0);
  });

  it('does not build proximity threat for tame spawns', () => {
    const species = DEFINING_WILDLIFE_SPECIES_REGISTRY['grey-wolf'];
    const instance = buildingTestWildlifeInstance({
      aggressionLevel: 'tame',
      hungerState: {
        hungerRatio: 0.1,
        driveLevel: 'starving',
        lastFedAtMs: null,
      },
      position: { x: 1, y: 1, layer: 1 },
    });

    const nextAggro = advancingWildlifeAggroTick({
      instance,
      species,
      nearbyInstances: [],
      playerPosition: { x: 1.5, y: 1.5, layer: 1 },
      playerUserId: 'player-1',
      deltaSeconds: 1,
      nowMs: 1000,
    });

    expect(nextAggro.threats).toHaveLength(0);
  });

  it('builds territory threat when a boar warns an intruder in its home patch', () => {
    const species = DEFINING_WILDLIFE_SPECIES_REGISTRY.boar;
    const instance = buildingTestWildlifeInstance({
      speciesId: 'boar',
      spawnAnchor: { x: 5, y: 5, layer: 1 },
      position: { x: 5, y: 5, layer: 1 },
      hungerState: {
        hungerRatio: 0.9,
        driveLevel: 'sated',
        lastFedAtMs: null,
      },
    });

    const nextAggro = advancingWildlifeAggroTick({
      instance,
      species,
      nearbyInstances: [],
      playerPosition: { x: 8, y: 5, layer: 1 },
      playerUserId: 'player-1',
      deltaSeconds: 1,
      nowMs: 1000,
    });

    expect(nextAggro.threats[0]?.targetId).toBe('player-1');
    expect(nextAggro.threats[0]?.threat ?? 0).toBeGreaterThan(0);
  });

  it('escalates territory threat quickly when the player steps inside the boar', () => {
    const species = DEFINING_WILDLIFE_SPECIES_REGISTRY.boar;
    const instance = buildingTestWildlifeInstance({
      speciesId: 'boar',
      spawnAnchor: { x: 5, y: 5, layer: 1 },
      position: { x: 5, y: 5, layer: 1 },
      hungerState: {
        hungerRatio: 0.9,
        driveLevel: 'sated',
        lastFedAtMs: null,
      },
    });

    const lingerAggro = advancingWildlifeAggroTick({
      instance,
      species,
      nearbyInstances: [],
      playerPosition: { x: 8, y: 5, layer: 1 },
      playerUserId: 'player-1',
      deltaSeconds: 1,
      nowMs: 1000,
    });

    const escalateAggro = advancingWildlifeAggroTick({
      instance,
      species,
      nearbyInstances: [],
      playerPosition: { x: 5.5, y: 5, layer: 1 },
      playerUserId: 'player-1',
      deltaSeconds: 1,
      nowMs: 1000,
    });

    expect(escalateAggro.threats[0]?.threat ?? 0).toBeGreaterThan(
      lingerAggro.threats[0]?.threat ?? 0
    );
  });

  it('locks onto nearby prey while sated when prey enters proximity range', () => {
    const species = DEFINING_WILDLIFE_SPECIES_REGISTRY['grey-wolf'];
    const instance = buildingTestWildlifeInstance({
      hungerState: {
        hungerRatio: 0.9,
        driveLevel: 'sated',
        lastFedAtMs: null,
      },
      position: { x: 1, y: 1, layer: 1 },
    });
    const deer = buildingTestWildlifeInstance({
      instanceId: 'wildlife:2:2:0',
      speciesId: 'deer',
      position: { x: 4, y: 1, layer: 1 },
    });

    const nextAggro = advancingWildlifeAggroTick({
      instance,
      species,
      nearbyInstances: [deer],
      playerPosition: null,
      playerUserId: null,
      deltaSeconds: 0.2,
      nowMs: 200,
    });

    expect(nextAggro.activeTargetId).toBe(deer.instanceId);
    expect(nextAggro.threats[0]?.threat ?? 0).toBeGreaterThanOrEqual(1.5);
  });
});

describe('applyingWildlifeDamageThreat', () => {
  it('aggroes retaliators onto the attacking wildlife instance', () => {
    const boarSpecies = DEFINING_WILDLIFE_SPECIES_REGISTRY.boar;
    const boar = buildingTestWildlifeInstance({
      instanceId: 'wildlife:boar:1',
      speciesId: 'boar',
      healthState: {
        ...creatingWorldPlazaEntityHealthInitialState(),
        currentHealth: 55,
      },
    });

    const nextBoar = applyingWildlifeDamageThreat(
      boar,
      boarSpecies,
      'wildlife:lion:1',
      12,
      1_000
    );

    expect(nextBoar.aggroState.activeTargetId).toBe('wildlife:lion:1');
    expect(nextBoar.aggroState.lastDamagedAtMs).toBe(1_000);
    expect(nextBoar.aggroState.threats[0]?.targetId).toBe('wildlife:lion:1');
    expect(nextBoar.aggroState.threats[0]?.threat ?? 0).toBeGreaterThan(0);
  });
});
