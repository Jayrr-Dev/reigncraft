import { resolvingWorldPlazaOnboardingCoachmarkDefinition } from '@/components/world/onboarding/domains/definingWorldPlazaOnboardingCoachmarkRegistry';
import {
  checkingWorldPlazaOnboardingCoachmarkAdvanceSatisfied,
  resolvingWorldPlazaOnboardingActiveCoachmark,
} from '@/components/world/onboarding/domains/resolvingWorldPlazaOnboardingActiveCoachmark';
import { describe, expect, it } from 'vitest';

describe('resolvingWorldPlazaOnboardingActiveCoachmark', () => {
  it('returns the first incomplete core step before contextual tips', () => {
    const activeCoachmark = resolvingWorldPlazaOnboardingActiveCoachmark(
      new Set(['move']),
      {
        sessionSignals: {
          hasMoved: true,
          hasHotbarClicked: false,
          hasActionBarClicked: false,
          hasChopStarted: false,
          hasLootPickup: false,
        },
        isChopLabelVisible: true,
        hasUnequippedTool: true,
        hasEquippedTool: false,
      }
    );

    expect(activeCoachmark?.id).toBe('hotbar');
  });

  it('shows contextual chop only after core steps are complete', () => {
    const activeCoachmark = resolvingWorldPlazaOnboardingActiveCoachmark(
      new Set(['move', 'hotbar', 'action-bar']),
      {
        sessionSignals: {
          hasMoved: true,
          hasHotbarClicked: true,
          hasActionBarClicked: true,
          hasChopStarted: false,
          hasLootPickup: false,
        },
        isChopLabelVisible: true,
        hasUnequippedTool: false,
        hasEquippedTool: false,
      }
    );

    expect(activeCoachmark?.id).toBe('chop');
  });
});

describe('checkingWorldPlazaOnboardingCoachmarkAdvanceSatisfied', () => {
  it('completes equip-tool when the fist slot holds a tool', () => {
    const definition =
      resolvingWorldPlazaOnboardingCoachmarkDefinition('equip-tool');

    expect(
      checkingWorldPlazaOnboardingCoachmarkAdvanceSatisfied(definition, {
        sessionSignals: {
          hasMoved: false,
          hasHotbarClicked: false,
          hasActionBarClicked: false,
          hasChopStarted: false,
          hasLootPickup: false,
        },
        isChopLabelVisible: false,
        hasUnequippedTool: true,
        hasEquippedTool: true,
      })
    ).toBe(true);
  });
});
