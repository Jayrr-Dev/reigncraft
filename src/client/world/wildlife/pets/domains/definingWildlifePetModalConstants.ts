/**
 * Declarative labels and classes for the bonded companion modal.
 * Shares parchment chrome with the Character profile panel.
 *
 * @module components/world/wildlife/pets/domains/definingWildlifePetModalConstants
 */

import { DEFINING_WORLD_PLAZA_GAMEPLAY_HUD_STYLE } from '@/components/world/domains/definingWorldPlazaGameplayHudStyleConstants';
import {
  DEFINING_WORLD_PLAZA_PROFILE_PANEL_ICON_SIZE_PX,
  DEFINING_WORLD_PLAZA_PROFILE_PANEL_PORTRAIT_ZOOM,
  STYLING_WORLD_PLAZA_PROFILE_PANEL_ATTRIBUTE_CHIP_CLASS_NAME,
  STYLING_WORLD_PLAZA_PROFILE_PANEL_ATTRIBUTE_GRID_CLASS_NAME,
  STYLING_WORLD_PLAZA_PROFILE_PANEL_ATTRIBUTE_LABEL_CLASS_NAME,
  STYLING_WORLD_PLAZA_PROFILE_PANEL_ATTRIBUTE_VALUE_CLASS_NAME,
  STYLING_WORLD_PLAZA_PROFILE_PANEL_BACKDROP_CLASS_NAME,
  STYLING_WORLD_PLAZA_PROFILE_PANEL_CLOSE_BUTTON_CLASS_NAME,
  STYLING_WORLD_PLAZA_PROFILE_PANEL_HEADER_CLASS_NAME,
  STYLING_WORLD_PLAZA_PROFILE_PANEL_IDENTITY_ROW_CLASS_NAME,
  STYLING_WORLD_PLAZA_PROFILE_PANEL_LEVEL_CHIP_CLASS_NAME,
  STYLING_WORLD_PLAZA_PROFILE_PANEL_NAME_CLASS_NAME,
  STYLING_WORLD_PLAZA_PROFILE_PANEL_PORTRAIT_FRAME_CLASS_NAME,
  STYLING_WORLD_PLAZA_PROFILE_PANEL_PORTRAIT_SPRITE_CLASS_NAME,
  STYLING_WORLD_PLAZA_PROFILE_PANEL_SECTION_HEADING_CLASS_NAME,
  STYLING_WORLD_PLAZA_PROFILE_PANEL_SHELL_CLASS_NAME,
  STYLING_WORLD_PLAZA_PROFILE_PANEL_SKIN_CLASS_NAME,
  STYLING_WORLD_PLAZA_PROFILE_PANEL_TAB_BODY_CLASS_NAME,
  STYLING_WORLD_PLAZA_PROFILE_PANEL_TAB_BUTTON_ACTIVE_CLASS_NAME,
  STYLING_WORLD_PLAZA_PROFILE_PANEL_TAB_BUTTON_CLASS_NAME,
  STYLING_WORLD_PLAZA_PROFILE_PANEL_TAB_LIST_CLASS_NAME,
  STYLING_WORLD_PLAZA_PROFILE_PANEL_TAB_SECTION_STACK_CLASS_NAME,
  STYLING_WORLD_PLAZA_PROFILE_PANEL_TITLE_CLASS_NAME,
  STYLING_WORLD_PLAZA_PROFILE_PANEL_VITAL_DETAIL_CLASS_NAME,
  STYLING_WORLD_PLAZA_PROFILE_PANEL_VITAL_LABEL_ROW_CLASS_NAME,
  STYLING_WORLD_PLAZA_PROFILE_PANEL_VITAL_LIST_CLASS_NAME,
  STYLING_WORLD_PLAZA_PROFILE_PANEL_VITAL_ROW_CLASS_NAME,
  STYLING_WORLD_PLAZA_PROFILE_PANEL_VITAL_TRACK_CLASS_NAME,
  STYLING_WORLD_PLAZA_PROFILE_PANEL_VITAL_VALUE_CLASS_NAME,
} from '@/components/world/domains/definingWorldPlazaProfilePanelConstants';

/** Data attribute on the portaled pet modal root for dismiss targeting. */
export const DEFINING_WILDLIFE_PET_MODAL_DATA_ATTRIBUTE =
  'data-plaza-pet-modal' as const;

/** Panel title (matches Character display treatment). */
export const LABELING_WILDLIFE_PET_MODAL_TITLE = 'Companion' as const;

/** Accessible label for the pet modal close control. */
export const DEFINING_WILDLIFE_PET_MODAL_CLOSE_BUTTON_ARIA_LABEL =
  'Close companion panel' as const;

/** Full-viewport anchor centering the parchment pet panel. */
export const DEFINING_WILDLIFE_PET_MODAL_OVERLAY_CLASS_NAME =
  `pointer-events-none fixed inset-0 z-50 flex items-center justify-center p-3 ${DEFINING_WORLD_PLAZA_GAMEPLAY_HUD_STYLE.scope.lightTheme}` as const;

/** Click-to-close backdrop (shared with Character). */
export const DEFINING_WILDLIFE_PET_MODAL_BACKDROP_CLASS_NAME =
  STYLING_WORLD_PLAZA_PROFILE_PANEL_BACKDROP_CLASS_NAME;

/** Parchment panel shell (shared with Character). */
export const DEFINING_WILDLIFE_PET_MODAL_PANEL_CLASS_NAME =
  STYLING_WORLD_PLAZA_PROFILE_PANEL_SHELL_CLASS_NAME;

/** Header row holding the title and close button. */
export const DEFINING_WILDLIFE_PET_MODAL_HEADER_CLASS_NAME =
  STYLING_WORLD_PLAZA_PROFILE_PANEL_HEADER_CLASS_NAME;

/** Panel title treatment. */
export const DEFINING_WILDLIFE_PET_MODAL_TITLE_CLASS_NAME =
  STYLING_WORLD_PLAZA_PROFILE_PANEL_TITLE_CLASS_NAME;

/** Close button in the header. */
export const DEFINING_WILDLIFE_PET_MODAL_CLOSE_BUTTON_CLASS_NAME =
  STYLING_WORLD_PLAZA_PROFILE_PANEL_CLOSE_BUTTON_CLASS_NAME;

/** Identity row: portrait beside name and tier. */
export const DEFINING_WILDLIFE_PET_MODAL_HEADER_ROW_CLASS_NAME =
  STYLING_WORLD_PLAZA_PROFILE_PANEL_IDENTITY_ROW_CLASS_NAME;

/** Inset frame around the companion portrait. */
export const DEFINING_WILDLIFE_PET_MODAL_PORTRAIT_FRAME_CLASS_NAME =
  `${STYLING_WORLD_PLAZA_PROFILE_PANEL_PORTRAIT_FRAME_CLASS_NAME} relative overflow-hidden` as const;

/** Cropped species idle frame filling the portrait box. */
export const DEFINING_WILDLIFE_PET_MODAL_PORTRAIT_SPRITE_CLASS_NAME =
  STYLING_WORLD_PLAZA_PROFILE_PANEL_PORTRAIT_SPRITE_CLASS_NAME;

/** Zoom on the companion modal portrait crop. */
export const DEFINING_WILDLIFE_PET_MODAL_PORTRAIT_ZOOM =
  DEFINING_WORLD_PLAZA_PROFILE_PANEL_PORTRAIT_ZOOM;

/** Companion display name. */
export const DEFINING_WILDLIFE_PET_MODAL_NAME_CLASS_NAME =
  STYLING_WORLD_PLAZA_PROFILE_PANEL_NAME_CLASS_NAME;

/** Species label under the companion name. */
export const DEFINING_WILDLIFE_PET_MODAL_SPECIES_CLASS_NAME =
  STYLING_WORLD_PLAZA_PROFILE_PANEL_SKIN_CLASS_NAME;

/** Loyalty tier chip (same chrome as Character level). */
export const DEFINING_WILDLIFE_PET_MODAL_TIER_CHIP_CLASS_NAME =
  STYLING_WORLD_PLAZA_PROFILE_PANEL_LEVEL_CHIP_CLASS_NAME;

/** Companion loadout tab ids (max 3). */
export type DefiningWildlifePetModalTabId = 'gear' | 'skills' | 'bond';

/** One tab in the companion loadout strip. */
export type DefiningWildlifePetModalTabDefinition = {
  id: DefiningWildlifePetModalTabId;
  label: string;
  /** Capability that must unlock before the tab appears. */
  requiredCapability: 'equipment' | 'teachSpells' | 'soulsave';
};

/**
 * Ordered loadout tabs: Equipment / Skills / Soulsave.
 * Vitals, commands, and combat stats stay above the strip.
 */
export const DEFINING_WILDLIFE_PET_MODAL_TAB_REGISTRY: readonly DefiningWildlifePetModalTabDefinition[] =
  [
    { id: 'gear', label: 'Gear', requiredCapability: 'equipment' },
    { id: 'skills', label: 'Skills', requiredCapability: 'teachSpells' },
    { id: 'bond', label: 'Bond', requiredCapability: 'soulsave' },
  ];

/** Default loadout tab when several are unlocked. */
export const DEFINING_WILDLIFE_PET_MODAL_DEFAULT_TAB_ID: DefiningWildlifePetModalTabId =
  'gear';

/** Accessible label for the companion loadout tab list. */
export const LABELING_WILDLIFE_PET_MODAL_TAB_LIST =
  'Companion loadout sections' as const;

/** Segmented tab strip (shared Character chrome). */
export const DEFINING_WILDLIFE_PET_MODAL_TAB_LIST_CLASS_NAME =
  STYLING_WORLD_PLAZA_PROFILE_PANEL_TAB_LIST_CLASS_NAME;

/** Inactive tab button. */
export const DEFINING_WILDLIFE_PET_MODAL_TAB_BUTTON_CLASS_NAME =
  STYLING_WORLD_PLAZA_PROFILE_PANEL_TAB_BUTTON_CLASS_NAME;

/** Active tab button. */
export const DEFINING_WILDLIFE_PET_MODAL_TAB_BUTTON_ACTIVE_CLASS_NAME =
  STYLING_WORLD_PLAZA_PROFILE_PANEL_TAB_BUTTON_ACTIVE_CLASS_NAME;

/** Scrollable tab body under the strip. */
export const DEFINING_WILDLIFE_PET_MODAL_TAB_BODY_CLASS_NAME =
  STYLING_WORLD_PLAZA_PROFILE_PANEL_TAB_BODY_CLASS_NAME;

/** Stack of blocks inside one loadout tab. */
export const DEFINING_WILDLIFE_PET_MODAL_TAB_SECTION_STACK_CLASS_NAME =
  STYLING_WORLD_PLAZA_PROFILE_PANEL_TAB_SECTION_STACK_CLASS_NAME;

/** Legacy caption alias kept for callers that still expect it. */
export const DEFINING_WILDLIFE_PET_MODAL_TIER_CAPTION_CLASS_NAME =
  STYLING_WORLD_PLAZA_PROFILE_PANEL_SKIN_CLASS_NAME;

/** Section wrapper stacked with Character spacing. */
export const DEFINING_WILDLIFE_PET_MODAL_SECTION_CLASS_NAME =
  'flex flex-col gap-1.5' as const;

/** Section heading classes (shared with Character). */
export const DEFINING_WILDLIFE_PET_MODAL_SECTION_HEADING_CLASS_NAME =
  STYLING_WORLD_PLAZA_PROFILE_PANEL_SECTION_HEADING_CLASS_NAME;

/** Stack of vital rows. */
export const DEFINING_WILDLIFE_PET_MODAL_STAT_LIST_CLASS_NAME =
  STYLING_WORLD_PLAZA_PROFILE_PANEL_VITAL_LIST_CLASS_NAME;

/** One vital row. */
export const DEFINING_WILDLIFE_PET_MODAL_STAT_ROW_CLASS_NAME =
  STYLING_WORLD_PLAZA_PROFILE_PANEL_VITAL_ROW_CLASS_NAME;

/** Label line inside a vital row. */
export const DEFINING_WILDLIFE_PET_MODAL_STAT_LABEL_ROW_CLASS_NAME =
  STYLING_WORLD_PLAZA_PROFILE_PANEL_VITAL_LABEL_ROW_CLASS_NAME;

/** Numeric value at the end of a vital label line. */
export const DEFINING_WILDLIFE_PET_MODAL_STAT_VALUE_CLASS_NAME =
  STYLING_WORLD_PLAZA_PROFILE_PANEL_VITAL_VALUE_CLASS_NAME;

/** Bar track behind vital fills. */
export const DEFINING_WILDLIFE_PET_MODAL_STAT_BAR_TRACK_CLASS_NAME =
  STYLING_WORLD_PLAZA_PROFILE_PANEL_VITAL_TRACK_CLASS_NAME;

/** Italic detail under a vital bar. */
export const DEFINING_WILDLIFE_PET_MODAL_STAT_DETAIL_CLASS_NAME =
  STYLING_WORLD_PLAZA_PROFILE_PANEL_VITAL_DETAIL_CLASS_NAME;

/** Icon size for vital and action glyphs. */
export const DEFINING_WILDLIFE_PET_MODAL_ICON_SIZE_PX =
  DEFINING_WORLD_PLAZA_PROFILE_PANEL_ICON_SIZE_PX;

/**
 * Resolves Character-style meter fill classes from a 0..1 ratio.
 */
export function resolvingWildlifePetModalVitalFillClassName(
  ratio: number
): string {
  const { meter } = DEFINING_WORLD_PLAZA_GAMEPLAY_HUD_STYLE;

  if (ratio <= 0.2) {
    return `${meter.fillBase} ${meter.fillDepleted}`;
  }

  if (ratio <= 0.5) {
    return `${meter.fillBase} ${meter.fillLow}`;
  }

  return `${meter.fillBase} ${meter.fillReady}`;
}

/**
 * @deprecated Prefer {@link resolvingWildlifePetModalVitalFillClassName}.
 * Kept so older imports keep compiling during the theme swap.
 */
export const DEFINING_WILDLIFE_PET_MODAL_STAT_BAR_FILL_CLASS_NAME_BY_ID = {
  health: `${DEFINING_WORLD_PLAZA_GAMEPLAY_HUD_STYLE.meter.fillBase} ${DEFINING_WORLD_PLAZA_GAMEPLAY_HUD_STYLE.meter.fillReady}`,
  stamina: `${DEFINING_WORLD_PLAZA_GAMEPLAY_HUD_STYLE.meter.fillBase} ${DEFINING_WORLD_PLAZA_GAMEPLAY_HUD_STYLE.meter.fillReady}`,
  hunger: `${DEFINING_WORLD_PLAZA_GAMEPLAY_HUD_STYLE.meter.fillBase} ${DEFINING_WORLD_PLAZA_GAMEPLAY_HUD_STYLE.meter.fillLow}`,
  loyalty: `${DEFINING_WORLD_PLAZA_GAMEPLAY_HUD_STYLE.meter.fillBase} ${DEFINING_WORLD_PLAZA_GAMEPLAY_HUD_STYLE.meter.fillReady}`,
} as const;

/** Name input field (parchment inset). */
export const DEFINING_WILDLIFE_PET_MODAL_NAME_INPUT_CLASS_NAME =
  `w-full rounded-md border border-poster-wood/40 bg-parchment-dark/35 px-2 py-1.5 font-body text-sm text-ink outline-none placeholder:text-ink-soft/70 ${DEFINING_WORLD_PLAZA_GAMEPLAY_HUD_STYLE.interactive.focusRingGold}` as const;

/** Base action button (parchment chip chrome). */
export const DEFINING_WILDLIFE_PET_MODAL_ACTION_BUTTON_CLASS_NAME =
  `flex items-center justify-center gap-1.5 rounded-md border border-poster-wood/35 bg-parchment-dark/30 px-2 py-1.5 font-display text-[10px] font-bold uppercase tracking-[0.08em] text-ink transition hover:bg-parchment-dark/50 disabled:cursor-not-allowed disabled:opacity-45 ${DEFINING_WORLD_PLAZA_GAMEPLAY_HUD_STYLE.interactive.focusRingGold}` as const;

/** Command chips use yellow label text so they read as orders, not care actions. */
export const DEFINING_WILDLIFE_PET_MODAL_COMMAND_BUTTON_CLASS_NAME =
  `flex items-center justify-center gap-1.5 rounded-md border border-poster-gold/40 bg-parchment-dark/30 px-2 py-1.5 font-display text-[10px] font-bold uppercase tracking-[0.08em] text-poster-gold transition hover:bg-parchment-dark/50 disabled:cursor-not-allowed disabled:opacity-45 ${DEFINING_WORLD_PLAZA_GAMEPLAY_HUD_STYLE.interactive.focusRingGold}` as const;

/** Active / selected action button (teal + gold, matches Character tabs). */
export const DEFINING_WILDLIFE_PET_MODAL_ACTION_BUTTON_ACTIVE_CLASS_NAME =
  'border-poster-gold/50 bg-poster-teal-deep/90 text-parchment shadow-sm hover:bg-poster-teal-deep' as const;

/** Command grid classes. */
export const DEFINING_WILDLIFE_PET_MODAL_COMMAND_GRID_CLASS_NAME =
  'grid grid-cols-2 gap-1.5' as const;

/** Feed / Heal action row. */
export const DEFINING_WILDLIFE_PET_MODAL_CARE_GRID_CLASS_NAME =
  'grid grid-cols-2 gap-1.5' as const;

/** Feed-only care row before Accepting unlocks Heal beside it. */
export const DEFINING_WILDLIFE_PET_MODAL_CARE_GRID_FEED_ONLY_CLASS_NAME =
  'grid grid-cols-1 gap-1.5' as const;

/** Advanced stat chip grid (shared attribute grid chrome). */
export const DEFINING_WILDLIFE_PET_MODAL_ADVANCED_STAT_GRID_CLASS_NAME =
  STYLING_WORLD_PLAZA_PROFILE_PANEL_ATTRIBUTE_GRID_CLASS_NAME;

/** Advanced stat card classes. */
export const DEFINING_WILDLIFE_PET_MODAL_ADVANCED_STAT_CARD_CLASS_NAME =
  `${STYLING_WORLD_PLAZA_PROFILE_PANEL_ATTRIBUTE_CHIP_CLASS_NAME} flex-col items-center justify-center gap-0.5 py-2` as const;

/** Advanced stat value classes. */
export const DEFINING_WILDLIFE_PET_MODAL_ADVANCED_STAT_VALUE_CLASS_NAME =
  STYLING_WORLD_PLAZA_PROFILE_PANEL_ATTRIBUTE_VALUE_CLASS_NAME;

/** Advanced stat label classes. */
export const DEFINING_WILDLIFE_PET_MODAL_ADVANCED_STAT_LABEL_CLASS_NAME =
  STYLING_WORLD_PLAZA_PROFILE_PANEL_ATTRIBUTE_LABEL_CLASS_NAME;

/** Row for one equipment / weapon list entry. */
export const DEFINING_WILDLIFE_PET_MODAL_INVENTORY_ROW_CLASS_NAME =
  'flex items-center justify-between gap-2 rounded-md border border-poster-wood/30 bg-parchment-dark/30 px-2 py-1.5 text-[11px] font-semibold text-ink' as const;

/** Disabled "coming soon" armor slot classes. */
export const DEFINING_WILDLIFE_PET_MODAL_ARMOR_SLOT_CLASS_NAME =
  'flex items-center justify-between gap-2 rounded-md border border-dashed border-poster-wood/35 px-2 py-1.5 text-[11px] italic text-ink-soft' as const;

/** Empty-state helper text classes. */
export const DEFINING_WILDLIFE_PET_MODAL_EMPTY_STATE_CLASS_NAME =
  STYLING_WORLD_PLAZA_PROFILE_PANEL_VITAL_DETAIL_CLASS_NAME;

/** Soulsave status text classes. */
export const DEFINING_WILDLIFE_PET_MODAL_SOULSAVE_TEXT_CLASS_NAME =
  'flex items-center gap-1.5 text-[11px] font-semibold text-ink' as const;

/** Inline text link on parchment rows. */
export const DEFINING_WILDLIFE_PET_MODAL_INLINE_LINK_CLASS_NAME =
  `font-display text-[10px] font-bold uppercase tracking-[0.08em] text-poster-teal-deep underline-offset-2 hover:underline ${DEFINING_WORLD_PLAZA_GAMEPLAY_HUD_STYLE.interactive.focusRingGold}` as const;

/** Body stack spacing inside the parchment shell. */
export const DEFINING_WILDLIFE_PET_MODAL_BODY_STACK_CLASS_NAME =
  'flex flex-col gap-2' as const;

/** Copy shown for the "coming soon" armor slot. */
export const DEFINING_WILDLIFE_PET_MODAL_ARMOR_COMING_SOON_LABEL =
  'Armor · Coming soon' as const;

/** Copy shown when the companion has no equippable weapons in the bag. */
export const DEFINING_WILDLIFE_PET_MODAL_NO_EQUIPPABLE_WEAPONS_LABEL =
  'No weapons or tools in your bag.' as const;

/** Copy shown when the character has no unlearned skills left to teach. */
export const DEFINING_WILDLIFE_PET_MODAL_NO_TEACHABLE_SKILLS_LABEL =
  'No new skills to teach yet.' as const;

/** Copy for the soulsave-ready state (Bonded, unused). */
export const DEFINING_WILDLIFE_PET_MODAL_SOULSAVE_READY_LABEL =
  'Soulsave ready. One fatal blow will be undone.' as const;

/** Copy for the soulsave-consumed state (Bonded, already spent). */
export const DEFINING_WILDLIFE_PET_MODAL_SOULSAVE_CONSUMED_LABEL =
  'Soulsave already spent this bond.' as const;

/** Name field placeholder for an unnamed companion. */
export const DEFINING_WILDLIFE_PET_MODAL_NAME_PLACEHOLDER = 'Name?' as const;

/** Feed action label. */
export const DEFINING_WILDLIFE_PET_MODAL_FEED_LABEL = 'Feed' as const;

/** Heal action label. */
export const DEFINING_WILDLIFE_PET_MODAL_HEAL_LABEL = 'Heal' as const;

/** Flat HP restored by one owner-cast Heal action (mirrors Minor Heal). */
export const DEFINING_WILDLIFE_PET_MODAL_HEAL_AMOUNT = 120 as const;

export type DefiningWildlifePetModalCommandOption = {
  readonly commandId: 'follow' | 'stay' | 'attack' | 'defend';
  readonly label: string;
  readonly iconId: string;
  readonly requiredCapability: 'commandsStayFollow' | 'commandsAttackDefend';
};

/** Declarative command button registry (order = display order). */
export const DEFINING_WILDLIFE_PET_MODAL_COMMAND_OPTIONS: readonly DefiningWildlifePetModalCommandOption[] =
  [
    {
      commandId: 'follow',
      label: 'Follow',
      iconId: 'mdi:run-fast',
      requiredCapability: 'commandsStayFollow',
    },
    {
      commandId: 'stay',
      label: 'Stay',
      iconId: 'mdi:home',
      requiredCapability: 'commandsStayFollow',
    },
    {
      commandId: 'attack',
      label: 'Attack',
      iconId: 'mdi:sword-cross',
      requiredCapability: 'commandsAttackDefend',
    },
    {
      commandId: 'defend',
      label: 'Defend',
      iconId: 'mdi:shield-account',
      requiredCapability: 'commandsAttackDefend',
    },
  ];

export type DefiningWildlifePetModalVitalId =
  | 'health'
  | 'stamina'
  | 'hunger'
  | 'loyalty';

export type DefiningWildlifePetModalVitalDefinition = {
  readonly id: DefiningWildlifePetModalVitalId;
  readonly label: string;
  readonly iconId: string;
};

/** Ordered vitals: full set at Accepting / basicUi; hunger alone at named Familiar / hungerUi. */
export const DEFINING_WILDLIFE_PET_MODAL_VITAL_REGISTRY: readonly DefiningWildlifePetModalVitalDefinition[] =
  [
    { id: 'health', label: 'Health', iconId: 'solar:heart-pulse-bold' },
    { id: 'hunger', label: 'Hunger', iconId: 'mdi:food-drumstick' },
    { id: 'stamina', label: 'Stamina', iconId: 'ph:person-simple-run' },
    { id: 'loyalty', label: 'Loyalty', iconId: 'mdi:paw' },
  ];
