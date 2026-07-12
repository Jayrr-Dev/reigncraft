import {
  DEFINING_WORLD_PLAZA_GAMEPLAY_HUD_STYLE,
  STYLING_WORLD_PLAZA_GAMEPLAY_HUD_LIGHT_THEME_SCOPE_CLASS,
} from '@/components/world/domains/definingWorldPlazaGameplayHudStyleConstants';

/**
 * Optional multiplier applied to all inventory base px values (not CSS transform).
 * Combined with device scale (mobile is larger than desktop).
 */
export const DEFINING_WORLD_PLAZA_INVENTORY_HOTBAR_SCALE = 1.25 as const;

/**
 * Extra hotbar multiplier on desktop / fullscreen.
 * Mobile uses {@link DEFINING_WORLD_PLAZA_INVENTORY_HOTBAR_MOBILE_DEVICE_SCALE}.
 */
export const DEFINING_WORLD_PLAZA_INVENTORY_HOTBAR_DEVICE_SCALE = 1.2 as const;

/** Extra hotbar multiplier on mobile (slightly larger touch targets). */
export const DEFINING_WORLD_PLAZA_INVENTORY_HOTBAR_MOBILE_DEVICE_SCALE =
  1.35 as const;

/** Base slot edge length in px (doubled from compact size-5 baseline). */
export const DEFINING_WORLD_PLAZA_INVENTORY_SLOT_BASE_PX = 40 as const;

/** Base Lucide icon edge length in px. */
export const DEFINING_WORLD_PLAZA_INVENTORY_SLOT_ICON_BASE_PX = 20 as const;

/** Base gap between hotbar slots and shell items in px. */
export const DEFINING_WORLD_PLAZA_INVENTORY_SHELL_GAP_BASE_PX = 4 as const;

/** Base hotbar shell padding in px. */
export const DEFINING_WORLD_PLAZA_INVENTORY_SHELL_PADDING_BASE_PX = 4 as const;

/**
 * Hotbar shell border width in px.
 * Keep in sync with `.plaza-inventory-hotbar-shell` in `index.css`.
 */
export const DEFINING_WORLD_PLAZA_INVENTORY_SHELL_BORDER_PX = 2 as const;

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

/** Bag popover title on teal glass panels (size via viewport styles). */
export const STYLING_WORLD_PLAZA_INVENTORY_BAG_POPOVER_LABEL_CLASS =
  `${DEFINING_WORLD_PLAZA_GAMEPLAY_HUD_STYLE.cssShell.inventoryBagPopoverLabel} mb-1.5 text-center font-body text-[10px] font-semibold leading-none` as const;

/** Compact Iconify glyph beside the bag popover title. */
export const STYLING_WORLD_PLAZA_INVENTORY_BAG_POPOVER_LABEL_ICON_CLASS =
  'size-3 shrink-0' as const;

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

/** Darker shell for storage pages (row 2+). */
export const STYLING_WORLD_PLAZA_INVENTORY_HOTBAR_SHELL_STORAGE_CLASS_NAME =
  DEFINING_WORLD_PLAZA_GAMEPLAY_HUD_STYLE.cssShell.inventoryHotbarShellStorage;

/** Hotbar grid — two visible rows (main + storage page); touch-manipulation for taps. */
export const STYLING_WORLD_PLAZA_INVENTORY_GRID_WRAPPER_CLASS_NAME =
  'grid touch-manipulation overscroll-none' as const;

/** Stacks the slot grid beside the storage page arrows. */
export const STYLING_WORLD_PLAZA_INVENTORY_SHELL_BODY_CLASS_NAME =
  'flex touch-manipulation items-stretch gap-1' as const;

/**
 * Minimum page-arrow tap/drag target edge (px).
 * Visual chrome stays smaller; hit area expands outward with negative margin.
 */
export const DEFINING_WORLD_PLAZA_INVENTORY_PAGE_ARROW_MIN_HIT_PX = 44 as const;

/** Vertical stack of compact page arrows beside the single inventory row. */
export const STYLING_WORLD_PLAZA_INVENTORY_PAGE_ARROW_STACK_CLASS_NAME =
  'relative flex shrink-0 flex-col items-center justify-center overflow-visible' as const;

/**
 * Expanded hit wrapper for page arrows (transparent; size via viewport styles).
 * Keeps layout footprint via negative margin while the tap box meets min hit px.
 */
export const STYLING_WORLD_PLAZA_INVENTORY_PAGE_ARROW_BUTTON_CLASS_NAME =
  'group relative flex shrink-0 touch-manipulation items-center justify-center border-0 bg-transparent p-0 text-poster-orange-deep disabled:cursor-not-allowed disabled:opacity-35' as const;

/** Solid wood-framed parchment face centered inside the hit wrapper. */
export const STYLING_WORLD_PLAZA_INVENTORY_PAGE_ARROW_BUTTON_FACE_CLASS_NAME =
  `${DEFINING_WORLD_PLAZA_GAMEPLAY_HUD_STYLE.cssShell.inventorySlot} pointer-events-none flex items-center justify-center transition-[filter,box-shadow] group-hover:brightness-105 group-disabled:group-hover:brightness-100` as const;

/** Drag-hover highlight on a page arrow drop target. */
export const STYLING_WORLD_PLAZA_INVENTORY_PAGE_ARROW_BUTTON_DRAG_OVER_CLASS_NAME =
  `${DEFINING_WORLD_PLAZA_GAMEPLAY_HUD_STYLE.slot.dropValid} brightness-110` as const;

/** Bold arrow glyph inside the page buttons. */
export const STYLING_WORLD_PLAZA_INVENTORY_PAGE_ARROW_ICON_CLASS_NAME =
  'shrink-0' as const;

/** Iconify ids for inventory storage page arrows. */
export const DEFINING_WORLD_PLAZA_INVENTORY_PAGE_ARROW_ICONS = {
  up: 'mdi:arrow-up-bold',
  down: 'mdi:arrow-down-bold',
} as const;

/** Gap between inventory slots in the grid row (gap via viewport styles). */
export const STYLING_WORLD_PLAZA_INVENTORY_GRID_GAP_CLASS = '' as const;

/** Occupied slot — cream row styling like home save slots. */
export const STYLING_WORLD_PLAZA_INVENTORY_SLOT_CLASS =
  `${DEFINING_WORLD_PLAZA_GAMEPLAY_HUD_STYLE.cssShell.inventorySlot} relative shrink-0 transition-[box-shadow,ring]` as const;

/** Empty slot variant. */
export const STYLING_WORLD_PLAZA_INVENTORY_SLOT_EMPTY_CLASS =
  DEFINING_WORLD_PLAZA_GAMEPLAY_HUD_STYLE.cssShell.inventorySlotEmpty;

/** Faded fist glyph in the reserved empty weapon/tool slot. */
export const STYLING_WORLD_PLAZA_INVENTORY_EMPTY_FIST_ICON_CLASS =
  'pointer-events-none shrink-0 text-parchment' as const;

/** Centers the empty fist inside the reserved equip slot. */
export const STYLING_WORLD_PLAZA_INVENTORY_EMPTY_WEAPON_TOOL_SLOT_CLASS =
  'flex items-center justify-center' as const;

/** Equipped slot highlight. */
export const STYLING_WORLD_PLAZA_INVENTORY_SLOT_EQUIPPED_CLASS =
  DEFINING_WORLD_PLAZA_GAMEPLAY_HUD_STYLE.cssShell.inventorySlotEquipped;

/** Charcoal outline for the reserved weapon/tool equipment slot. */
export const STYLING_WORLD_PLAZA_INVENTORY_SLOT_WEAPON_TOOL_CLASS =
  DEFINING_WORLD_PLAZA_GAMEPLAY_HUD_STYLE.cssShell.inventorySlotWeaponTool;

/** Drag surface fills the fixed slot. */
export const STYLING_WORLD_PLAZA_INVENTORY_SLOT_DRAG_SURFACE_CLASS =
  'relative z-10 flex touch-manipulation items-center justify-center' as const;

/** Lucide icon layout inside a hotbar slot (size via viewport styles). */
export const STYLING_WORLD_PLAZA_INVENTORY_SLOT_ICON_CLASS =
  'shrink-0' as const;

/** Pixel PNG inventory icons (nearest-neighbor upscale). */
export const STYLING_WORLD_PLAZA_INVENTORY_SLOT_IMAGE_ICON_CLASS =
  'shrink-0 object-contain [image-rendering:pixelated]' as const;

/**
 * Slot durability track: thin centered bar near the bottom edge.
 * Width is inset from both sides so the bar reads centered in the slot.
 */
export const STYLING_WORLD_PLAZA_INVENTORY_SLOT_DURABILITY_TRACK_CLASS =
  'pointer-events-none absolute inset-x-2 bottom-1 block h-0.5 overflow-hidden rounded-full bg-black/35' as const;

/** Durability fill inside the track (width set inline from remaining ratio). */
export const STYLING_WORLD_PLAZA_INVENTORY_SLOT_DURABILITY_FILL_CLASS =
  'block h-full rounded-full' as const;

/** Full durability / healthy fill color. */
export const STYLING_WORLD_PLAZA_INVENTORY_SLOT_DURABILITY_FILL_OK_CLASS =
  'bg-emerald-400' as const;

/** Zero remaining durability fill color (still usable until break roll). */
export const STYLING_WORLD_PLAZA_INVENTORY_SLOT_DURABILITY_FILL_WORN_CLASS =
  'bg-amber-400' as const;

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
