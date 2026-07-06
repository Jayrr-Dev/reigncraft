import type { DefiningWorldPlazaEquipmentToolKind } from '@/components/world/equipment/domains/definingWorldPlazaEquipmentToolKind';

/** Visual tone for inventory item detail badge chips. */
export type DefiningWorldPlazaInventoryItemDetailBadgeVariant =
  | 'neutral'
  | 'positive'
  | 'warning'
  | 'tool'
  | 'food';

/** One informational chip shown in the item detail popover. */
export type DefiningWorldPlazaInventoryItemDetailBadge = {
  readonly id: string;
  readonly label: string;
  readonly variant: DefiningWorldPlazaInventoryItemDetailBadgeVariant;
};

/** Badge chip class names keyed by variant. */
export const DEFINING_WORLD_PLAZA_INVENTORY_ITEM_DETAIL_BADGE_CLASS_BY_VARIANT: Readonly<
  Record<DefiningWorldPlazaInventoryItemDetailBadgeVariant, string>
> = {
  neutral: 'border-poster-wood/35 bg-parchment/80 text-ink-soft',
  positive: 'border-emerald-500/35 bg-emerald-500/15 text-emerald-900',
  warning: 'border-amber-500/40 bg-amber-400/20 text-amber-950',
  tool: 'border-poster-teal/35 bg-poster-teal/15 text-poster-teal-deep',
  food: 'border-orange-400/35 bg-orange-300/20 text-orange-950',
};

/** Human-readable labels for equipped tool kinds. */
export const DEFINING_WORLD_PLAZA_INVENTORY_EQUIPMENT_TOOL_KIND_BADGE_LABELS: Readonly<
  Record<DefiningWorldPlazaEquipmentToolKind, string>
> = {
  axe: 'Chops trees',
  build: 'Places blocks',
  ignite: 'Ignites fires',
};
