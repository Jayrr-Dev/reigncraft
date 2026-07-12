/**
 * Declarative registry for bottom HUD toolbar mode badges (Items / Craft / Build / Claim).
 *
 * @module components/world/domains/definingWorldPlazaHudToolbarModeRegistry
 */

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

/**
 * Compact badge chrome sized to sit above the inventory hotbar.
 * Scaled with inventory hotbar scale at resolve time.
 */
export const DEFINING_WORLD_PLAZA_HUD_TOOLBAR_MODE_BADGE_LAYOUT = {
  /** Vertical padding inside each badge. */
  paddingYBasePx: 3,
  /** Horizontal padding inside each badge. */
  paddingXBasePx: 3,
  /** Tighter horizontal padding on narrow viewports. */
  mobilePaddingXBasePx: 2,
  /** Gap between icon and label. */
  iconLabelGapBasePx: 3,
  /** Tighter icon/label gap on narrow viewports. */
  mobileIconLabelGapBasePx: 2,
  /** Gap between badge buttons. */
  buttonGapBasePx: 3,
  /** Label font size (desktop). */
  labelTextBasePx: 10,
  /** Label font on narrow viewports. */
  mobileLabelTextBasePx: 8,
  /** Icon edge length. */
  iconBasePx: 11,
  /** Slightly smaller icon on narrow viewports. */
  mobileIconBasePx: 10,
  /** Letter-spacing for uppercase labels (em). */
  labelTrackingEm: 0.08,
  /** Tighter tracking on narrow viewports. */
  mobileLabelTrackingEm: 0.04,
} as const;

/** Accessible label for the HUD toolbar mode badge row. */
export const LABELING_WORLD_PLAZA_HUD_TOOLBAR_MODE_SWITCHER =
  'Inventory, craft, claim, or build' as const;

/**
 * Badge row stretches to the inventory hotbar shell width.
 */
export const STYLING_WORLD_PLAZA_HUD_TOOLBAR_MODE_SWITCHER_CLASS_NAME =
  'flex w-full items-stretch' as const;

/** Inactive HUD toolbar mode badge shell — equal share of the hotbar width. */
export const STYLING_WORLD_PLAZA_HUD_TOOLBAR_MODE_BUTTON_CLASS_NAME =
  'inline-flex min-w-0 flex-1 items-center justify-center rounded-md border border-poster-gold/30 bg-poster-teal-deep/90 font-bold uppercase text-parchment shadow-md shadow-black/35 backdrop-blur-sm transition-[transform,background-color,border-color,box-shadow] hover:border-poster-gold/50 hover:bg-poster-teal-deep hover:text-parchment disabled:cursor-not-allowed disabled:opacity-40' as const;

/** Active HUD toolbar mode badge shell — equal share of the hotbar width. */
export const STYLING_WORLD_PLAZA_HUD_TOOLBAR_MODE_BUTTON_ACTIVE_CLASS_NAME =
  'inline-flex min-w-0 flex-1 items-center justify-center rounded-md border border-poster-gold/70 bg-[linear-gradient(180deg,#2c4a52_0%,#1a3038_100%)] font-bold uppercase text-[#f4d35e] shadow-[0_0_0_1px_rgba(244,211,94,0.25),0_2px_8px_rgba(0,0,0,0.45)] backdrop-blur-sm disabled:cursor-not-allowed disabled:opacity-40' as const;

/** Icon size inside a HUD toolbar mode badge (edge set via inline styles). */
export const STYLING_WORLD_PLAZA_HUD_TOOLBAR_MODE_ICON_CLASS_NAME =
  'shrink-0 text-current' as const;

/**
 * Column wrapping mode badges and the active bottom toolbar body.
 * Badge header width locks to the inventory shell; toolbar body centers under it.
 */
export const STYLING_WORLD_PLAZA_HUD_TOOLBAR_BOTTOM_STACK_CLASS_NAME =
  'pointer-events-none inline-flex flex-col items-stretch gap-1' as const;

/** Header row that hosts the mode badges (pointer-events restored). */
export const STYLING_WORLD_PLAZA_HUD_TOOLBAR_MODE_HEADER_CLASS_NAME =
  'pointer-events-auto flex w-full flex-col' as const;

/** Label text inside a mode badge — truncates when the hotbar is narrow. */
export const STYLING_WORLD_PLAZA_HUD_TOOLBAR_MODE_LABEL_CLASS_NAME =
  'min-w-0 truncate leading-none' as const;
