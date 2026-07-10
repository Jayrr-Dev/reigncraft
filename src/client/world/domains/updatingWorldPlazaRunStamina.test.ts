import { applyingWorldPlazaRunStaminaAfterActionSpend } from '@/components/world/domains/applyingWorldPlazaRunStaminaAfterActionSpend';
import { advancingWorldPlazaPlayerStaminaFatigueTier } from '@/components/world/domains/advancingWorldPlazaPlayerStaminaFatigueTier';
import { applyingWorldPlazaPlayerStaminaOnFullDepletion } from '@/components/world/domains/applyingWorldPlazaPlayerStaminaOnFullDepletion';
import { checkingWorldPlazaPlayerStaminaFatigueCanUseStaminaAgain } from '@/components/world/domains/checkingWorldPlazaPlayerStaminaFatigueCanUseStaminaAgain';
import {
  DEFINING_WORLD_PLAZA_RUN_STAMINA_ACTION_SPEND_REGEN_DELAY_MS,
  DEFINING_WORLD_PLAZA_RUN_STAMINA_DEPLETION_REGEN_DELAY_MS,
  DEFINING_WORLD_PLAZA_RUN_STAMINA_DRAIN_PER_SECOND,
  DEFINING_WORLD_PLAZA_RUN_STAMINA_INITIAL_STATE,
  DEFINING_WORLD_PLAZA_RUN_STAMINA_REGEN_PER_SECOND,
} from '@/components/world/domains/definingWorldPlazaRunStaminaConstants';
import { resettingWorldPlazaPlayerStaminaFatigueOnFullBar } from '@/components/world/domains/resettingWorldPlazaPlayerStaminaFatigueOnFullBar';
import { updatingWorldPlazaRunStamina } from '@/components/world/domains/updatingWorldPlazaRunStamina';
import { describe, expect, it } from 'vitest';

describe('applyingWorldPlazaRunStaminaAfterActionSpend', () => {
  it('starts the configurable post-action regen pause', () => {
    const nowMs = 1_000;

    expect(
      applyingWorldPlazaRunStaminaAfterActionSpend({
        state: DEFINING_WORLD_PLAZA_RUN_STAMINA_INITIAL_STATE,
        nextStaminaRatio: 0.5,
        nowMs,
        hitZero: false,
      })
    ).toEqual({
      staminaRatio: 0.5,
      fatigueTier: 'fresh',
      isDepleted: false,
      depletedAtMs: null,
      regenPausedUntilMs:
        nowMs + DEFINING_WORLD_PLAZA_RUN_STAMINA_ACTION_SPEND_REGEN_DELAY_MS,
      runningForSeconds: 0,
    });
  });

  it('advances fatigue tier when an action fully empties the bar', () => {
    const nowMs = 1_000;

    expect(
      applyingWorldPlazaRunStaminaAfterActionSpend({
        state: DEFINING_WORLD_PLAZA_RUN_STAMINA_INITIAL_STATE,
        nextStaminaRatio: 0,
        nowMs,
        hitZero: true,
      })
    ).toEqual({
      staminaRatio: 0,
      fatigueTier: 'winded',
      isDepleted: true,
      depletedAtMs: nowMs,
      regenPausedUntilMs:
        nowMs + DEFINING_WORLD_PLAZA_RUN_STAMINA_ACTION_SPEND_REGEN_DELAY_MS,
      runningForSeconds: 0,
    });
  });
});

describe('updatingWorldPlazaRunStamina action regen pause', () => {
  it('does not regenerate while the post-action pause is active', () => {
    const spentAtMs = 1_000;
    const state = applyingWorldPlazaRunStaminaAfterActionSpend({
      state: DEFINING_WORLD_PLAZA_RUN_STAMINA_INITIAL_STATE,
      nextStaminaRatio: 0.5,
      nowMs: spentAtMs,
      hitZero: false,
    });
    const nowMs =
      spentAtMs +
      DEFINING_WORLD_PLAZA_RUN_STAMINA_ACTION_SPEND_REGEN_DELAY_MS -
      1;

    const { state: nextState } = updatingWorldPlazaRunStamina({
      state,
      deltaSeconds: 0.5,
      nowMs,
      isAttemptingRun: false,
    });

    expect(nextState.staminaRatio).toBe(0.5);
  });

  it('regenerates after the post-action pause expires', () => {
    const state = applyingWorldPlazaRunStaminaAfterActionSpend({
      state: DEFINING_WORLD_PLAZA_RUN_STAMINA_INITIAL_STATE,
      nextStaminaRatio: 0.5,
      nowMs: 1_000,
      hitZero: false,
    });
    const nowMs =
      1_000 + DEFINING_WORLD_PLAZA_RUN_STAMINA_ACTION_SPEND_REGEN_DELAY_MS + 1;

    const { state: nextState } = updatingWorldPlazaRunStamina({
      state,
      deltaSeconds: 0.5,
      nowMs,
      isAttemptingRun: false,
    });

    expect(nextState.staminaRatio).toBeGreaterThan(0.5);
    expect(nextState.regenPausedUntilMs).toBeNull();
  });
});

describe('player stamina fatigue tiers', () => {
  it('progresses fresh -> winded -> fatigued -> spent -> collapsed on full depletions', () => {
    expect(advancingWorldPlazaPlayerStaminaFatigueTier('fresh')).toBe('winded');
    expect(advancingWorldPlazaPlayerStaminaFatigueTier('winded')).toBe('fatigued');
    expect(advancingWorldPlazaPlayerStaminaFatigueTier('fatigued')).toBe('spent');
    expect(advancingWorldPlazaPlayerStaminaFatigueTier('spent')).toBe('collapsed');
    expect(advancingWorldPlazaPlayerStaminaFatigueTier('collapsed')).toBe(
      'collapsed'
    );
  });

  it('locks winded usage until 85% of the bar refills', () => {
    const depletedAtMs = 0;
    const state = applyingWorldPlazaPlayerStaminaOnFullDepletion({
      state: DEFINING_WORLD_PLAZA_RUN_STAMINA_INITIAL_STATE,
      nextStaminaRatio: 0,
      nowMs: depletedAtMs,
    });

    expect(state.fatigueTier).toBe('winded');
    expect(
      checkingWorldPlazaPlayerStaminaFatigueCanUseStaminaAgain(state, 0.84)
    ).toBe(false);
    expect(
      checkingWorldPlazaPlayerStaminaFatigueCanUseStaminaAgain(state, 0.85)
    ).toBe(true);
  });

  it('unlocks spent usage at 40% bar fill', () => {
    const state = {
      ...DEFINING_WORLD_PLAZA_RUN_STAMINA_INITIAL_STATE,
      fatigueTier: 'spent' as const,
      isDepleted: true,
      depletedAtMs: 0,
    };

    expect(
      checkingWorldPlazaPlayerStaminaFatigueCanUseStaminaAgain(state, 0.39)
    ).toBe(false);
    expect(
      checkingWorldPlazaPlayerStaminaFatigueCanUseStaminaAgain(state, 0.4)
    ).toBe(true);
  });

  it('regenerates at full speed while collapsed', () => {
    const depletedAtMs = 0;
    const afterHoldMs =
      depletedAtMs + DEFINING_WORLD_PLAZA_RUN_STAMINA_DEPLETION_REGEN_DELAY_MS + 1;
    const state = {
      ...applyingWorldPlazaPlayerStaminaOnFullDepletion({
        state: {
          ...DEFINING_WORLD_PLAZA_RUN_STAMINA_INITIAL_STATE,
          fatigueTier: 'spent',
        },
        nextStaminaRatio: 0,
        nowMs: depletedAtMs,
      }),
      regenPausedUntilMs: null,
    };

    expect(state.fatigueTier).toBe('collapsed');

    const { state: normalRegen } = updatingWorldPlazaRunStamina({
      state: {
        ...DEFINING_WORLD_PLAZA_RUN_STAMINA_INITIAL_STATE,
        staminaRatio: 0,
        isDepleted: true,
        depletedAtMs,
        regenPausedUntilMs: null,
      },
      deltaSeconds: 1,
      nowMs: afterHoldMs,
      isAttemptingRun: false,
    });

    const { state: collapsedRegen } = updatingWorldPlazaRunStamina({
      state,
      deltaSeconds: 1,
      nowMs: afterHoldMs,
      isAttemptingRun: false,
    });

    expect(collapsedRegen.staminaRatio).toBeCloseTo(normalRegen.staminaRatio, 5);
  });

  it('resets fatigue tier when the bar returns to full', () => {
    const state = resettingWorldPlazaPlayerStaminaFatigueOnFullBar({
      ...DEFINING_WORLD_PLAZA_RUN_STAMINA_INITIAL_STATE,
      staminaRatio: 1,
      fatigueTier: 'collapsed',
      isDepleted: false,
      depletedAtMs: null,
    });

    expect(state.fatigueTier).toBe('fresh');
    expect(state.isDepleted).toBe(false);
  });

  it('advances fatigue tier when running drains the bar to zero', () => {
    const nowMs = 5_000;
    const { state } = updatingWorldPlazaRunStamina({
      state: {
        ...DEFINING_WORLD_PLAZA_RUN_STAMINA_INITIAL_STATE,
        staminaRatio: DEFINING_WORLD_PLAZA_RUN_STAMINA_DRAIN_PER_SECOND * 0.01,
      },
      deltaSeconds: 0.02,
      nowMs,
      isAttemptingRun: true,
    });

    expect(state.staminaRatio).toBe(0);
    expect(state.fatigueTier).toBe('winded');
    expect(state.isDepleted).toBe(true);
    expect(state.depletedAtMs).toBe(nowMs);
  });

  it('accumulates runningForSeconds while sprinting and resets when stopped', () => {
    const first = updatingWorldPlazaRunStamina({
      state: DEFINING_WORLD_PLAZA_RUN_STAMINA_INITIAL_STATE,
      deltaSeconds: 0.2,
      nowMs: 1_000,
      isAttemptingRun: true,
    });

    expect(first.isRunning).toBe(true);
    expect(first.state.runningForSeconds).toBeCloseTo(0.2);

    const second = updatingWorldPlazaRunStamina({
      state: first.state,
      deltaSeconds: 0.3,
      nowMs: 1_300,
      isAttemptingRun: true,
    });

    expect(second.state.runningForSeconds).toBeCloseTo(0.5);

    const stopped = updatingWorldPlazaRunStamina({
      state: second.state,
      deltaSeconds: 0.1,
      nowMs: 1_400,
      isAttemptingRun: false,
    });

    expect(stopped.isRunning).toBe(false);
    expect(stopped.state.runningForSeconds).toBe(0);
  });

  it('clears depletion at the collapsed 15% usage gate without resetting tier until full', () => {
    const depletedAtMs = 0;
    const afterHoldMs =
      depletedAtMs + DEFINING_WORLD_PLAZA_RUN_STAMINA_DEPLETION_REGEN_DELAY_MS + 1;
    const depletedState = {
      ...applyingWorldPlazaPlayerStaminaOnFullDepletion({
        state: {
          ...DEFINING_WORLD_PLAZA_RUN_STAMINA_INITIAL_STATE,
          fatigueTier: 'spent',
        },
        nextStaminaRatio: 0,
        nowMs: depletedAtMs,
      }),
      regenPausedUntilMs: null,
    };

    expect(depletedState.fatigueTier).toBe('collapsed');

    const regenSeconds = 0.16 / DEFINING_WORLD_PLAZA_RUN_STAMINA_REGEN_PER_SECOND;
    const { state: recoveredState } = updatingWorldPlazaRunStamina({
      state: depletedState,
      deltaSeconds: regenSeconds,
      nowMs: afterHoldMs,
      isAttemptingRun: false,
    });

    expect(recoveredState.staminaRatio).toBeGreaterThanOrEqual(0.15);
    expect(recoveredState.isDepleted).toBe(false);
    expect(recoveredState.fatigueTier).toBe('collapsed');
  });
});
