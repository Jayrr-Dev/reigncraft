import { describe, expect, it } from 'vitest';
import { listingWorldPlazaHungerPanelStatusLines } from '@/components/world/hunger/domains/listingWorldPlazaHungerPanelStatusLines';
import type { ResolvingWorldPlazaHungerMovementEffects } from '@/components/world/hunger/domains/resolvingWorldPlazaHungerMovementEffects';

const NEUTRAL_EFFECTS: ResolvingWorldPlazaHungerMovementEffects = {
  speedMultiplier: 1,
  staminaDrainMultiplier: 1,
  staminaRegenMultiplier: 1,
  jumpCostMultiplier: 1,
  isSprintDisabled: false,
  isJumpDisabled: false,
  isHealthDraining: false,
};

describe('listingWorldPlazaHungerPanelStatusLines', () => {
  it('returns no lines for neutral effects', () => {
    expect(listingWorldPlazaHungerPanelStatusLines(NEUTRAL_EFFECTS)).toEqual(
      []
    );
  });

  it('lists active modifiers and locks', () => {
    expect(
      listingWorldPlazaHungerPanelStatusLines({
        ...NEUTRAL_EFFECTS,
        speedMultiplier: 0.8,
        isSprintDisabled: true,
        isJumpDisabled: true,
        isHealthDraining: true,
      })
    ).toEqual([
      'Walk speed ×0.8',
      'Sprint locked',
      'Jump locked',
      'Health draining',
    ]);
  });
});
