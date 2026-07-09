import { resolvingWildlifeLocomotionPresentation } from '@/components/world/wildlife/domains/resolvingWildlifeLocomotionPresentation';
import { describe, expect, it } from 'vitest';

describe('resolvingWildlifeLocomotionPresentation', () => {
  const baseAiState = {
    intent: {
      mode: 'stalk' as const,
      targetInstanceId: 'player-1',
      targetPoint: { x: 0, y: 0, layer: 1 },
    },
    facingDirection: 'Down' as const,
    motionClip: 'run' as const,
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
    chargeWindupStartedAtMs: null,
    fleeTargetPoint: null,
    feedingOnKillUntilMs: null,
    feedingOnKillGroundItemId: null,
    isSleeping: false,
    hasSleepBeenDisturbed: false,
  hasPlayerSleepBumpContact: false,
  };

  it('forces idle when a stale run clip has no movement', () => {
    const presentation = resolvingWildlifeLocomotionPresentation({
      aiState: baseAiState,
      intent: baseAiState.intent,
      movedDistanceGrid: 0,
      nowMs: 1_000,
    });

    expect(presentation).toEqual({
      isMoving: false,
      motionClip: 'idle',
    });
  });

  it('keeps stalk movement on walk when the wolf actually moved', () => {
    const presentation = resolvingWildlifeLocomotionPresentation({
      aiState: baseAiState,
      intent: baseAiState.intent,
      movedDistanceGrid: 0.12,
      nowMs: 1_000,
    });

    expect(presentation).toEqual({
      isMoving: true,
      motionClip: 'walk',
    });
  });
});
