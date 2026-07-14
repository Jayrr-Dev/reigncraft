/**
 * Copy and parchment chrome for the action-bar companion roster panel.
 *
 * @module components/world/wildlife/pets/domains/definingWildlifePetRosterPanelConstants
 */

import { DEFINING_WORLD_PLAZA_GAMEPLAY_HUD_STYLE } from '@/components/world/domains/definingWorldPlazaGameplayHudStyleConstants';
import {
  STYLING_WORLD_PLAZA_PROFILE_PANEL_BACKDROP_CLASS_NAME,
  STYLING_WORLD_PLAZA_PROFILE_PANEL_CLOSE_BUTTON_CLASS_NAME,
  STYLING_WORLD_PLAZA_PROFILE_PANEL_HEADER_CLASS_NAME,
  STYLING_WORLD_PLAZA_PROFILE_PANEL_SHELL_CLASS_NAME,
  STYLING_WORLD_PLAZA_PROFILE_PANEL_TITLE_CLASS_NAME,
} from '@/components/world/domains/definingWorldPlazaProfilePanelConstants';

/** Action bar button label. */
export const LABELING_WORLD_PLAZA_ACTION_BAR_PETS = 'Companions' as const;

/** Panel heading. */
export const LABELING_WILDLIFE_PET_ROSTER_PANEL_TITLE = 'Companions' as const;

/** Close control aria label. */
export const LABELING_WILDLIFE_PET_ROSTER_PANEL_CLOSE =
  'Close companions panel' as const;

/** Empty roster copy. */
export const LABELING_WILDLIFE_PET_ROSTER_PANEL_EMPTY =
  'No bonded companions yet. Pet a cat or dog until Familiar.' as const;

/** Alive status chip. */
export const LABELING_WILDLIFE_PET_ROSTER_STATUS_ALIVE = 'Alive' as const;

/** Deceased status chip. */
export const LABELING_WILDLIFE_PET_ROSTER_STATUS_DECEASED = 'Deceased' as const;

/** Fallback name when the companion was never named. */
export const LABELING_WILDLIFE_PET_ROSTER_UNNAMED = 'Unnamed' as const;

/**
 * Poll cadence while the companions panel is open so Alive/Deceased and HP
 * track the live wildlife instance (same ballpark as the companion modal).
 */
export const DEFINING_WILDLIFE_PET_ROSTER_PANEL_LIVE_REFRESH_INTERVAL_MS = 400;

/** Data attribute on the portaled roster root. */
export const DEFINING_WILDLIFE_PET_ROSTER_PANEL_DATA_ATTRIBUTE =
  'data-plaza-pet-roster-panel' as const;

/** Full-viewport overlay. */
export const STYLING_WILDLIFE_PET_ROSTER_PANEL_OVERLAY_CLASS_NAME =
  `pointer-events-none fixed inset-0 z-50 flex items-center justify-center p-3 ${DEFINING_WORLD_PLAZA_GAMEPLAY_HUD_STYLE.scope.lightTheme}` as const;

/** Click-to-close backdrop. */
export const STYLING_WILDLIFE_PET_ROSTER_PANEL_BACKDROP_CLASS_NAME =
  STYLING_WORLD_PLAZA_PROFILE_PANEL_BACKDROP_CLASS_NAME;

/** Parchment shell — a bit wider for compact status rows. */
export const STYLING_WILDLIFE_PET_ROSTER_PANEL_SHELL_CLASS_NAME =
  `${STYLING_WORLD_PLAZA_PROFILE_PANEL_SHELL_CLASS_NAME} w-[min(94vw,26rem)]` as const;

/** Header row. */
export const STYLING_WILDLIFE_PET_ROSTER_PANEL_HEADER_CLASS_NAME =
  STYLING_WORLD_PLAZA_PROFILE_PANEL_HEADER_CLASS_NAME;

/** Title. */
export const STYLING_WILDLIFE_PET_ROSTER_PANEL_TITLE_CLASS_NAME =
  STYLING_WORLD_PLAZA_PROFILE_PANEL_TITLE_CLASS_NAME;

/** Title + living/max count cluster. */
export const STYLING_WILDLIFE_PET_ROSTER_PANEL_TITLE_ROW_CLASS_NAME =
  'flex min-w-0 items-baseline gap-2' as const;

/** Living companion count beside the title (`0/3`). */
export const STYLING_WILDLIFE_PET_ROSTER_PANEL_COUNT_CLASS_NAME =
  'shrink-0 font-display text-[11px] font-bold tabular-nums tracking-wide text-ink-soft' as const;

/** Close button. */
export const STYLING_WILDLIFE_PET_ROSTER_PANEL_CLOSE_BUTTON_CLASS_NAME =
  STYLING_WORLD_PLAZA_PROFILE_PANEL_CLOSE_BUTTON_CLASS_NAME;

/** Stack of companion rows. */
export const STYLING_WILDLIFE_PET_ROSTER_PANEL_LIST_CLASS_NAME =
  'flex flex-col gap-1.5' as const;

/** One compact companion status row. */
export const STYLING_WILDLIFE_PET_ROSTER_PANEL_ROW_CLASS_NAME =
  `${DEFINING_WORLD_PLAZA_GAMEPLAY_HUD_STYLE.surface.parchmentCardInsetFrame} flex items-center gap-2 px-2 py-1.5` as const;

/** Portrait frame on the left of each row. */
export const STYLING_WILDLIFE_PET_ROSTER_PANEL_PORTRAIT_CLASS_NAME =
  'relative size-11 shrink-0 overflow-hidden rounded-md border border-poster-wood/40 bg-parchment-dark/45' as const;

/** Zoom for the roster row portrait crop. */
export const DEFINING_WILDLIFE_PET_ROSTER_PANEL_PORTRAIT_ZOOM = 1.45 as const;

/** Text column beside the portrait. */
export const STYLING_WILDLIFE_PET_ROSTER_PANEL_BODY_CLASS_NAME =
  'min-w-0 flex-1' as const;

/** Top line: name + status chip. */
export const STYLING_WILDLIFE_PET_ROSTER_PANEL_NAME_ROW_CLASS_NAME =
  'flex items-center gap-1.5' as const;

/** Companion display name. */
export const STYLING_WILDLIFE_PET_ROSTER_PANEL_NAME_CLASS_NAME =
  'truncate font-display text-sm font-bold leading-tight text-ink' as const;

/** Species under the name. */
export const STYLING_WILDLIFE_PET_ROSTER_PANEL_SPECIES_CLASS_NAME =
  'truncate text-[10px] font-semibold leading-tight text-ink-soft' as const;

/** Death cause note under species for deceased companions. */
export const STYLING_WILDLIFE_PET_ROSTER_PANEL_DEATH_NOTE_CLASS_NAME =
  'mt-0.5 truncate text-[10px] font-medium italic leading-tight text-ink-soft/85' as const;

/** Stats line (health / loyalty). */
export const STYLING_WILDLIFE_PET_ROSTER_PANEL_STATS_CLASS_NAME =
  'mt-0.5 truncate text-[10px] font-semibold tabular-nums text-poster-teal-deep' as const;

/** Alive status pill. */
export const STYLING_WILDLIFE_PET_ROSTER_STATUS_ALIVE_CLASS_NAME =
  'shrink-0 rounded-full border border-emerald-800/35 bg-emerald-700/85 px-1.5 py-px font-display text-[9px] font-bold uppercase tracking-[0.06em] text-parchment' as const;

/** Deceased status pill. */
export const STYLING_WILDLIFE_PET_ROSTER_STATUS_DECEASED_CLASS_NAME =
  'shrink-0 rounded-full border border-stone-500/45 bg-stone-600/80 px-1.5 py-px font-display text-[9px] font-bold uppercase tracking-[0.06em] text-parchment' as const;

/** Empty-state caption. */
export const STYLING_WILDLIFE_PET_ROSTER_PANEL_EMPTY_CLASS_NAME =
  'px-1 py-3 text-center text-xs font-medium italic leading-snug text-ink-soft' as const;
