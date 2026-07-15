import { DEFINING_WORLD_PLAZA_INTERACTABLE_FLOWER_SELECTION_KEY_PREFIX } from '@/components/world/interaction/domains/formattingWorldPlazaInteractableFlowerSelectionKey';
import { DEFINING_WORLD_PLAZA_INTERACTABLE_MUSHROOM_SELECTION_KEY_PREFIX } from '@/components/world/interaction/domains/formattingWorldPlazaInteractableMushroomSelectionKey';
import { DEFINING_WORLD_PLAZA_INTERACTABLE_PEBBLE_SELECTION_KEY_PREFIX } from '@/components/world/interaction/domains/formattingWorldPlazaInteractablePebbleSelectionKey';

const CHECKING_WORLD_PLAZA_ONBOARDING_FORAGE_SELECTION_KEY_PREFIXES = [
  DEFINING_WORLD_PLAZA_INTERACTABLE_FLOWER_SELECTION_KEY_PREFIX,
  DEFINING_WORLD_PLAZA_INTERACTABLE_MUSHROOM_SELECTION_KEY_PREFIX,
  DEFINING_WORLD_PLAZA_INTERACTABLE_PEBBLE_SELECTION_KEY_PREFIX,
] as const;

/**
 * Returns true when a flower, mushroom, or pebble pick label should be visible.
 */
export function checkingWorldPlazaOnboardingForageLabelVisible(
  selectedInteractableBlockKeys: ReadonlySet<string>
): boolean {
  for (const selectionKey of selectedInteractableBlockKeys) {
    for (const prefix of CHECKING_WORLD_PLAZA_ONBOARDING_FORAGE_SELECTION_KEY_PREFIXES) {
      if (selectionKey.startsWith(`${prefix}:`)) {
        return true;
      }
    }
  }

  return false;
}
