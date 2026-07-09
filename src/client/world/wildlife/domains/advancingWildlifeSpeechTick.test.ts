import { creatingWorldPlazaEntityHealthInitialState } from '@/components/world/health/domains/managingWorldPlazaEntityHealthState';
import { advancingWildlifeSpeechTick } from '@/components/world/wildlife/domains/advancingWildlifeSpeechTick';
import { creatingWildlifeInitialStaminaState } from '@/components/world/wildlife/domains/advancingWildlifeStaminaTick';
import {
  DEFINING_WILDLIFE_SPEECH_BUBBLE_DURATION_MS,
  DEFINING_WILDLIFE_SPEECH_COOLDOWN_MS,
  DEFINING_WILDLIFE_SPEECH_TONE_TEXT_COLORS,
} from '@/components/world/wildlife/domains/definingWildlifeSpeechConstants';
import type {
  DefiningWildlifeInstance,
  DefiningWildlifeSpeechState,
} from '@/components/world/wildlife/domains/definingWildlifeTypes';
import { resolvingWildlifeSpeechContextFromIntent } from '@/components/world/wildlife/domains/resolvingWildlifeSpeechContextFromIntent';
import { resolvingWildlifeSpeechLinePresentation } from '@/components/world/wildlife/domains/resolvingWildlifeSpeechLinePresentation';
import { describe, expect, it } from 'vitest';

function buildingTestWildlifeInstance(
  overrides: Partial<DefiningWildlifeInstance> = {}
): DefiningWildlifeInstance {
  return {
    instanceId: 'wildlife:4:7:0',
    speciesId: 'cow',
    anchorId: 'wildlife:4:7:0',
    aggressionLevel: 'tame',
    sleepScheduleSample: 0,
    sizeScaleSample: 1,
    spawnAnchor: { x: 4.5, y: 7.5, layer: 1 },
    position: { x: 4.5, y: 7.5, layer: 1 },
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
    floatingTexts: [],
    speechState: {
      activeBubble: null,
      lastEmittedAtMs: null,
      lastContextKey: null,
    },
    environmentalDamageLastTickAtMs: null,
    isDead: false,
    diedAtMs: null,
    hasDroppedLoot: false,
    hasBeenStudied: false,
    ...overrides,
  };
}

function findingCowEatingSpeechAtMs(
  nowMs: number
): DefiningWildlifeSpeechState | null {
  const instance = buildingTestWildlifeInstance({
    aiState: {
      ...buildingTestWildlifeInstance().aiState,
      intent: { mode: 'graze' },
    },
    speechState: {
      activeBubble: null,
      lastEmittedAtMs: null,
      lastContextKey: null,
    },
  });

  const speechState = advancingWildlifeSpeechTick({ instance, nowMs });

  return speechState.activeBubble ? speechState : null;
}

describe('resolvingWildlifeSpeechContextFromIntent', () => {
  it('maps behavior intents to state-specific speech contexts', () => {
    const baseInstance = buildingTestWildlifeInstance();

    expect(
      resolvingWildlifeSpeechContextFromIntent({
        instance: {
          ...baseInstance,
          aiState: {
            ...baseInstance.aiState,
            intent: { mode: 'flee', targetPoint: { x: 1, y: 1, layer: 1 } },
          },
        },
        nowMs: 1000,
      })
    ).toBe('flee');

    expect(
      resolvingWildlifeSpeechContextFromIntent({
        instance: {
          ...baseInstance,
          aiState: {
            ...baseInstance.aiState,
            intent: {
              mode: 'chase',
              targetInstanceId: 'player-1',
              targetPoint: { x: 1, y: 1, layer: 1 },
            },
          },
        },
        nowMs: 1000,
      })
    ).toBe('chase');

    expect(
      resolvingWildlifeSpeechContextFromIntent({
        instance: {
          ...baseInstance,
          aiState: {
            ...baseInstance.aiState,
            intent: {
              mode: 'followPlayer',
              targetInstanceId: 'player-1',
              targetPoint: { x: 1, y: 1, layer: 1 },
            },
          },
        },
        nowMs: 1000,
      })
    ).toBe('friendly');

    expect(
      resolvingWildlifeSpeechContextFromIntent({
        instance: {
          ...baseInstance,
          aiState: {
            ...baseInstance.aiState,
            intent: {
              mode: 'attack',
              targetInstanceId: 'player-1',
              targetPoint: { x: 1, y: 1, layer: 1 },
            },
          },
        },
        nowMs: 1000,
      })
    ).toBe('attack');

    expect(
      resolvingWildlifeSpeechContextFromIntent({
        instance: {
          ...baseInstance,
          aiState: {
            ...baseInstance.aiState,
            intent: {
              mode: 'stalk',
              targetInstanceId: 'player-1',
              targetPoint: { x: 1, y: 1, layer: 1 },
            },
          },
        },
        nowMs: 1000,
      })
    ).toBe('stalk');

    expect(
      resolvingWildlifeSpeechContextFromIntent({
        instance: {
          ...baseInstance,
          aiState: {
            ...baseInstance.aiState,
            intent: { mode: 'graze' },
          },
        },
        nowMs: 1000,
      })
    ).toBe('eating');

    expect(
      resolvingWildlifeSpeechContextFromIntent({
        instance: {
          ...baseInstance,
          aggressionLevel: 'normal',
          aiState: {
            ...baseInstance.aiState,
            intent: { mode: 'return', targetPoint: { x: 1, y: 1, layer: 1 } },
          },
        },
        nowMs: 1000,
      })
    ).toBe('neutral');

    expect(
      resolvingWildlifeSpeechContextFromIntent({
        instance: {
          ...baseInstance,
          aiState: {
            ...baseInstance.aiState,
            feedingOnKillUntilMs: 5000,
            intent: { mode: 'idle' },
          },
        },
        nowMs: 1000,
      })
    ).toBe('eatingAggressive');
  });
});

describe('advancingWildlifeSpeechTick', () => {
  it('emits a friendly cow line while grazing', () => {
    let speechState: DefiningWildlifeSpeechState | null = null;
    let emittedAtMs = 0;

    outer: for (let tileX = 0; tileX < 16; tileX += 1) {
      for (let tileY = 0; tileY < 16; tileY += 1) {
        for (let nowMs = 0; nowMs < 50_000; nowMs += 250) {
          const instance = buildingTestWildlifeInstance({
            position: { x: tileX + 0.5, y: tileY + 0.5, layer: 1 },
            aiState: {
              ...buildingTestWildlifeInstance().aiState,
              intent: { mode: 'graze' },
            },
          });

          speechState = advancingWildlifeSpeechTick({ instance, nowMs });

          if (speechState.activeBubble) {
            emittedAtMs = nowMs;
            break outer;
          }
        }
      }
    }

    expect(speechState?.activeBubble?.message).toMatch(
      /Moo|mmm|mnch|crrnch|glrp|nmm|chrP|smkk|glug|gulp/i
    );
    expect(speechState?.activeBubble?.presentation.textColor).toBe(
      DEFINING_WILDLIFE_SPEECH_TONE_TEXT_COLORS.eating
    );
    expect(speechState?.activeBubble?.expiresAtMs).toBe(
      emittedAtMs + DEFINING_WILDLIFE_SPEECH_BUBBLE_DURATION_MS
    );
  });

  it('emits a flee line when deer enters flee context', () => {
    const nowMs = 20_000;
    let speechState: DefiningWildlifeSpeechState | null = null;

    for (let offset = 0; offset < 500; offset += 1) {
      const instance = buildingTestWildlifeInstance({
        speciesId: 'deer',
        position: { x: 9, y: 3, layer: 1 },
        aggressionLevel: 'normal',
        aiState: {
          ...buildingTestWildlifeInstance().aiState,
          intent: {
            mode: 'flee',
            targetPoint: { x: 12, y: 3, layer: 1 },
          },
        },
      });

      speechState = advancingWildlifeSpeechTick({
        instance,
        nowMs: nowMs + offset,
      });

      if (speechState.activeBubble) {
        break;
      }
    }

    expect(speechState?.activeBubble?.message).toMatch(
      /Snort!|Skree!|EeeeEE!|Aaaah!|Yiii!/i
    );
    expect(speechState?.activeBubble?.presentation.textColor).toBe(
      DEFINING_WILDLIFE_SPEECH_TONE_TEXT_COLORS.flee
    );
  });

  it('emits red attack noise when a chicken bites', () => {
    let speechState: DefiningWildlifeSpeechState | null = null;

    for (let nowMs = 0; nowMs < 20_000; nowMs += 50) {
      speechState = advancingWildlifeSpeechTick({
        instance: buildingTestWildlifeInstance({
          speciesId: 'chicken',
          aggressionLevel: 'aggressive',
          position: { x: 3, y: 5, layer: 1 },
          aiState: {
            ...buildingTestWildlifeInstance().aiState,
            intent: {
              mode: 'attack',
              targetInstanceId: 'player-1',
              targetPoint: { x: 4, y: 5, layer: 1 },
            },
          },
        }),
        nowMs,
      });

      if (speechState.activeBubble) {
        break;
      }
    }

    expect(speechState?.activeBubble?.message).toMatch(
      /BWAAAK!|SKWAAAK!|KRRRKK!|SNAAAP!|GRRRR!|RAAWR!|CHOMP!|GNRRR!/i
    );
    expect(speechState?.activeBubble?.presentation.textColor).toBe(
      DEFINING_WILDLIFE_SPEECH_TONE_TEXT_COLORS.attack
    );
  });

  it('blocks back-to-back lines during cooldown', () => {
    let firstSpeech: DefiningWildlifeSpeechState | null = null;
    let emittedAtMs = 0;

    for (let nowMs = 0; nowMs < 50_000; nowMs += 250) {
      firstSpeech = findingCowEatingSpeechAtMs(nowMs);

      if (firstSpeech?.activeBubble) {
        emittedAtMs = nowMs;
        break;
      }
    }

    expect(firstSpeech?.activeBubble).not.toBeNull();

    const instance = buildingTestWildlifeInstance({
      aiState: {
        ...buildingTestWildlifeInstance().aiState,
        intent: { mode: 'graze' },
      },
      speechState: firstSpeech ?? {
        activeBubble: null,
        lastEmittedAtMs: null,
        lastContextKey: null,
      },
    });

    const blockedSpeech = advancingWildlifeSpeechTick({
      instance: {
        ...instance,
        speechState: {
          ...instance.speechState,
          activeBubble: null,
        },
      },
      nowMs: emittedAtMs + DEFINING_WILDLIFE_SPEECH_COOLDOWN_MS - 100,
    });

    expect(blockedSpeech.activeBubble).toBeNull();
  });

  it('tracks neutral context for normal lions while idle', () => {
    const speechState = advancingWildlifeSpeechTick({
      instance: buildingTestWildlifeInstance({
        speciesId: 'lion',
        aggressionLevel: 'normal',
        position: { x: 2, y: 2, layer: 1 },
        aiState: {
          ...buildingTestWildlifeInstance().aiState,
          intent: { mode: 'idle' },
        },
      }),
      nowMs: 40_000,
    });

    expect(speechState.activeBubble).toBeNull();
    expect(speechState.lastContextKey).toBe('neutral');
  });

  it('clears expired bubbles on the next tick', () => {
    const speechState = advancingWildlifeSpeechTick({
      instance: buildingTestWildlifeInstance({
        speechState: {
          activeBubble: {
            message: 'Moo',
            expiresAtMs: 1000,
            presentation: resolvingWildlifeSpeechLinePresentation(
              'Moo',
              'neutral'
            ),
          },
          lastEmittedAtMs: 0,
          lastContextKey: 'neutral',
        },
      }),
      nowMs: 1000,
    });

    expect(speechState.activeBubble).toBeNull();
  });

  it('shows Zzz speech while the animal is sleeping', () => {
    const speechState = advancingWildlifeSpeechTick({
      instance: buildingTestWildlifeInstance({
        aiState: {
          ...buildingTestWildlifeInstance().aiState,
          isSleeping: true,
          intent: { mode: 'idle' },
        },
      }),
      nowMs: 5000,
    });

    expect(speechState.activeBubble).not.toBeNull();
    expect(speechState.activeBubble?.message.toLowerCase()).toContain('z');
    expect(speechState.lastContextKey).toBe('sleep');
  });

  it('emits quiet stalk lines while a wolf shadows the player', () => {
    let speechState: DefiningWildlifeSpeechState | null = null;

    for (let nowMs = 0; nowMs < 30_000; nowMs += 50) {
      speechState = advancingWildlifeSpeechTick({
        instance: buildingTestWildlifeInstance({
          speciesId: 'grey-wolf',
          aggressionLevel: 'normal',
          position: { x: 6, y: 4, layer: 1 },
          aiState: {
            ...buildingTestWildlifeInstance().aiState,
            intent: {
              mode: 'stalk',
              targetInstanceId: 'player-1',
              targetPoint: { x: 10, y: 4, layer: 1 },
            },
          },
        }),
        nowMs,
      });

      if (speechState.activeBubble) {
        break;
      }
    }

    expect(speechState?.activeBubble?.message).toMatch(
      /sniff|snf|rrr|\.\.\.|hff|snff/i
    );
    expect(speechState?.activeBubble?.presentation.textColor).toBe(
      DEFINING_WILDLIFE_SPEECH_TONE_TEXT_COLORS.stalk
    );
    expect(speechState?.activeBubble?.presentation.fontSizePx).toBe(9);
  });
});
