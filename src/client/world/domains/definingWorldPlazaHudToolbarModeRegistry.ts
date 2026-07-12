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
  readonly iconifyIcon: string;
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
    ariaLabel: 'Build mode. Click again to switch to claim.',
    iconifyIcon: 'mdi:hammer',
  },
  [DEFINING_WORLD_PLAZA_HUD_TOOLBAR_MODE_ID.CLAIM]: {
    modeId: DEFINING_WORLD_PLAZA_HUD_TOOLBAR_MODE_ID.CLAIM,
    label: 'Claim',
    ariaLabel: 'Claim mode. Click again to switch to build.',
    iconifyIcon: 'mdi:land-plots',
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
  'Inventory, craft, or build and claim' as const;

/**
 * Badge row stretches to the inventory hotbar shell width.
 * Equal columns so every mode tab matches ITEMS width.
 */
export const STYLING_WORLD_PLAZA_HUD_TOOLBAR_MODE_SWITCHER_CLASS_NAME =
  'grid w-full' as const;

/** Inactive HUD toolbar mode badge shell — fills one equal grid column. */
export const STYLING_WORLD_PLAZA_HUD_TOOLBAR_MODE_BUTTON_CLASS_NAME =
  'inline-flex min-w-0 w-full items-center justify-center rounded-md border border-poster-gold/30 bg-poster-teal-deep/90 font-bold uppercase text-parchment shadow-md shadow-black/35 backdrop-blur-sm transition-[transform,background-color,border-color,box-shadow] hover:border-poster-gold/50 hover:bg-poster-teal-deep hover:text-parchment disabled:cursor-not-allowed disabled:opacity-40' as const;

/** Active HUD toolbar mode badge shell — fills one equal grid column. */
export const STYLING_WORLD_PLAZA_HUD_TOOLBAR_MODE_BUTTON_ACTIVE_CLASS_NAME =
  'inline-flex min-w-0 w-full items-center justify-center rounded-md border border-poster-gold/70 bg-[linear-gradient(180deg,#2c4a52_0%,#1a3038_100%)] font-bold uppercase text-[#f4d35e] shadow-[0_0_0_1px_rgba(244,211,94,0.25),0_2px_8px_rgba(0,0,0,0.45)] backdrop-blur-sm disabled:cursor-not-allowed disabled:opacity-40' as const;

/** Icon size inside a HUD toolbar mode badge (edge set via inline styles). */
export const STYLING_WORLD_PLAZA_HUD_TOOLBAR_MODE_ICON_CLASS_NAME =
  'shrink-0 text-current' as const;

/** Fixed icon box so every mode glyph occupies the same footprint. */
export const STYLING_WORLD_PLAZA_HUD_TOOLBAR_MODE_ICON_SLOT_CLASS_NAME =
  'inline-flex shrink-0 items-center justify-center' as const;

/**
 * Shared icon+label cluster centered in each equal-width tab.
 * Width is locked via viewport styles so content matches across modes.
 */
export const STYLING_WORLD_PLAZA_HUD_TOOLBAR_MODE_CONTENT_CLASS_NAME =
  'inline-flex max-w-full items-center justify-center' as const;

/**
 * Column wrapping mode badges and the active bottom toolbar body.
 * Width is set on the stack to the inventory hotbar shell; children stretch.
 */
export const STYLING_WORLD_PLAZA_HUD_TOOLBAR_BOTTOM_STACK_CLASS_NAME =
  'pointer-events-none inline-flex w-full flex-col items-stretch gap-1' as const;

/** Header row that hosts the mode badges (pointer-events restored). */
export const STYLING_WORLD_PLAZA_HUD_TOOLBAR_MODE_HEADER_CLASS_NAME =
  'pointer-events-auto flex w-full flex-col' as const;

/**
 * Label text inside a mode badge — fixed ch width from longest registry label.
 */
export const STYLING_WORLD_PLAZA_HUD_TOOLBAR_MODE_LABEL_CLASS_NAME =
  'shrink-0 text-center leading-none' as const;

/**
 * Longest mode label length (chars). Drives uniform label column width.
 * Includes Build/Claim toggle faces so the shared column stays stable.
 */
export const DEFINING_WORLD_PLAZA_HUD_TOOLBAR_MODE_MAX_LABEL_LENGTH = Math.max(
  ...DEFINING_WORLD_PLAZA_HUD_TOOLBAR_MODE_BADGE_REGISTRY.flatMap(
    (badgeDefinition) => {
      if (badgeDefinition.kind === 'mode') {
        return [badgeDefinition.label.length];
      }

      return Object.values(
        DEFINING_WORLD_PLAZA_HUD_TOOLBAR_BUILD_CLAIM_TOGGLE_FACES
      ).map((face) => face.label.length);
    }
  )
);
