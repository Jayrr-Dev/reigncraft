import { creatingWorldPlazaEntityHealthInitialState } from '@/components/world/health/domains/managingWorldPlazaEntityHealthState';
import { creatingWildlifeInitialStaminaState } from '@/components/world/wildlife/domains/advancingWildlifeStaminaTick';
import { checkingWildlifeStalkerCaughtUpToStillPrey } from '@/components/world/wildlife/domains/checkingWildlifeStalkerCaughtUpToStillPrey';
import { DEFINING_WILDLIFE_MELEE_RANGE_GRID } from '@/components/world/wildlife/domains/definingWildlifeAggroConstants';
import { DEFINING_WILDLIFE_STALK_SURROUND_APPROACH_WALK_MAX_DISTANCE_GRID } from '@/components/world/wildlife/domains/definingWildlifeStalkConstants';
import type { DefiningWildlifeInstance } from '@/components/world/wildlife/domains/definingWildlifeTypes';
import { resolvingWildlifeStalkSurroundEngagementIntent } from '@/components/world/wildlife/domains/resolvingWildlifeStalkSurroundEngagementIntent';
import { describe, expect, it } from 'vitest';

function buildingStalkFormationInstance(
  instanceId: string,
  position: DefiningWildlifeInstance['position']
): DefiningWildlifeInstance {
  return {
    instanceId,
    speciesId: 'grey-wolf',
    anchorId: instanceId,
    aggressionLevel: 'normal',
    sleepScheduleSample: 0,
    sizeScaleSample: 1,
    spawnAnchor: position,
    position,
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
      fleeTargetPoint: null,
      feedingOnKillUntilMs: null,
      feedingOnKillGroundItemId: null,
      isSleeping: false,
      hasSleepBeenDisturbed: false,
    hasPlayerSleepBumpContact: false,
    },
    aggroState: {
      threats: [],
      activeTargetId: 'player-1',
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

describe('checkingWildlifeStalkerCaughtUpToStillPrey', () => {
  const preyPosition = { x: 10, y: 10, layer: 1 };

  it('returns false while the prey is still moving', () => {
    expect(
      checkingWildlifeStalkerCaughtUpToStillPrey({
        position: { x: 3, y: 10, layer: 1 },
        preyPosition,
        preyStillDurationMs: 0,
      })
    ).toBe(false);
  });

  it('returns true when caught up and the prey has been still', () => {
    expect(
      checkingWildlifeStalkerCaughtUpToStillPrey({
        position: { x: 3, y: 10, layer: 1 },
        preyPosition,
        preyStillDurationMs: 2_000,
      })
    ).toBe(true);
  });

  it('returns false when still catching up to the prey', () => {
    expect(
      checkingWildlifeStalkerCaughtUpToStillPrey({
        position: { x: -5, y: 10, layer: 1 },
        preyPosition,
        preyStillDurationMs: 2_000,
      })
    ).toBe(false);
  });
});

describe('resolvingWildlifeStalkSurroundEngagementIntent', () => {
  const preyPosition = { x: 10, y: 10, layer: 1 };
  const surroundPoint = { x: 13.5, y: 10.5, layer: 1 };
  const alphaFormation = { isAlpha: true, followerRank: 0 };
  const followerFormation = { isAlpha: false, followerRank: 1 };

  it('walks toward the flank point while still far away', () => {
    const intent = resolvingWildlifeStalkSurroundEngagementIntent({
      position: { x: 5, y: 10, layer: 1 },
      preyTargetId: 'player-1',
      preyPosition,
      surroundPoint,
      currentIntent: { mode: 'idle' },
      formation: alphaFormation,
      alphaHasCommittedAttack: false,
    });

    expect(intent.mode).toBe('stalk');
    if (intent.mode === 'stalk') {
      expect(intent.targetPoint).toEqual(surroundPoint);
    }
  });

  it('runs the last stretch toward the flank point', () => {
    const intent = resolvingWildlifeStalkSurroundEngagementIntent({
      position: {
        x:
          surroundPoint.x -
          DEFINING_WILDLIFE_STALK_SURROUND_APPROACH_WALK_MAX_DISTANCE_GRID +
          1,
        y: surroundPoint.y,
        layer: 1,
      },
      preyTargetId: 'player-1',
      preyPosition,
      surroundPoint,
      currentIntent: { mode: 'idle' },
      formation: alphaFormation,
      alphaHasCommittedAttack: false,
    });

    expect(intent.mode).toBe('chase');
    if (intent.mode === 'chase') {
      expect(intent.targetPoint).toEqual(surroundPoint);
    }
  });

  it('closes on the player after holding the flank point', () => {
    const intent = resolvingWildlifeStalkSurroundEngagementIntent({
      position: surroundPoint,
      preyTargetId: 'player-1',
      preyPosition,
      surroundPoint,
      currentIntent: { mode: 'idle' },
      formation: alphaFormation,
      alphaHasCommittedAttack: false,
    });

    expect(intent.mode).toBe('chase');
    if (intent.mode === 'chase') {
      expect(intent.targetPoint).toEqual(preyPosition);
    }
  });

  it('keeps rushing the player after leaving the flank point', () => {
    const intent = resolvingWildlifeStalkSurroundEngagementIntent({
      position: { x: 11.5, y: 10, layer: 1 },
      preyTargetId: 'player-1',
      preyPosition,
      surroundPoint,
      currentIntent: {
        mode: 'chase',
        targetInstanceId: 'player-1',
        targetPoint: preyPosition,
      },
      formation: alphaFormation,
      alphaHasCommittedAttack: true,
    });

    expect(intent.mode).toBe('chase');
    if (intent.mode === 'chase') {
      expect(intent.targetPoint).toEqual(preyPosition);
    }
  });

  it('attacks once the player is in melee range after the surround rush', () => {
    const intent = resolvingWildlifeStalkSurroundEngagementIntent({
      position: {
        x: preyPosition.x + DEFINING_WILDLIFE_MELEE_RANGE_GRID * 0.8,
        y: preyPosition.y,
        layer: 1,
      },
      preyTargetId: 'player-1',
      preyPosition,
      surroundPoint,
      currentIntent: {
        mode: 'chase',
        targetInstanceId: 'player-1',
        targetPoint: preyPosition,
      },
      formation: alphaFormation,
      alphaHasCommittedAttack: true,
    });

    expect(intent.mode).toBe('attack');
  });

  it('holds followers at the flank until the alpha commits', () => {
    const intent = resolvingWildlifeStalkSurroundEngagementIntent({
      position: surroundPoint,
      preyTargetId: 'player-1',
      preyPosition,
      surroundPoint,
      currentIntent: { mode: 'idle' },
      formation: followerFormation,
      alphaHasCommittedAttack: false,
    });

    expect(intent.mode).toBe('stalk');
    if (intent.mode === 'stalk') {
      expect(intent.targetPoint).toEqual(surroundPoint);
    }
  });
});
