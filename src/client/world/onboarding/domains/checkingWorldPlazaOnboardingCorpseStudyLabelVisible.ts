import { checkingWildlifeCorpseStudySelectionKey } from '@/components/world/wildlife/domains/formattingWildlifeCorpseStudySelectionKey';

/**
 * Returns true when a wildlife corpse Study label should be visible.
 */
export function checkingWorldPlazaOnboardingCorpseStudyLabelVisible(
  selectedInteractableBlockKeys: ReadonlySet<string>
): boolean {
  for (const selectionKey of selectedInteractableBlockKeys) {
    if (checkingWildlifeCorpseStudySelectionKey(selectionKey)) {
      return true;
    }
  }

  return false;
}
