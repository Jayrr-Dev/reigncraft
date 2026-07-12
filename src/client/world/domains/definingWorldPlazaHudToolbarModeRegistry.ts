/**
 * Declarative registry for bottom HUD toolbar mode badges (Items / Craft / Build / Claim).
 *
 * @module components/world/domains/definingWorldPlazaHudToolbarModeRegistry
 */

import {
  STYLING_WORLD_PLAZA_EDIT_MODE_SESSION_MODE_BUTTON_ACTIVE_CLASS_NAME,
  STYLING_WORLD_PLAZA_EDIT_MODE_SESSION_MODE_BUTTON_CLASS_NAME,
  STYLING_WORLD_PLAZA_EDIT_MODE_SESSION_MODE_ICON_CLASS_NAME,
  STYLING_WORLD_PLAZA_EDIT_MODE_SESSION_MODE_SWITCHER_CLASS_NAME,
} from '@/components/world/building/domains/definingWorldPlazaBuildModeFunctionHotbarConstants';

/** Stable ids for bottom HUD toolbar modes. */
export const DEFINING_WORLD_PLAZA_HUD_TOOLBAR_MODE_ID = {
  ITEMS: 'items',
  CRAFT: 'craft',
  BUILD: 'build',
  CLAIM: 'claim',
} as const;

/** One bottom HUD toolbar mode id. */
export type DefiningWorldPlazaHudToolbarModeId =
  (typeof DEFINING_WORLD_PLAZA_HUD_TOOLBAR_MODE_ID)[keyof typeof DEFINING_WORLD_PLAZA_HUD_TOOLBAR_MODE_ID];

/** Display + icon metadata for one HUD toolbar mode badge. */
export type DefiningWorldPlazaHudToolbarModeDefinition = {
  readonly id: DefiningWorldPlazaHudToolbarModeId;
  readonly label: string;
  readonly ariaLabel: string;
  readonly iconifyIcon: string;
  /** When true, badge is disabled when build/claim is unavailable for the session. */
  readonly requiresEditEnabled: boolean;
};

/** Ordered bottom HUD mode badges (left → right). */
export const DEFINING_WORLD_PLAZA_HUD_TOOLBAR_MODE_REGISTRY = [
  {
    id: DEFINING_WORLD_PLAZA_HUD_TOOLBAR_MODE_ID.ITEMS,
    label: 'Items',
    ariaLabel: 'Items inventory',
    iconifyIcon: 'mdi:bag-personal',
    requiresEditEnabled: false,
  },
  {
    id: DEFINING_WORLD_PLAZA_HUD_TOOLBAR_MODE_ID.CRAFT,
    label: 'Craft',
    ariaLabel: 'Crafting',
    iconifyIcon: 'game-icons:anvil',
    requiresEditEnabled: false,
  },
  {
    id: DEFINING_WORLD_PLAZA_HUD_TOOLBAR_MODE_ID.CLAIM,
    label: 'Claim',
    ariaLabel: 'Claim mode',
    iconifyIcon: 'mdi:land-plots',
    requiresEditEnabled: true,
  },
  {
    id: DEFINING_WORLD_PLAZA_HUD_TOOLBAR_MODE_ID.BUILD,
    label: 'Build',
    ariaLabel: 'Build mode',
    iconifyIcon: 'mdi:hammer',
    requiresEditEnabled: true,
  },
] as const satisfies readonly DefiningWorldPlazaHudToolbarModeDefinition[];

/** Accessible label for the HUD toolbar mode badge row. */
export const LABELING_WORLD_PLAZA_HUD_TOOLBAR_MODE_SWITCHER =
  'Inventory, craft, claim, or build' as const;

/** Row layout for HUD toolbar mode badges above the bottom hotbar. */
export const STYLING_WORLD_PLAZA_HUD_TOOLBAR_MODE_SWITCHER_CLASS_NAME =
  STYLING_WORLD_PLAZA_EDIT_MODE_SESSION_MODE_SWITCHER_CLASS_NAME;

/** Inactive HUD toolbar mode badge shell. */
export const STYLING_WORLD_PLAZA_HUD_TOOLBAR_MODE_BUTTON_CLASS_NAME =
  STYLING_WORLD_PLAZA_EDIT_MODE_SESSION_MODE_BUTTON_CLASS_NAME;

/** Active HUD toolbar mode badge shell. */
export const STYLING_WORLD_PLAZA_HUD_TOOLBAR_MODE_BUTTON_ACTIVE_CLASS_NAME =
  STYLING_WORLD_PLAZA_EDIT_MODE_SESSION_MODE_BUTTON_ACTIVE_CLASS_NAME;

/** Icon size inside a HUD toolbar mode badge. */
export const STYLING_WORLD_PLAZA_HUD_TOOLBAR_MODE_ICON_CLASS_NAME =
  STYLING_WORLD_PLAZA_EDIT_MODE_SESSION_MODE_ICON_CLASS_NAME;

/** Column wrapping mode badges and the active bottom toolbar body. */
export const STYLING_WORLD_PLAZA_HUD_TOOLBAR_BOTTOM_STACK_CLASS_NAME =
  'pointer-events-none flex flex-col items-center gap-1' as const;

/** Header row that hosts the mode badges (pointer-events restored). */
export const STYLING_WORLD_PLAZA_HUD_TOOLBAR_MODE_HEADER_CLASS_NAME =
  'pointer-events-auto flex flex-col items-center' as const;
