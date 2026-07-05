/**
 * Visual constants for inventory drag-to-ground drop marker.
 *
 * @module components/world/inventory/domains/definingWorldPlazaInventoryDropConstants
 */

/** Base Lucide arrow icon size in px before viewport HUD scaling. */
export const DEFINING_WORLD_PLAZA_INVENTORY_DROP_PREVIEW_ARROW_BASE_PX =
  28 as const;

/** Small lift above tile center so the arrow sits on the diamond, not below it. */
export const DEFINING_WORLD_PLAZA_INVENTORY_DROP_PREVIEW_ARROW_VERTICAL_OFFSET_PX =
  8 as const;

/** Bob amplitude while the drop arrow is visible (pixels). */
export const DEFINING_WORLD_PLAZA_INVENTORY_DROP_PREVIEW_ARROW_BOB_AMPLITUDE_PX =
  3 as const;

/** Bob cycle duration (ms). */
export const DEFINING_WORLD_PLAZA_INVENTORY_DROP_PREVIEW_ARROW_BOB_PERIOD_MS =
  900 as const;

/** Black dashed stroke around the selected drop tile. */
export const DEFINING_WORLD_PLAZA_INVENTORY_DROP_TILE_OUTLINE_STROKE_COLOR =
  0x1a1a1a as const;

/** z-index offset so the tile outline sorts above entities at the same cell. */
export {
  DEFINING_WORLD_DEPTH_INVENTORY_DROP_TILE_OUTLINE_Z_INDEX_OFFSET as DEFINING_WORLD_PLAZA_INVENTORY_DROP_TILE_OUTLINE_Z_INDEX_OFFSET,
} from '@/components/world/depth';

/** Root wrapper for the drop arrow DOM overlay. */
export const STYLING_WORLD_PLAZA_INVENTORY_DROP_ARROW_ROOT_CLASS_NAME =
  'pointer-events-none absolute left-0 top-0 z-[60] flex items-center justify-center' as const;

/** Drop arrow color (green). */
export const STYLING_WORLD_PLAZA_INVENTORY_DROP_ARROW_CLASS_NAME =
  'text-[#22c55e] drop-shadow-[0_1px_2px_rgba(20,83,45,0.55)]' as const;

/** Max Chebyshev tile distance from the player to complete a ground drop. */
export const DEFINING_WORLD_PLAZA_INVENTORY_DROP_RADIUS_TILES = 2 as const;
