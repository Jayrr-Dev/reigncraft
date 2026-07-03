import type { RoughSketchFillStyle } from "@/lib/theme/definingRoughSketchOptions";

/** Optional multiplier applied to all inventory base px values (not CSS transform). */
export const DEFINING_WORLD_PLAZA_INVENTORY_HOTBAR_SCALE = 1 as const;

/** Base slot edge length in px (doubled from compact size-5 baseline). */
export const DEFINING_WORLD_PLAZA_INVENTORY_SLOT_BASE_PX = 40 as const;

/** Base Lucide icon edge length in px. */
export const DEFINING_WORLD_PLAZA_INVENTORY_SLOT_ICON_BASE_PX = 20 as const;

/** Base gap between hotbar slots and shell items in px. */
export const DEFINING_WORLD_PLAZA_INVENTORY_SHELL_GAP_BASE_PX = 4 as const;

/** Base hotbar shell padding in px. */
export const DEFINING_WORLD_PLAZA_INVENTORY_SHELL_PADDING_BASE_PX = 4 as const;

/** Base quantity badge diameter in px. */
export const DEFINING_WORLD_PLAZA_INVENTORY_QUANTITY_BADGE_BASE_PX = 16 as const;

/** Base quantity badge label size in px. */
export const DEFINING_WORLD_PLAZA_INVENTORY_QUANTITY_BADGE_TEXT_BASE_PX = 12 as const;

/** Base loading label size in px. */
export const DEFINING_WORLD_PLAZA_INVENTORY_LOADING_TEXT_BASE_PX = 20 as const;

/** Base emoji size in px inside a slot. */
export const DEFINING_WORLD_PLAZA_INVENTORY_SLOT_EMOJI_BASE_PX = 20 as const;

/** Base fallback glyph size in px inside a slot. */
export const DEFINING_WORLD_PLAZA_INVENTORY_SLOT_FALLBACK_TEXT_BASE_PX = 16 as const;

/**
 * Scales one inventory base px value by {@link DEFINING_WORLD_PLAZA_INVENTORY_HOTBAR_SCALE}.
 *
 * @param basePx - Unscaled design token in px
 */
function computingWorldPlazaInventoryHotbarPx(basePx: number): number {
  return Math.round(basePx * DEFINING_WORLD_PLAZA_INVENTORY_HOTBAR_SCALE);
}

/** Slot edge length in px after scale multiplier. */
export const DEFINING_WORLD_PLAZA_INVENTORY_SLOT_PX =
  computingWorldPlazaInventoryHotbarPx(DEFINING_WORLD_PLAZA_INVENTORY_SLOT_BASE_PX);

/** Lucide icon edge length in px after scale multiplier. */
export const DEFINING_WORLD_PLAZA_INVENTORY_SLOT_ICON_PX =
  computingWorldPlazaInventoryHotbarPx(
    DEFINING_WORLD_PLAZA_INVENTORY_SLOT_ICON_BASE_PX,
  );

/** Shared Rough.js props for plaza inventory surfaces (calm, readable slots). */
export const DEFINING_WORLD_PLAZA_INVENTORY_ROUGH_SKETCH_PROPS = {
  roughnessLevel: "faint" as const,
  outlineStyle: "solid" as const,
  outlineThickness: "thin" as const,
  rounded: "md" as const,
  showShadow: false,
};

/** Hotbar shell sketch fill. */
export const DEFINING_WORLD_PLAZA_INVENTORY_ROUGH_HOTBAR_FILL_STYLE: RoughSketchFillStyle =
  "solid";

/** Occupied slot sketch fill. */
export const DEFINING_WORLD_PLAZA_INVENTORY_ROUGH_SLOT_FILL_STYLE: RoughSketchFillStyle =
  "solid";

/** Empty slot sketch fill. */
export const DEFINING_WORLD_PLAZA_INVENTORY_ROUGH_EMPTY_SLOT_FILL_STYLE: RoughSketchFillStyle =
  "solid";

/** Hotbar shell fill opacity. */
export const DEFINING_WORLD_PLAZA_INVENTORY_ROUGH_HOTBAR_FILL_OPACITY = 0.96;

/** Occupied slot fill opacity. */
export const DEFINING_WORLD_PLAZA_INVENTORY_ROUGH_SLOT_FILL_OPACITY = 0.94;

/** Empty slot fill opacity. */
export const DEFINING_WORLD_PLAZA_INVENTORY_ROUGH_EMPTY_SLOT_FILL_OPACITY = 0.72;

/** Foreground for icons on cream slot fills (fixed light hex). */
export const STYLING_WORLD_PLAZA_INVENTORY_ROUGH_SLOT_FOREGROUND_CLASS =
  "text-[#3a2618]" as const;

/** Inherited text on rough shells (overrides dark-mode ui label tokens). */
export const STYLING_WORLD_PLAZA_INVENTORY_ROUGH_SHELL_TEXT_CLASS =
  "text-[#3a2618]" as const;

/** Loading copy on the hotbar shell (fixed light hex; size via viewport styles). */
export const STYLING_WORLD_PLAZA_INVENTORY_ROUGH_LOADING_TEXT_CLASS =
  "font-medium text-[#fff4dc]" as const;

/** Loading placeholder shell (matches hotbar footprint; height via viewport styles). */
export const STYLING_WORLD_PLAZA_INVENTORY_ROUGH_LOADING_SHELL_CLASS =
  "flex min-w-[14rem] items-center justify-center" as const;

/** Quantity badge on rough inventory slots (size via viewport styles). */
export const STYLING_WORLD_PLAZA_INVENTORY_ROUGH_QUANTITY_BADGE_CLASS =
  "pointer-events-none absolute -bottom-0.5 -right-0.5 flex items-center justify-center rounded-full bg-[#3a2618] font-semibold leading-none text-[#fff4dc]" as const;

/** Drop target ring on rough slots (fixed light hex). */
export const STYLING_WORLD_PLAZA_INVENTORY_ROUGH_SLOT_DROP_VALID_CLASS =
  "ring-1 ring-[#6f8f5e] ring-offset-0 ring-offset-transparent" as const;

/** Invalid drop target ring on rough slots. */
export const STYLING_WORLD_PLAZA_INVENTORY_ROUGH_SLOT_DROP_INVALID_CLASS =
  "ring-1 ring-[#c9795b] ring-offset-0 ring-offset-transparent" as const;

/** Layout for the rough hotbar shell (sketch supplies border/fill). */
export const STYLING_WORLD_PLAZA_INVENTORY_ROUGH_HOTBAR_SHELL_CLASS_NAME =
  "pointer-events-auto flex touch-none overscroll-none items-center" as const;

/** Gap between inventory slots in the grid row (gap via viewport styles). */
export const STYLING_WORLD_PLAZA_INVENTORY_ROUGH_GRID_GAP_CLASS = "" as const;

/** Fixed slot layout for rough inventory cells (size via viewport styles). */
export const STYLING_WORLD_PLAZA_INVENTORY_ROUGH_SLOT_SIZE_CLASS =
  "relative shrink-0 overflow-hidden" as const;

/**
 * Drag surface fills the fixed slot (RoughDiv inner slot is content-sized, so
 * avoid size-full which collapses and pins icons to the top-left).
 */
export const STYLING_WORLD_PLAZA_INVENTORY_ROUGH_SLOT_DRAG_SURFACE_CLASS =
  "relative z-10 flex touch-none items-center justify-center" as const;

/** Lucide icon layout inside a hotbar slot (size via viewport styles). */
export const STYLING_WORLD_PLAZA_INVENTORY_ROUGH_SLOT_ICON_CLASS =
  "shrink-0" as const;

/** Emoji layout inside a hotbar slot (size via viewport styles). */
export const STYLING_WORLD_PLAZA_INVENTORY_ROUGH_SLOT_EMOJI_CLASS =
  "leading-none" as const;

/** Fallback glyph layout inside a hotbar slot (size via viewport styles). */
export const STYLING_WORLD_PLAZA_INVENTORY_ROUGH_SLOT_FALLBACK_TEXT_CLASS =
  "font-medium" as const;

/** Centers item icon/emoji with room for the quantity badge. */
export const STYLING_WORLD_PLAZA_INVENTORY_ROUGH_ITEM_ICON_WRAPPER_CLASS =
  "relative flex items-center justify-center" as const;

/** Ensures inventory UI ignores site dark mode (color-scheme + isolation). */
export const STYLING_WORLD_PLAZA_INVENTORY_LIGHT_THEME_SCOPE_CLASS =
  "isolate [color-scheme:light]" as const;

export {
  DEFINING_WORLD_PLAZA_INVENTORY_ROUGH_DROP_TARGET_SKETCH_COLORS,
  DEFINING_WORLD_PLAZA_INVENTORY_ROUGH_EMPTY_SLOT_SKETCH_COLORS,
  DEFINING_WORLD_PLAZA_INVENTORY_ROUGH_HOTBAR_SKETCH_COLORS,
  DEFINING_WORLD_PLAZA_INVENTORY_ROUGH_SLOT_SKETCH_COLORS,
} from "@/components/world/inventory/domains/creatingWorldPlazaInventoryFixedLightSketchColors";
