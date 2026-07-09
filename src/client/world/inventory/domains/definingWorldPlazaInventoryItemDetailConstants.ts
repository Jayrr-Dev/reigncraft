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
  | 'food';

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

/** Info action row at the top of the tower. */
export const DEFINING_WORLD_PLAZA_INVENTORY_ITEM_ACTION_TOWER_INFO_BUTTON_CLASS_NAME =
  'flex min-h-11 w-full touch-manipulation select-none items-center justify-center border-0 bg-poster-teal-deep/10 px-3 py-2 font-display text-sm font-bold uppercase tracking-[0.08em] leading-none text-poster-teal-deep transition active:bg-poster-teal-deep/15 hover:bg-poster-teal-deep/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-poster-gold/80' as const;

/** Armed enchantment row in the action tower. */
export const DEFINING_WORLD_PLAZA_INVENTORY_ITEM_ACTION_TOWER_ARMED_BUTTON_CLASS_NAME =
  'flex min-h-11 w-full touch-manipulation select-none items-center justify-center border-0 bg-poster-gold/20 px-3 py-2 font-body text-sm font-semibold leading-none text-poster-amber transition active:bg-poster-gold/30 hover:bg-poster-gold/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-poster-gold/80 disabled:cursor-not-allowed disabled:text-ink/30 disabled:active:bg-transparent disabled:hover:bg-transparent' as const;

/** Shared compact rainbow badge chip layout (info dialog). */
export const DEFINING_WORLD_PLAZA_INVENTORY_ITEM_DETAIL_BADGE_CHIP_CLASS_NAME =
  'inline-flex h-4 max-w-full items-center truncate rounded-sm border px-1 font-body text-[7px] font-semibold uppercase leading-none tracking-[0.04em]' as const;

/** Compact row of badge chips (info dialog). */
export const DEFINING_WORLD_PLAZA_INVENTORY_ITEM_DETAIL_BADGE_ROW_CLASS_NAME =
  'mt-1 flex flex-wrap gap-0.5' as const;

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
};

/** Item info dialog chrome (centered, all screen sizes). */
export const DEFINING_WORLD_PLAZA_INVENTORY_ITEM_INFO_DIALOG_STYLE = {
  overlay: `${DEFINING_WORLD_PLAZA_CONFIRM_DIALOG_STYLE.overlayFixed} z-[70]`,
  panel: `${DEFINING_WORLD_PLAZA_CONFIRM_DIALOG_STYLE.panel} w-[min(19rem,calc(100vw-2rem))] max-w-none p-0`,
  header:
    'flex items-start justify-between gap-2 border-b border-ink/10 px-3 py-2.5',
  title:
    'min-w-0 flex-1 font-display text-sm font-bold uppercase leading-tight tracking-[0.06em] text-poster-teal-deep',
  closeButton:
    'flex size-6 shrink-0 items-center justify-center rounded border border-ink/15 text-ink/55 transition hover:border-ink/25 hover:bg-ink/5 hover:text-ink/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-poster-gold/70',
  body: 'space-y-3 px-3 py-2.5',
  description: 'font-body text-xs font-normal leading-relaxed text-ink-soft',
  infoSection: 'space-y-1',
  infoSectionLabel:
    'font-body text-[10px] font-semibold uppercase tracking-[0.08em] text-ink/55',
  infoRow:
    'grid grid-cols-[minmax(0,7.5rem)_minmax(0,1fr)] items-baseline gap-x-2 gap-y-0.5',
  infoRowLabel: 'font-body text-[10px] font-medium leading-snug text-ink/60',
  infoRowValue: 'font-body text-[11px] font-semibold leading-snug text-ink',
  infoRowValuePositive: 'text-emerald-800',
  infoRowValueWarning: 'text-amber-800',
  infoRowValueFood: 'text-orange-900',
  infoRowValueTool: 'text-sky-900',
  durabilityLabel:
    'font-body text-[10px] font-semibold tabular-nums leading-none text-ink/70',
  enchantmentBlock: 'space-y-1',
  enchantmentRow:
    'rounded border border-violet-300/40 bg-violet-100/50 px-2 py-1',
  enchantmentName:
    'font-body text-[10px] font-semibold leading-none text-violet-950',
  enchantmentDescription:
    'mt-0.5 font-body text-[10px] font-normal leading-snug text-violet-900/80',
} as const;

/** Accessible label for the item info dialog. */
export const LABELING_WORLD_PLAZA_INVENTORY_ITEM_INFO_DIALOG =
  'Item details' as const;

/** Accessible label for the info dialog dismiss control. */
export const LABELING_WORLD_PLAZA_INVENTORY_ITEM_INFO_DIALOG_DISMISS =
  'Close item details' as const;

/** Section heading for expanded item stats. */
export const LABELING_WORLD_PLAZA_INVENTORY_ITEM_INFO_DIALOG_STATS =
  'Details' as const;

/** Section heading for passive enchantments. */
export const LABELING_WORLD_PLAZA_INVENTORY_ITEM_INFO_DIALOG_ENCHANTMENTS =
  'Enchantments' as const;

/** Info tower button label. */
export const LABELING_WORLD_PLAZA_INVENTORY_ITEM_ACTION_TOWER_INFO =
  'Info' as const;

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
