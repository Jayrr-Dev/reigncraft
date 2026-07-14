/**
 * Declarative labels and classes for the bonded companion modal.
 *
 * @module components/world/wildlife/pets/domains/definingWildlifePetModalConstants
 */

/** Data attribute on the portaled pet modal root for dismiss targeting. */
export const DEFINING_WILDLIFE_PET_MODAL_DATA_ATTRIBUTE =
  'data-plaza-pet-modal' as const;

/** Pet modal overlay classes (covers the plaza viewport). */
export const DEFINING_WILDLIFE_PET_MODAL_OVERLAY_CLASS_NAME =
  'pointer-events-auto fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 py-6' as const;

/** Pet modal panel shell classes. */
export const DEFINING_WILDLIFE_PET_MODAL_PANEL_CLASS_NAME =
  'relative w-full max-w-sm max-h-[min(90vh,640px)] overflow-y-auto rounded-xl border border-border bg-background p-4 shadow-2xl' as const;

/** Pet modal close button classes. */
export const DEFINING_WILDLIFE_PET_MODAL_CLOSE_BUTTON_CLASS_NAME =
  'absolute top-2 right-2 z-10 flex size-8 cursor-pointer items-center justify-center rounded-full border border-border/80 bg-background/95 text-foreground shadow-sm transition hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring' as const;

/** Accessible label for the pet modal close control. */
export const DEFINING_WILDLIFE_PET_MODAL_CLOSE_BUTTON_ARIA_LABEL =
  'Close companion panel' as const;

/** Section wrapper classes, stacked with consistent spacing. */
export const DEFINING_WILDLIFE_PET_MODAL_SECTION_CLASS_NAME =
  'mt-4 border-t border-border/60 pt-4 first:mt-0 first:border-t-0 first:pt-0' as const;

/** Section heading classes. */
export const DEFINING_WILDLIFE_PET_MODAL_SECTION_HEADING_CLASS_NAME =
  'mb-2 text-xs font-semibold tracking-wide text-muted-foreground uppercase' as const;

/** Header row (icon + name + tier) classes. */
export const DEFINING_WILDLIFE_PET_MODAL_HEADER_ROW_CLASS_NAME =
  'flex items-center gap-2 pr-8' as const;

/** Stat bar track classes. */
export const DEFINING_WILDLIFE_PET_MODAL_STAT_BAR_TRACK_CLASS_NAME =
  'h-2 w-full overflow-hidden rounded-full bg-muted' as const;

/** Stat bar row classes. */
export const DEFINING_WILDLIFE_PET_MODAL_STAT_ROW_CLASS_NAME =
  'mb-2 last:mb-0' as const;

/** Stat bar label row classes. */
export const DEFINING_WILDLIFE_PET_MODAL_STAT_LABEL_ROW_CLASS_NAME =
  'mb-1 flex items-center justify-between text-xs text-muted-foreground' as const;

/** Fill color for each progressive stat bar, keyed by stat id. */
export const DEFINING_WILDLIFE_PET_MODAL_STAT_BAR_FILL_CLASS_NAME_BY_ID = {
  health: 'h-full rounded-full bg-red-500',
  stamina: 'h-full rounded-full bg-emerald-500',
  hunger: 'h-full rounded-full bg-amber-500',
  loyalty: 'h-full rounded-full bg-pink-500',
} as const;

/** Name input field classes. */
export const DEFINING_WILDLIFE_PET_MODAL_NAME_INPUT_CLASS_NAME =
  'w-full rounded-md border border-border bg-muted/40 px-2 py-1 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring' as const;

/** Base action button classes shared by command / equip / teach buttons. */
export const DEFINING_WILDLIFE_PET_MODAL_ACTION_BUTTON_CLASS_NAME =
  'flex items-center justify-center gap-1.5 rounded-md border border-border px-2 py-1.5 text-xs font-medium transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50' as const;

/** Active-state modifier appended to the action button when selected. */
export const DEFINING_WILDLIFE_PET_MODAL_ACTION_BUTTON_ACTIVE_CLASS_NAME =
  'border-primary bg-primary/10 text-primary' as const;

/** Command grid classes. */
export const DEFINING_WILDLIFE_PET_MODAL_COMMAND_GRID_CLASS_NAME =
  'grid grid-cols-2 gap-2' as const;

/** Advanced stat trio grid classes. */
export const DEFINING_WILDLIFE_PET_MODAL_ADVANCED_STAT_GRID_CLASS_NAME =
  'grid grid-cols-3 gap-2 text-center' as const;

/** Advanced stat card classes. */
export const DEFINING_WILDLIFE_PET_MODAL_ADVANCED_STAT_CARD_CLASS_NAME =
  'rounded-md border border-border/60 bg-muted/30 py-2' as const;

/** Advanced stat value classes. */
export const DEFINING_WILDLIFE_PET_MODAL_ADVANCED_STAT_VALUE_CLASS_NAME =
  'text-sm font-semibold' as const;

/** Advanced stat label classes. */
export const DEFINING_WILDLIFE_PET_MODAL_ADVANCED_STAT_LABEL_CLASS_NAME =
  'text-[10px] tracking-wide text-muted-foreground uppercase' as const;

/** Row for one equipment / weapon list entry. */
export const DEFINING_WILDLIFE_PET_MODAL_INVENTORY_ROW_CLASS_NAME =
  'flex items-center justify-between gap-2 rounded-md border border-border/60 bg-muted/20 px-2 py-1.5 text-xs' as const;

/** Disabled "coming soon" armor slot classes. */
export const DEFINING_WILDLIFE_PET_MODAL_ARMOR_SLOT_CLASS_NAME =
  'flex items-center justify-between gap-2 rounded-md border border-dashed border-border/60 px-2 py-1.5 text-xs text-muted-foreground' as const;

/** Empty-state helper text classes. */
export const DEFINING_WILDLIFE_PET_MODAL_EMPTY_STATE_CLASS_NAME =
  'text-xs text-muted-foreground italic' as const;

/** Soulsave status text classes. */
export const DEFINING_WILDLIFE_PET_MODAL_SOULSAVE_TEXT_CLASS_NAME =
  'flex items-center gap-1.5 text-xs font-medium' as const;

/** Loyalty tier caption classes. */
export const DEFINING_WILDLIFE_PET_MODAL_TIER_CAPTION_CLASS_NAME =
  'text-xs text-muted-foreground' as const;

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
  'Soulsave ready — one fatal blow will be undone.' as const;

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
