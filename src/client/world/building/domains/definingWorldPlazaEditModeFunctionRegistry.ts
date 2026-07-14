/**
 * Declarative registry for the unified build/claim edit hotbar.
 *
 * @module components/world/building/domains/definingWorldPlazaEditModeFunctionRegistry
 */

/** Stable ids for unified edit-mode function slots (left → right). */
export const DEFINING_WORLD_PLAZA_EDIT_MODE_FUNCTION_ID = {
  PLACE: 'place',
  REMOVE: 'remove',
  MATERIALS: 'materials',
  CUT: 'cut',
  BLOCKS: 'blocks',
  CLAIM: 'claim',
  UNCLAIM: 'unclaim',
  PLOTS: 'plots',
  SAVES: 'saves',
} as const;

/** One unified edit-mode function slot id. */
export type DefiningWorldPlazaEditModeFunctionId =
  (typeof DEFINING_WORLD_PLAZA_EDIT_MODE_FUNCTION_ID)[keyof typeof DEFINING_WORLD_PLAZA_EDIT_MODE_FUNCTION_ID];

/** Stable ids for Build vs Claim session mode switch above the hotbar. */
export const DEFINING_WORLD_PLAZA_EDIT_MODE_SESSION_MODE_ID = {
  BUILD: 'build',
  CLAIM: 'claim',
} as const;

/** One edit-session mode switcher id. */
export type DefiningWorldPlazaEditModeSessionModeId =
  (typeof DEFINING_WORLD_PLAZA_EDIT_MODE_SESSION_MODE_ID)[keyof typeof DEFINING_WORLD_PLAZA_EDIT_MODE_SESSION_MODE_ID];

/** Display + icon metadata for one edit hotbar function. */
export type DefiningWorldPlazaEditModeFunctionDefinition = {
  readonly id: DefiningWorldPlazaEditModeFunctionId;
  readonly sessionModeId: DefiningWorldPlazaEditModeSessionModeId;
  readonly label: string;
  readonly ariaLabel: string;
  readonly iconifyIcon: string;
};

/**
 * Ordered unified edit functions shown as inventory-shaped icon slots.
 * Crafting lives on the separate Craft HUD mode badge.
 */
export const DEFINING_WORLD_PLAZA_EDIT_MODE_FUNCTION_REGISTRY = [
  {
    id: DEFINING_WORLD_PLAZA_EDIT_MODE_FUNCTION_ID.PLACE,
    sessionModeId: DEFINING_WORLD_PLAZA_EDIT_MODE_SESSION_MODE_ID.BUILD,
    label: 'Place',
    ariaLabel: 'Place blocks',
    iconifyIcon: 'mdi:hammer',
  },
  {
    id: DEFINING_WORLD_PLAZA_EDIT_MODE_FUNCTION_ID.REMOVE,
    sessionModeId: DEFINING_WORLD_PLAZA_EDIT_MODE_SESSION_MODE_ID.BUILD,
    label: 'Remove',
    ariaLabel: 'Remove blocks',
    iconifyIcon: 'mdi:delete-outline',
  },
  {
    id: DEFINING_WORLD_PLAZA_EDIT_MODE_FUNCTION_ID.MATERIALS,
    sessionModeId: DEFINING_WORLD_PLAZA_EDIT_MODE_SESSION_MODE_ID.BUILD,
    label: 'Materials',
    ariaLabel: 'Materials palette',
    iconifyIcon: 'mdi:cube-outline',
  },
  {
    id: DEFINING_WORLD_PLAZA_EDIT_MODE_FUNCTION_ID.BLOCKS,
    sessionModeId: DEFINING_WORLD_PLAZA_EDIT_MODE_SESSION_MODE_ID.BUILD,
    label: 'Blocks',
    ariaLabel: 'Block size and placement layer',
    iconifyIcon: 'mdi:shape-square-plus',
  },
  {
    id: DEFINING_WORLD_PLAZA_EDIT_MODE_FUNCTION_ID.CUT,
    sessionModeId: DEFINING_WORLD_PLAZA_EDIT_MODE_SESSION_MODE_ID.BUILD,
    label: 'Cut',
    ariaLabel: 'Cut footprint',
    iconifyIcon: 'mdi:view-grid-outline',
  },
  {
    id: DEFINING_WORLD_PLAZA_EDIT_MODE_FUNCTION_ID.CLAIM,
    sessionModeId: DEFINING_WORLD_PLAZA_EDIT_MODE_SESSION_MODE_ID.CLAIM,
    label: 'Claim',
    ariaLabel: 'Claim land tiles',
    iconifyIcon: 'mdi:map-marker-plus',
  },
  {
    id: DEFINING_WORLD_PLAZA_EDIT_MODE_FUNCTION_ID.UNCLAIM,
    sessionModeId: DEFINING_WORLD_PLAZA_EDIT_MODE_SESSION_MODE_ID.CLAIM,
    label: 'Unclaim',
    ariaLabel: 'Unclaim owned land tiles',
    iconifyIcon: 'mdi:map-marker-minus',
  },
  {
    id: DEFINING_WORLD_PLAZA_EDIT_MODE_FUNCTION_ID.PLOTS,
    sessionModeId: DEFINING_WORLD_PLAZA_EDIT_MODE_SESSION_MODE_ID.CLAIM,
    label: 'Plots',
    ariaLabel: 'Owned plots and temporary tiles',
    iconifyIcon: 'mdi:land-plots',
  },
  {
    id: DEFINING_WORLD_PLAZA_EDIT_MODE_FUNCTION_ID.SAVES,
    sessionModeId: DEFINING_WORLD_PLAZA_EDIT_MODE_SESSION_MODE_ID.CLAIM,
    label: 'Saves',
    ariaLabel: 'Bookmark tile and saved coordinates',
    iconifyIcon: 'mdi:bookmark',
  },
] as const satisfies readonly DefiningWorldPlazaEditModeFunctionDefinition[];

/**
 * Which Build/Claim session each function slot should activate when opened.
 * Opening a slot auto-switches the edit session to that mode.
 */
export const DEFINING_WORLD_PLAZA_EDIT_MODE_FUNCTION_SESSION_MODE_BY_ID = {
  [DEFINING_WORLD_PLAZA_EDIT_MODE_FUNCTION_ID.PLACE]:
    DEFINING_WORLD_PLAZA_EDIT_MODE_SESSION_MODE_ID.BUILD,
  [DEFINING_WORLD_PLAZA_EDIT_MODE_FUNCTION_ID.REMOVE]:
    DEFINING_WORLD_PLAZA_EDIT_MODE_SESSION_MODE_ID.BUILD,
  [DEFINING_WORLD_PLAZA_EDIT_MODE_FUNCTION_ID.MATERIALS]:
    DEFINING_WORLD_PLAZA_EDIT_MODE_SESSION_MODE_ID.BUILD,
  [DEFINING_WORLD_PLAZA_EDIT_MODE_FUNCTION_ID.CUT]:
    DEFINING_WORLD_PLAZA_EDIT_MODE_SESSION_MODE_ID.BUILD,
  [DEFINING_WORLD_PLAZA_EDIT_MODE_FUNCTION_ID.BLOCKS]:
    DEFINING_WORLD_PLAZA_EDIT_MODE_SESSION_MODE_ID.BUILD,
  [DEFINING_WORLD_PLAZA_EDIT_MODE_FUNCTION_ID.CLAIM]:
    DEFINING_WORLD_PLAZA_EDIT_MODE_SESSION_MODE_ID.CLAIM,
  [DEFINING_WORLD_PLAZA_EDIT_MODE_FUNCTION_ID.UNCLAIM]:
    DEFINING_WORLD_PLAZA_EDIT_MODE_SESSION_MODE_ID.CLAIM,
  [DEFINING_WORLD_PLAZA_EDIT_MODE_FUNCTION_ID.PLOTS]:
    DEFINING_WORLD_PLAZA_EDIT_MODE_SESSION_MODE_ID.CLAIM,
  [DEFINING_WORLD_PLAZA_EDIT_MODE_FUNCTION_ID.SAVES]:
    DEFINING_WORLD_PLAZA_EDIT_MODE_SESSION_MODE_ID.CLAIM,
} as const satisfies Record<
  DefiningWorldPlazaEditModeFunctionId,
  DefiningWorldPlazaEditModeSessionModeId
>;

/** Build paint tools stay selected without opening a popover. */
export const DEFINING_WORLD_PLAZA_EDIT_MODE_BUILD_PAINT_FUNCTION_IDS = [
  DEFINING_WORLD_PLAZA_EDIT_MODE_FUNCTION_ID.PLACE,
  DEFINING_WORLD_PLAZA_EDIT_MODE_FUNCTION_ID.REMOVE,
] as const satisfies readonly DefiningWorldPlazaEditModeFunctionId[];

/** One build paint tool id (place or remove). */
export type DefiningWorldPlazaEditModeBuildPaintFunctionId =
  (typeof DEFINING_WORLD_PLAZA_EDIT_MODE_BUILD_PAINT_FUNCTION_IDS)[number];

/** Claim paint tools stay selected without opening a popover. */
export const DEFINING_WORLD_PLAZA_EDIT_MODE_CLAIM_PAINT_FUNCTION_IDS = [
  DEFINING_WORLD_PLAZA_EDIT_MODE_FUNCTION_ID.CLAIM,
  DEFINING_WORLD_PLAZA_EDIT_MODE_FUNCTION_ID.UNCLAIM,
] as const satisfies readonly DefiningWorldPlazaEditModeFunctionId[];

/** One claim paint tool id (claim or unclaim). */
export type DefiningWorldPlazaEditModeClaimPaintFunctionId =
  (typeof DEFINING_WORLD_PLAZA_EDIT_MODE_CLAIM_PAINT_FUNCTION_IDS)[number];

/** Popover panel title copy by function id. */
export const LABELING_WORLD_PLAZA_EDIT_MODE_FUNCTION_POPOVER_TITLE: Record<
  DefiningWorldPlazaEditModeFunctionId,
  string
> = {
  place: 'Place',
  remove: 'Remove',
  materials: 'Materials',
  cut: 'Cut',
  blocks: 'Blocks',
  claim: 'Claim',
  unclaim: 'Unclaim',
  plots: 'Plots',
  saves: 'Saves',
};

/** Accessible label for the unified edit hotbar. */
export const LABELING_WORLD_PLAZA_EDIT_MODE_FUNCTION_HOTBAR =
  'Build tools' as const;

/** Aria labels for the session toggle arrows, keyed by the target mode. */
export const LABELING_WORLD_PLAZA_EDIT_MODE_SESSION_TOGGLE = {
  [DEFINING_WORLD_PLAZA_EDIT_MODE_SESSION_MODE_ID.BUILD]:
    'Switch to Build tools',
  [DEFINING_WORLD_PLAZA_EDIT_MODE_SESSION_MODE_ID.CLAIM]:
    'Switch to Claim tools',
} as const satisfies Record<DefiningWorldPlazaEditModeSessionModeId, string>;

/**
 * Glyphs for the right-side Build/Claim session switcher
 * (top = Build hammer, bottom = Claim land-plots).
 */
export const DEFINING_WORLD_PLAZA_EDIT_MODE_SESSION_TOGGLE_ICONS = {
  [DEFINING_WORLD_PLAZA_EDIT_MODE_SESSION_MODE_ID.BUILD]: 'mdi:hammer',
  [DEFINING_WORLD_PLAZA_EDIT_MODE_SESSION_MODE_ID.CLAIM]: 'mdi:land-plots',
} as const satisfies Record<DefiningWorldPlazaEditModeSessionModeId, string>;

/**
 * Vertical order of session switcher buttons (top → bottom).
 */
export const DEFINING_WORLD_PLAZA_EDIT_MODE_SESSION_TOGGLE_ORDER = [
  DEFINING_WORLD_PLAZA_EDIT_MODE_SESSION_MODE_ID.BUILD,
  DEFINING_WORLD_PLAZA_EDIT_MODE_SESSION_MODE_ID.CLAIM,
] as const satisfies readonly DefiningWorldPlazaEditModeSessionModeId[];

/**
 * Checks whether a mode-board tool id is an edit-mode function id.
 *
 * @param toolId - Any HUD mode-board tool id
 */
export function checkingWorldPlazaEditModeFunctionId(
  toolId: string
): toolId is DefiningWorldPlazaEditModeFunctionId {
  const functionIds: readonly string[] = Object.values(
    DEFINING_WORLD_PLAZA_EDIT_MODE_FUNCTION_ID
  );

  return functionIds.includes(toolId);
}

/**
 * Checks whether a function id is a sticky place/remove paint tool.
 *
 * @param functionId - Edit-mode function id
 */
export function checkingWorldPlazaEditModeFunctionIsBuildPaintTool(
  functionId: DefiningWorldPlazaEditModeFunctionId
): functionId is DefiningWorldPlazaEditModeBuildPaintFunctionId {
  return (
    functionId === DEFINING_WORLD_PLAZA_EDIT_MODE_FUNCTION_ID.PLACE ||
    functionId === DEFINING_WORLD_PLAZA_EDIT_MODE_FUNCTION_ID.REMOVE
  );
}

/**
 * Maps a build paint tool id to its sticky paint action.
 *
 * @param functionId - Place or remove function id
 */
export function resolvingWorldPlazaEditModeBuildPaintAction(
  functionId: DefiningWorldPlazaEditModeBuildPaintFunctionId
): 'place' | 'remove' {
  return functionId === DEFINING_WORLD_PLAZA_EDIT_MODE_FUNCTION_ID.REMOVE
    ? 'remove'
    : 'place';
}

/**
 * Checks whether a function id is a sticky claim/unclaim paint tool.
 *
 * @param functionId - Edit-mode function id
 */
export function checkingWorldPlazaEditModeFunctionIsClaimPaintTool(
  functionId: DefiningWorldPlazaEditModeFunctionId
): functionId is DefiningWorldPlazaEditModeClaimPaintFunctionId {
  return (
    functionId === DEFINING_WORLD_PLAZA_EDIT_MODE_FUNCTION_ID.CLAIM ||
    functionId === DEFINING_WORLD_PLAZA_EDIT_MODE_FUNCTION_ID.UNCLAIM
  );
}

/**
 * Maps a claim paint tool id to its sticky paint action.
 *
 * @param functionId - Claim or unclaim function id
 */
export function resolvingWorldPlazaEditModeClaimPaintAction(
  functionId: DefiningWorldPlazaEditModeClaimPaintFunctionId
): 'claim' | 'unclaim' {
  return functionId === DEFINING_WORLD_PLAZA_EDIT_MODE_FUNCTION_ID.UNCLAIM
    ? 'unclaim'
    : 'claim';
}

/**
 * Checks whether a function id is any sticky paint tool (build or claim).
 *
 * @param functionId - Edit-mode function id
 */
export function checkingWorldPlazaEditModeFunctionIsPaintTool(
  functionId: DefiningWorldPlazaEditModeFunctionId
): boolean {
  return (
    checkingWorldPlazaEditModeFunctionIsBuildPaintTool(functionId) ||
    checkingWorldPlazaEditModeFunctionIsClaimPaintTool(functionId)
  );
}

/**
 * Returns edit hotbar function slots for the active Build or Claim session.
 *
 * @param sessionModeId - Active edit session mode.
 */
export function listingWorldPlazaEditModeFunctionsForSession(
  sessionModeId: DefiningWorldPlazaEditModeSessionModeId
): readonly DefiningWorldPlazaEditModeFunctionDefinition[] {
  return DEFINING_WORLD_PLAZA_EDIT_MODE_FUNCTION_REGISTRY.filter(
    (functionDefinition) => functionDefinition.sessionModeId === sessionModeId
  );
}
