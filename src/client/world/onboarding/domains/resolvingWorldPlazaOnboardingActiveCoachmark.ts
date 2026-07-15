import { DEFINING_WORLD_PLAZA_INTERACTABLE_TREE_SELECTION_KEY_PREFIX } from '@/components/world/interaction/domains/formattingWorldPlazaInteractableTreeSelectionKey';
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
  readonly isChopLabelVisible: boolean;
  readonly hasUnequippedTool: boolean;
  readonly hasEquippedTool: boolean;
};

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

    if (checkingWorldPlazaOnboardingContextualStepEligible(stepId, liveSignals)) {
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
