import {
  advancingWildlifeWolfHowlTriggers,
  checkingWildlifeInstanceIsHowling,
  requestingWildlifeWolfHowl,
} from '@/components/world/wildlife/domains/advancingWildlifeWolfHowlTick';
import { creatingWildlifeTestInstance } from '@/components/world/wildlife/domains/creatingWildlifeTestFixtures';
import {
  DEFINING_WILDLIFE_WOLF_ATTACK2_DAMAGE_MULTIPLIER,
  DEFINING_WILDLIFE_WOLF_ATTACK3_DAMAGE_MULTIPLIER,
  DEFINING_WILDLIFE_WOLF_ATTACK_COMBO_RESET_MS,
  DEFINING_WILDLIFE_WOLF_HOWL_COOLDOWN_MS,
  DEFINING_WILDLIFE_WOLF_HOWL_DURATION_MS,
} from '@/components/world/wildlife/domains/definingWildlifeWolfVocalizationConstants';
import {
  resolvingWildlifeWolfAttackComboIndexAfterSwing,
  resolvingWildlifeWolfAttackComboIndexForSwing,
  resolvingWildlifeWolfAttackDamageMultiplier,
  resolvingWildlifeWolfAttackMotionClip,
} from '@/components/world/wildlife/domains/resolvingWildlifeWolfAttackMotionClip';
import { describe, expect, it } from 'vitest';

describe('resolvingWildlifeWolfAttackMotionClip', () => {
  it('cycles attack, attack2, and attack3 for grey wolves', () => {
    expect(resolvingWildlifeWolfAttackMotionClip('grey-wolf', 0)).toBe(
      'attack'
    );
    expect(resolvingWildlifeWolfAttackMotionClip('grey-wolf', 1)).toBe(
      'attack2'
    );
    expect(resolvingWildlifeWolfAttackMotionClip('grey-wolf', 2)).toBe(
      'attack3'
    );
    expect(
      resolvingWildlifeWolfAttackComboIndexAfterSwing('grey-wolf', 2)
    ).toBe(0);
  });

  it('resets the combo after a long gap between bites', () => {
    expect(
      resolvingWildlifeWolfAttackComboIndexForSwing({
        speciesId: 'grey-wolf',
        attackComboIndex: 2,
        lastAttackAtMs: 1_000,
        nowMs: 1_000 + DEFINING_WILDLIFE_WOLF_ATTACK_COMBO_RESET_MS + 1,
      })
    ).toBe(0);
  });

  it('scales finisher damage highest', () => {
    expect(
      resolvingWildlifeWolfAttackDamageMultiplier('grey-wolf', 'attack')
    ).toBe(1);
    expect(
      resolvingWildlifeWolfAttackDamageMultiplier('grey-wolf', 'attack2')
    ).toBe(DEFINING_WILDLIFE_WOLF_ATTACK2_DAMAGE_MULTIPLIER);
    expect(
      resolvingWildlifeWolfAttackDamageMultiplier('grey-wolf', 'attack3')
    ).toBe(DEFINING_WILDLIFE_WOLF_ATTACK3_DAMAGE_MULTIPLIER);
  });
});

describe('advancingWildlifeWolfHowlTick', () => {
  it('locks the wolf on the howl clip for the configured duration', () => {
    const nowMs = 10_000;
    const howling = requestingWildlifeWolfHowl(
      creatingWildlifeTestInstance(),
      nowMs
    );

    expect(checkingWildlifeInstanceIsHowling(howling, nowMs + 100)).toBe(true);
    expect(howling.aiState.motionClip).toBe('idle');
    expect(howling.aiState.howlingUntilMs).toBe(
      nowMs + DEFINING_WILDLIFE_WOLF_HOWL_DURATION_MS
    );
  });

  it('requests a howl when the pack alpha opens a hunt', () => {
    const instance = creatingWildlifeTestInstance();
    const howling = advancingWildlifeWolfHowlTriggers({
      instance,
      previousAggroState: {
        ...instance.aggroState,
        stalkPhase: 'idle',
      },
      nextAggroState: {
        ...instance.aggroState,
        stalkPhase: 'shadowing',
        stalkingPreySinceMs: 12_000,
      },
      previousIntent: { mode: 'wander', targetPoint: instance.position },
      nextIntent: {
        mode: 'stalk',
        targetInstanceId: 'player-1',
        targetPoint: { x: 8, y: 0.5, layer: 1 },
      },
      isPackAlpha: true,
      nowMs: 12_000,
    });

    expect(checkingWildlifeInstanceIsHowling(howling, 12_100)).toBe(true);
  });

  it('respects the howl cooldown', () => {
    const cooledDownAtMs =
      20_000 + DEFINING_WILDLIFE_WOLF_HOWL_COOLDOWN_MS - 100;
    const instance = creatingWildlifeTestInstance({
      aiState: {
        ...creatingWildlifeTestInstance().aiState,
        lastHowlAtMs: 20_000,
        hasUsedBluffCharge: false,
        bluffChargePlayerExitedTerritory: false,
        bluffReturnPoint: null,
        docileFollowUntilMs: null,
        docileLastReactAtMs: null,
      },
    });
    const blocked = requestingWildlifeWolfHowl(instance, cooledDownAtMs);

    expect(blocked.aiState.howlingUntilMs).toBeNull();
  });
});
