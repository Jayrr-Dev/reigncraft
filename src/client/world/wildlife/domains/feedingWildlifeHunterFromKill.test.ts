import { creatingWorldPlazaEntityHealthInitialState } from '@/components/world/health/domains/managingWorldPlazaEntityHealthState';
import { creatingWildlifeInitialStaminaState } from '@/components/world/wildlife/domains/advancingWildlifeStaminaTick';
import { DEFINING_WILDLIFE_HUNTER_KILL_FEEDING_DURATION_MS } from '@/components/world/wildlife/domains/definingWildlifeHunterFeedingConstants';
import { DEFINING_WILDLIFE_SPECIES_REGISTRY } from '@/components/world/wildlife/domains/definingWildlifeSpeciesRegistry';
import type { DefiningWildlifeInstance } from '@/components/world/wildlife/domains/definingWildlifeTypes';
import { feedingWildlifeHunterFromKill } from '@/components/world/wildlife/domains/feedingWildlifeHunterFromKill';
import { listingWildlifeGroundFoodItems } from '@/components/world/wildlife/domains/managingWildlifeGroundFoodBridge';
import { creatingWildlifeInstanceStore } from '@/components/world/wildlife/domains/managingWildlifeInstanceStore';
import { describe, expect, it } from 'vitest';

function buildingStore(
  instances: Record<string, DefiningWildlifeInstance>
) {
  const store = creatingWildlifeInstanceStore();
  store.instances = new Map(Object.entries(instances));
  return store;
}

function buildingDeadDeer(): DefiningWildlifeInstance {
  return {
    instanceId: 'wildlife:deer:1',
    speciesId: 'deer',
    anchorId: 'wildlife:deer:1',
    aggressionLevel: 'normal',
    sleepScheduleSample: 0,
    sizeScaleSample: 1,
    spawnAnchor: { x: 2.5, y: 2.5, layer: 1 },
    position: { x: 2.5, y: 2.5, layer: 1 },
    facingDirection: 'Down',
    healthState: {
      ...creatingWorldPlazaEntityHealthInitialState(),
      currentHealth: 0,
    },
    hungerState: {
      hungerRatio: 0.5,
      driveLevel: 'hungry',
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
      jumpState: null,
      lastJumpEndedAtMs: null,
      startledUntilMs: null,
      chargeWindupStartedAtMs: null,
      fleeTargetPoint: null,
      feedingOnKillUntilMs: null,
      feedingOnKillGroundItemId: null,
    isSleeping: false,
    hasSleepBeenDisturbed: false,
    },
    aggroState: {
      threats: [],
      activeTargetId: null,
      lastDamagedAtMs: null,
    },
    isDead: true,
    diedAtMs: 1000,
    hasDroppedLoot: false,
    floatingTexts: [],
    speechState: {
      activeBubble: null,
      lastEmittedAtMs: null,
      lastContextKey: null,
    },
    environmentalDamageLastTickAtMs: null,
  };
}

function buildingHungryWolf(): DefiningWildlifeInstance {
  return {
    instanceId: 'wildlife:wolf:1',
    speciesId: 'grey-wolf',
    anchorId: 'wildlife:wolf:1',
    aggressionLevel: 'normal',
    sleepScheduleSample: 0,
    sizeScaleSample: 1,
    spawnAnchor: { x: 1.5, y: 2.5, layer: 1 },
    position: { x: 2.4, y: 2.5, layer: 1 },
    facingDirection: 'Right',
    healthState: creatingWorldPlazaEntityHealthInitialState(),
    hungerState: {
      hungerRatio: 0.2,
      driveLevel: 'hungry',
      lastFedAtMs: null,
    },
    staminaState: creatingWildlifeInitialStaminaState(),
    aiState: {
      intent: {
        mode: 'attack',
        targetInstanceId: 'wildlife:deer:1',
        targetPoint: { x: 2.5, y: 2.5, layer: 1 },
      },
      facingDirection: 'Right',
      motionClip: 'attack',
      isMoving: false,
      lastThinkAtMs: 1000,
      wanderTarget: null,
      steeringCache: null,
      lastAttackAtMs: 1000,
      jumpState: null,
      lastJumpEndedAtMs: null,
      startledUntilMs: null,
      chargeWindupStartedAtMs: null,
      fleeTargetPoint: null,
      feedingOnKillUntilMs: null,
      feedingOnKillGroundItemId: null,
    isSleeping: false,
    hasSleepBeenDisturbed: false,
    },
    aggroState: {
      threats: [],
      activeTargetId: 'wildlife:deer:1',
      lastDamagedAtMs: null,
    },
    isDead: false,
    diedAtMs: null,
    hasDroppedLoot: false,
    floatingTexts: [],
    speechState: {
      activeBubble: null,
      lastEmittedAtMs: null,
      lastContextKey: null,
    },
    environmentalDamageLastTickAtMs: null,
  };
}

describe('feedingWildlifeHunterFromKill', () => {
  it('starts a ten-second feeding lock instead of eating immediately', () => {
    const deer = buildingDeadDeer();
    const wolf = buildingHungryWolf();
    const store = buildingStore({
      [deer.instanceId]: deer,
      [wolf.instanceId]: wolf,
    });
    const nowMs = 1500;

    const result = feedingWildlifeHunterFromKill({
      store,
      preyInstance: deer,
      preySpecies: DEFINING_WILDLIFE_SPECIES_REGISTRY.deer,
      hunterInstance: wolf,
      hunterSpecies: DEFINING_WILDLIFE_SPECIES_REGISTRY['grey-wolf'],
      meatDropContext: null,
      nowMs,
    });

    expect(result.prey.hasDroppedLoot).toBe(true);
    expect(result.hunter.hungerState.hungerRatio).toBe(0.2);
    expect(result.hunter.aiState.intent.mode).toBe('forageEat');
    expect(result.hunter.aiState.feedingOnKillUntilMs).toBe(
      nowMs + DEFINING_WILDLIFE_HUNTER_KILL_FEEDING_DURATION_MS
    );
    expect(result.hunter.aiState.feedingOnKillGroundItemId).not.toBeNull();
    expect(result.hunter.aggroState.activeTargetId).toBeNull();
    expect(listingWildlifeGroundFoodItems()).toHaveLength(1);
  });
});
