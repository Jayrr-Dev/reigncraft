import { creatingWorldPlazaEntityHealthInitialState } from '@/components/world/health/domains/managingWorldPlazaEntityHealthState';
import { creatingWildlifeInitialStaminaState } from '@/components/world/wildlife/domains/advancingWildlifeStaminaTick';
import { DEFINING_WILDLIFE_SPECIES_REGISTRY } from '@/components/world/wildlife/domains/definingWildlifeSpeciesRegistry';
import type { DefiningWildlifeInstance } from '@/components/world/wildlife/domains/definingWildlifeTypes';
import {
  creatingWildlifeInstanceStore,
  listingWildlifeInstances,
} from '@/components/world/wildlife/domains/managingWildlifeInstanceStore';
import { wakingWildlifeNearbySleepersFromHit } from '@/components/world/wildlife/domains/wakingWildlifeNearbySleepersFromHit';
import { describe, expect, it, vi } from 'vitest';

vi.mock(
  '@/components/world/health/domains/resolvingWorldPlazaEnvironmentalHazardAtTileIndex',
  () => ({
    resolvingWorldPlazaEnvironmentalHazardAtTileIndex: vi.fn(() => null),
  })
);

vi.mock('@/components/world/domains/checkingWorldPlazaLavaAtTileIndex', () => ({
  checkingWorldPlazaLavaAtTileIndex: vi.fn(() => false),
}));

vi.mock(
  '@/components/world/domains/resolvingWorldPlazaWaterAtTileIndex',
  () => ({
    resolvingWorldPlazaWaterAtTileIndex: vi.fn(() => null),
  })
);

vi.mock('@/components/world/collision', () => ({
  checkingWorldCollisionBlockedAtPoint: vi.fn(() => false),
}));

const DEFINING_WILDLIFE_TEST_HAZARD_SAMPLING = {
  placedBlocks: [],
  isDaytime: true,
} as const;

function buildingSleepingWildlifeInstance(
  overrides: Partial<DefiningWildlifeInstance> = {}
): DefiningWildlifeInstance {
  return {
    instanceId: 'wildlife:cow:1',
    speciesId: 'cow',
    anchorId: 'wildlife:cow:1',
    aggressionLevel: 'normal',
    sleepScheduleSample: 0,
    sizeScaleSample: 1,
    spawnAnchor: { x: 1.5, y: 1.5, layer: 1 },
    position: { x: 1.5, y: 1.5, layer: 1 },
    facingDirection: 'Down',
    healthState: creatingWorldPlazaEntityHealthInitialState(),
    hungerState: {
      hungerRatio: 0.85,
      driveLevel: 'sated',
      lastFedAtMs: null,
    },
    staminaState: creatingWildlifeInitialStaminaState(),
    aiState: {
      intent: { mode: 'idle' },
      facingDirection: 'Down',
      motionClip: 'sleep',
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
      isSleeping: true,
      hasSleepBeenDisturbed: false,
    hasPlayerSleepBumpContact: false,
    },
    aggroState: {
      threats: [],
      activeTargetId: null,
      lastDamagedAtMs: null,
    },
    floatingTexts: [],
    speechState: {
      activeBubble: null,
      lastEmittedAtMs: null,
      lastContextKey: 'sleep',
    },
    environmentalDamageLastTickAtMs: null,
    isDead: false,
    diedAtMs: null,
    hasDroppedLoot: false,
    ...overrides,
  };
}

describe('wakingWildlifeNearbySleepersFromHit', () => {
  it('wakes a nearby sleeping same-species neighbor when the roll succeeds', () => {
    const store = creatingWildlifeInstanceStore();
    const struck = buildingSleepingWildlifeInstance({
      instanceId: 'wildlife:cow:struck',
      anchorId: 'wildlife:cow:struck',
      position: { x: 2, y: 2, layer: 1 },
    });
    const neighbor = buildingSleepingWildlifeInstance({
      instanceId: 'wildlife:cow:neighbor',
      anchorId: 'wildlife:cow:neighbor',
      position: { x: 3, y: 2, layer: 1 },
    });
    const farNeighbor = buildingSleepingWildlifeInstance({
      instanceId: 'wildlife:cow:far',
      anchorId: 'wildlife:cow:far',
      position: { x: 14, y: 2, layer: 1 },
    });
    const otherSpecies = buildingSleepingWildlifeInstance({
      instanceId: 'wildlife:sheep:neighbor',
      anchorId: 'wildlife:sheep:neighbor',
      speciesId: 'sheep',
      position: { x: 2.5, y: 2.5, layer: 1 },
    });

    store.instances.set(struck.instanceId, struck);
    store.instances.set(neighbor.instanceId, neighbor);
    store.instances.set(farNeighbor.instanceId, farNeighbor);
    store.instances.set(otherSpecies.instanceId, otherSpecies);

    wakingWildlifeNearbySleepersFromHit({
      store,
      hitInstanceId: struck.instanceId,
      speciesId: 'cow',
      species: DEFINING_WILDLIFE_SPECIES_REGISTRY.cow,
      centerPoint: struck.position,
      threatPoint: { x: 1, y: 2, layer: 1 },
      threatTargetId: 'player-1',
      hazardSampling: DEFINING_WILDLIFE_TEST_HAZARD_SAMPLING,
      nowMs: 1000,
      roll: () => 0,
    });

    const instances = listingWildlifeInstances(store);
    const wokenNeighbor = instances.find(
      (entry) => entry.instanceId === neighbor.instanceId
    );
    const untouchedFar = instances.find(
      (entry) => entry.instanceId === farNeighbor.instanceId
    );
    const untouchedOtherSpecies = instances.find(
      (entry) => entry.instanceId === otherSpecies.instanceId
    );

    expect(wokenNeighbor?.aiState.isSleeping).toBe(false);
    expect(wokenNeighbor?.aiState.hasSleepBeenDisturbed).toBe(true);
    expect(wokenNeighbor?.aiState.intent.mode).toBe('flee');
    expect(untouchedFar?.aiState.isSleeping).toBe(true);
    expect(untouchedOtherSpecies?.aiState.isSleeping).toBe(true);
  });

  it('leaves nearby sleepers alone when the roll fails', () => {
    const store = creatingWildlifeInstanceStore();
    const struck = buildingSleepingWildlifeInstance({
      instanceId: 'wildlife:cow:struck',
      anchorId: 'wildlife:cow:struck',
      position: { x: 2, y: 2, layer: 1 },
    });
    const neighbor = buildingSleepingWildlifeInstance({
      instanceId: 'wildlife:cow:neighbor',
      anchorId: 'wildlife:cow:neighbor',
      position: { x: 3, y: 2, layer: 1 },
    });

    store.instances.set(struck.instanceId, struck);
    store.instances.set(neighbor.instanceId, neighbor);

    wakingWildlifeNearbySleepersFromHit({
      store,
      hitInstanceId: struck.instanceId,
      speciesId: 'cow',
      species: DEFINING_WILDLIFE_SPECIES_REGISTRY.cow,
      centerPoint: struck.position,
      threatPoint: { x: 1, y: 2, layer: 1 },
      threatTargetId: 'player-1',
      hazardSampling: DEFINING_WILDLIFE_TEST_HAZARD_SAMPLING,
      nowMs: 1000,
      roll: () => 1,
    });

    const neighborAfter = store.instances.get(neighbor.instanceId);

    expect(neighborAfter?.aiState.isSleeping).toBe(true);
    expect(neighborAfter?.aiState.hasSleepBeenDisturbed).toBe(false);
  });
});
