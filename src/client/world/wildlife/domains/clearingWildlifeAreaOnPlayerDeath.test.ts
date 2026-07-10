import { creatingWorldPlazaEntityHealthInitialState } from '@/components/world/health/domains/managingWorldPlazaEntityHealthState';
import { creatingWildlifeInitialStaminaState } from '@/components/world/wildlife/domains/advancingWildlifeStaminaTick';
import { clearingWildlifeAreaOnPlayerDeath } from '@/components/world/wildlife/domains/clearingWildlifeAreaOnPlayerDeath';
import { resolvingWildlifeSpeciesDefinition } from '@/components/world/wildlife/domains/definingWildlifeSpeciesRegistry';
import type { DefiningWildlifeInstance } from '@/components/world/wildlife/domains/definingWildlifeTypes';
import {
  creatingWildlifeInstanceStore,
  DEFINING_WILDLIFE_SIM_RADIUS_GRID,
} from '@/components/world/wildlife/domains/managingWildlifeInstanceStore';
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
      hungerRatio: 0.85,
      driveLevel: 'sated',
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
      hasUsedBluffCharge: false,
      bluffChargePlayerExitedTerritory: false,
      bluffReturnPoint: null,
      fleeTargetPoint: null,
    pendingGroundFoodBite: null,
    feedingOnKillUntilMs: null,
    feedingOnKillGroundItemId: null,
    isSleeping: false,
    hasSleepBeenDisturbed: false,
    hasPlayerSleepBumpContact: false,
    docileFollowUntilMs: null,
    docileLastReactAtMs: null,
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

describe('clearingWildlifeAreaOnPlayerDeath', () => {
  it('despawns wildlife inside the clear radius', () => {
    const store = creatingWildlifeInstanceStore();
    const nearby = buildingTestWildlifeInstance({
      instanceId: 'wildlife:near',
      anchorId: 'wildlife:near',
      position: { x: 2, y: 2, layer: 1 },
    });

    store.instances.set(nearby.instanceId, nearby);
    store.knownAnchorIds.add(nearby.anchorId);

    clearingWildlifeAreaOnPlayerDeath({
      store,
      center: { x: 0, y: 0, layer: 1 },
      playerUserId: 'player-1',
      nowMs: 0,
      clearRadiusGrid: DEFINING_WILDLIFE_SIM_RADIUS_GRID,
      resolveSpecies: resolvingWildlifeSpeciesDefinition,
    });

    expect(store.instances.has('wildlife:near')).toBe(false);
    expect(store.knownAnchorIds.has('wildlife:near')).toBe(false);
  });

  it('releases player aggro on wildlife outside the clear radius', () => {
    const store = creatingWildlifeInstanceStore();
    const distant = buildingTestWildlifeInstance({
      instanceId: 'wildlife:far',
      anchorId: 'wildlife:far',
      position: { x: 80, y: 80, layer: 1 },
      aggroState: {
        threats: [{ targetId: 'player-1', threat: 8, lastUpdatedAtMs: 0 }],
        activeTargetId: 'player-1',
        lastDamagedAtMs: 0,
      },
      aiState: {
        intent: {
          mode: 'chase',
          targetInstanceId: 'player-1',
          targetPoint: { x: 0, y: 0, layer: 1 },
        },
        facingDirection: 'Down',
        motionClip: 'run',
        isMoving: true,
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
        chargeWindupStartedAtMs: 100,
        fleeTargetPoint: { x: 1, y: 1, layer: 1 },
      pendingGroundFoodBite: null,
      feedingOnKillUntilMs: null,
      feedingOnKillGroundItemId: null,
      isSleeping: false,
      hasSleepBeenDisturbed: false,
      hasPlayerSleepBumpContact: false,
      hasUsedBluffCharge: false,
      bluffChargePlayerExitedTerritory: false,
      bluffReturnPoint: null,
      docileFollowUntilMs: null,
      docileLastReactAtMs: null,
      },
    });

    store.instances.set(distant.instanceId, distant);

    clearingWildlifeAreaOnPlayerDeath({
      store,
      center: { x: 0, y: 0, layer: 1 },
      playerUserId: 'player-1',
      nowMs: 0,
      clearRadiusGrid: DEFINING_WILDLIFE_SIM_RADIUS_GRID,
      resolveSpecies: resolvingWildlifeSpeciesDefinition,
    });

    const updated = store.instances.get('wildlife:far');

    expect(updated).toBeDefined();
    expect(updated?.aggroState.activeTargetId).toBeNull();
    expect(updated?.aggroState.threats).toEqual([]);
    expect(updated?.aiState.intent).toEqual({ mode: 'idle' });
    expect(updated?.aiState.chargeWindupStartedAtMs).toBeNull();
    expect(updated?.aiState.fleeTargetPoint).toBeNull();
  });
});
