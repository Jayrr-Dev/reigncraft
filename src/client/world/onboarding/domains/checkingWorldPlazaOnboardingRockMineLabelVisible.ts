import { DEFINING_WORLD_PLAZA_INTERACTABLE_ROCK_SELECTION_KEY_PREFIX } from '@/components/world/interaction/domains/formattingWorldPlazaInteractableRockSelectionKey';

/**
 * Returns true when a rock Mine label should be visible.
 */
export function checkingWorldPlazaOnboardingRockMineLabelVisible(
  selectedInteractableBlockKeys: ReadonlySet<string>
): boolean {
  for (const selectionKey of selectedInteractableBlockKeys) {
    if (
      selectionKey.startsWith(
        `${DEFINING_WORLD_PLAZA_INTERACTABLE_ROCK_SELECTION_KEY_PREFIX}:`
      )
    ) {
      return true;
    }
  }

  return false;
}
