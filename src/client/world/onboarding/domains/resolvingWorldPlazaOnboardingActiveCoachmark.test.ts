import { DEFINING_WORLD_PLAZA_HUD_TOOLBAR_MODE_ID } from '@/components/world/domains/definingWorldPlazaHudToolbarModeRegistry';
import { resolvingWorldPlazaOnboardingCoachmarkDefinition } from '@/components/world/onboarding/domains/definingWorldPlazaOnboardingCoachmarkRegistry';
import {
  checkingWorldPlazaOnboardingCoachmarkAdvanceSatisfied,
  resolvingWorldPlazaOnboardingActiveCoachmark,
} from '@/components/world/onboarding/domains/resolvingWorldPlazaOnboardingActiveCoachmark';
import { describe, expect, it } from 'vitest';

const RESOLVING_WORLD_PLAZA_ONBOARDING_TEST_EMPTY_SESSION_SIGNALS = {
  hasMoved: false,
  hasHotbarClicked: false,
  hasActionBarClicked: false,
  hasChopStarted: false,
  hasForagePicked: false,
  hasMineStarted: false,
  hasLootPickup: false,
  hasMeleeSwung: false,
  hasHungerClicked: false,
  hasTemperatureClicked: false,
  hasSprinted: false,
  hasStaminaDepleted: false,
  hasStatusEffectClicked: false,
  hasCraftModeSelected: false,
  hasCookStarted: false,
  hasCodexOpened: false,
  hasHerbariumCodexOpened: false,
  hasStudyStarted: false,
  hasMinimapOpened: false,
  hasBuildModeSelected: false,
  hasClaimModeSelected: false,
  hasProfileOpened: false,
  hasPetsOpened: false,
} as const;

function buildingWorldPlazaOnboardingTestLiveSignals(
  overrides: Partial<
    Parameters<typeof resolvingWorldPlazaOnboardingActiveCoachmark>[1]
  > = {}
) {
  return {
    sessionSignals: RESOLVING_WORLD_PLAZA_ONBOARDING_TEST_EMPTY_SESSION_SIGNALS,
    hudToolbarMode: DEFINING_WORLD_PLAZA_HUD_TOOLBAR_MODE_ID.ITEMS,
    isEditEnabled: false,
    hungerRatio: 1,
    localTemperatureCelsius: 20,
    temperatureComfortBand: {
      comfortLowCelsius: 10,
      comfortHighCelsius: 28,
    },
    spritcoreInventoryQuantity: 0,
    hasAnyPets: false,
    isChopLabelVisible: false,
    isForageLabelVisible: false,
    isMineLabelVisible: false,
    isCorpseStudyLabelVisible: false,
    hasUnequippedTool: false,
    hasEquippedTool: false,
    hasEquippedPickaxe: false,
    isHostileWildlifeNearby: false,
    hasRawCookableMeat: false,
    isMinimapOpen: false,
    staminaRatio: 1,
    isRunning: false,
    isStaminaDepleted: false,
    statusEffectCount: 0,
    ...overrides,
  };
}

describe('resolvingWorldPlazaOnboardingActiveCoachmark', () => {
  it('returns the first incomplete core step before contextual tips', () => {
    const activeCoachmark = resolvingWorldPlazaOnboardingActiveCoachmark(
      new Set(['move']),
      buildingWorldPlazaOnboardingTestLiveSignals()
    );

    expect(activeCoachmark?.id).toBe('hotbar');
  });

  it('shows contextual chop only after core steps are complete', () => {
    const activeCoachmark = resolvingWorldPlazaOnboardingActiveCoachmark(
      new Set(['move', 'hotbar', 'action-bar']),
      buildingWorldPlazaOnboardingTestLiveSignals({
        isChopLabelVisible: true,
      })
    );

    expect(activeCoachmark?.id).toBe('chop');
  });

  it('shows craft guidance before the player enters craft mode', () => {
    const activeCoachmark = resolvingWorldPlazaOnboardingActiveCoachmark(
      new Set([
        'move',
        'hotbar',
        'action-bar',
        'chop',
        'forage',
        'mine',
        'loot',
        'equip-tool',
        'melee',
        'hunger',
        'temperature',
        'stamina',
        'status-effects',
      ]),
      buildingWorldPlazaOnboardingTestLiveSignals()
    );

    expect(activeCoachmark?.id).toBe('craft');
  });

  it('shows mine guidance when a rock label is visible and a pickaxe is equipped', () => {
    const activeCoachmark = resolvingWorldPlazaOnboardingActiveCoachmark(
      new Set(['move', 'hotbar', 'action-bar', 'chop', 'forage']),
      buildingWorldPlazaOnboardingTestLiveSignals({
        isMineLabelVisible: true,
        hasEquippedPickaxe: true,
      })
    );

    expect(activeCoachmark?.id).toBe('mine');
  });

  it('shows herbarium guidance after the first forage pick', () => {
    const activeCoachmark = resolvingWorldPlazaOnboardingActiveCoachmark(
      new Set([
        'move',
        'hotbar',
        'action-bar',
        'chop',
        'forage',
        'mine',
        'loot',
        'equip-tool',
        'melee',
        'hunger',
        'temperature',
        'stamina',
        'status-effects',
        'craft',
        'cook',
        'codex',
      ]),
      buildingWorldPlazaOnboardingTestLiveSignals({
        sessionSignals: {
          ...RESOLVING_WORLD_PLAZA_ONBOARDING_TEST_EMPTY_SESSION_SIGNALS,
          hasForagePicked: true,
        },
      })
    );

    expect(activeCoachmark?.id).toBe('herbarium');
  });

  it('shows spritcore guidance when orbs are in inventory', () => {
    const activeCoachmark = resolvingWorldPlazaOnboardingActiveCoachmark(
      new Set([
        'move',
        'hotbar',
        'action-bar',
        'chop',
        'forage',
        'mine',
        'loot',
        'equip-tool',
        'melee',
        'hunger',
        'temperature',
        'stamina',
        'status-effects',
        'craft',
        'cook',
        'codex',
        'herbarium',
        'study',
        'minimap',
        'build',
        'claim',
      ]),
      buildingWorldPlazaOnboardingTestLiveSignals({
        spritcoreInventoryQuantity: 3,
      })
    );

    expect(activeCoachmark?.id).toBe('spritcore');
  });
});

describe('checkingWorldPlazaOnboardingCoachmarkAdvanceSatisfied', () => {
  it('completes equip-tool when the fist slot holds a tool', () => {
    const definition =
      resolvingWorldPlazaOnboardingCoachmarkDefinition('equip-tool');

    expect(
      checkingWorldPlazaOnboardingCoachmarkAdvanceSatisfied(
        definition,
        buildingWorldPlazaOnboardingTestLiveSignals({
          hasUnequippedTool: true,
          hasEquippedTool: true,
        })
      )
    ).toBe(true);
  });

  it('completes codex when the book menu was opened', () => {
    const definition =
      resolvingWorldPlazaOnboardingCoachmarkDefinition('codex');

    expect(
      checkingWorldPlazaOnboardingCoachmarkAdvanceSatisfied(
        definition,
        buildingWorldPlazaOnboardingTestLiveSignals({
          sessionSignals: {
            ...RESOLVING_WORLD_PLAZA_ONBOARDING_TEST_EMPTY_SESSION_SIGNALS,
            hasCodexOpened: true,
          },
        })
      )
    ).toBe(true);
  });

  it('completes stamina when the player sprints', () => {
    const definition =
      resolvingWorldPlazaOnboardingCoachmarkDefinition('stamina');

    expect(
      checkingWorldPlazaOnboardingCoachmarkAdvanceSatisfied(
        definition,
        buildingWorldPlazaOnboardingTestLiveSignals({
          sessionSignals: {
            ...RESOLVING_WORLD_PLAZA_ONBOARDING_TEST_EMPTY_SESSION_SIGNALS,
            hasSprinted: true,
          },
        })
      )
    ).toBe(true);
  });
});
