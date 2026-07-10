import {
  DEFINING_WORLD_PLAZA_RUN_ANIMATION_SPEED_SCALE_MAX,
  DEFINING_WORLD_PLAZA_RUN_ANIMATION_SPEED_SCALE_MIN,
} from '@/components/world/domains/definingWorldPlazaRunAnimationSpeedScaleConstants';
import { resolvingWorldPlazaRunAnimationSpeedScale } from '@/components/world/domains/resolvingWorldPlazaRunAnimationSpeedScale';
import { describe, expect, it } from 'vitest';

describe('resolvingWorldPlazaRunAnimationSpeedScale', () => {
  it('returns 1 at full run speed', () => {
    expect(resolvingWorldPlazaRunAnimationSpeedScale(3, 3)).toBe(1);
  });

  it('scales with current speed and clamps', () => {
    expect(resolvingWorldPlazaRunAnimationSpeedScale(1.5, 3)).toBeCloseTo(0.5);
    expect(resolvingWorldPlazaRunAnimationSpeedScale(0, 3)).toBe(
      DEFINING_WORLD_PLAZA_RUN_ANIMATION_SPEED_SCALE_MIN
    );
    expect(resolvingWorldPlazaRunAnimationSpeedScale(6, 3)).toBe(
      DEFINING_WORLD_PLAZA_RUN_ANIMATION_SPEED_SCALE_MAX
    );
  });

  it('returns 1 when full run speed is non-positive', () => {
    expect(resolvingWorldPlazaRunAnimationSpeedScale(2, 0)).toBe(1);
  });
});
