import { DEFINING_WORLD_PLAZA_PLAYER_NAME_LABEL_OFFSET_ABOVE_AVATAR_PX } from '@/components/world/domains/definingWorldPlazaPlayerNameLabelConstants';

/**
 * Same head-top anchor as name labels minus the 2px name gap, plus 6px lift so
 * the bar sits slightly above the visible head line.
 */
export const DEFINING_WORLD_PLAZA_ENTITY_HEALTH_BAR_OFFSET_ABOVE_AVATAR_PX =
  DEFINING_WORLD_PLAZA_PLAYER_NAME_LABEL_OFFSET_ABOVE_AVATAR_PX - 2 + 6;

/** Unscaled health bar width in CSS pixels (divisible by 10 for even 100 HP ticks). */
export const DEFINING_WORLD_PLAZA_ENTITY_HEALTH_BAR_WIDTH_PX = 50;

/** Unscaled health bar height in CSS pixels (League-style thin bar). */
export const DEFINING_WORLD_PLAZA_ENTITY_HEALTH_BAR_HEIGHT_PX = 4;

/** Track fill for missing HP (kept lighter so empty bar does not read as broken). */
export const DEFINING_WORLD_PLAZA_ENTITY_HEALTH_BAR_EMPTY_TRACK_COLOR =
  '#2f3a2c' as const;

/** Hit points per vertical segment divider (one tick every 100 HP). */
export const DEFINING_WORLD_PLAZA_ENTITY_HEALTH_BAR_SEGMENT_HEALTH = 100;

/** Health ratio below which the bar turns yellow. */
export const DEFINING_WORLD_PLAZA_ENTITY_HEALTH_BAR_LOW_RATIO = 0.5;

/** Health ratio below which the bar turns red. */
export const DEFINING_WORLD_PLAZA_ENTITY_HEALTH_BAR_CRITICAL_RATIO = 0.25;

/** Buff/debuff icon size below the health bar (75% of the prior 11px size). */
export const DEFINING_WORLD_PLAZA_ENTITY_HEALTH_BUFF_ICON_SIZE_PX = 8;

/** Unscaled stamina bar height stacked directly under the HP bar. */
export const DEFINING_WORLD_PLAZA_ENTITY_STAMINA_BAR_HEIGHT_PX = 3;

/** Gap between the buff icon row and the nameplate / HP stack below it. */
export const DEFINING_WORLD_PLAZA_ENTITY_HEALTH_BUFF_ROW_GAP_BELOW_ICONS_PX = 2;

/** Reserved height for the buff icon row so the card/name stack stays stable. */
export const DEFINING_WORLD_PLAZA_ENTITY_HEALTH_BUFF_ROW_RESERVED_HEIGHT_PX = 15;

/** Extra margin (CSS px) under the open buff explanation card above the icon row. */
export const DEFINING_WORLD_PLAZA_ENTITY_HEALTH_BUFF_CARD_GAP_ABOVE_ICONS_PX = 8;
