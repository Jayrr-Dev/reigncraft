/**
 * Labels and styling for the plaza character profile panel opened from the
 * action bar (Minecraft-style player info with live RPG stats).
 *
 * @module components/world/domains/definingWorldPlazaProfilePanelConstants
 */

import { DEFINING_WORLD_PLAZA_GAMEPLAY_HUD_STYLE } from '@/components/world/domains/definingWorldPlazaGameplayHudStyleConstants';

/** Accessible label for the profile action bar button. */
export const LABELING_WORLD_PLAZA_ACTION_BAR_PROFILE =
  'Character profile' as const;

/** Panel heading. */
export const LABELING_WORLD_PLAZA_PROFILE_PANEL_TITLE = 'Character' as const;

/** Accessible label for the close control. */
export const LABELING_WORLD_PLAZA_PROFILE_PANEL_CLOSE =
  'Close character profile' as const;

/** Section heading above the vital bars. */
export const LABELING_WORLD_PLAZA_PROFILE_PANEL_VITALS_SECTION =
  'Vitals' as const;

/** Section heading above the attribute chips. */
export const LABELING_WORLD_PLAZA_PROFILE_PANEL_ATTRIBUTES_SECTION =
  'Attributes' as const;

/** Stats-tab category: attack, defense, attack speed. */
export const LABELING_WORLD_PLAZA_PROFILE_PANEL_COMBAT_SECTION =
  'Combat' as const;

/** Stats-tab category: movement, jump, roll. */
export const LABELING_WORLD_PLAZA_PROFILE_PANEL_AGILITY_SECTION =
  'Agility' as const;

/** Stats-tab category: height, weight, temperature thresholds. */
export const LABELING_WORLD_PLAZA_PROFILE_PANEL_PHYSICALITY_SECTION =
  'Physicality' as const;

/** Ordered attribute category ids for the Stats tab. */
export type DefiningWorldPlazaProfilePanelAttributeCategoryId =
  | 'combat'
  | 'agility'
  | 'physicality';

/** Declarative Stats-tab attribute category headings. */
export const DEFINING_WORLD_PLAZA_PROFILE_PANEL_ATTRIBUTE_CATEGORY_REGISTRY = [
  {
    id: 'combat' as const,
    label: LABELING_WORLD_PLAZA_PROFILE_PANEL_COMBAT_SECTION,
  },
  {
    id: 'agility' as const,
    label: LABELING_WORLD_PLAZA_PROFILE_PANEL_AGILITY_SECTION,
  },
  {
    id: 'physicality' as const,
    label: LABELING_WORLD_PLAZA_PROFILE_PANEL_PHYSICALITY_SECTION,
  },
] as const;

/** Section heading above inherited wildlife passives. */
export const LABELING_WORLD_PLAZA_PROFILE_PANEL_PASSIVES_SECTION =
  'Passives' as const;

/** Copy shown when the current form has no on-hit or trait passives. */
export const LABELING_WORLD_PLAZA_PROFILE_PANEL_PASSIVES_EMPTY =
  'No inherited passives' as const;

/** Section heading above active buffs and ailments. */
export const LABELING_WORLD_PLAZA_PROFILE_PANEL_EFFECTS_SECTION =
  'Active effects' as const;

/** Copy shown in the effects section when nothing is active. */
export const LABELING_WORLD_PLAZA_PROFILE_PANEL_EFFECTS_EMPTY =
  'No active effects' as const;

/** Profile panel body tab ids. */
export type DefiningWorldPlazaProfilePanelTabId = 'status' | 'stats';

/** One tab in the profile panel strip. */
export type DefiningWorldPlazaProfilePanelTabDefinition = {
  id: DefiningWorldPlazaProfilePanelTabId;
  label: string;
};

/** Ordered tabs: live vitals/effects vs derived stats/passives. */
export const DEFINING_WORLD_PLAZA_PROFILE_PANEL_TAB_REGISTRY: readonly DefiningWorldPlazaProfilePanelTabDefinition[] =
  [
    { id: 'status', label: 'Status' },
    { id: 'stats', label: 'Stats' },
  ] as const;

/** Default tab when the panel opens. */
export const DEFINING_WORLD_PLAZA_PROFILE_PANEL_DEFAULT_TAB_ID: DefiningWorldPlazaProfilePanelTabId =
  'status';

/** Accessible label for the profile panel tab list. */
export const LABELING_WORLD_PLAZA_PROFILE_PANEL_TAB_LIST =
  'Character panel sections' as const;

/** Full-viewport anchor centering the profile panel over the plaza. */
export const STYLING_WORLD_PLAZA_PROFILE_PANEL_ANCHOR_CLASS_NAME =
  `pointer-events-none absolute inset-0 z-[70] flex items-center justify-center p-3 ${DEFINING_WORLD_PLAZA_GAMEPLAY_HUD_STYLE.scope.lightTheme}` as const;

/** Click-to-close backdrop behind the panel. */
export const STYLING_WORLD_PLAZA_PROFILE_PANEL_BACKDROP_CLASS_NAME =
  'pointer-events-auto absolute inset-0 bg-black/45' as const;

/** Parchment panel shell (scrolls on short viewports). */
export const STYLING_WORLD_PLAZA_PROFILE_PANEL_SHELL_CLASS_NAME =
  `${DEFINING_WORLD_PLAZA_GAMEPLAY_HUD_STYLE.cssShell.parchmentPanel} pointer-events-auto relative flex w-[min(92vw,22rem)] max-h-[min(82vh,28rem)] flex-col gap-2 overflow-y-auto p-2.5 font-body [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden` as const;

/** Header row holding the title and close button. */
export const STYLING_WORLD_PLAZA_PROFILE_PANEL_HEADER_CLASS_NAME =
  'flex items-center justify-between gap-2' as const;

/** Panel title treatment. */
export const STYLING_WORLD_PLAZA_PROFILE_PANEL_TITLE_CLASS_NAME =
  `${DEFINING_WORLD_PLAZA_GAMEPLAY_HUD_STYLE.typography.labelDisplay} text-xs font-bold text-poster-teal-deep` as const;

/** Close button in the header. */
export const STYLING_WORLD_PLAZA_PROFILE_PANEL_CLOSE_BUTTON_CLASS_NAME =
  `flex size-6 shrink-0 items-center justify-center rounded-md text-ink-soft transition-colors hover:bg-parchment-dark/50 hover:text-ink ${DEFINING_WORLD_PLAZA_GAMEPLAY_HUD_STYLE.interactive.focusRingGold}` as const;

/** Identity row: portrait beside name and skin details. */
export const STYLING_WORLD_PLAZA_PROFILE_PANEL_IDENTITY_ROW_CLASS_NAME =
  'flex items-center gap-2.5' as const;

/** Inset frame around the avatar portrait. */
export const STYLING_WORLD_PLAZA_PROFILE_PANEL_PORTRAIT_FRAME_CLASS_NAME =
  `${DEFINING_WORLD_PLAZA_GAMEPLAY_HUD_STYLE.surface.parchmentCardInsetFrame} relative size-14 shrink-0 bg-parchment-dark/40` as const;

/** Sampled sprite frame filling the portrait box. */
export const STYLING_WORLD_PLAZA_PROFILE_PANEL_PORTRAIT_SPRITE_CLASS_NAME =
  'pointer-events-none absolute inset-0' as const;

/** Zoom applied to the cropped portrait frame. */
export const DEFINING_WORLD_PLAZA_PROFILE_PANEL_PORTRAIT_ZOOM = 1.55 as const;

/** Player display name in the identity row. */
export const STYLING_WORLD_PLAZA_PROFILE_PANEL_NAME_CLASS_NAME =
  'truncate font-display text-sm font-bold leading-tight text-ink' as const;

/** Skin display name under the player name. */
export const STYLING_WORLD_PLAZA_PROFILE_PANEL_SKIN_CLASS_NAME =
  'truncate text-[11px] font-semibold leading-tight text-ink-soft' as const;

/** Level chip in the identity row. */
export const STYLING_WORLD_PLAZA_PROFILE_PANEL_LEVEL_CHIP_CLASS_NAME =
  'mt-0.5 inline-flex w-max items-center gap-1 rounded-full border border-poster-gold/50 bg-poster-teal-deep/85 px-2 py-0.5 font-display text-[10px] font-bold uppercase tracking-[0.08em] text-parchment' as const;

/** Segmented tab strip under the identity row. */
export const STYLING_WORLD_PLAZA_PROFILE_PANEL_TAB_LIST_CLASS_NAME =
  'flex shrink-0 gap-0.5 rounded-md border border-poster-wood/35 bg-parchment-dark/35 p-0.5' as const;

/** Inactive tab button. */
export const STYLING_WORLD_PLAZA_PROFILE_PANEL_TAB_BUTTON_CLASS_NAME =
  `flex-1 rounded px-2 py-1 font-display text-[10px] font-bold uppercase tracking-[0.08em] text-ink-soft transition-colors hover:text-ink ${DEFINING_WORLD_PLAZA_GAMEPLAY_HUD_STYLE.interactive.focusRingGold}` as const;

/** Active tab button. */
export const STYLING_WORLD_PLAZA_PROFILE_PANEL_TAB_BUTTON_ACTIVE_CLASS_NAME =
  'bg-poster-teal-deep/90 text-parchment shadow-sm' as const;

/** Scrollable tab body under the strip. */
export const STYLING_WORLD_PLAZA_PROFILE_PANEL_TAB_BODY_CLASS_NAME =
  'flex min-h-0 flex-col gap-2' as const;

/** Stack of blocks inside one tab. */
export const STYLING_WORLD_PLAZA_PROFILE_PANEL_TAB_SECTION_STACK_CLASS_NAME =
  'flex flex-col gap-1.5' as const;

/** Small-caps section heading. */
export const STYLING_WORLD_PLAZA_PROFILE_PANEL_SECTION_HEADING_CLASS_NAME =
  `${DEFINING_WORLD_PLAZA_GAMEPLAY_HUD_STYLE.typography.labelDisplay} text-[10px] font-bold text-ink/60` as const;

/** One vital row (icon, label, value, bar). */
export const STYLING_WORLD_PLAZA_PROFILE_PANEL_VITAL_ROW_CLASS_NAME =
  'flex flex-col gap-0.5' as const;

/** Stack of vital rows. */
export const STYLING_WORLD_PLAZA_PROFILE_PANEL_VITAL_LIST_CLASS_NAME =
  'flex flex-col gap-1.5' as const;

/** Label line inside a vital row. */
export const STYLING_WORLD_PLAZA_PROFILE_PANEL_VITAL_LABEL_ROW_CLASS_NAME =
  'flex items-center gap-1.5 text-[11px] font-semibold text-ink' as const;

/** Numeric value at the end of a vital label line. */
export const STYLING_WORLD_PLAZA_PROFILE_PANEL_VITAL_VALUE_CLASS_NAME =
  'ml-auto shrink-0 tabular-nums font-display text-[11px] font-bold text-poster-teal-deep' as const;

/** Bar track behind vital fills. */
export const STYLING_WORLD_PLAZA_PROFILE_PANEL_VITAL_TRACK_CLASS_NAME =
  `${DEFINING_WORLD_PLAZA_GAMEPLAY_HUD_STYLE.surface.barTrack} h-1.5 w-full` as const;

/** Detail caption under a vital bar. */
export const STYLING_WORLD_PLAZA_PROFILE_PANEL_VITAL_DETAIL_CLASS_NAME =
  'text-[9px] font-medium italic leading-tight text-ink-soft' as const;

/** Two-column attribute grid. */
export const STYLING_WORLD_PLAZA_PROFILE_PANEL_ATTRIBUTE_GRID_CLASS_NAME =
  'grid grid-cols-2 gap-1' as const;

/** One attribute chip. */
export const STYLING_WORLD_PLAZA_PROFILE_PANEL_ATTRIBUTE_CHIP_CLASS_NAME =
  'flex items-center gap-1 rounded-md border border-poster-wood/30 bg-parchment-dark/30 px-1.5 py-1' as const;

/** Attribute label inside a chip. */
export const STYLING_WORLD_PLAZA_PROFILE_PANEL_ATTRIBUTE_LABEL_CLASS_NAME =
  'min-w-0 truncate text-[10px] font-semibold text-ink-soft' as const;

/** Attribute value inside a chip. */
export const STYLING_WORLD_PLAZA_PROFILE_PANEL_ATTRIBUTE_VALUE_CLASS_NAME =
  'ml-auto shrink-0 tabular-nums font-display text-[11px] font-bold text-ink' as const;

/** One active effect row. */
export const STYLING_WORLD_PLAZA_PROFILE_PANEL_EFFECT_ROW_CLASS_NAME =
  'flex items-baseline gap-1.5 text-[11px] leading-tight' as const;

/** Effect label emphasis. */
export const STYLING_WORLD_PLAZA_PROFILE_PANEL_EFFECT_LABEL_CLASS_NAME =
  'shrink-0 font-semibold text-ink' as const;

/** Effect description copy. */
export const STYLING_WORLD_PLAZA_PROFILE_PANEL_EFFECT_DESCRIPTION_CLASS_NAME =
  'min-w-0 truncate text-[10px] italic text-ink-soft' as const;

/** Icon size for vital and attribute glyphs. */
export const DEFINING_WORLD_PLAZA_PROFILE_PANEL_ICON_SIZE_PX = 12 as const;

/** Profile attribute label for the cold comfort floor. */
export const LABELING_WORLD_PLAZA_PROFILE_PANEL_COLD_THRESHOLD_ATTRIBUTE =
  'Cold threshold' as const;

/** Iconify id for the cold threshold attribute chip. */
export const DEFINING_WORLD_PLAZA_PROFILE_PANEL_COLD_THRESHOLD_ATTRIBUTE_ICON =
  'mdi:snowflake' as const;

/** Profile attribute label for the heat comfort ceiling. */
export const LABELING_WORLD_PLAZA_PROFILE_PANEL_HEAT_THRESHOLD_ATTRIBUTE =
  'Heat threshold' as const;

/** Iconify id for the heat threshold attribute chip. */
export const DEFINING_WORLD_PLAZA_PROFILE_PANEL_HEAT_THRESHOLD_ATTRIBUTE_ICON =
  'mdi:fire' as const;

/** Profile attribute label for walk / run jump distance. */
export const LABELING_WORLD_PLAZA_PROFILE_PANEL_JUMP_DISTANCE_ATTRIBUTE =
  'Jump distance' as const;

/** Iconify id for the jump distance attribute chip. */
export const DEFINING_WORLD_PLAZA_PROFILE_PANEL_JUMP_DISTANCE_ATTRIBUTE_ICON =
  'mdi:jump' as const;

/** Profile attribute label for max upward jump layer reach. */
export const LABELING_WORLD_PLAZA_PROFILE_PANEL_JUMP_HEIGHT_ATTRIBUTE =
  'Jump height' as const;

/** Iconify id for the jump height attribute chip. */
export const DEFINING_WORLD_PLAZA_PROFILE_PANEL_JUMP_HEIGHT_ATTRIBUTE_ICON =
  'mdi:stairs-up' as const;

/** Profile attribute label for walk / run jump stamina cost. */
export const LABELING_WORLD_PLAZA_PROFILE_PANEL_JUMP_COST_ATTRIBUTE =
  'Jump cost' as const;

/** Iconify id for the jump cost attribute chip. */
export const DEFINING_WORLD_PLAZA_PROFILE_PANEL_JUMP_COST_ATTRIBUTE_ICON =
  'mdi:battery-minus' as const;

/** Profile attribute label for roll dodge stamina cost. */
export const LABELING_WORLD_PLAZA_PROFILE_PANEL_ROLL_COST_ATTRIBUTE =
  'Roll cost' as const;

/** Iconify id for the roll cost attribute chip. */
export const DEFINING_WORLD_PLAZA_PROFILE_PANEL_ROLL_COST_ATTRIBUTE_ICON =
  'mdi:rotate-right' as const;

/** Profile attribute label for sprint acceleration (walk → top speed). */
export const LABELING_WORLD_PLAZA_PROFILE_PANEL_ACCELERATION_ATTRIBUTE =
  'Acceleration' as const;

/** Iconify id for the acceleration attribute chip. */
export const DEFINING_WORLD_PLAZA_PROFILE_PANEL_ACCELERATION_ATTRIBUTE_ICON =
  'mdi:trending-up' as const;

/** Profile attribute label for sprint top speed. */
export const LABELING_WORLD_PLAZA_PROFILE_PANEL_TOP_SPEED_ATTRIBUTE =
  'Top speed' as const;

/** Iconify id for the top speed attribute chip. */
export const DEFINING_WORLD_PLAZA_PROFILE_PANEL_TOP_SPEED_ATTRIBUTE_ICON =
  'mdi:speedometer' as const;

/** Profile attribute label for resting stamina regeneration. */
export const LABELING_WORLD_PLAZA_PROFILE_PANEL_STAMINA_REGEN_ATTRIBUTE =
  'Stamina regen' as const;

/** Iconify id for the stamina regen attribute chip. */
export const DEFINING_WORLD_PLAZA_PROFILE_PANEL_STAMINA_REGEN_ATTRIBUTE_ICON =
  'mdi:battery-plus' as const;
