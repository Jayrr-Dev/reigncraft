import type { DefiningWorldPlazaHudToolbarModeId } from '@/components/world/domains/definingWorldPlazaHudToolbarModeRegistry';
import type { DefiningWorldPlazaEntityTemperatureComfortBand } from '@/components/world/health/domains/definingWorldPlazaTemperatureTypes';
import { DEFINING_WORLD_PLAZA_INTERACTABLE_TREE_SELECTION_KEY_PREFIX } from '@/components/world/interaction/domains/formattingWorldPlazaInteractableTreeSelectionKey';
import { checkingWorldPlazaOnboardingCorpseStudyLabelVisible } from '@/components/world/onboarding/domains/checkingWorldPlazaOnboardingCorpseStudyLabelVisible';
import { checkingWorldPlazaOnboardingTemperatureOutsideComfort } from '@/components/world/onboarding/domains/checkingWorldPlazaOnboardingTemperatureOutsideComfort';
import type {
  WorldPlazaOnboardingCoachmarkDefinition,
  WorldPlazaOnboardingCoachmarkStepId,
} from '@/components/world/onboarding/domains/definingWorldPlazaOnboardingCoachmarkConstants';
import {
  DEFINING_WORLD_PLAZA_ONBOARDING_COACHMARK_CONTEXTUAL_ORDER,
  DEFINING_WORLD_PLAZA_ONBOARDING_COACHMARK_CORE_ORDER,
  resolvingWorldPlazaOnboardingCoachmarkDefinition,
} from '@/components/world/onboarding/domains/definingWorldPlazaOnboardingCoachmarkRegistry';
import type { WorldPlazaOnboardingCoachmarkSessionSignals } from '@/components/world/onboarding/domains/managingWorldPlazaOnboardingCoachmarkStore';

export type ResolvingWorldPlazaOnboardingCoachmarkLiveSignals = {
  readonly sessionSignals: WorldPlazaOnboardingCoachmarkSessionSignals;
  readonly hudToolbarMode: DefiningWorldPlazaHudToolbarModeId;
  readonly isEditEnabled: boolean;
  readonly hungerRatio: number | null;
  readonly localTemperatureCelsius: number | null;
  readonly temperatureComfortBand: DefiningWorldPlazaEntityTemperatureComfortBand | null;
  readonly spritcoreInventoryQuantity: number;
  readonly hasAnyPets: boolean;
  readonly isChopLabelVisible: boolean;
  readonly isCorpseStudyLabelVisible: boolean;
  readonly hasUnequippedTool: boolean;
  readonly hasEquippedTool: boolean;
};

const RESOLVING_WORLD_PLAZA_ONBOARDING_HUNGER_TIP_RATIO_THRESHOLD = 0.98;

function checkingWorldPlazaOnboardingContextualStepEligible(
  stepId: WorldPlazaOnboardingCoachmarkStepId,
  liveSignals: ResolvingWorldPlazaOnboardingCoachmarkLiveSignals
): boolean {
  switch (stepId) {
    case 'chop':
      return liveSignals.isChopLabelVisible;
    case 'loot':
      return liveSignals.sessionSignals.hasLootPickup;
    case 'equip-tool':
      return liveSignals.hasUnequippedTool;
    case 'hunger':
      return (
        liveSignals.hungerRatio !== null &&
        liveSignals.hungerRatio <
          RESOLVING_WORLD_PLAZA_ONBOARDING_HUNGER_TIP_RATIO_THRESHOLD
      );
    case 'temperature':
      return checkingWorldPlazaOnboardingTemperatureOutsideComfort(
        liveSignals.localTemperatureCelsius,
        liveSignals.temperatureComfortBand
      );
    case 'craft':
      return !liveSignals.sessionSignals.hasCraftModeSelected;
    case 'codex':
      return liveSignals.sessionSignals.hasActionBarClicked;
    case 'study':
      return liveSignals.isCorpseStudyLabelVisible;
    case 'build':
      return (
        liveSignals.isEditEnabled &&
        !liveSignals.sessionSignals.hasBuildModeSelected
      );
    case 'claim':
      return (
        liveSignals.isEditEnabled &&
        !liveSignals.sessionSignals.hasClaimModeSelected
      );
    case 'spritcore':
      return liveSignals.spritcoreInventoryQuantity > 0;
    case 'pets':
      return liveSignals.hasAnyPets;
    default:
      return false;
  }
}

/**
 * Picks the next coachmark to show from completed steps and live world signals.
 */
export function resolvingWorldPlazaOnboardingActiveCoachmark(
  completedStepIds: ReadonlySet<WorldPlazaOnboardingCoachmarkStepId>,
  liveSignals: ResolvingWorldPlazaOnboardingCoachmarkLiveSignals
): WorldPlazaOnboardingCoachmarkDefinition | null {
  for (const stepId of DEFINING_WORLD_PLAZA_ONBOARDING_COACHMARK_CORE_ORDER) {
    if (!completedStepIds.has(stepId)) {
      return resolvingWorldPlazaOnboardingCoachmarkDefinition(stepId);
    }
  }

  for (const stepId of DEFINING_WORLD_PLAZA_ONBOARDING_COACHMARK_CONTEXTUAL_ORDER) {
    if (completedStepIds.has(stepId)) {
      continue;
    }

    if (
      checkingWorldPlazaOnboardingContextualStepEligible(stepId, liveSignals)
    ) {
      return resolvingWorldPlazaOnboardingCoachmarkDefinition(stepId);
    }
  }

  return null;
}

/**
 * Returns true when a live signal satisfies the active step advance event.
 */
export function checkingWorldPlazaOnboardingCoachmarkAdvanceSatisfied(
  definition: WorldPlazaOnboardingCoachmarkDefinition,
  liveSignals: ResolvingWorldPlazaOnboardingCoachmarkLiveSignals
): boolean {
  switch (definition.advanceEvent) {
    case 'move':
      return liveSignals.sessionSignals.hasMoved;
    case 'hotbar-click':
      return liveSignals.sessionSignals.hasHotbarClicked;
    case 'action-bar-click':
      return liveSignals.sessionSignals.hasActionBarClicked;
    case 'chop-start':
      return liveSignals.sessionSignals.hasChopStarted;
    case 'loot-pickup':
      return liveSignals.sessionSignals.hasLootPickup;
    case 'equip-tool':
      return liveSignals.hasEquippedTool;
    case 'hunger-click':
      return liveSignals.sessionSignals.hasHungerClicked;
    case 'temperature-click':
      return liveSignals.sessionSignals.hasTemperatureClicked;
    case 'craft-mode-select':
      return liveSignals.sessionSignals.hasCraftModeSelected;
    case 'codex-open':
      return liveSignals.sessionSignals.hasCodexOpened;
    case 'study-start':
      return liveSignals.sessionSignals.hasStudyStarted;
    case 'build-mode-select':
      return liveSignals.sessionSignals.hasBuildModeSelected;
    case 'claim-mode-select':
      return liveSignals.sessionSignals.hasClaimModeSelected;
    case 'spritcore-view':
      return liveSignals.sessionSignals.hasProfileOpened;
    case 'pets-open':
      return liveSignals.sessionSignals.hasPetsOpened;
    default:
      return false;
  }
}

/**
 * Returns true when any selected interactable key refers to a nearby tree chop label.
 */
export function checkingWorldPlazaOnboardingChopLabelVisibleFromSelectionKeys(
  selectedInteractableBlockKeys: ReadonlySet<string>
): boolean {
  for (const selectionKey of selectedInteractableBlockKeys) {
    if (
      selectionKey.startsWith(
        `${DEFINING_WORLD_PLAZA_INTERACTABLE_TREE_SELECTION_KEY_PREFIX}:`
      )
    ) {
      return true;
    }
  }

  return false;
}

/**
 * Returns true when a wildlife corpse Study label should be visible.
 */
export function checkingWorldPlazaOnboardingCorpseStudyLabelVisibleFromSelectionKeys(
  selectedInteractableBlockKeys: ReadonlySet<string>
): boolean {
  return checkingWorldPlazaOnboardingCorpseStudyLabelVisible(
    selectedInteractableBlockKeys
  );
}
