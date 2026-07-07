import {
  DEFINING_WORLD_PLAZA_GAMEPLAY_HUD_STYLE,
  STYLING_WORLD_PLAZA_GAMEPLAY_HUD_LIGHT_THEME_SCOPE_CLASS,
} from '@/components/world/domains/definingWorldPlazaGameplayHudStyleConstants';

/** Optional multiplier applied to all inventory base px values (not CSS transform). */
export const DEFINING_WORLD_PLAZA_INVENTORY_HOTBAR_SCALE = 1.25 as const;

/** Base slot edge length in px (doubled from compact size-5 baseline). */
export const DEFINING_WORLD_PLAZA_INVENTORY_SLOT_BASE_PX = 40 as const;

/** Base Lucide icon edge length in px. */
export const DEFINING_WORLD_PLAZA_INVENTORY_SLOT_ICON_BASE_PX = 20 as const;

/** Base gap between hotbar slots and shell items in px. */
export const DEFINING_WORLD_PLAZA_INVENTORY_SHELL_GAP_BASE_PX = 4 as const;

/** Base hotbar shell padding in px. */
export const DEFINING_WORLD_PLAZA_INVENTORY_SHELL_PADDING_BASE_PX = 4 as const;

/** Base quantity badge height in px. */
export const DEFINING_WORLD_PLAZA_INVENTORY_QUANTITY_BADGE_BASE_HEIGHT_PX =
  12 as const;

/** Base horizontal padding inside quantity badges in px. */
export const DEFINING_WORLD_PLAZA_INVENTORY_QUANTITY_BADGE_PADDING_X_BASE_PX =
  2 as const;

/** Base quantity badge label size in px. */
export const DEFINING_WORLD_PLAZA_INVENTORY_QUANTITY_BADGE_TEXT_BASE_PX =
  9 as const;

/** Base loading label size in px. */
export const DEFINING_WORLD_PLAZA_INVENTORY_LOADING_TEXT_BASE_PX = 20 as const;

/** Base emoji size in px inside a slot. */
export const DEFINING_WORLD_PLAZA_INVENTORY_SLOT_EMOJI_BASE_PX = 20 as const;

/** Base fallback glyph size in px inside a slot. */
export const DEFINING_WORLD_PLAZA_INVENTORY_SLOT_FALLBACK_TEXT_BASE_PX =
  16 as const;

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
  computingWorldPlazaInventoryHotbarPx(
    DEFINING_WORLD_PLAZA_INVENTORY_SLOT_BASE_PX
  );

/** Lucide icon edge length in px after scale multiplier. */
export const DEFINING_WORLD_PLAZA_INVENTORY_SLOT_ICON_PX =
  computingWorldPlazaInventoryHotbarPx(
    DEFINING_WORLD_PLAZA_INVENTORY_SLOT_ICON_BASE_PX
  );

/** Foreground for icons on cream slot fills. */
export const STYLING_WORLD_PLAZA_INVENTORY_SLOT_FOREGROUND_CLASS =
  DEFINING_WORLD_PLAZA_GAMEPLAY_HUD_STYLE.interactive.slotIcon;

/** Inherited text on the hotbar shell. */
export const STYLING_WORLD_PLAZA_INVENTORY_SHELL_TEXT_CLASS =
  DEFINING_WORLD_PLAZA_GAMEPLAY_HUD_STYLE.typography.textInk;

/** Loading copy on the hotbar shell (size via viewport styles). */
export const STYLING_WORLD_PLAZA_INVENTORY_LOADING_TEXT_CLASS =
  `font-medium italic ${DEFINING_WORLD_PLAZA_GAMEPLAY_HUD_STYLE.typography.textInkSoft}` as const;

/** Loading placeholder shell (matches hotbar footprint; height via viewport styles). */
export const STYLING_WORLD_PLAZA_INVENTORY_LOADING_SHELL_CLASS =
  'flex min-w-[14rem] items-center justify-center' as const;

/** Quantity badge on inventory slots (size via viewport styles). */
export const STYLING_WORLD_PLAZA_INVENTORY_QUANTITY_BADGE_CLASS =
  DEFINING_WORLD_PLAZA_GAMEPLAY_HUD_STYLE.badge.quantity;

/** Valid drop target ring on slots. */
export const STYLING_WORLD_PLAZA_INVENTORY_SLOT_DROP_VALID_CLASS =
  DEFINING_WORLD_PLAZA_GAMEPLAY_HUD_STYLE.slot.dropValid;

/** Invalid drop target ring on slots. */
export const STYLING_WORLD_PLAZA_INVENTORY_SLOT_DROP_INVALID_CLASS =
  DEFINING_WORLD_PLAZA_GAMEPLAY_HUD_STYLE.slot.dropInvalid;

/** Parchment hotbar shell — matches home-screen plaza panel styling. */
export const STYLING_WORLD_PLAZA_INVENTORY_HOTBAR_SHELL_CLASS_NAME =
  `${DEFINING_WORLD_PLAZA_GAMEPLAY_HUD_STYLE.cssShell.inventoryHotbarShell} pointer-events-auto flex touch-manipulation overscroll-none items-center overflow-visible` as const;

/** Hotbar grid row — touch-manipulation so slot taps synthesize click reliably. */
export const STYLING_WORLD_PLAZA_INVENTORY_GRID_WRAPPER_CLASS_NAME =
  'flex touch-manipulation overscroll-none items-center gap-1' as const;

/** Gap between inventory slots in the grid row (gap via viewport styles). */
export const STYLING_WORLD_PLAZA_INVENTORY_GRID_GAP_CLASS = '' as const;

/** Occupied slot — cream row styling like home save slots. */
export const STYLING_WORLD_PLAZA_INVENTORY_SLOT_CLASS =
  `${DEFINING_WORLD_PLAZA_GAMEPLAY_HUD_STYLE.cssShell.inventorySlot} relative shrink-0 transition-[box-shadow,ring]` as const;

/** Empty slot variant. */
export const STYLING_WORLD_PLAZA_INVENTORY_SLOT_EMPTY_CLASS =
  DEFINING_WORLD_PLAZA_GAMEPLAY_HUD_STYLE.cssShell.inventorySlotEmpty;

/** Equipped slot highlight. */
export const STYLING_WORLD_PLAZA_INVENTORY_SLOT_EQUIPPED_CLASS =
  DEFINING_WORLD_PLAZA_GAMEPLAY_HUD_STYLE.cssShell.inventorySlotEquipped;

/** Drag surface fills the fixed slot. */
export const STYLING_WORLD_PLAZA_INVENTORY_SLOT_DRAG_SURFACE_CLASS =
  'relative z-10 flex touch-manipulation items-center justify-center' as const;

/** Lucide icon layout inside a hotbar slot (size via viewport styles). */
export const STYLING_WORLD_PLAZA_INVENTORY_SLOT_ICON_CLASS =
  'shrink-0' as const;

/** Emoji layout inside a hotbar slot (size via viewport styles). */
export const STYLING_WORLD_PLAZA_INVENTORY_SLOT_EMOJI_CLASS =
  'leading-none' as const;

/** Fallback glyph layout inside a hotbar slot (size via viewport styles). */
export const STYLING_WORLD_PLAZA_INVENTORY_SLOT_FALLBACK_TEXT_CLASS =
  'font-medium' as const;

/** Centers item icon/emoji with room for the quantity badge. */
export const STYLING_WORLD_PLAZA_INVENTORY_ITEM_ICON_WRAPPER_CLASS =
  'relative flex items-center justify-center' as const;

/** Drag overlay lift above the hotbar. */
export const STYLING_WORLD_PLAZA_INVENTORY_DRAG_OVERLAY_CLASS =
  DEFINING_WORLD_PLAZA_GAMEPLAY_HUD_STYLE.slot.dragOverlay;

/** Ensures inventory UI ignores site dark mode (color-scheme + isolation). */
export const STYLING_WORLD_PLAZA_INVENTORY_LIGHT_THEME_SCOPE_CLASS =
  STYLING_WORLD_PLAZA_GAMEPLAY_HUD_LIGHT_THEME_SCOPE_CLASS;
