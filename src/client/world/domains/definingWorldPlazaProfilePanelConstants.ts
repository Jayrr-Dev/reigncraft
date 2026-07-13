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

/** Section heading above inherited wildlife passives. */
export const LABELING_WORLD_PLAZA_PROFILE_PANEL_PASSIVES_SECTION =
  'Passives' as const;

/** Copy shown when the current form has no on-hit or trait passives. */
export const LABELING_WORLD_PLAZA_PROFILE_PANEL_PASSIVES_EMPTY =
  'No inherited passives' as const;

/** Copy shown in the effects section when nothing is active. */
export const LABELING_WORLD_PLAZA_PROFILE_PANEL_EFFECTS_EMPTY =
  'No active effects' as const;

/** Full-viewport anchor centering the profile panel over the plaza. */
export const STYLING_WORLD_PLAZA_PROFILE_PANEL_ANCHOR_CLASS_NAME =
  `pointer-events-none absolute inset-0 z-[70] flex items-center justify-center p-3 ${DEFINING_WORLD_PLAZA_GAMEPLAY_HUD_STYLE.scope.lightTheme}` as const;

/** Click-to-close backdrop behind the panel. */
export const STYLING_WORLD_PLAZA_PROFILE_PANEL_BACKDROP_CLASS_NAME =
  'pointer-events-auto absolute inset-0 bg-black/45' as const;

/** Parchment panel shell (scrolls on short viewports). */
export const STYLING_WORLD_PLAZA_PROFILE_PANEL_SHELL_CLASS_NAME =
  `${DEFINING_WORLD_PLAZA_GAMEPLAY_HUD_STYLE.cssShell.parchmentPanel} pointer-events-auto relative flex w-[min(92vw,23rem)] max-h-[min(86vh,34rem)] flex-col gap-2.5 overflow-y-auto p-3 font-body [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden` as const;

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
  'flex items-center gap-3' as const;

/** Inset frame around the avatar portrait. */
export const STYLING_WORLD_PLAZA_PROFILE_PANEL_PORTRAIT_FRAME_CLASS_NAME =
  `${DEFINING_WORLD_PLAZA_GAMEPLAY_HUD_STYLE.surface.parchmentCardInsetFrame} relative size-20 shrink-0 bg-parchment-dark/40` as const;

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
  'mt-1 inline-flex w-max items-center gap-1 rounded-full border border-poster-gold/50 bg-poster-teal-deep/85 px-2 py-0.5 font-display text-[10px] font-bold uppercase tracking-[0.08em] text-parchment' as const;

/** Small-caps section heading. */
export const STYLING_WORLD_PLAZA_PROFILE_PANEL_SECTION_HEADING_CLASS_NAME =
  `${DEFINING_WORLD_PLAZA_GAMEPLAY_HUD_STYLE.typography.labelDisplay} text-[10px] font-bold text-ink/60` as const;

/** One vital row (icon, label, value, bar). */
export const STYLING_WORLD_PLAZA_PROFILE_PANEL_VITAL_ROW_CLASS_NAME =
  'flex flex-col gap-1' as const;

/** Label line inside a vital row. */
export const STYLING_WORLD_PLAZA_PROFILE_PANEL_VITAL_LABEL_ROW_CLASS_NAME =
  'flex items-center gap-1.5 text-[11px] font-semibold text-ink' as const;

/** Numeric value at the end of a vital label line. */
export const STYLING_WORLD_PLAZA_PROFILE_PANEL_VITAL_VALUE_CLASS_NAME =
  'ml-auto shrink-0 tabular-nums font-display text-[11px] font-bold text-poster-teal-deep' as const;

/** Bar track behind vital fills. */
export const STYLING_WORLD_PLAZA_PROFILE_PANEL_VITAL_TRACK_CLASS_NAME =
  `${DEFINING_WORLD_PLAZA_GAMEPLAY_HUD_STYLE.surface.barTrack} h-2 w-full` as const;

/** Detail caption under a vital bar. */
export const STYLING_WORLD_PLAZA_PROFILE_PANEL_VITAL_DETAIL_CLASS_NAME =
  'text-[10px] font-medium italic leading-tight text-ink-soft' as const;

/** Two-column attribute grid. */
export const STYLING_WORLD_PLAZA_PROFILE_PANEL_ATTRIBUTE_GRID_CLASS_NAME =
  'grid grid-cols-2 gap-1.5' as const;

/** One attribute chip. */
export const STYLING_WORLD_PLAZA_PROFILE_PANEL_ATTRIBUTE_CHIP_CLASS_NAME =
  'flex items-center gap-1.5 rounded-md border border-poster-wood/30 bg-parchment-dark/30 px-2 py-1.5' as const;

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
export const DEFINING_WORLD_PLAZA_PROFILE_PANEL_ICON_SIZE_PX = 13 as const;

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
