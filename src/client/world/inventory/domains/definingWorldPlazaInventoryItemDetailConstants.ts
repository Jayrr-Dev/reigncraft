import type {
  DefiningReigncraftBadgeDarkShade,
  DefiningReigncraftBadgeRainbowColor,
} from '@/components/ui/domains/definingReigncraftBadgeConstants';
import { DEFINING_WORLD_PLAZA_CONFIRM_DIALOG_STYLE } from '@/components/world/domains/definingWorldPlazaConfirmDialogConstants';
import type { DefiningWorldPlazaEquipmentToolKind } from '@/components/world/equipment/domains/definingWorldPlazaEquipmentToolKind';

/** One label/value row in the item info dialog. */
export type DefiningWorldPlazaInventoryItemDetailInfoRow = {
  readonly id: string;
  readonly label: string;
  readonly value: string;
  readonly tone?: DefiningWorldPlazaInventoryItemDetailBadgeVariant;
};

/** Visual tone for inventory item detail badge chips. */
export type DefiningWorldPlazaInventoryItemDetailBadgeVariant =
  | 'neutral'
  | 'positive'
  | 'warning'
  | 'tool'
  | 'food'
  | 'enhancement'
  | 'enchantment'
  | 'rarity-basic'
  | 'rarity-common'
  | 'rarity-uncommon'
  | 'rarity-rare'
  | 'rarity-epic'
  | 'rarity-mythic'
  | 'rarity-legendary'
  | 'rarity-godly'
  | 'tag-godforge'
  | 'tag-unique'
  | 'tag-quest-reward';

/** One informational chip shown in the item info dialog. */
export type DefiningWorldPlazaInventoryItemDetailBadge = {
  readonly id: string;
  readonly label: string;
  readonly variant: DefiningWorldPlazaInventoryItemDetailBadgeVariant;
};

/** Rainbow badge paint preset for one item detail badge variant. */
export type DefiningWorldPlazaInventoryItemDetailBadgePaintPreset = {
  readonly color: DefiningReigncraftBadgeRainbowColor;
  readonly shade: DefiningReigncraftBadgeDarkShade;
};

/** Minimum touch row height for the item action tower (px). */
export const DEFINING_WORLD_PLAZA_INVENTORY_ITEM_ACTION_TOWER_MIN_TOUCH_ROW_PX =
  44 as const;

/**
 * Slot-anchored action tower shell — same width on mobile, desktop, and fullscreen
 * so rows stay tappable and the menu does not shrink to hotbar slot width.
 */
export const DEFINING_WORLD_PLAZA_INVENTORY_ITEM_ACTION_TOWER_SHELL_CLASS_NAME =
  'pointer-events-auto absolute bottom-full left-1/2 z-[60] mb-3 w-[min(10.5rem,calc(100vw-2rem))] min-w-0 -translate-x-1/2 flex flex-col items-stretch touch-manipulation select-none' as const;

/** Vertical menu panel (parchment poster chrome). */
export const DEFINING_WORLD_PLAZA_INVENTORY_ITEM_ACTION_TOWER_PANEL_CLASS_NAME =
  'plaza-item-action-tower-panel w-full min-w-0 overflow-hidden rounded-md divide-y divide-poster-wood/25' as const;

/** Standard action row in the item action tower. */
export const DEFINING_WORLD_PLAZA_INVENTORY_ITEM_ACTION_TOWER_BUTTON_CLASS_NAME =
  'flex min-h-11 w-full touch-manipulation select-none items-center justify-center border-0 bg-transparent px-3 py-2 font-body text-sm font-semibold leading-none text-ink transition active:bg-poster-wood/15 hover:bg-poster-wood/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-poster-gold/80 disabled:cursor-not-allowed disabled:text-ink/30 disabled:active:bg-transparent disabled:hover:bg-transparent' as const;

/** Destructive action row (drop). */
export const DEFINING_WORLD_PLAZA_INVENTORY_ITEM_ACTION_TOWER_DESTRUCTIVE_BUTTON_CLASS_NAME =
  'flex min-h-11 w-full touch-manipulation select-none items-center justify-center border-0 bg-transparent px-3 py-2 font-body text-sm font-semibold leading-none text-poster-orange-deep transition active:bg-poster-orange/20 hover:bg-poster-orange/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-poster-orange/70 disabled:cursor-not-allowed disabled:text-ink/30 disabled:active:bg-transparent disabled:hover:bg-transparent' as const;

/** Info action row at the top of the tower (name + info icon). */
export const DEFINING_WORLD_PLAZA_INVENTORY_ITEM_ACTION_TOWER_INFO_BUTTON_CLASS_NAME =
  'flex min-h-11 w-full touch-manipulation select-none items-center justify-start gap-1.5 border-0 bg-poster-teal-deep/10 px-3 py-2 font-display text-sm font-bold leading-tight tracking-[0.04em] text-poster-teal-deep transition active:bg-poster-teal-deep/15 hover:bg-poster-teal-deep/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-poster-gold/80' as const;

/** Wrapped item-name label inside the info action row. */
export const DEFINING_WORLD_PLAZA_INVENTORY_ITEM_ACTION_TOWER_INFO_NAME_CLASS_NAME =
  'min-w-0 flex-1 whitespace-normal break-words text-left' as const;

/** Bundled Iconify glyph for the info action row. */
export const DEFINING_WORLD_PLAZA_INVENTORY_ITEM_ACTION_TOWER_INFO_ICONIFY_ICON =
  'mdi:information-outline' as const;

/** Armed enchantment row in the action tower. */
export const DEFINING_WORLD_PLAZA_INVENTORY_ITEM_ACTION_TOWER_ARMED_BUTTON_CLASS_NAME =
  'flex min-h-11 w-full touch-manipulation select-none items-center justify-center border-0 bg-poster-gold/20 px-3 py-2 font-body text-sm font-semibold leading-none text-poster-amber transition active:bg-poster-gold/30 hover:bg-poster-gold/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-poster-gold/80 disabled:cursor-not-allowed disabled:text-ink/30 disabled:active:bg-transparent disabled:hover:bg-transparent' as const;

/** Compact row of badge chips (info dialog). */
export const DEFINING_WORLD_PLAZA_INVENTORY_ITEM_DETAIL_BADGE_ROW_CLASS_NAME =
  'mt-1.5 flex flex-wrap gap-1 sm:mt-2 sm:gap-1.5' as const;

/** Shared compact rainbow badge chip layout (info dialog). */
export const DEFINING_WORLD_PLAZA_INVENTORY_ITEM_DETAIL_BADGE_CHIP_CLASS_NAME =
  'inline-flex h-5 max-w-full items-center truncate rounded-sm border px-1.5 font-body text-[8px] font-semibold uppercase leading-none tracking-[0.06em] sm:h-6 sm:px-2 sm:text-[9px]' as const;

/** Rainbow badge presets keyed by informational badge variant. */
export const DEFINING_WORLD_PLAZA_INVENTORY_ITEM_DETAIL_BADGE_PAINT_BY_VARIANT: Readonly<
  Record<
    DefiningWorldPlazaInventoryItemDetailBadgeVariant,
    DefiningWorldPlazaInventoryItemDetailBadgePaintPreset
  >
> = {
  neutral: { color: 'indigo', shade: 'dark' },
  positive: { color: 'green', shade: 'dark' },
  warning: { color: 'orange', shade: 'darker' },
  tool: { color: 'blue', shade: 'dark' },
  food: { color: 'orange', shade: 'dark' },
  enhancement: { color: 'blue', shade: 'dark' },
  enchantment: { color: 'violet', shade: 'dark' },
  'rarity-basic': { color: 'indigo', shade: 'darker' },
  'rarity-common': { color: 'blue', shade: 'dark' },
  'rarity-uncommon': { color: 'green', shade: 'dark' },
  'rarity-rare': { color: 'blue', shade: 'darker' },
  'rarity-epic': { color: 'violet', shade: 'dark' },
  'rarity-mythic': { color: 'orange', shade: 'dark' },
  'rarity-legendary': { color: 'yellow', shade: 'dark' },
  'rarity-godly': { color: 'red', shade: 'deepest' },
  'tag-godforge': { color: 'yellow', shade: 'deepest' },
  'tag-unique': { color: 'violet', shade: 'darker' },
  'tag-quest-reward': { color: 'orange', shade: 'darker' },
};

/** Item info dialog chrome (centered; scales up on larger viewports). */
export const DEFINING_WORLD_PLAZA_INVENTORY_ITEM_INFO_DIALOG_STYLE = {
  overlay: `${DEFINING_WORLD_PLAZA_CONFIRM_DIALOG_STYLE.overlayFixed} z-[70]`,
  panel: `${DEFINING_WORLD_PLAZA_CONFIRM_DIALOG_STYLE.panel} w-[min(22rem,calc(100vw-1.5rem))] max-w-none p-0 sm:w-[min(26rem,calc(100vw-2rem))] md:w-[min(30rem,calc(100vw-3rem))]`,
  header:
    'flex items-start justify-between gap-2 border-b border-ink/10 px-3.5 py-3 sm:gap-3 sm:px-5 sm:py-3.5 md:px-6 md:py-4',
  title:
    'min-w-0 flex-1 font-display text-base font-bold uppercase leading-tight tracking-[0.06em] text-poster-teal-deep sm:text-lg md:text-xl',
  closeButton:
    'flex size-7 shrink-0 items-center justify-center rounded border border-ink/15 text-ink/55 transition hover:border-ink/25 hover:bg-ink/5 hover:text-ink/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-poster-gold/70 sm:size-8',
  closeIcon: 'size-4 sm:size-5' as const,
  body: 'space-y-2.5 px-3.5 py-3 sm:space-y-3 sm:px-5 sm:py-3.5 md:space-y-3.5 md:px-6 md:py-4',
  iconFrame:
    'mx-auto flex size-16 shrink-0 items-center justify-center rounded-md border border-ink/10 bg-ink/[0.04] sm:size-20 md:size-24',
  itemIcon:
    'size-10 text-[2.5rem] leading-none sm:size-12 sm:text-[3rem] md:size-14 md:text-[3.5rem]' as const,
  description:
    'font-body text-sm font-normal leading-relaxed text-ink-soft sm:text-base md:text-lg',
  infoSection: 'space-y-1 sm:space-y-1.5',
  infoSectionLabel:
    'font-body text-xs font-semibold uppercase tracking-[0.08em] text-ink/55 sm:text-sm',
  infoRow:
    'grid grid-cols-[minmax(0,8.5rem)_minmax(0,1fr)] items-baseline gap-x-3 gap-y-0.5 sm:grid-cols-[minmax(0,10rem)_minmax(0,1fr)] sm:gap-x-4',
  infoRowLabel:
    'font-body text-xs font-medium leading-snug text-ink/60 sm:text-sm',
  infoRowValue:
    'font-body text-sm font-semibold leading-snug text-ink sm:text-base',
  infoRowValuePositive: 'text-emerald-800',
  infoRowValueWarning: 'text-amber-800',
  infoRowValueFood: 'text-orange-900',
  infoRowValueTool: 'text-sky-900',
  durabilityRow: 'flex items-center gap-2 sm:gap-2.5',
  durabilityLabel:
    'shrink-0 font-body text-xs font-semibold tabular-nums leading-none text-ink/70 sm:text-sm',
  itemModBlock: 'space-y-1.5 sm:space-y-2',
  itemModBadgeRow: 'flex flex-wrap gap-1.5 sm:gap-2',
  itemModBadgeShell:
    'inline-flex h-6 max-w-full cursor-pointer touch-manipulation select-none items-center truncate rounded-sm border px-2 font-body text-[10px] font-semibold uppercase leading-none tracking-[0.06em] transition hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-poster-gold/80 sm:h-7 sm:px-2.5 sm:text-[11px]',
  itemModBadgeShellExpanded: 'ring-2 ring-poster-gold/55',
  itemModDescription:
    'mt-1.5 w-full rounded border border-ink/10 bg-ink/[0.04] px-2.5 py-1.5 font-body text-xs font-normal leading-snug text-ink-soft sm:mt-2 sm:px-3 sm:py-2 sm:text-sm',
} as const;

/** Accessible hint appended when an item-mod badge can expand. */
export const LABELING_WORLD_PLAZA_INVENTORY_ITEM_INFO_DIALOG_ITEM_MOD_EXPAND =
  'Tap for details' as const;

/** Accessible label for the item info dialog. */
export const LABELING_WORLD_PLAZA_INVENTORY_ITEM_INFO_DIALOG =
  'Item details' as const;

/** Accessible label for the info dialog dismiss control. */
export const LABELING_WORLD_PLAZA_INVENTORY_ITEM_INFO_DIALOG_DISMISS =
  'Close item details' as const;

/** Section heading for expanded item stats. */
export const LABELING_WORLD_PLAZA_INVENTORY_ITEM_INFO_DIALOG_STATS =
  'Details' as const;

/** Section heading for passive enhancements (physical / concrete). */
export const LABELING_WORLD_PLAZA_INVENTORY_ITEM_INFO_DIALOG_ENHANCEMENTS =
  'Enhancements' as const;

/** Section heading for passive enchantments (status / buffs / damage type). */
export const LABELING_WORLD_PLAZA_INVENTORY_ITEM_INFO_DIALOG_ENCHANTMENTS =
  'Enchantments' as const;

/** Accessible label for the info tower button (opens item details). */
export const LABELING_WORLD_PLAZA_INVENTORY_ITEM_ACTION_TOWER_INFO =
  'Item details' as const;

/** Human-readable labels for equipped tool kinds. */
export const DEFINING_WORLD_PLAZA_INVENTORY_EQUIPMENT_TOOL_KIND_BADGE_LABELS: Readonly<
  Record<DefiningWorldPlazaEquipmentToolKind, string>
> = {
  axe: 'Chops trees',
  build: 'Places blocks',
  ignite: 'Ignites fires',
  sword: 'Melee weapon',
  hoe: 'Tills soil',
  scythe: 'Harvests crops',
  fishrod: 'Fishes water',
};
