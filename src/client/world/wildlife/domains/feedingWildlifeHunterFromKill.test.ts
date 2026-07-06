import { creatingWorldPlazaEntityHealthInitialState } from '@/components/world/health/domains/managingWorldPlazaEntityHealthState';
import { creatingWildlifeInitialStaminaState } from '@/components/world/wildlife/domains/advancingWildlifeStaminaTick';
import { DEFINING_WILDLIFE_SPECIES_REGISTRY } from '@/components/world/wildlife/domains/definingWildlifeSpeciesRegistry';
import type { DefiningWildlifeInstance } from '@/components/world/wildlife/domains/definingWildlifeTypes';
import { feedingWildlifeHunterFromKill } from '@/components/world/wildlife/domains/feedingWildlifeHunterFromKill';
import {
  consumingWildlifeGroundFoodBridgeUnit,
  listingWildlifeGroundFoodItems,
} from '@/components/world/wildlife/domains/managingWildlifeGroundFoodBridge';
import type { ManagingWildlifeInstanceStore } from '@/components/world/wildlife/domains/managingWildlifeInstanceStore';
import { describe, expect, it } from 'vitest';

function buildingStore(
  instances: Record<string, DefiningWildlifeInstance>
): ManagingWildlifeInstanceStore {
  return {
    instances: new Map(Object.entries(instances)),
  };
}

function buildingDeadDeer(): DefiningWildlifeInstance {
  return {
    instanceId: 'wildlife:deer:1',
    speciesId: 'deer',
    anchorId: 'wildlife:deer:1',
    aggressionLevel: 'normal',
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
  it('spawns meat and feeds the hunter on the same kill', () => {
    const deer = buildingDeadDeer();
    const wolf = buildingHungryWolf();
    const store = buildingStore({
      [deer.instanceId]: deer,
      [wolf.instanceId]: wolf,
    });

    const result = feedingWildlifeHunterFromKill({
      store,
      preyInstance: deer,
      preySpecies: DEFINING_WILDLIFE_SPECIES_REGISTRY.deer,
      hunterInstance: wolf,
      hunterSpecies: DEFINING_WILDLIFE_SPECIES_REGISTRY['grey-wolf'],
      meatDropContext: null,
      nowMs: 1500,
    });

    expect(result.prey.hasDroppedLoot).toBe(true);
    expect(result.hunter.hungerState.hungerRatio).toBeGreaterThan(0.2);
    expect(result.hunter.aiState.intent.mode).toBe('idle');
    expect(listingWildlifeGroundFoodItems()).toHaveLength(0);
    expect(
      consumingWildlifeGroundFoodBridgeUnit('missing', wolf.position)
    ).toBe(false);
  });
});
