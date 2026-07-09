import {
  checkingWildlifeStalkInitialPhaseComplete,
  checkingWildlifeStalkKillConditions,
  checkingWildlifeStalkPackSurroundCommit,
} from '@/components/world/wildlife/domains/checkingWildlifeStalkKillConditions';
import {
  DEFINING_WILDLIFE_STALK_INITIAL_PHASE_MS,
  DEFINING_WILDLIFE_STALK_PREY_STILL_COMMIT_MS,
} from '@/components/world/wildlife/domains/definingWildlifeStalkConstants';
import {
  checkingWildlifeStalkConfidenceCommit,
  resolvingWildlifeStalkPackConfidenceCommitChance,
} from '@/components/world/wildlife/domains/resolvingWildlifeStalkPackConfidenceCommit';
import { describe, expect, it } from 'vitest';

const completedInitialPhaseMs = DEFINING_WILDLIFE_STALK_INITIAL_PHASE_MS;

const healthyPrey = {
  preyHealthRatio: 1,
  preyStaminaRatio: 1,
  preyStaminaIsDepleted: false,
  preyStillDurationMs: 0,
};

describe('resolvingWildlifeStalkPackConfidenceCommitChance', () => {
  it('rises with pack size and peaks at five or more', () => {
    expect(resolvingWildlifeStalkPackConfidenceCommitChance(1)).toBe(0.1);
    expect(resolvingWildlifeStalkPackConfidenceCommitChance(3)).toBe(0.4);
    expect(resolvingWildlifeStalkPackConfidenceCommitChance(5)).toBe(0.88);
    expect(resolvingWildlifeStalkPackConfidenceCommitChance(8)).toBe(0.88);
  });
});

describe('checkingWildlifeStalkConfidenceCommit', () => {
  it('is stable for the same hunt bucket and pack size', () => {
    const params = {
      stalkPackCount: 5,
      preyTargetId: 'player-1',
      stalkingPreySinceMs: 1_000,
      nowMs: 1_000 + completedInitialPhaseMs + 500,
    };

    expect(checkingWildlifeStalkConfidenceCommit(params)).toBe(
      checkingWildlifeStalkConfidenceCommit(params)
    );
  });
});

describe('checkingWildlifeStalkKillConditions', () => {
  it('keeps stalking during the mandatory opening shadow phase', () => {
    expect(
      checkingWildlifeStalkKillConditions({
        ...healthyPrey,
        preyHealthRatio: 0.49,
        preyStaminaIsDepleted: true,
        preyStillDurationMs: DEFINING_WILDLIFE_STALK_PREY_STILL_COMMIT_MS,
        stalkingElapsedMs: completedInitialPhaseMs - 1,
      })
    ).toBe(false);
    expect(
      checkingWildlifeStalkPackSurroundCommit({
        ...healthyPrey,
        preyHealthRatio: 0.49,
        stalkPackCount: 5,
        stalkingElapsedMs: completedInitialPhaseMs - 1,
      })
    ).toBe(false);
  });

  it('opens the kill window when prey is below half health after the opening phase', () => {
    expect(
      checkingWildlifeStalkKillConditions({
        preyHealthRatio: 0.49,
        preyStaminaRatio: 1,
        preyStaminaIsDepleted: false,
        preyStillDurationMs: 0,
        stalkingElapsedMs: completedInitialPhaseMs,
      })
    ).toBe(true);
  });

  it('opens the kill window when prey stamina is depleted after the opening phase', () => {
    expect(
      checkingWildlifeStalkKillConditions({
        preyHealthRatio: 1,
        preyStaminaRatio: 0,
        preyStaminaIsDepleted: true,
        preyStillDurationMs: 0,
        stalkingElapsedMs: completedInitialPhaseMs,
      })
    ).toBe(true);
  });

  it('does not open the kill window from pack size alone without a confidence roll context', () => {
    expect(
      checkingWildlifeStalkKillConditions({
        ...healthyPrey,
        stalkingElapsedMs: completedInitialPhaseMs,
      })
    ).toBe(false);
  });

  it('stays in shadow mode while prey is healthy and the pack is small without rolling', () => {
    expect(
      checkingWildlifeStalkKillConditions({
        preyHealthRatio: 0.9,
        preyStaminaRatio: 0.8,
        preyStaminaIsDepleted: false,
        preyStillDurationMs: 0,
        stalkingElapsedMs: completedInitialPhaseMs,
      })
    ).toBe(false);
  });

  it('opens the kill window when prey has stood still long enough after the opening phase', () => {
    expect(
      checkingWildlifeStalkKillConditions({
        ...healthyPrey,
        preyStillDurationMs: DEFINING_WILDLIFE_STALK_PREY_STILL_COMMIT_MS,
        stalkingElapsedMs: completedInitialPhaseMs,
      })
    ).toBe(true);
  });

  it('may open from pack confidence after the shadow without weakness', () => {
    const stalkingPreySinceMs = 10_000;
    const nowMs = stalkingPreySinceMs + completedInitialPhaseMs + 100;
    const opened = checkingWildlifeStalkKillConditions({
      ...healthyPrey,
      stalkingElapsedMs: completedInitialPhaseMs,
      stalkPackCount: 5,
      preyTargetId: 'player-confidence',
      stalkingPreySinceMs,
      nowMs,
    });
    const rolled = checkingWildlifeStalkConfidenceCommit({
      stalkPackCount: 5,
      preyTargetId: 'player-confidence',
      stalkingPreySinceMs,
      nowMs,
    });

    expect(opened).toBe(rolled);
  });

  it('marks the initial stalk phase complete at fifteen seconds', () => {
    expect(checkingWildlifeStalkInitialPhaseComplete(14_999)).toBe(false);
    expect(
      checkingWildlifeStalkInitialPhaseComplete(
        DEFINING_WILDLIFE_STALK_INITIAL_PHASE_MS
      )
    ).toBe(true);
  });
});

describe('checkingWildlifeStalkPackSurroundCommit', () => {
  it('requires three hunters and a weakness trigger before surrounding', () => {
    expect(
      checkingWildlifeStalkPackSurroundCommit({
        ...healthyPrey,
        stalkPackCount: 3,
        stalkingElapsedMs: completedInitialPhaseMs,
      })
    ).toBe(false);

    expect(
      checkingWildlifeStalkPackSurroundCommit({
        preyHealthRatio: 0.49,
        preyStaminaRatio: 1,
        preyStaminaIsDepleted: false,
        preyStillDurationMs: 0,
        stalkPackCount: 2,
        stalkingElapsedMs: completedInitialPhaseMs,
      })
    ).toBe(false);

    expect(
      checkingWildlifeStalkPackSurroundCommit({
        preyHealthRatio: 0.49,
        preyStaminaRatio: 1,
        preyStaminaIsDepleted: false,
        preyStillDurationMs: 0,
        stalkPackCount: 3,
        stalkingElapsedMs: completedInitialPhaseMs,
      })
    ).toBe(true);
  });
});
