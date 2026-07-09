import { creatingWorldPlazaEntityHealthInitialState } from '@/components/world/health/domains/managingWorldPlazaEntityHealthState';
import {
  advancingWildlifeChargeWindup,
  clearingWildlifeChargeWindupAfterStamina,
} from '@/components/world/wildlife/domains/advancingWildlifeChargeWindup';
import { creatingWildlifeInitialStaminaState } from '@/components/world/wildlife/domains/advancingWildlifeStaminaTick';
import type { DefiningWildlifeInstance } from '@/components/world/wildlife/domains/definingWildlifeTypes';
import { describe, expect, it } from 'vitest';

function buildingBoarInstance(
  overrides: Partial<DefiningWildlifeInstance> = {}
): DefiningWildlifeInstance {
  return {
    instanceId: 'wildlife:1:1:0',
    speciesId: 'boar',
    anchorId: 'wildlife:1:1:0',
    aggressionLevel: 'normal',
    sleepScheduleSample: 0,
    sizeScaleSample: 1,
    spawnAnchor: { x: 1.5, y: 1.5, layer: 1 },
    position: { x: 1.5, y: 1.5, layer: 1 },
    facingDirection: 'Down',
    healthState: creatingWorldPlazaEntityHealthInitialState(),
    hungerState: {
      hungerRatio: 0.9,
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
    feedingOnKillUntilMs: null,
    feedingOnKillGroundItemId: null,
    isSleeping: false,
    hasSleepBeenDisturbed: false,
    hasPlayerSleepBumpContact: false,
    docileFollowUntilMs: null,
    docileLastReactAtMs: null,
    },
    aggroState: {
      threats: [{ targetId: 'player-1', threat: 5, lastUpdatedAtMs: 1000 }],
      activeTargetId: 'player-1',
      lastDamagedAtMs: 1000,
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

describe('advancingWildlifeChargeWindup', () => {
  it('holds the boar idle for one second before releasing a player chase', () => {
    const chaseIntent = {
      mode: 'chase' as const,
      targetInstanceId: 'player-1',
      targetPoint: { x: 8, y: 8, layer: 1 },
    };

    const windupStart = advancingWildlifeChargeWindup({
      intent: chaseIntent,
      instance: buildingBoarInstance(),
      speciesId: 'boar',
      playerUserId: 'player-1',
      playerPosition: { x: 8, y: 8, layer: 1 },
      nowMs: 1000,
    });

    expect(windupStart.intent.mode).toBe('idle');
    expect(windupStart.chargeWindupStartedAtMs).toBe(1000);

    const stillWindingUp = advancingWildlifeChargeWindup({
      intent: chaseIntent,
      instance: buildingBoarInstance({
        aiState: {
          ...buildingBoarInstance().aiState,
          chargeWindupStartedAtMs: 1000,
          hasUsedBluffCharge: false,
          bluffChargePlayerExitedTerritory: false,
          bluffReturnPoint: null,
          docileFollowUntilMs: null,
          docileLastReactAtMs: null,
        },
      }),
      speciesId: 'boar',
      playerUserId: 'player-1',
      playerPosition: { x: 8, y: 8, layer: 1 },
      nowMs: 1500,
    });

    expect(stillWindingUp.intent.mode).toBe('idle');

    const released = advancingWildlifeChargeWindup({
      intent: chaseIntent,
      instance: buildingBoarInstance({
        aiState: {
          ...buildingBoarInstance().aiState,
          chargeWindupStartedAtMs: 1000,
          hasUsedBluffCharge: false,
          bluffChargePlayerExitedTerritory: false,
          bluffReturnPoint: null,
          docileFollowUntilMs: null,
          docileLastReactAtMs: null,
        },
      }),
      speciesId: 'boar',
      playerUserId: 'player-1',
      playerPosition: { x: 8, y: 8, layer: 1 },
      nowMs: 2001,
    });

    expect(released.intent).toEqual(chaseIntent);
    expect(released.chargeWindupStartedAtMs).toBe(1000);
  });

  it('skips wind-up when stamina is not full', () => {
    const chaseIntent = {
      mode: 'chase' as const,
      targetInstanceId: 'player-1',
      targetPoint: { x: 8, y: 8, layer: 1 },
    };

    const result = advancingWildlifeChargeWindup({
      intent: chaseIntent,
      instance: buildingBoarInstance({
        staminaState: {
          staminaRatio: 0.5,
          isExhausted: false,
          runningForSeconds: 0,
        },
      }),
      speciesId: 'boar',
      playerUserId: 'player-1',
      playerPosition: { x: 8, y: 8, layer: 1 },
      nowMs: 1000,
    });

    expect(result.intent).toEqual(chaseIntent);
    expect(result.chargeWindupStartedAtMs).toBeNull();
  });

  it('clears charge wind-up while the boar is winded', () => {
    expect(
      clearingWildlifeChargeWindupAfterStamina('boar', 1000, {
        staminaRatio: 0.2,
        isExhausted: true,
        runningForSeconds: 0,
      })
    ).toBeNull();
  });
});
