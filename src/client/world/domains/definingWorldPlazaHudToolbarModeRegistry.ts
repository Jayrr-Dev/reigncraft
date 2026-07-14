/**
 * Declarative registry for bottom HUD toolbar mode badges (Items / Craft / Build↔Claim).
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

/** Face shown for one side of the Build↔Claim toggle badge. */
export type DefiningWorldPlazaHudToolbarBuildClaimToggleFace = {
  readonly modeId:
    | typeof DEFINING_WORLD_PLAZA_HUD_TOOLBAR_MODE_ID.BUILD
    | typeof DEFINING_WORLD_PLAZA_HUD_TOOLBAR_MODE_ID.CLAIM;
  readonly label: string;
  readonly ariaLabel: string;
  /** Mode glyph (hammer for build, land-plots for claim). */
  readonly iconifyIcon: string;
  /** Active badge chrome (distinct color per toggle side). */
  readonly activeButtonClassName: string;
};

/** Display + icon metadata for a single-mode HUD toolbar badge. */
export type DefiningWorldPlazaHudToolbarSingleModeBadgeDefinition = {
  readonly kind: 'mode';
  readonly id:
    | typeof DEFINING_WORLD_PLAZA_HUD_TOOLBAR_MODE_ID.ITEMS
    | typeof DEFINING_WORLD_PLAZA_HUD_TOOLBAR_MODE_ID.CRAFT;
  readonly label: string;
  readonly ariaLabel: string;
  readonly iconifyIcon: string;
  readonly requiresEditEnabled: false;
};

/** Build↔Claim combined badge — one control that toggles between edit modes. */
export type DefiningWorldPlazaHudToolbarBuildClaimToggleBadgeDefinition = {
  readonly kind: 'buildClaimToggle';
  readonly requiresEditEnabled: true;
};

/** One visible badge in the bottom HUD mode strip. */
export type DefiningWorldPlazaHudToolbarModeBadgeDefinition =
  | DefiningWorldPlazaHudToolbarSingleModeBadgeDefinition
  | DefiningWorldPlazaHudToolbarBuildClaimToggleBadgeDefinition;

/** Faces for the Build↔Claim toggle (display updates with the active edit mode). */
export const DEFINING_WORLD_PLAZA_HUD_TOOLBAR_BUILD_CLAIM_TOGGLE_FACES = {
  [DEFINING_WORLD_PLAZA_HUD_TOOLBAR_MODE_ID.BUILD]: {
    modeId: DEFINING_WORLD_PLAZA_HUD_TOOLBAR_MODE_ID.BUILD,
    label: 'Build',
    ariaLabel:
      'Build mode. Use the build/claim switch on the hotbar to change edit mode.',
    iconifyIcon: 'mdi:hammer',
    activeButtonClassName:
      'inline-flex shrink-0 items-center justify-center rounded-md border border-amber-300/80 bg-[linear-gradient(180deg,#7a4a18_0%,#4a2e0e_100%)] font-bold uppercase text-amber-100 shadow-[0_0_0_1px_rgba(251,191,36,0.35),0_2px_8px_rgba(0,0,0,0.45)] backdrop-blur-sm disabled:cursor-not-allowed disabled:opacity-40',
  },
  [DEFINING_WORLD_PLAZA_HUD_TOOLBAR_MODE_ID.CLAIM]: {
    modeId: DEFINING_WORLD_PLAZA_HUD_TOOLBAR_MODE_ID.CLAIM,
    label: 'Claim',
    ariaLabel:
      'Claim mode. Use the build/claim switch on the hotbar to change edit mode.',
    iconifyIcon: 'mdi:land-plots',
    activeButtonClassName:
      'inline-flex shrink-0 items-center justify-center rounded-md border border-sky-300/80 bg-[linear-gradient(180deg,#1e4a5c_0%,#123040_100%)] font-bold uppercase text-sky-100 shadow-[0_0_0_1px_rgba(125,211,252,0.35),0_2px_8px_rgba(0,0,0,0.45)] backdrop-blur-sm disabled:cursor-not-allowed disabled:opacity-40',
  },
} as const satisfies Record<
  | typeof DEFINING_WORLD_PLAZA_HUD_TOOLBAR_MODE_ID.BUILD
  | typeof DEFINING_WORLD_PLAZA_HUD_TOOLBAR_MODE_ID.CLAIM,
  DefiningWorldPlazaHudToolbarBuildClaimToggleFace
>;

/** Ordered bottom HUD mode badges (left → right). Claim+Build share one toggle. */
export const DEFINING_WORLD_PLAZA_HUD_TOOLBAR_MODE_BADGE_REGISTRY = [
  {
    kind: 'mode',
    id: DEFINING_WORLD_PLAZA_HUD_TOOLBAR_MODE_ID.ITEMS,
    label: 'Items',
    ariaLabel: 'Items inventory',
    iconifyIcon: 'mdi:bag-personal',
    requiresEditEnabled: false,
  },
  {
    kind: 'mode',
    id: DEFINING_WORLD_PLAZA_HUD_TOOLBAR_MODE_ID.CRAFT,
    label: 'Craft',
    ariaLabel: 'Crafting',
    iconifyIcon: 'game-icons:anvil',
    requiresEditEnabled: false,
  },
  {
    kind: 'buildClaimToggle',
    requiresEditEnabled: true,
  },
] as const satisfies readonly DefiningWorldPlazaHudToolbarModeBadgeDefinition[];

/**
 * Compact badge chrome sized to sit above the inventory hotbar.
 * Scaled with inventory hotbar scale at resolve time.
 */
export const DEFINING_WORLD_PLAZA_HUD_TOOLBAR_MODE_BADGE_LAYOUT = {
  /** Vertical padding inside each badge. */
  paddingYBasePx: 3,
  /** Extra vertical padding on narrow viewports for finger targets. */
  mobilePaddingYBasePx: 6,
  /** Horizontal padding inside each badge. */
  paddingXBasePx: 6,
  /** Wider horizontal padding on narrow viewports. */
  mobilePaddingXBasePx: 9,
  /** Gap between icon and label. */
  iconLabelGapBasePx: 3,
  /** Icon/label gap on narrow viewports. */
  mobileIconLabelGapBasePx: 3,
  /** Gap between badge buttons. */
  buttonGapBasePx: 6,
  /** Wider gap between badges on narrow viewports. */
  mobileButtonGapBasePx: 8,
  /** Label font size (desktop). */
  labelTextBasePx: 10,
  /** Larger label font on narrow viewports for readability. */
  mobileLabelTextBasePx: 11,
  /** Icon edge length. */
  iconBasePx: 11,
  /** Larger icon on narrow viewports. */
  mobileIconBasePx: 13,
  /** Letter-spacing for uppercase labels (em). */
  labelTrackingEm: 0.08,
  /** Tracking on narrow viewports. */
  mobileLabelTrackingEm: 0.05,
} as const;

/** Accessible label for the HUD toolbar mode badge row. */
export const LABELING_WORLD_PLAZA_HUD_TOOLBAR_MODE_SWITCHER =
  'Inventory, craft, or build and claim' as const;

/**
 * Badge row spans the inventory hotbar shell width.
 * Content-sized badges sit centered over the hotbar.
 */
export const STYLING_WORLD_PLAZA_HUD_TOOLBAR_MODE_SWITCHER_CLASS_NAME =
  'flex w-full items-center justify-center' as const;

/** Inactive HUD toolbar mode badge shell — width follows icon+label. */
export const STYLING_WORLD_PLAZA_HUD_TOOLBAR_MODE_BUTTON_CLASS_NAME =
  'inline-flex shrink-0 items-center justify-center rounded-md border border-poster-gold/30 bg-poster-teal-deep/90 font-bold uppercase text-parchment shadow-md shadow-black/35 backdrop-blur-sm transition-[transform,background-color,border-color,box-shadow] hover:border-poster-gold/50 hover:bg-poster-teal-deep hover:text-parchment disabled:cursor-not-allowed disabled:opacity-40' as const;

/** Active HUD toolbar mode badge shell — width follows icon+label. */
export const STYLING_WORLD_PLAZA_HUD_TOOLBAR_MODE_BUTTON_ACTIVE_CLASS_NAME =
  'inline-flex shrink-0 items-center justify-center rounded-md border border-poster-gold/70 bg-[linear-gradient(180deg,#2c4a52_0%,#1a3038_100%)] font-bold uppercase text-[#f4d35e] shadow-[0_0_0_1px_rgba(244,211,94,0.25),0_2px_8px_rgba(0,0,0,0.45)] backdrop-blur-sm disabled:cursor-not-allowed disabled:opacity-40' as const;

/** Icon size inside a HUD toolbar mode badge (edge set via inline styles). */
export const STYLING_WORLD_PLAZA_HUD_TOOLBAR_MODE_ICON_CLASS_NAME =
  'shrink-0 text-current' as const;

/** Fixed icon box so every mode glyph occupies the same footprint. */
export const STYLING_WORLD_PLAZA_HUD_TOOLBAR_MODE_ICON_SLOT_CLASS_NAME =
  'inline-flex shrink-0 items-center justify-center' as const;

/**
 * Shared icon+label cluster inside each mode badge.
 */
export const STYLING_WORLD_PLAZA_HUD_TOOLBAR_MODE_CONTENT_CLASS_NAME =
  'inline-flex items-center justify-center' as const;

/**
 * Column wrapping mode badges and the active bottom toolbar body.
 * Width is set on the stack to the inventory hotbar shell; children stretch.
 */
export const STYLING_WORLD_PLAZA_HUD_TOOLBAR_BOTTOM_STACK_CLASS_NAME =
  'pointer-events-none inline-flex w-full flex-col items-stretch gap-1' as const;

/**
 * Hotbar / craft / build body under the mode badges.
 * z-10 keeps slot-anchored popovers above the badge row (z-0).
 */
export const STYLING_WORLD_PLAZA_HUD_TOOLBAR_BOTTOM_BODY_CLASS_NAME =
  'pointer-events-auto relative z-10 flex w-full flex-col items-stretch' as const;

/**
 * Header row that hosts the mode badges (pointer-events restored).
 * Stays below the hotbar body stacking context so bag / item / Plots / Saves
 * popovers paint above Items/Craft/Claim when they open upward.
 */
export const STYLING_WORLD_PLAZA_HUD_TOOLBAR_MODE_HEADER_CLASS_NAME =
  'pointer-events-auto relative z-0 flex w-full flex-col' as const;

/**
 * Label text inside a mode badge.
 */
export const STYLING_WORLD_PLAZA_HUD_TOOLBAR_MODE_LABEL_CLASS_NAME =
  'whitespace-nowrap text-center leading-none' as const;
