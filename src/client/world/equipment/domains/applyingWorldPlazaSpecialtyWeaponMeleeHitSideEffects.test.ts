import { applyingWorldPlazaSpecialtyWeaponMeleeHitSideEffects } from '@/components/world/equipment/domains/applyingWorldPlazaSpecialtyWeaponMeleeHitSideEffects';
import { creatingWorldPlazaEntityHealthInitialState } from '@/components/world/health/domains/managingWorldPlazaEntityHealthState';
import { creatingWildlifeInitialStaminaState } from '@/components/world/wildlife/domains/advancingWildlifeStaminaTick';
import type { DefiningWildlifeInstance } from '@/components/world/wildlife/domains/definingWildlifeTypes';
import { describe, expect, it } from 'vitest';

function buildingTestWildlifeInstance(
  overrides: Partial<DefiningWildlifeInstance> = {}
): DefiningWildlifeInstance {
  return {
    instanceId: 'wildlife:0:0:0',
    speciesId: 'deer',
    anchorId: 'wildlife:0:0:0',
    aggressionLevel: 'normal',
    sleepScheduleSample: 0,
    sizeScaleSample: 1,
    spawnAnchor: { x: 0.5, y: 0.5, layer: 1 },
    position: { x: 0.5, y: 0.5, layer: 1 },
    facingDirection: 'Down',
    healthState: creatingWorldPlazaEntityHealthInitialState(),
    hungerState: {
      hungerRatio: 1,
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

describe('applyingWorldPlazaSpecialtyWeaponMeleeHitSideEffects', () => {
  it('applies Venom Barb poison to wildlife', () => {
    const result = applyingWorldPlazaSpecialtyWeaponMeleeHitSideEffects({
      instance: buildingTestWildlifeInstance(),
      playerHealthState: creatingWorldPlazaEntityHealthInitialState(),
      swingEv: 20,
      nowMs: 1000,
      potentialDamageProc: null,
      selfCurseProc: null,
      bleedProc: null,
      temperatureProc: null,
      poisonProc: {
        kind: 'poison',
        weight: 1,
        potency: 'toxic',
        flatExpectedDamage: 12,
      },
      selfShieldProc: null,
      weaponId: 'venom-barb',
    });

    expect(result.instance.healthState.poisonEffects).toHaveLength(1);
    expect(result.instance.healthState.poisonEffects[0]?.potency).toBe('toxic');
  });

  it('applies Bessemer Edge self shield to player', () => {
    const before = creatingWorldPlazaEntityHealthInitialState();
    const result = applyingWorldPlazaSpecialtyWeaponMeleeHitSideEffects({
      instance: buildingTestWildlifeInstance(),
      playerHealthState: before,
      swingEv: 20,
      nowMs: 1000,
      potentialDamageProc: null,
      selfCurseProc: null,
      bleedProc: null,
      temperatureProc: null,
      poisonProc: null,
      selfShieldProc: { kind: 'self_shield', weight: 1, shieldPoints: 6 },
      weaponId: 'bessemer-edge',
    });

    expect(result.playerHealthState.shieldPoints).toBe(before.shieldPoints + 6);
  });
});
