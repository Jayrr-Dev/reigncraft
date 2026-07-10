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
  };

  it('forces idle when a stale run clip has no movement', () => {
    const presentation = resolvingWildlifeLocomotionPresentation({
      aiState: baseAiState,
      intent: baseAiState.intent,
      movedDistanceGrid: 0,
      deltaSeconds: 1 / 60,
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
      deltaSeconds: 1 / 60,
      nowMs: 1_000,
    });

    expect(presentation).toEqual({
      isMoving: true,
      motionClip: 'walk',
    });
  });

  it('keeps a slow walk on high-refresh frames instead of flickering to idle', () => {
    // Sheep walk: 1.5 grid/s at 144fps moves ~0.0104 grid per frame, below
    // the old fixed 0.02 grid epsilon that caused walk/idle flicker.
    const presentation = resolvingWildlifeLocomotionPresentation({
      aiState: { ...baseAiState, intent: { mode: 'wander' as const } },
      intent: { mode: 'wander' as const },
      movedDistanceGrid: 1.5 / 144,
      deltaSeconds: 1 / 144,
      nowMs: 1_000,
    });

    expect(presentation.isMoving).toBe(true);
  });

  it('keeps the current clip on zero-delta frames', () => {
    const presentation = resolvingWildlifeLocomotionPresentation({
      aiState: { ...baseAiState, motionClip: 'walk' as const },
      intent: { mode: 'wander' as const },
      movedDistanceGrid: 0,
      deltaSeconds: 0,
      nowMs: 1_000,
    });

    expect(presentation).toEqual({
      isMoving: true,
      motionClip: 'walk',
    });
  });
});
