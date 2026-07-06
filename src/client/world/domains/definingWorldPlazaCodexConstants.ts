/**
 * Codex menu sections opened from the plaza action bar book button.
 *
 * @module components/world/domains/definingWorldPlazaCodexConstants
 */

import {
  STYLING_WORLD_PLAZA_ACTION_BAR_TRANSFORM_OPTION_ACTIVE_CLASS_NAME,
  STYLING_WORLD_PLAZA_ACTION_BAR_TRANSFORM_OPTION_BASE_CLASS_NAME,
  STYLING_WORLD_PLAZA_ACTION_BAR_TRANSFORM_OPTION_INACTIVE_CLASS_NAME,
} from '@/components/world/domains/definingWorldPlazaActionBarConstants';
import { DEFINING_WORLD_PLAZA_GAMEPLAY_HUD_STYLE } from '@/components/world/domains/definingWorldPlazaGameplayHudStyleConstants';

/** Codex section identifiers opened from the book menu. */
export type WorldPlazaCodexSectionId = 'controls' | 'mechanics' | 'lore';

/** One selectable entry in the codex dropdown menu. */
export type WorldPlazaCodexMenuOption = {
  id: WorldPlazaCodexSectionId;
  label: string;
  icon: string;
  description: string;
};

/** Ordered codex menu entries below the action bar book button. */
export const DEFINING_WORLD_PLAZA_CODEX_MENU_OPTIONS: readonly WorldPlazaCodexMenuOption[] =
  [
    {
      id: 'controls',
      label: 'Controls',
      icon: 'solar:gamepad-bold',
      description: 'Movement, build, and combat',
    },
    {
      id: 'mechanics',
      label: 'Mechanics',
      icon: 'mdi:hammer',
      description: 'Damage, status effects, and badges',
    },
    {
      id: 'lore',
      label: 'Lore',
      icon: 'mdi:book-open-page-variant',
      description: 'Coming soon',
    },
  ] as const;

/** Accessible label for the codex action in the plaza action bar. */
export const LABELING_WORLD_PLAZA_ACTION_BAR_CODEX = 'Guide' as const;

/** Accessible label for the codex dropdown menu. */
export const LABELING_WORLD_PLAZA_CODEX_MENU = 'Guide sections' as const;

/** Wrapper anchoring the codex dropdown to its action bar button. */
export const STYLING_WORLD_PLAZA_ACTION_BAR_CODEX_ANCHOR_CLASS_NAME =
  'relative flex shrink-0 items-center' as const;

/** Dropdown panel listing codex sections below the action bar. */
export const STYLING_WORLD_PLAZA_CODEX_MENU_PANEL_CLASS_NAME =
  `${DEFINING_WORLD_PLAZA_GAMEPLAY_HUD_STYLE.cssShell.actionBarDropdown} pointer-events-auto absolute left-1/2 top-full z-50 mt-2 flex w-max min-w-[11rem] -translate-x-1/2 flex-col gap-1 p-1.5 font-body` as const;

/** Base classes shared by every codex menu option button. */
export const STYLING_WORLD_PLAZA_CODEX_MENU_OPTION_BASE_CLASS_NAME =
  `${STYLING_WORLD_PLAZA_ACTION_BAR_TRANSFORM_OPTION_BASE_CLASS_NAME} flex items-center gap-2` as const;

/** Classes applied to the active codex menu option (none selected in dropdown). */
export const STYLING_WORLD_PLAZA_CODEX_MENU_OPTION_ACTIVE_CLASS_NAME =
  STYLING_WORLD_PLAZA_ACTION_BAR_TRANSFORM_OPTION_ACTIVE_CLASS_NAME;

/** Classes applied to inactive codex menu options. */
export const STYLING_WORLD_PLAZA_CODEX_MENU_OPTION_INACTIVE_CLASS_NAME =
  STYLING_WORLD_PLAZA_ACTION_BAR_TRANSFORM_OPTION_INACTIVE_CLASS_NAME;

/** Placeholder copy for mechanics and lore sections. */
export const LABELING_WORLD_PLAZA_CODEX_PLACEHOLDER_BODY =
  'This section is coming soon.' as const;

/** Modal overlay classes for codex placeholder panels. */
export const DEFINING_WORLD_PLAZA_CODEX_OVERLAY_CLASS_NAME =
  'pointer-events-auto fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 py-6' as const;

/** Section titles for codex placeholder overlays. */
export const LABELING_WORLD_PLAZA_CODEX_SECTION_TITLES: Record<
  Exclude<WorldPlazaCodexSectionId, 'controls'>,
  string
> = {
  mechanics: 'Mechanics',
  lore: 'Lore',
} as const;
