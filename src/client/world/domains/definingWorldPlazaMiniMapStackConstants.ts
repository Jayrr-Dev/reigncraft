/**
 * Layout constants for the bottom-left minimap stack.
 *
 * @module components/world/domains/definingWorldPlazaMiniMapStackConstants
 */

/** Base inset from the left edge on embedded viewports (px). */
export const DEFINING_WORLD_PLAZA_MINI_MAP_STACK_EMBEDDED_EDGE_INSET_BASE_PX = 12;

/** Base inset from viewport edges in fullscreen (px). */
export const DEFINING_WORLD_PLAZA_MINI_MAP_STACK_FULLSCREEN_EDGE_INSET_BASE_PX = 16;

/** Gap between the minimap stack and the inventory hotbar on mobile (px). */
export const DEFINING_WORLD_PLAZA_MINI_MAP_STACK_MOBILE_HOTBAR_CLEARANCE_BASE_PX = 8;

/**
 * Inventory hotbar layout tokens mirrored for minimap clearance math.
 * Keep aligned with {@link DEFINING_WORLD_PLAZA_INVENTORY_SLOT_BASE_PX} and related constants.
 */
export const DEFINING_WORLD_PLAZA_MINI_MAP_STACK_INVENTORY_HOTBAR_BOTTOM_INSET_BASE_PX = 12;
export const DEFINING_WORLD_PLAZA_MINI_MAP_STACK_INVENTORY_HOTBAR_SHELL_PADDING_BASE_PX = 4;
export const DEFINING_WORLD_PLAZA_MINI_MAP_STACK_INVENTORY_HOTBAR_SCALE = 1.25;
export const DEFINING_WORLD_PLAZA_MINI_MAP_STACK_INVENTORY_HOTBAR_SLOT_BASE_PX = 40;

/** Bottom-left anchor for the minimap + environment bar stack. */
export const STYLING_WORLD_PLAZA_MINI_MAP_STACK_ANCHOR_CLASS_NAME =
  'pointer-events-none absolute z-20 flex flex-col items-start gap-1 select-none' as const;
