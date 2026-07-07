import {
  checkingWildlifeStalkInitialPhaseComplete,
  checkingWildlifeStalkKillConditions,
  checkingWildlifeStalkPackSurroundCommit,
} from '@/components/world/wildlife/domains/checkingWildlifeStalkKillConditions';
import {
  DEFINING_WILDLIFE_STALK_INITIAL_PHASE_MS,
  DEFINING_WILDLIFE_STALK_PREY_STILL_COMMIT_MS,
} from '@/components/world/wildlife/domains/definingWildlifeStalkConstants';
import { describe, expect, it } from 'vitest';

const completedInitialPhaseMs = DEFINING_WILDLIFE_STALK_INITIAL_PHASE_MS;

const healthyPrey = {
  preyHealthRatio: 1,
  preyStaminaRatio: 1,
  preyStaminaIsDepleted: false,
  preyStillDurationMs: 0,
};

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

  it('does not open the kill window from pack size alone', () => {
    expect(
      checkingWildlifeStalkKillConditions({
        ...healthyPrey,
        stalkingElapsedMs: completedInitialPhaseMs,
      })
    ).toBe(false);
  });

  it('stays in shadow mode while prey is healthy and the pack is small', () => {
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
