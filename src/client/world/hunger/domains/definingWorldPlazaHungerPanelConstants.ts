/**
 * Labels and shell classes for the action-bar hunger status panel.
 *
 * @module components/world/hunger/domains/definingWorldPlazaHungerPanelConstants
 */

import { DEFINING_WORLD_PLAZA_GAMEPLAY_HUD_STYLE } from '@/components/world/domains/definingWorldPlazaGameplayHudStyleConstants';
import type { DefiningWorldPlazaHungerTier } from '@/components/world/hunger/domains/definingWorldPlazaHungerConstants';

/** Accessible label for the hunger action in the plaza action bar. */
export const LABELING_WORLD_PLAZA_ACTION_BAR_HUNGER = 'Hunger' as const;

/** Accessible label for the hunger status dropdown. */
export const LABELING_WORLD_PLAZA_HUNGER_PANEL = 'Hunger status' as const;

/** Title shown at the top of the hunger panel. */
export const LABELING_WORLD_PLAZA_HUNGER_PANEL_TITLE = 'Hunger' as const;

/** Tip under the status list. */
export const LABELING_WORLD_PLAZA_HUNGER_PANEL_TIP =
  'Eat food from your hotbar to refill.' as const;

/** Wrapper anchoring the hunger dropdown to its action bar orb. */
export const STYLING_WORLD_PLAZA_ACTION_BAR_HUNGER_ANCHOR_CLASS_NAME =
  'relative flex shrink-0 items-center' as const;

/** Dropdown panel listing hunger status below the action bar. */
export const STYLING_WORLD_PLAZA_HUNGER_PANEL_CLASS_NAME =
  `${DEFINING_WORLD_PLAZA_GAMEPLAY_HUD_STYLE.cssShell.actionBarDropdown} pointer-events-auto absolute left-1/2 top-full z-50 mt-2 flex w-max min-w-[11rem] max-w-[14rem] -translate-x-1/2 flex-col gap-2.5 p-3 font-body` as const;

/** Title row in the hunger panel. */
export const STYLING_WORLD_PLAZA_HUNGER_PANEL_TITLE_CLASS_NAME =
  'text-sm font-bold tracking-wide text-ink' as const;

/** Large percent readout. */
export const STYLING_WORLD_PLAZA_HUNGER_PANEL_PERCENT_CLASS_NAME =
  'text-2xl font-bold tabular-nums leading-none text-ink' as const;

/** Tier badge under the percent. */
export const STYLING_WORLD_PLAZA_HUNGER_PANEL_TIER_CLASS_NAME =
  'text-xs font-semibold text-ink-soft' as const;

/** Flavor blurb under the tier. */
export const STYLING_WORLD_PLAZA_HUNGER_PANEL_BLURB_CLASS_NAME =
  'text-[11px] leading-snug text-ink-soft' as const;

/** Track behind the brown hunger fill bar. */
export const STYLING_WORLD_PLAZA_HUNGER_PANEL_BAR_TRACK_CLASS_NAME =
  'h-2.5 w-full overflow-hidden rounded-full border border-poster-wood/40 bg-[rgba(55,45,32,0.35)]' as const;

/** Status-effect list. */
export const STYLING_WORLD_PLAZA_HUNGER_PANEL_EFFECT_LIST_CLASS_NAME =
  'flex flex-col gap-1' as const;

/** One status-effect line. */
export const STYLING_WORLD_PLAZA_HUNGER_PANEL_EFFECT_LINE_CLASS_NAME =
  'text-[11px] leading-snug text-ink' as const;

/** Tip footer. */
export const STYLING_WORLD_PLAZA_HUNGER_PANEL_TIP_CLASS_NAME =
  'border-t border-poster-wood/30 pt-2 text-[10px] italic leading-snug text-ink-soft' as const;

/** Starvation warning line. */
export const STYLING_WORLD_PLAZA_HUNGER_PANEL_WARNING_CLASS_NAME =
  'rounded border border-poster-orange/50 bg-poster-orange/15 px-2 py-1 text-[11px] font-semibold text-ink' as const;

/** Display title per hunger tier. */
export const LABELING_WORLD_PLAZA_HUNGER_PANEL_TIER: Record<
  DefiningWorldPlazaHungerTier,
  string
> = {
  well_fed: 'Well fed',
  content: 'Fed',
  peckish: 'Peckish',
  hungry: 'Hungry',
  starving: 'Starving',
};

/** Short flavor line per hunger tier. */
export const LABELING_WORLD_PLAZA_HUNGER_PANEL_TIER_BLURB: Record<
  DefiningWorldPlazaHungerTier,
  string
> = {
  well_fed: 'Full belly. Stamina recovers a bit faster.',
  content: 'Comfortable. No hunger penalties.',
  peckish: 'Getting empty. Sprint and jumps cost more.',
  hungry: 'Low fuel. Slower walk, and sprint is locked.',
  starving: 'Empty. Health drains, and jump is locked.',
};

/** Warning copy while starvation damage is active. */
export const LABELING_WORLD_PLAZA_HUNGER_PANEL_STARVING_WARNING =
  'Starvation is draining your health.' as const;
