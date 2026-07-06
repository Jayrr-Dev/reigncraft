import { creatingWorldPlazaEntityHealthInitialState } from '@/components/world/health/domains/managingWorldPlazaEntityHealthState';
import { advancingWildlifeSpeechTick } from '@/components/world/wildlife/domains/advancingWildlifeSpeechTick';
import { creatingWildlifeInitialStaminaState } from '@/components/world/wildlife/domains/advancingWildlifeStaminaTick';
import {
  DEFINING_WILDLIFE_SPEECH_BUBBLE_DURATION_MS,
  DEFINING_WILDLIFE_SPEECH_COOLDOWN_MS,
} from '@/components/world/wildlife/domains/definingWildlifeSpeechConstants';
import type {
  DefiningWildlifeInstance,
  DefiningWildlifeSpeechState,
} from '@/components/world/wildlife/domains/definingWildlifeTypes';
import { resolvingWildlifeSpeechContextFromIntent } from '@/components/world/wildlife/domains/resolvingWildlifeSpeechContextFromIntent';
import { describe, expect, it } from 'vitest';

function buildingTestWildlifeInstance(
  overrides: Partial<DefiningWildlifeInstance> = {}
): DefiningWildlifeInstance {
  return {
    instanceId: 'wildlife:4:7:0',
    speciesId: 'cow',
    anchorId: 'wildlife:4:7:0',
    aggressionLevel: 'tame',
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
    ...overrides,
  };
}

function findingCowPassiveSpeechAtMs(
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
  it('maps flee and aggro intents to speech contexts', () => {
    expect(
      resolvingWildlifeSpeechContextFromIntent({
        intent: { mode: 'flee', targetPoint: { x: 1, y: 1, layer: 1 } },
        startledUntilMs: null,
        nowMs: 1000,
      })
    ).toBe('flee');

    expect(
      resolvingWildlifeSpeechContextFromIntent({
        intent: {
          mode: 'chase',
          targetInstanceId: 'player-1',
          targetPoint: { x: 1, y: 1, layer: 1 },
        },
        startledUntilMs: null,
        nowMs: 1000,
      })
    ).toBe('aggro');

    expect(
      resolvingWildlifeSpeechContextFromIntent({
        intent: { mode: 'return', targetPoint: { x: 1, y: 1, layer: 1 } },
        startledUntilMs: null,
        nowMs: 1000,
      })
    ).toBeNull();
  });
});

describe('advancingWildlifeSpeechTick', () => {
  it('emits a passive cow line when the enter roll passes', () => {
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

    expect(speechState?.activeBubble?.message).toMatch(/Moo|Mmm/);
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

    expect(speechState?.activeBubble?.message).toBe('Snort!');
  });

  it('blocks back-to-back lines during cooldown', () => {
    let firstSpeech: DefiningWildlifeSpeechState | null = null;
    let emittedAtMs = 0;

    for (let nowMs = 0; nowMs < 50_000; nowMs += 250) {
      firstSpeech = findingCowPassiveSpeechAtMs(nowMs);

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

  it('keeps predators silent while idle', () => {
    const speechState = advancingWildlifeSpeechTick({
      instance: buildingTestWildlifeInstance({
        speciesId: 'lion',
        position: { x: 2, y: 2, layer: 1 },
        aiState: {
          ...buildingTestWildlifeInstance().aiState,
          intent: { mode: 'idle' },
        },
      }),
      nowMs: 40_000,
    });

    expect(speechState.activeBubble).toBeNull();
    expect(speechState.lastContextKey).toBe('passive');
  });

  it('clears expired bubbles on the next tick', () => {
    const speechState = advancingWildlifeSpeechTick({
      instance: buildingTestWildlifeInstance({
        speechState: {
          activeBubble: {
            message: 'Moo',
            expiresAtMs: 1000,
          },
          lastEmittedAtMs: 0,
          lastContextKey: 'passive',
        },
      }),
      nowMs: 1000,
    });

    expect(speechState.activeBubble).toBeNull();
  });
});
