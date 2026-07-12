/**
 * Declarative registry for the unified build/claim edit hotbar (5 slots).
 *
 * @module components/world/building/domains/definingWorldPlazaEditModeFunctionRegistry
 */

/** Stable ids for unified edit-mode function slots (left → right). */
export const DEFINING_WORLD_PLAZA_EDIT_MODE_FUNCTION_ID = {
  MATERIALS: 'materials',
  CUT: 'cut',
  BLOCKS: 'blocks',
  PLOTS: 'plots',
  SAVED: 'saved',
} as const;

/** One unified edit-mode function slot id. */
export type DefiningWorldPlazaEditModeFunctionId =
  (typeof DEFINING_WORLD_PLAZA_EDIT_MODE_FUNCTION_ID)[keyof typeof DEFINING_WORLD_PLAZA_EDIT_MODE_FUNCTION_ID];

/** Display + icon metadata for one edit hotbar function. */
export type DefiningWorldPlazaEditModeFunctionDefinition = {
  readonly id: DefiningWorldPlazaEditModeFunctionId;
  readonly label: string;
  readonly ariaLabel: string;
  readonly iconifyIcon: string;
};

/** Stable ids for Build vs Claim session mode switch above the hotbar. */
export const DEFINING_WORLD_PLAZA_EDIT_MODE_SESSION_MODE_ID = {
  BUILD: 'build',
  CLAIM: 'claim',
} as const;

/** One edit-session mode switcher id. */
export type DefiningWorldPlazaEditModeSessionModeId =
  (typeof DEFINING_WORLD_PLAZA_EDIT_MODE_SESSION_MODE_ID)[keyof typeof DEFINING_WORLD_PLAZA_EDIT_MODE_SESSION_MODE_ID];

/**
 * Ordered unified edit functions shown as inventory-shaped icon slots.
 * Order matches {@link DEFINING_WORLD_PLAZA_INVENTORY_CAPACITY} (5).
 */
export const DEFINING_WORLD_PLAZA_EDIT_MODE_FUNCTION_REGISTRY = [
  {
    id: DEFINING_WORLD_PLAZA_EDIT_MODE_FUNCTION_ID.MATERIALS,
    label: 'Materials',
    ariaLabel: 'Materials palette',
    iconifyIcon: 'mdi:cube-outline',
  },
  {
    id: DEFINING_WORLD_PLAZA_EDIT_MODE_FUNCTION_ID.CUT,
    label: 'Cut',
    ariaLabel: 'Cut footprint',
    iconifyIcon: 'mdi:view-grid-outline',
  },
  {
    id: DEFINING_WORLD_PLAZA_EDIT_MODE_FUNCTION_ID.BLOCKS,
    label: 'Blocks',
    ariaLabel: 'Block size and placement layer',
    iconifyIcon: 'mdi:shape-square-plus',
  },
  {
    id: DEFINING_WORLD_PLAZA_EDIT_MODE_FUNCTION_ID.PLOTS,
    label: 'Plots',
    ariaLabel: 'Plots and temporary tiles',
    iconifyIcon: 'mdi:land-plots',
  },
  {
    id: DEFINING_WORLD_PLAZA_EDIT_MODE_FUNCTION_ID.SAVED,
    label: 'Saved',
    ariaLabel: 'Save and manage coordinates',
    iconifyIcon: 'mdi:bookmark',
  },
] as const satisfies readonly DefiningWorldPlazaEditModeFunctionDefinition[];

/**
 * Which Build/Claim session each function slot should activate when opened.
 * Opening a slot auto-switches the edit session to that mode.
 */
export const DEFINING_WORLD_PLAZA_EDIT_MODE_FUNCTION_SESSION_MODE_BY_ID = {
  [DEFINING_WORLD_PLAZA_EDIT_MODE_FUNCTION_ID.MATERIALS]:
    DEFINING_WORLD_PLAZA_EDIT_MODE_SESSION_MODE_ID.BUILD,
  [DEFINING_WORLD_PLAZA_EDIT_MODE_FUNCTION_ID.CUT]:
    DEFINING_WORLD_PLAZA_EDIT_MODE_SESSION_MODE_ID.BUILD,
  [DEFINING_WORLD_PLAZA_EDIT_MODE_FUNCTION_ID.BLOCKS]:
    DEFINING_WORLD_PLAZA_EDIT_MODE_SESSION_MODE_ID.BUILD,
  [DEFINING_WORLD_PLAZA_EDIT_MODE_FUNCTION_ID.PLOTS]:
    DEFINING_WORLD_PLAZA_EDIT_MODE_SESSION_MODE_ID.CLAIM,
  [DEFINING_WORLD_PLAZA_EDIT_MODE_FUNCTION_ID.SAVED]:
    DEFINING_WORLD_PLAZA_EDIT_MODE_SESSION_MODE_ID.CLAIM,
} as const satisfies Record<
  DefiningWorldPlazaEditModeFunctionId,
  DefiningWorldPlazaEditModeSessionModeId
>;

/** Popover panel title copy by function id. */
export const LABELING_WORLD_PLAZA_EDIT_MODE_FUNCTION_POPOVER_TITLE: Record<
  DefiningWorldPlazaEditModeFunctionId,
  string
> = {
  materials: 'Materials',
  cut: 'Cut',
  blocks: 'Blocks',
  plots: 'Plots',
  saved: 'Saved Coords',
};

/** Accessible label for the unified edit hotbar. */
export const LABELING_WORLD_PLAZA_EDIT_MODE_FUNCTION_HOTBAR =
  'Build tools' as const;

/** Display + icon metadata for one Build/Claim session switch button. */
export type DefiningWorldPlazaEditModeSessionModeDefinition = {
  readonly id: DefiningWorldPlazaEditModeSessionModeId;
  readonly label: string;
  readonly ariaLabel: string;
  readonly iconifyIcon: string;
};

/** Ordered Build / Claim switcher shown above the unified edit hotbar. */
export const DEFINING_WORLD_PLAZA_EDIT_MODE_SESSION_MODE_REGISTRY = [
  {
    id: DEFINING_WORLD_PLAZA_EDIT_MODE_SESSION_MODE_ID.BUILD,
    label: 'Build',
    ariaLabel: 'Build mode',
    iconifyIcon: 'mdi:hammer',
  },
  {
    id: DEFINING_WORLD_PLAZA_EDIT_MODE_SESSION_MODE_ID.CLAIM,
    label: 'Claim',
    ariaLabel: 'Claim mode',
    iconifyIcon: 'mdi:land-plots',
  },
] as const satisfies readonly DefiningWorldPlazaEditModeSessionModeDefinition[];

/** Accessible label for the Build/Claim mode switcher row. */
export const LABELING_WORLD_PLAZA_EDIT_MODE_SESSION_MODE_SWITCHER =
  'Build or claim mode' as const;
